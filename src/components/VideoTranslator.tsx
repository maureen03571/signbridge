'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, Youtube, Music, Play, Loader2, ChevronRight, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { SignAvatar } from './SignAvatar';

// Simulated transcription segments for demo purposes
// In production, this would call a real transcription API (Whisper/AssemblyAI/etc.)
const DEMO_TRANSCRIPTS: Record<string, string[]> = {
  youtube: [
    "Hello and welcome to this video.",
    "Today we will be discussing sign language.",
    "Sign language is a beautiful form of communication.",
    "It uses hand gestures and facial expressions.",
    "Millions of people around the world use sign language.",
    "Let us learn some basic signs together.",
    "Thank you for watching this video.",
  ],
  default: [
    "Processing audio from the provided link.",
    "Extracting speech segments.",
    "Translating text to sign language.",
    "Animation will begin shortly.",
    "Thank you for using SignBridge.",
  ]
};

type VideoSource = 'youtube' | 'spotify' | 'generic' | null;

function detectSource(url: string): VideoSource {
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  if (url.includes('spotify.com')) return 'spotify';
  if (url.startsWith('http')) return 'generic';
  return null;
}

function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export default function VideoTranslator() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'playing' | 'error'>('idle');
  const [transcriptLines, setTranscriptLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentSignWord, setCurrentSignWord] = useState('HELLO');
  const [isAvatarAnimating, setIsAvatarAnimating] = useState(false);
  const [youtubeId, setYoutubeId] = useState<string | null>(null);
  const [videoSource, setVideoSource] = useState<VideoSource>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);

  const handleAnalyze = async () => {
    if (!url.trim()) return;
    
    setStatus('loading');
    setErrorMsg('');
    setTranscriptLines([]);
    setCurrentLine(0);
    
    const source = detectSource(url);
    setVideoSource(source);
    
    if (!source) {
      setErrorMsg('Please enter a valid YouTube, Spotify, or web video URL.');
      setStatus('error');
      return;
    }

    // Extract YouTube ID if applicable
    if (source === 'youtube') {
      const ytId = getYouTubeId(url);
      setYoutubeId(ytId);
    }

    // Simulate API call / transcription (in production: call Whisper/AssemblyAI)
    await new Promise(r => setTimeout(r, 2500));
    
    const transcript = source === 'youtube' ? DEMO_TRANSCRIPTS.youtube : DEMO_TRANSCRIPTS.default;
    setTranscriptLines(transcript);
    setStatus('ready');
  };

  const handlePlay = () => {
    if (transcriptLines.length === 0) return;
    setStatus('playing');
    setCurrentLine(0);
    setIsAvatarAnimating(true);

    let lineIdx = 0;
    const playLine = () => {
      if (lineIdx >= transcriptLines.length) {
        setStatus('ready');
        setIsAvatarAnimating(false);
        setCurrentLine(0);
        return;
      }
      
      setCurrentLine(lineIdx);
      const words = transcriptLines[lineIdx].split(' ');
      const firstWord = words.find(w => w.length > 2) || words[0] || 'SIGN';
      setCurrentSignWord(firstWord.toUpperCase().replace(/[^A-Z]/g, ''));
      
      // Auto-scroll transcript
      if (transcriptRef.current) {
        const lineEl = transcriptRef.current.querySelector(`[data-line="${lineIdx}"]`);
        lineEl?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      const lineDuration = Math.max(transcriptLines[lineIdx].length * 60, 2500);
      intervalRef.current = setTimeout(() => {
        lineIdx++;
        playLine();
      }, lineDuration);
    };

    playLine();
  };

  const handleStop = () => {
    if (intervalRef.current) clearTimeout(intervalRef.current);
    setStatus('ready');
    setIsAvatarAnimating(false);
    setCurrentLine(0);
  };

  const handleClear = () => {
    handleStop();
    setUrl('');
    setStatus('idle');
    setTranscriptLines([]);
    setYoutubeId(null);
    setVideoSource(null);
  };

  const sourceIcons: Record<string, React.ReactNode> = {
    youtube: <Youtube size={16} className="text-red-400" />,
    spotify: <Music size={16} className="text-green-400" />,
    generic: <Link size={16} className="text-blue-400" />,
  };

  return (
    <div className="feature-card h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.3), rgba(251,146,60,0.3))' }}>
            <Youtube size={18} className="text-red-400" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-white">Video Translator</h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>YouTube • Spotify • Any video</p>
          </div>
        </div>
        {status !== 'idle' && (
          <span className={`badge ${status === 'playing' ? 'badge-green' : status === 'ready' ? 'badge-cyan' : 'badge-primary'}`}>
            {status === 'loading' ? '⏳ Processing' : status === 'playing' ? '▶ Live' : status === 'ready' ? '✓ Ready' : status === 'error' ? '✗ Error' : ''}
          </span>
        )}
      </div>

      {/* URL Input */}
      <div className="space-y-3 mb-5">
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            {videoSource ? sourceIcons[videoSource] : <Link size={16} style={{ color: 'var(--text-muted)' }} />}
          </div>
          <input
            id="video-url-input"
            type="url"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setStatus('idle'); }}
            placeholder="Paste YouTube, Spotify or any video URL..."
            className="input-field"
            style={{ paddingLeft: '44px', paddingRight: url ? '44px' : '18px' }}
            onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
          />
          {url && (
            <button 
              onClick={handleClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <button
            id="analyze-video-btn"
            onClick={handleAnalyze}
            disabled={!url.trim() || status === 'loading'}
            className="btn-primary btn-icon flex-1"
          >
            {status === 'loading' ? (
              <><Loader2 size={16} className="animate-spin" /> Analyzing...</>
            ) : (
              <><Play size={16} /> Analyze & Translate</>
            )}
          </button>
        </div>

        {/* Quick URLs */}
        <div className="flex gap-2 flex-wrap">
          <p className="text-xs w-full" style={{ color: 'var(--text-muted)' }}>Try an example:</p>
          {[
            { label: 'YouTube Demo', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', icon: '▶' },
            { label: 'Spotify Podcast', url: 'https://open.spotify.com/episode/example', icon: '♪' },
          ].map(item => (
            <button
              key={item.label}
              onClick={() => { setUrl(item.url); setStatus('idle'); setVideoSource(detectSource(item.url)); }}
              className="text-xs px-3 py-1.5 rounded-lg border transition-all hover:border-indigo-500/50"
              style={{ 
                background: 'rgba(99,102,241,0.08)', 
                borderColor: 'rgba(255,255,255,0.08)',
                color: 'var(--text-secondary)'
              }}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      <AnimatePresence>
        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-3 rounded-xl flex items-center gap-2 text-sm"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5' }}
          >
            <AlertCircle size={16} />
            {errorMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* YouTube embed */}
      {youtubeId && (status === 'ready' || status === 'playing') && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-4 rounded-xl overflow-hidden"
          style={{ border: '1px solid rgba(239,68,68,0.2)' }}
        >
          <iframe
            width="100%"
            height="180"
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=0&rel=0`}
            title="YouTube video"
            frameBorder="0"
            allowFullScreen
            className="block"
          />
        </motion.div>
      )}

      {/* Avatar + Transcript */}
      <AnimatePresence>
        {(status === 'ready' || status === 'playing') && transcriptLines.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="space-y-4"
          >
            {/* Mini Avatar */}
            <div className="flex gap-4 items-stretch">
              <div className="relative flex items-center justify-center rounded-xl flex-shrink-0"
                style={{ 
                  width: 120, 
                  background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.15) 0%, rgba(5,7,20,0.8) 80%)',
                  border: '1px solid rgba(99,102,241,0.15)'
                }}>
                <SignAvatar word={currentSignWord} isAnimating={isAvatarAnimating} size="sm" />
              </div>
              
              {/* Transcript */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 size={14} className="text-green-400" />
                  <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                    Transcript ({transcriptLines.length} segments)
                  </span>
                </div>
                <div className="transcript-area" ref={transcriptRef}>
                  {transcriptLines.map((line, i) => (
                    <motion.p
                      key={i}
                      data-line={i}
                      className="mb-1 transition-all duration-300"
                      animate={{
                        color: i === currentLine && status === 'playing' ? '#a5b4fc' : i < currentLine ? '#6ee7b7' : 'rgba(240,244,255,0.4)',
                        fontWeight: i === currentLine ? 600 : 400,
                      }}
                    >
                      {i < currentLine && '✓ '}
                      {i === currentLine && status === 'playing' && '▶ '}
                      {line}
                    </motion.p>
                  ))}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-2">
              {status === 'playing' ? (
                <button id="stop-translation-btn" onClick={handleStop} className="btn-secondary btn-icon flex-1">
                  ⏹ Stop Translation
                </button>
              ) : (
                <button id="play-translation-btn" onClick={handlePlay} className="btn-primary btn-icon flex-1">
                  <Play size={16} /> Play Sign Translation
                  <ChevronRight size={14} />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
