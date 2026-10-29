'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Type, Volume2, Mic, MicOff, Play, ChevronRight } from 'lucide-react';
import { SignAvatar } from './SignAvatar';

interface SpeechRecognitionEventLike {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionLike {
  new (): {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    onstart: (() => void) | null;
    onend: (() => void) | null;
    onresult: ((event: SpeechRecognitionEventLike) => void) | null;
    onerror: (() => void) | null;
    start: () => void;
  };
}

const SUPPORTED_LANGUAGES = ['ASL', 'BSL', 'Auslan', 'ISL', 'LSF', 'DGS'];

interface TextToSignProps {
  onLanguageChange?: (lang: string) => void;
}

export default function TextToSign({ onLanguageChange }: TextToSignProps) {
  const [inputText, setInputText] = useState('');
  const [currentWord, setCurrentWord] = useState('HELLO');
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedLang, setSelectedLang] = useState('ASL');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeWordIndex, setActiveWordIndex] = useState(-1);

  const processText = useCallback((text: string) => {
    const words = text.trim().toUpperCase().split(/\s+/).filter(Boolean);
    if (words.length === 0) return;
    
    setCurrentWord(words[0]);
    setIsAnimating(true);
    setActiveWordIndex(0);

    const letterDuration = 650; // ms per letter
    
    const animateWord = (wordIdx: number) => {
      if (wordIdx >= words.length) {
        setIsAnimating(false);
        setActiveWordIndex(-1);
        return;
      }
      const word = words[wordIdx];
      setCurrentWord(word);
      setActiveWordIndex(wordIdx);
      const duration = Math.max(word.length * letterDuration, 1200);
      setTimeout(() => animateWord(wordIdx + 1), duration);
    };

    animateWord(0);
  }, []);

  const handleSpeak = () => {
    if (!inputText.trim()) return;
    processText(inputText);
    
    // Text-to-speech
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(inputText);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleVoiceInput = () => {
    const windowWithSpeech = window as unknown as {
      SpeechRecognition?: SpeechRecognitionLike;
      webkitSpeechRecognition?: SpeechRecognitionLike;
    };
    const SpeechRecognition = windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Chrome.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: SpeechRecognitionEventLike) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      processText(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.start();
  };

  const handleLangSelect = (lang: string) => {
    setSelectedLang(lang);
    onLanguageChange?.(lang);
  };

  const words = inputText.trim().toUpperCase().split(/\s+/).filter(Boolean);

  return (
    <div className="feature-card h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.3))' }}>
            <Type size={18} className="text-indigo-400" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-white">Text → Sign</h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Type or speak to sign</p>
          </div>
        </div>
        <span className="badge badge-primary">{selectedLang}</span>
      </div>

      {/* Language selector */}
      <div className="flex gap-2 flex-wrap mb-5">
        {SUPPORTED_LANGUAGES.map(lang => (
          <button
            key={lang}
            className={`lang-pill text-xs ${selectedLang === lang ? 'selected' : ''}`}
            onClick={() => handleLangSelect(lang)}
            id={`lang-pill-${lang.toLowerCase()}`}
          >
            {lang}
          </button>
        ))}
      </div>

      {/* Avatar Display */}
      <div className="relative flex items-center justify-center mb-5 rounded-2xl overflow-hidden"
        style={{ 
          height: '280px',
          background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.12) 0%, rgba(5,7,20,0.8) 70%)',
          border: '1px solid rgba(99,102,241,0.15)'
        }}>
        {/* Grid pattern */}
        <div className="absolute inset-0 grid-pattern opacity-30" />
        
        {/* Glow rings */}
        {isAnimating && (
          <>
            <motion.div
              className="absolute rounded-full border border-indigo-500/30"
              animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ width: 200, height: 200 }}
            />
            <motion.div
              className="absolute rounded-full border border-purple-500/20"
              animate={{ scale: [1, 2, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
              style={{ width: 200, height: 200 }}
            />
          </>
        )}
        
        <SignAvatar word={currentWord} isAnimating={isAnimating} size="sm" />
        
        {/* Word being signed overlay */}
        <AnimatePresence>
          {isAnimating && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 badge badge-primary px-4 py-2 text-sm font-bold"
            >
              ✋ {currentWord}
            </motion.div>
          )}
        </AnimatePresence>
        
        {!isAnimating && !inputText && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs" style={{ color: 'var(--text-muted)' }}>
            Enter text below to start signing
          </div>
        )}
      </div>

      {/* Word highlights */}
      {words.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1">
          {words.map((word, i) => (
            <span
              key={i}
              className={`sign-word text-sm ${i === activeWordIndex ? 'active' : ''}`}
              style={{ color: i === activeWordIndex ? undefined : 'var(--text-muted)' }}
            >
              {word}
            </span>
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="space-y-3">
        <div className="relative">
          <textarea
            id="text-to-sign-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type text to translate into sign language..."
            className="input-field resize-none"
            rows={3}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSpeak();
            }}
          />
          <div className="absolute bottom-3 right-3 text-xs" style={{ color: 'var(--text-muted)' }}>
            Ctrl+Enter to sign
          </div>
        </div>

        <div className="flex gap-2">
          <button
            id="voice-input-btn"
            onClick={handleVoiceInput}
            className={`btn-secondary btn-icon flex-shrink-0 ${isListening ? 'border-red-500/50 text-red-400' : ''}`}
            style={{ padding: '12px 16px' }}
          >
            {isListening ? <MicOff size={16} className="text-red-400" /> : <Mic size={16} />}
          </button>
          
          <button
            id="speak-sign-btn"
            onClick={handleSpeak}
            className="btn-primary btn-icon flex-1"
            disabled={!inputText.trim() || isAnimating}
          >
            {isSpeaking ? <Volume2 size={16} /> : <Play size={16} />}
            {isAnimating ? 'Signing...' : 'Translate & Sign'}
            {!isAnimating && <ChevronRight size={14} />}
          </button>
        </div>
      </div>
      
      {/* Quick phrases */}
      <div className="mt-4">
        <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>Quick phrases:</p>
        <div className="flex flex-wrap gap-2">
          {['Hello', 'Thank you', 'Good morning', 'I love you', 'Please help'].map(phrase => (
            <button
              key={phrase}
              onClick={() => { setInputText(phrase); processText(phrase); }}
              className="text-xs px-3 py-1.5 rounded-lg border transition-all hover:border-indigo-500/50"
              style={{ 
                background: 'rgba(99,102,241,0.08)', 
                borderColor: 'rgba(255,255,255,0.08)',
                color: 'var(--text-secondary)'
              }}
            >
              {phrase}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
