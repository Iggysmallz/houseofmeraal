import React, { useState, useEffect, useRef, useCallback } from 'react';
import { connectLiveSession, LiveSessionController, getGeminiTextResponse } from '../services/geminiService';
import { AIChatMessage, MessageRole } from '../types';

interface AIChatbotProps {
  systemInstruction?: string;
  initialMessage?: string;
  onNewMessage?: (message: AIChatMessage) => void;
  chatHistory: AIChatMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<AIChatMessage[]>>;
}

const AIChatbot: React.FC<AIChatbotProps> = ({
  systemInstruction,
  initialMessage,
  onNewMessage,
  chatHistory,
  setChatHistory
}) => {
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLiveSessionActive, setIsLiveSessionActive] = useState<boolean>(false);
  const [isMicrophoneListening, setIsMicrophoneListening] = useState<boolean>(false);

  const liveSessionController = useRef<LiveSessionController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null); // To keep track of the output AudioContext
  const currentOutputTranscription = useRef<string>('');
  const currentInputTranscription = useRef<string>('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const updateMessage = useCallback((id: string, updates: Partial<AIChatMessage>) => {
    setChatHistory((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, ...updates } : msg))
    );
  }, [setChatHistory]);

  const addNewMessage = useCallback((message: AIChatMessage) => {
    setChatHistory((prev) => [...prev, message]);
    onNewMessage?.(message);
  }, [setChatHistory, onNewMessage]);

  const handleLiveMessage = useCallback((message) => {
    if (message.serverContent?.outputTranscription) {
      const text = message.serverContent.outputTranscription.text;
      currentOutputTranscription.current += text;
      // Update the last model message in a streaming fashion
      setChatHistory((prev) => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage && lastMessage.role === MessageRole.MODEL) {
          return prev.map((msg, index) =>
            index === prev.length - 1
              ? { ...msg, text: currentOutputTranscription.current, isStreaming: true }
              : msg
          );
        }
        return prev;
      });
    } else if (message.serverContent?.inputTranscription) {
      currentInputTranscription.current = message.serverContent.inputTranscription.text;
      // Optionally update a live input transcription display
    }

    if (message.serverContent?.turnComplete) {
      const fullInputTranscription = currentInputTranscription.current;
      const fullOutputTranscription = currentOutputTranscription.current;

      // Ensure the last model message is marked as not streaming
      setChatHistory((prev) =>
        prev.map((msg, index) =>
          index === prev.length - 1 && msg.role === MessageRole.MODEL
            ? { ...msg, text: fullOutputTranscription, isStreaming: false }
            : msg
        )
      );

      console.debug('User input (turn complete): ', fullInputTranscription);
      console.debug('Model output (turn complete): ', fullOutputTranscription);

      currentInputTranscription.current = '';
      currentOutputTranscription.current = '';
    }
  }, [setChatHistory]);

  const handleLiveError = useCallback((err: Error) => {
    console.error("Live session error:", err);
    setError(err.message);
    setIsLiveSessionActive(false);
    setIsMicrophoneListening(false);
    // Add an error message to chat history
    addNewMessage({
      id: `error-${Date.now()}`,
      role: MessageRole.MODEL,
      text: `Oops! Something went wrong with the voice assistant: ${err.message}. Please try again or use text chat.`,
      timestamp: new Date(),
    });
  }, [addNewMessage]);

  const handleLiveOpen = useCallback(() => {
    console.log("Live session opened!");
    setIsLiveSessionActive(true);
    setIsMicrophoneListening(true); // Assuming mic starts listening on open
  }, []);

  const handleLiveClose = useCallback(() => {
    console.log("Live session closed.");
    setIsLiveSessionActive(false);
    setIsMicrophoneListening(false);
    if (outputAudioContextRef.current) {
      outputAudioContextRef.current.close().catch(console.error);
      outputAudioContextRef.current = null;
    }
  }, []);

  const handleAudioBuffer = useCallback((audioBuffer: AudioBuffer) => {
    // This callback receives decoded AudioBuffer chunks.
    // It can be used for a real-time audio visualizer if desired.
    // For now, it just ensures the outputAudioContext is running.
    if (!outputAudioContextRef.current) {
      // Replaced deprecated `webkitAudioContext` with `AudioContext`.
      outputAudioContextRef.current = new (window.AudioContext)({ sampleRate: 24000 });
    }
    // ensure the context is resumed if suspended
    if (outputAudioContextRef.current.state === 'suspended') {
      outputAudioContextRef.current.resume();
    }
  }, []);


  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  useEffect(() => {
    if (initialMessage && chatHistory.length === 0) {
      addNewMessage({
        id: `init-${Date.now()}`,
        role: MessageRole.MODEL,
        text: initialMessage,
        timestamp: new Date(),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMessage]); // Rerun when initialMessage changes

  const handleTextSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMessage: AIChatMessage = {
      id: `user-${Date.now()}`,
      role: MessageRole.USER,
      text: inputText,
      timestamp: new Date(),
    };
    addNewMessage(userMessage);
    setInputText('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await getGeminiTextResponse(inputText, chatHistory, systemInstruction);
      addNewMessage({
        id: `model-${Date.now()}`,
        role: MessageRole.MODEL,
        text: response.text,
        timestamp: new Date(),
      });
    } catch (err: any) {
      console.error('Error sending text message to Gemini:', err);
      setError(err.message || 'Failed to get a response from the AI. Please try again.');
      addNewMessage({
        id: `error-${Date.now()}`,
        role: MessageRole.MODEL,
        text: `Error: ${err.message || 'Failed to get a response.'}`,
        timestamp: new Date(),
      });
    } finally {
      setIsLoading(false);
    }
  }, [inputText, isLoading, chatHistory, systemInstruction, addNewMessage]);

  const toggleLiveSession = useCallback(async () => {
    if (liveSessionController.current?.isConnected) {
      liveSessionController.current.stopRecording();
      liveSessionController.current.close();
      liveSessionController.current = null;
      setIsLiveSessionActive(false);
      setIsMicrophoneListening(false);
    } else {
      setError(null);
      setIsLoading(true);
      // Add a placeholder message for the model's response
      const modelPlaceholderId = `model-live-${Date.now()}`;
      addNewMessage({
        id: modelPlaceholderId,
        role: MessageRole.MODEL,
        text: 'Listening...',
        timestamp: new Date(),
        isStreaming: true, // Indicate that this message is actively streaming
      });

      // Pass `modelPlaceholderId` to the message handler so it can update the correct message
      const sessionCallbacks = {
        onMessage: (message: any) => {
          // If a new model turn starts, ensure a new message is added or the existing one is updated
          if (message.serverContent?.modelTurn && currentOutputTranscription.current === '') {
            updateMessage(modelPlaceholderId, { text: '', isStreaming: true }); // Reset text to handle new stream
          }
          handleLiveMessage(message);
        },
        onError: (e: Error) => {
          setIsLoading(false);
          handleLiveError(e);
          updateMessage(modelPlaceholderId, { text: `Error: ${e.message}`, isStreaming: false });
        },
        onOpen: () => {
          setIsLoading(false);
          handleLiveOpen();
          // The placeholder message will be updated by onOpen callback
        },
        onClose: handleLiveClose,
        onAudioBuffer: handleAudioBuffer,
      };

      try {
        const controller = await connectLiveSession(sessionCallbacks);
        liveSessionController.current = controller;
        // The state will be updated by onOpen callback
      } catch (err: any) {
        setIsLoading(false);
        setError(err.message || 'Failed to start voice assistant.');
        updateMessage(modelPlaceholderId, { text: `Error: ${err.message}`, isStreaming: false });
      }
    }
  }, [handleLiveMessage, handleLiveError, handleLiveOpen, handleLiveClose, handleAudioBuffer, addNewMessage, updateMessage]);

  return (
    <div className="flex flex-col h-full bg-[var(--bg)] rounded-lg shadow-inner border border-gray-200">
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {chatHistory.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === MessageRole.USER ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] px-4 py-2 rounded-lg text-sm ${
                msg.role === MessageRole.USER
                  ? 'bg-[var(--brand-dark)] text-white'
                  : 'bg-white text-[var(--brand-dark)] border border-gray-200'
              }`}
            >
              <p>{msg.text}</p>
              {msg.isStreaming && msg.role === MessageRole.MODEL && (
                <span className="animate-pulse text-xs text-gray-500 block mt-1">...</span>
              )}
            </div>
          </div>
        ))}
        {isLoading && !isLiveSessionActive && (
          <div className="flex justify-start">
            <div className="bg-white text-[var(--brand-dark)] px-4 py-2 rounded-lg text-sm border border-gray-200">
              <span className="animate-pulse">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 p-4 flex gap-2 items-center sticky bottom-0 bg-white">
        <button
          onClick={toggleLiveSession}
          className={`flex items-center justify-center p-3 rounded-full text-white transition-colors duration-200
            ${isLiveSessionActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}
            ${isLoading && !isLiveSessionActive ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          disabled={isLoading && !isLiveSessionActive}
          aria-label={isLiveSessionActive ? "Stop voice assistant" : "Start voice assistant"}
        >
          {isLiveSessionActive ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 18h12V6H6v12zM8 8h8v8H8V8z" /> {/* Stop icon */}
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.2-3c0 3.53-2.9 6.43-6.2 6.43S5.8 14.53 5.8 11H4v1c0 3.98 3.44 7.28 7.5 7.94V22h1v-3.06c4.06-.66 7.5-3.96 7.5-7.94v-1h-1.2z" />
            </svg>
          )}
        </button>

        <form onSubmit={handleTextSubmit} className="flex-grow flex gap-2">
          <input
            type="text"
            className="flex-grow p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)]"
            placeholder={isMicrophoneListening ? "Speak or type..." : "Type your message..."}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading || isMicrophoneListening}
            aria-label="Chat input"
          />
          <button
            type="submit"
            className="bg-[var(--brand-dark)] text-white px-6 py-3 rounded-lg hover:opacity-95 transition"
            disabled={isLoading || isMicrophoneListening || !inputText.trim()}
          >
            Send
          </button>
        </form>
      </div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mx-4 mb-4" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline ml-2">{error}</span>
        </div>
      )}
    </div>
  );
};

export default AIChatbot;