import React, { useState, useRef, useCallback, useEffect } from 'react';

interface ImageUploadWithCameraProps {
  id: string;
  label: string;
  currentImageBase64?: string;
  onImageChange: (imageBase64: string | undefined) => void;
  showCameraOption: boolean;
  maxSizeMB?: number;
}

const ImageUploadWithCamera: React.FC<ImageUploadWithCameraProps> = ({
  id,
  label,
  currentImageBase64,
  onImageChange,
  showCameraOption,
  maxSizeMB = 2,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const stopCamera = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setShowCamera(false);
  }, []);

  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setShowCamera(true);
    } catch (err) {
      console.error('Error accessing camera:', err);
      setCameraError('Could not access camera. Please ensure it is enabled and try again.');
      setShowCamera(false);
    }
  }, []);

  const capturePhoto = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg', 0.9); // Adjust quality as needed
        onImageChange(imageData);
        stopCamera();
      }
    }
  }, [onImageChange, stopCamera]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file (e.g., JPG, PNG, GIF).');
        onImageChange(undefined);
        return;
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        alert(`Image file is too large. Please upload an image smaller than ${maxSizeMB}MB.`);
        onImageChange(undefined);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        onImageChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      onImageChange(undefined);
    }
  }, [onImageChange, maxSizeMB]);

  useEffect(() => {
    // Cleanup camera on unmount or when camera is hidden
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold mb-2 text-[var(--brand-dark)]">{label}</label>

      {/* File Upload Input */}
      {!showCamera && (
        <input
          id={id}
          type="file"
          accept="image/*"
          className="w-full text-sm text-gray-700
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-[var(--brand-accent)] file:text-white
            hover:file:bg-opacity-90"
          onChange={handleFileChange}
        />
      )}

      {/* Camera Controls */}
      {showCameraOption && !currentImageBase64 && !showCamera && (
        <button
          type="button"
          onClick={startCamera}
          className="mt-2 w-full flex items-center justify-center p-2 border border-gray-300 rounded text-sm text-[var(--brand-dark)] hover:bg-gray-50 transition"
          aria-label="Use camera to upload photo"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.867-1.299A2 2 0 0113.045 4h.914a2 2 0 011.664.89l.867 1.299A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Use Camera
        </button>
      )}

      {showCamera && (
        <div className="mt-4 bg-gray-100 p-2 rounded-lg text-center">
          {cameraError && <p className="text-red-500 text-sm mb-2">{cameraError}</p>}
          <video ref={videoRef} className="w-full rounded-lg" autoPlay playsInline></video>
          <div className="flex justify-center gap-2 mt-2">
            <button
              type="button"
              onClick={capturePhoto}
              className="px-4 py-2 bg-[var(--brand-dark)] text-white rounded hover:opacity-95 transition text-sm"
            >
              Capture Photo
            </button>
            <button
              type="button"
              onClick={stopCamera}
              className="px-4 py-2 border border-gray-300 rounded text-[var(--brand-dark)] hover:bg-gray-50 transition text-sm"
            >
              Cancel
            </button>
          </div>
          <canvas ref={canvasRef} style={{ display: 'none' }}></canvas> {/* Hidden canvas for photo capture */}
        </div>
      )}

      {/* Image Preview */}
      {currentImageBase64 && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
          <img src={currentImageBase64} alt="Preview" className="max-w-full h-auto rounded-lg shadow" style={{ maxHeight: '150px' }} />
          <button
            type="button"
            onClick={() => onImageChange(undefined)}
            className="mt-2 text-red-600 hover:text-red-800 text-sm"
          >
            Remove Image
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploadWithCamera;