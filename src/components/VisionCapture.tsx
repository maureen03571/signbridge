'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, CameraOff, Volume2, Loader2, AlertTriangle, RefreshCw, Mic } from 'lucide-react';
import { SignAvatar } from './SignAvatar';

const GESTURE_SEQUENCE = [
  { gesture: 'open_palm', word: 'HELLO', confidence: 0.94 },
  { gesture: 'thumbs_up', word: 'GOOD', confidence: 0.89 },
  { gesture: 'closed_fist', word: 'STOP', confidence: 0.92 },
  { gesture: 'peace', word: 'TWO', confidence: 0.87 },
  { gesture: 'pointing', word: 'YOU', confidence: 0.91 },
  { gesture: 'waving', word: 'GOODBYE', confidence: 0.88 },
  { gesture: 'ok_sign', word: 'OK', confidence: 0.95 },
  { gesture: 'open_palm', word: 'HELP', confidence: 0.82 },
];

interface DetectedSign {
  word: string;
  confidence: number;
  timestamp: number;
}

export default function VisionCapture() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectionRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [detectedSigns, setDetectedSigns] = useState<DetectedSign[]>([]);
  const [currentSign, setCurrentSign] = useState<DetectedSign | null>(null);
  const [translatedText, setTranslatedText] = useState('');
  const [avatarWord, setAvatarWord] = useState('HELLO');
  const [isAvatarAnimating, setIsAvatarAnimating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [fps, setFps] = useState(30);
  const [confidence, setConfidence] = useState(0);
  const fpsRef = useRef(0);
  const lastFpsTime = useRef(0);

  // Draw hand landmarks overlay on canvas
  const drawHandOverlay = useCallback((ctx: CanvasRenderingContext2D, landmarks: {x: number, y: number}[]) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    if (landmarks.length === 0) return;
    
    // Draw connections
    const connections = [
      [0, 1], [1, 2], [2, 3], [3, 4], // thumb
      [0, 5], [5, 6], [6, 7], [7, 8], // index
      [5, 9], [9, 10], [10, 11], [11, 12], // middle
      [9, 13], [13, 14], [14, 15], [15, 16], // ring
      [13, 17], [17, 18], [18, 19], [19, 20], // pinky
      [0, 17],
    ];
    
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.7)';
    ctx.lineWidth = 2;
    connections.forEach(([a, b]) => {
      if (landmarks[a] && landmarks[b]) {
        ctx.beginPath();
        ctx.moveTo(landmarks[a].x * ctx.canvas.width, landmarks[a].y * ctx.canvas.height);
        ctx.lineTo(landmarks[b].x * ctx.canvas.width, landmarks[b].y * ctx.canvas.height);
        ctx.stroke();
      }
    });
    
    // Draw joints
    landmarks.forEach((pt, i) => {
      ctx.beginPath();
      ctx.arc(pt.x * ctx.canvas.width, pt.y * ctx.canvas.height, i === 0 ? 6 : 4, 0, Math.PI * 2);
      ctx.fillStyle = i === 0 ? '#10b981' : '#6366f1';
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  }, []);

  // Generate mock hand landmarks for visualization
  const generateMockLandmarks = useCallback(() => {
    const baseX = 0.3 + Math.random() * 0.4;
    const baseY = 0.3 + Math.random() * 0.4;
    
    return Array.from({ length: 21 }, () => ({
      x: baseX + (Math.random() - 0.5) * 0.3,
      y: baseY + (Math.random() - 0.5) * 0.3,
    }));
  }, []);

  // Simulate sign detection loop
  const startDetectionLoop = useCallback(() => {
    let idx = 0;
    lastFpsTime.current = Date.now();
    fpsRef.current = 0;
    detectionRef.current = setInterval(() => {
      // Simulate FPS counter
      fpsRef.current++;
      const now = Date.now();
      if (now - lastFpsTime.current >= 1000) {
        setFps(fpsRef.current);
        fpsRef.current = 0;
        lastFpsTime.current = now;
      }
      
      // Update hand landmarks every frame
      const landmarks = generateMockLandmarks();
      
      // Draw on canvas
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) drawHandOverlay(ctx, landmarks);
      }
      
      // Simulate gesture detection every ~3 seconds
      if (Math.random() < 0.015) {
        const gesture = GESTURE_SEQUENCE[idx % GESTURE_SEQUENCE.length];
        idx++;
        
        const detected: DetectedSign = {
          word: gesture.word,
          confidence: gesture.confidence + (Math.random() - 0.5) * 0.05,
          timestamp: Date.now(),
        };
        
        setCurrentSign(detected);
        setConfidence(detected.confidence);
        setAvatarWord(detected.word);
        setIsAvatarAnimating(true);
        
        setDetectedSigns(prev => {
          const updated = [...prev, detected];
          return updated.slice(-20); // Keep last 20
        });
        
        setTranslatedText(prev => {
          const words = prev ? prev + ' ' + detected.word : detected.word;
          return words;
        });
        
        // Speak the detected word
        if ('speechSynthesis' in window && !window.speechSynthesis.speaking) {
          setIsSpeaking(true);
          const utterance = new SpeechSynthesisUtterance(detected.word);
          utterance.rate = 1;
          utterance.pitch = 1;
          utterance.volume = 0.8;
          utterance.onend = () => { setIsSpeaking(false); setIsAvatarAnimating(false); };
          window.speechSynthesis.speak(utterance);
        }
      }
    }, 50); // 20fps simulation
  }, [drawHandOverlay, generateMockLandmarks]);

  const startCamera = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480, facingMode: 'user' },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      streamRef.current = stream;
      setIsActive(true);
      setIsLoading(false);
      
      // Start detection simulation after camera is ready
      setTimeout(startDetectionLoop, 1000);
      
    } catch (err: unknown) {
      const isPermissionDenied = err instanceof Error && err.message.includes('Permission');
      setError(isPermissionDenied 
        ? 'Camera permission denied. Please allow camera access.' 
        : 'Unable to start camera. Please check your device.');
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (detectionRef.current) {
      clearInterval(detectionRef.current);
      detectionRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    
    setIsActive(false);
    setIsAvatarAnimating(false);
    setCurrentSign(null);
    setFps(0);
  };

  const clearTranscript = () => {
    setDetectedSigns([]);
    setTranslatedText('');
    setCurrentSign(null);
  };

  const speakText = () => {
    if (!translatedText || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(translatedText);
    utterance.rate = 0.9;
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="feature-card h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.3), rgba(6,182,212,0.3))' }}>
            <Camera size={18} className="text-emerald-400" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-white">Vision Capture</h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Sign → Speech translation</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isActive && (
            <span className="badge badge-green flex items-center gap-1">
              <span className="status-dot active" />
              LIVE • {fps} FPS
            </span>
          )}
        </div>
      </div>

      {/* Camera feed */}
      <div className="relative rounded-2xl overflow-hidden mb-4"
        style={{ 
          height: 220,
          background: 'radial-gradient(ellipse, rgba(16,185,129,0.08) 0%, rgba(5,7,20,0.95) 80%)',
          border: `1px solid ${isActive ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.08)'}`
        }}>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 grid-pattern opacity-20" />
        
        {/* Video element */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: isActive ? 1 : 0, transform: 'scaleX(-1)' }}
          muted
          playsInline
        />
        
        {/* Canvas overlay for hand landmarks */}
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: isActive ? 1 : 0, transform: 'scaleX(-1)' }}
        />
        
        {/* Confidence bar */}
        {isActive && confidence > 0 && (
          <div className="absolute top-3 left-3 right-3">
            <div className="flex items-center justify-between text-xs mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>
              <span>Detection confidence</span>
              <span>{(confidence * 100).toFixed(0)}%</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #10b981, #06b6d4)' }}
                animate={{ width: `${confidence * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}
        
        {/* Detected sign overlay */}
        <AnimatePresence>
          {currentSign && isActive && (
            <motion.div
              key={currentSign.timestamp}
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-3 left-3 badge badge-green text-sm font-bold px-4 py-2"
            >
              ✋ {currentSign.word}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Scan lines when active */}
        {isActive && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(16,185,129,0.02) 2px, rgba(16,185,129,0.02) 4px)',
            }}
          />
        )}
        
        {/* Idle / Loading state */}
        {!isActive && !isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(16,185,129,0.15)', border: '2px solid rgba(16,185,129,0.3)' }}
            >
              <Camera size={28} className="text-emerald-400" />
            </motion.div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Camera ready</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Click start to begin capturing</p>
          </div>
        )}
        
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <Loader2 size={32} className="animate-spin text-emerald-400" />
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Starting camera...</p>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 p-3 rounded-xl flex items-center gap-2 text-sm"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5' }}
        >
          <AlertTriangle size={14} />
          {error}
        </motion.div>
      )}

      {/* Camera controls */}
      <div className="flex gap-2 mb-4">
        {!isActive ? (
          <button
            id="start-camera-btn"
            onClick={startCamera}
            disabled={isLoading}
            className="btn-primary btn-icon flex-1"
            style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)' }}
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
            {isLoading ? 'Starting...' : 'Start Camera'}
          </button>
        ) : (
          <>
            <button
              id="stop-camera-btn"
              onClick={stopCamera}
              className="btn-secondary btn-icon flex-1"
            >
              <CameraOff size={16} />
              Stop Camera
            </button>
            <button
              id="speak-detected-btn"
              onClick={speakText}
              disabled={!translatedText || isSpeaking}
              className="btn-primary btn-icon"
              style={{ padding: '12px 16px', background: 'linear-gradient(135deg, #10b981, #06b6d4)' }}
            >
              {isSpeaking ? <Mic size={16} /> : <Volume2 size={16} />}
            </button>
          </>
        )}
      </div>

      {/* Avatar response section */}
      {isActive && (
        <div className="flex gap-3 mb-4">
          {/* Mini avatar */}
          <div className="relative rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center"
            style={{ 
              width: 80, 
              height: 100,
              background: 'radial-gradient(ellipse, rgba(16,185,129,0.15) 0%, rgba(5,7,20,0.9) 80%)',
              border: '1px solid rgba(16,185,129,0.2)'
            }}>
            <SignAvatar word={avatarWord} isAnimating={isAvatarAnimating} size="sm" />
          </div>
          
          {/* Translated text */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Detected Signs</p>
              <button onClick={clearTranscript} className="text-xs hover:text-white transition-colors" style={{ color: 'var(--text-muted)' }}>
                <RefreshCw size={12} />
              </button>
            </div>
            <div className="transcript-area" style={{ height: 80 }}>
              {translatedText ? (
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {translatedText}
                </p>
              ) : (
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Performing signs in front of the camera...
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Recent detections */}
      {detectedSigns.length > 0 && (
        <div>
          <p className="text-xs mb-2 font-medium" style={{ color: 'var(--text-muted)' }}>Recent detections:</p>
          <div className="flex flex-wrap gap-2">
            {detectedSigns.slice(-8).map((sign) => (
              <motion.span
                key={sign.timestamp}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-xs px-2.5 py-1 rounded-lg font-medium"
                style={{ 
                  background: 'rgba(16,185,129,0.12)', 
                  border: '1px solid rgba(16,185,129,0.2)',
                  color: '#6ee7b7'
                }}
              >
                {sign.word}
              </motion.span>
            ))}
          </div>
        </div>
      )}
      
      {/* How it works */}
      {!isActive && (
        <div className="mt-4 space-y-2">
          {[
            { icon: '📷', text: 'Camera captures your hand gestures in real-time' },
            { icon: '🧠', text: 'AI model identifies sign language gestures' },
            { icon: '🔊', text: 'Translated words are spoken aloud automatically' },
            { icon: '👤', text: 'Avatar echoes the detected sign back to you' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
              <span className="text-base">{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
