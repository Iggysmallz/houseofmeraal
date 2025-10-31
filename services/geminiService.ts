import { GoogleGenAI, LiveServerMessage, Modality, Blob, Chat, GenerateContentResponse } from "@google/genai";
import { AIChatMessage, MessageRole } from '../types';

// Helper functions for audio encoding/decoding
export function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export function encodeBase64(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function createPcmBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encodeBase64(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

// Gemini API Service
export interface LiveSessionController {
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  sendMessage: (text: string) => Promise<void>;
  close: () => void;
  isConnected: boolean;
  isListening: boolean;
}

export interface LiveConnectParams {
  onMessage: (message: LiveServerMessage) => void;
  onError: (error: Error) => void;
  onOpen: () => void;
  onClose: () => void;
  onAudioBuffer: (audioBuffer: AudioBuffer) => void;
}

const API_KEY = process.env.API_KEY || ''; // Assume API_KEY is available

// Re-creates GoogleGenAI instance on each call to ensure the latest API key is used.
function getGenAIInstance(): GoogleGenAI {
  if (!API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  return new GoogleGenAI({ apiKey: API_KEY });
}

export async function connectLiveSession(
  params: LiveConnectParams,
): Promise<LiveSessionController> {
  let mediaStream: MediaStream | null = null;
  let audioInputSource: MediaStreamAudioSourceNode | null = null;
  let scriptProcessorNode: ScriptProcessorNode | null = null;
  let audioContext: AudioContext | null = null;
  let outputAudioContext: AudioContext | null = null;
  let outputGainNode: GainNode | null = null;
  let nextStartTime = 0;
  const sources = new Set<AudioBufferSourceNode>(); // To manage audio playback

  let sessionPromise: Promise<Awaited<ReturnType<typeof getGenAIInstance>>['live']['connect']> | null = null;
  let geminiSession: Awaited<ReturnType<typeof getGenAIInstance>>['live']['connect'] | null = null;

  const ai = getGenAIInstance();

  const handleMessage = async (message: LiveServerMessage) => {
    params.onMessage(message);

    const base64EncodedAudioString = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
    if (base64EncodedAudioString && outputAudioContext && outputGainNode) {
      nextStartTime = Math.max(nextStartTime, outputAudioContext.currentTime);
      try {
        const audioBuffer = await decodeAudioData(
          decodeBase64(base64EncodedAudioString),
          outputAudioContext,
          24000,
          1,
        );
        params.onAudioBuffer(audioBuffer); // Pass the audio buffer to the UI for visualizers or direct playback control
        const source = outputAudioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(outputGainNode);
        source.addEventListener('ended', () => {
          sources.delete(source);
        });

        source.start(nextStartTime);
        nextStartTime = nextStartTime + audioBuffer.duration;
        sources.add(source);
      } catch (error) {
        console.error("Error decoding audio data:", error);
      }
    }

    const interrupted = message.serverContent?.interrupted;
    if (interrupted) {
      for (const source of sources.values()) {
        source.stop();
        sources.delete(source);
      }
      nextStartTime = 0;
    }
  };

  const ensureApiKey = async () => {
    if (typeof window.aistudio !== 'undefined' && typeof window.aistudio.hasSelectedApiKey === 'function') {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await window.aistudio.openSelectKey();
        // Assume key selection was successful after calling openSelectKey()
        // Handle potential race condition by allowing the API call to proceed
      }
    }
  };

  const startRecording = async () => {
    if (geminiSession) {
      console.warn("Session already connected.");
      return;
    }

    await ensureApiKey();

    try {
      // Replaced deprecated `webkitAudioContext` with `AudioContext`.
      audioContext = new (window.AudioContext)({ sampleRate: 16000 });
      // Replaced deprecated `webkitAudioContext` with `AudioContext`.
      outputAudioContext = new (window.AudioContext)({ sampleRate: 24000 });
      outputGainNode = outputAudioContext.createGain();
      outputGainNode.connect(outputAudioContext.destination);

      mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioInputSource = audioContext.createMediaStreamSource(mediaStream);
      scriptProcessorNode = audioContext.createScriptProcessor(4096, 1, 1);

      scriptProcessorNode.onaudioprocess = (audioProcessingEvent) => {
        const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
        const pcmBlob = createPcmBlob(inputData);
        if (sessionPromise) { // CRITICAL: Only send after session promise resolves
          sessionPromise.then((session) => {
            session.sendRealtimeInput({ media: pcmBlob });
          }).catch(console.error); // Catch errors in promise chain
        }
      };

      audioInputSource.connect(scriptProcessorNode);
      scriptProcessorNode.connect(audioContext.destination);

      sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            // NOTE: This line was incorrect (ai.live.connect instead of resolved session).
            // It's corrected in the `await sessionPromise` below.
            params.onOpen();
          },
          onmessage: handleMessage,
          onerror: (e: ErrorEvent) => {
            console.debug('Live session got error:', e);
            params.onError(new Error(e.message || 'Live session error'));
            stopRecording(); // Automatically stop on error
          },
          onclose: (e: CloseEvent) => {
            console.debug('Live session closed:', e);
            params.onClose();
            geminiSession = null;
          },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          systemInstruction: `You are an AI assistant for House of Miraal, a custom wear tailoring service. Your goal is to help customers make informed choices about their custom garment orders. You can provide suggestions on fabrics, colors, or styling based on their preferences and the garment type. Be helpful, polite, and guide them through the customization process. Do not create external links or offer services outside tailoring.`,
        },
      });

      geminiSession = await sessionPromise; // Resolve the promise and store the actual session object
      console.log('Gemini Live session connected.');
    } catch (err: any) {
      console.error('Error starting live session:', err);
      params.onError(new Error(err.message || 'Failed to start live session.'));
      // If the error message contains "Requested entity was not found.", prompt user to select API key again.
      if (typeof err.message === 'string' && err.message.includes("Requested entity was not found.")) {
        if (typeof window.aistudio !== 'undefined' && typeof window.aistudio.openSelectKey === 'function') {
          console.log("API key might be invalid or not selected. Prompting user to select again.");
          await window.aistudio.openSelectKey();
        }
      }
      stopRecording(); // Ensure cleanup on error
      throw err; // Re-throw to propagate the error
    }
  };

  const stopRecording = () => {
    if (scriptProcessorNode) {
      scriptProcessorNode.disconnect();
      scriptProcessorNode = null;
    }
    if (audioInputSource) {
      audioInputSource.disconnect();
      audioInputSource = null;
    }
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      mediaStream = null;
    }
    if (audioContext) {
      audioContext.close();
      audioContext = null;
    }
    if (outputAudioContext) {
      outputAudioContext.close();
      outputAudioContext = null;
      outputGainNode = null;
    }
    if (geminiSession) {
      geminiSession.close();
      geminiSession = null;
    }
    sessionPromise = null; // Clear the promise reference
    console.log('Live session disconnected.');

    for (const source of sources.values()) {
      source.stop();
      sources.delete(source);
    }
    nextStartTime = 0;
  };

  const sendMessage = async (text: string) => {
    if (geminiSession) {
      // In Live API, text messages are sent as RealtimeInput, similar to audio
      await geminiSession.sendRealtimeInput({ text: text });
    } else if (sessionPromise) {
       // If session is still connecting, wait for it to resolve
      const session = await sessionPromise;
      await session.sendRealtimeInput({ text: text });
    } else {
      console.warn("Gemini session not active to send message.");
    }
  };

  return {
    startRecording,
    stopRecording,
    sendMessage,
    close: stopRecording, // Alias for stopRecording
    get isConnected() { return !!geminiSession; },
    get isListening() { return !!(mediaStream && audioContext?.state === 'running'); }
  };
}

// Regular chat (non-streaming for custom order form AI text suggestions)
export async function getGeminiTextResponse(
  prompt: string,
  history: AIChatMessage[],
  systemInstruction: string = `You are an AI assistant for House of Miraal, a custom wear tailoring service. Your goal is to help customers make informed choices about their custom garment orders. You can provide suggestions on fabrics, colors, or styling based on their preferences and the garment type. Be helpful, polite, and guide them through the customization process. Do not create external links or offer services outside tailoring.`,
): Promise<GenerateContentResponse> {
  const ai = getGenAIInstance();
  const chat: Chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.7,
      topP: 0.95,
      topK: 64,
    },
    history: history.map(msg => ({
      role: msg.role === MessageRole.USER ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }))
  });

  const response = await chat.sendMessage({ message: prompt });
  return response;
}

/**
 * Sends a multimodal request to Gemini with a text prompt and two image parts.
 * @param prompt The text prompt for the AI.
 * @param userImageBase64 Base64 string of the user's body image.
 * @param outfitImageBase64 Base64 string of the outfit sample image.
 * @returns A Promise that resolves to a GenerateContentResponse.
 */
export async function getGeminiMultiModalImageResponse(
  prompt: string,
  userImageBase64: string,
  outfitImageBase64: string,
): Promise<GenerateContentResponse> {
  const ai = getGenAIInstance();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image', // Suitable for multimodal image input and text output
    contents: {
      parts: [
        { text: prompt },
        {
          inlineData: {
            mimeType: 'image/jpeg', // Assuming JPEG for simplicity, can be dynamic
            data: userImageBase64.split(',')[1], // Remove data URL prefix
          },
        },
        {
          inlineData: {
            mimeType: 'image/jpeg', // Assuming JPEG for simplicity, can be dynamic
            data: outfitImageBase64.split(',')[1], // Remove data URL prefix
          },
        },
      ],
    },
    config: {
      temperature: 0.7,
      topP: 0.95,
      topK: 64,
    },
  });
  return response;
}