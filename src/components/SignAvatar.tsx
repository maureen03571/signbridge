'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ASL hand sign configurations - each letter/word maps to a gesture description
export const ASL_ALPHABET: Record<string, { fingers: number[], wrist: number, description: string }> = {
  A: { fingers: [0, 0, 0, 0, 0], wrist: 0, description: 'Fist with thumb to side' },
  B: { fingers: [1, 1, 1, 1, 0], wrist: 0, description: 'Four fingers up, thumb bent' },
  C: { fingers: [0.5, 0.5, 0.5, 0.5, 0.5], wrist: 15, description: 'Curved hand like letter C' },
  D: { fingers: [1, 0, 0, 0, 0], wrist: 0, description: 'Index up, others circle' },
  E: { fingers: [0.3, 0.3, 0.3, 0.3, 0.3], wrist: -10, description: 'Fingers curled, thumb under' },
  F: { fingers: [0, 1, 1, 1, 0], wrist: 0, description: 'Thumb-index circle, others up' },
  G: { fingers: [1, 0, 0, 0, 0], wrist: 90, description: 'Index finger pointing sideways' },
  H: { fingers: [1, 1, 0, 0, 0], wrist: 90, description: 'Index and middle pointing sideways' },
  I: { fingers: [0, 0, 0, 0, 1], wrist: 0, description: 'Pinky up' },
  J: { fingers: [0, 0, 0, 0, 1], wrist: 45, description: 'Pinky traces J' },
  K: { fingers: [1, 1, 0, 0, 0], wrist: 0, description: 'Index and middle up, thumb between' },
  L: { fingers: [1, 0, 0, 0, 1], wrist: 0, description: 'L-shape with thumb and index' },
  M: { fingers: [0, 0, 0, 0, 0], wrist: -15, description: 'Three fingers over thumb' },
  N: { fingers: [0, 0, 0, 0, 0], wrist: -10, description: 'Two fingers over thumb' },
  O: { fingers: [0.4, 0.4, 0.4, 0.4, 0.4], wrist: 0, description: 'O shape with all fingers' },
  P: { fingers: [1, 1, 0, 0, 0], wrist: -90, description: 'K shape pointing down' },
  Q: { fingers: [1, 0, 0, 0, 0], wrist: -90, description: 'G shape pointing down' },
  R: { fingers: [1, 1, 0, 0, 0], wrist: 0, description: 'Index and middle crossed' },
  S: { fingers: [0, 0, 0, 0, 0], wrist: 0, description: 'Fist with thumb over fingers' },
  T: { fingers: [0, 0, 0, 0, 0], wrist: 0, description: 'Thumb between index and middle' },
  U: { fingers: [1, 1, 0, 0, 0], wrist: 0, description: 'Index and middle together up' },
  V: { fingers: [1, 1, 0, 0, 0], wrist: 10, description: 'Index and middle spread (peace)' },
  W: { fingers: [1, 1, 1, 0, 0], wrist: 0, description: 'Three fingers spread' },
  X: { fingers: [0.6, 0, 0, 0, 0], wrist: 0, description: 'Index finger hooked' },
  Y: { fingers: [0, 0, 0, 0, 1], wrist: 0, description: 'Thumb and pinky out' },
  Z: { fingers: [1, 0, 0, 0, 0], wrist: 0, description: 'Index traces Z' },
};

// Common sign language words with gesture descriptions
export const SIGN_WORDS: Record<string, string> = {
  HELLO: 'Wave hand from ear outward',
  GOODBYE: 'Wave hand up and down',
  THANK: 'Flat hand from chin forward',
  PLEASE: 'Circular motion on chest',
  SORRY: 'Fist circular motion on chest',
  YES: 'Fist nodding motion',
  NO: 'Index and middle close to thumb',
  HELP: 'Thumb up on open palm, lift',
  LOVE: 'Cross arms over chest',
  GOOD: 'Flat hand from chin down',
  BAD: 'Fingers to chin, flip down',
  WANT: 'Claw hands pull toward body',
  MORE: 'Fingertips together, tap twice',
  STOP: 'Flat hand chop into palm',
  GO: 'Both index fingers forward',
  COME: 'Index finger curl inward',
  WATER: 'W hand to chin, tap twice',
  EAT: 'Fingers to mouth',
  SLEEP: 'Hand closes over face downward',
  WORK: 'Fists tap together',
  SCHOOL: 'Clap flat hand twice',
  HOME: 'Fingers to mouth then cheek',
  FAMILY: 'F hands circle outward',
  FRIEND: 'Index fingers link and swap',
  LEARN: 'Flat hand to forehead',
  UNDERSTAND: 'Index flicks from temple upward',
  DEAF: 'Index to ear then mouth',
  HEARING: 'Index circle near mouth',
  SIGN: 'Alternate index circles',
  LANGUAGE: 'L hands wiggle apart',
};

interface SignAvatarProps {
  word: string;
  isAnimating: boolean;
  size?: 'sm' | 'md' | 'lg';
}

// Hand SVG component that animates based on sign
function HandSign({ letter, animated }: { letter: string; animated: boolean }) {
  const config = ASL_ALPHABET[letter.toUpperCase()] || ASL_ALPHABET['A'];
  
  return (
    <motion.div
      className="relative flex items-center justify-center"
      animate={animated ? {
        scale: [1, 1.05, 1],
        rotate: [0, config.wrist * 0.3, 0],
      } : {}}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      <svg width="120" height="160" viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Palm */}
        <motion.rect
          x="25" y="80" width="70" height="65" rx="12"
          fill="url(#handGrad)"
          animate={animated ? { y: [80, 75, 80] } : {}}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        />
        {/* Wrist */}
        <rect x="35" y="135" width="50" height="25" rx="8" fill="url(#handGrad)" />
        
        {/* Thumb */}
        <motion.g
          animate={animated ? {
            rotate: config.fingers[4] > 0.5 ? [0, -30, 0] : [0, 15, 0],
            originX: '25px', originY: '110px'
          } : {}}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          <rect x="8" y="95" width="22" height="38" rx="10" fill="url(#handGrad)" transform={`rotate(${config.fingers[4] > 0.5 ? -25 : 10}, 19, 114)`} />
        </motion.g>
        
        {/* Index finger */}
        <motion.rect
          x="28" y="22" width="16" height={45 + config.fingers[0] * 10} rx="7"
          fill="url(#handGrad)"
          animate={animated ? {
            height: config.fingers[0] > 0.5 ? [55, 58, 55] : [30, 32, 30],
            y: config.fingers[0] > 0.5 ? [22, 20, 22] : [45, 43, 45]
          } : {}}
          transition={{ duration: 0.6, ease: 'easeInOut', delay: 0.05 }}
        />
        
        {/* Middle finger */}
        <motion.rect
          x="48" y="18" width="16" height={48 + config.fingers[1] * 10} rx="7"
          fill="url(#handGrad)"
          animate={animated ? {
            height: config.fingers[1] > 0.5 ? [58, 62, 58] : [28, 32, 28],
            y: config.fingers[1] > 0.5 ? [18, 16, 18] : [46, 44, 46]
          } : {}}
          transition={{ duration: 0.6, ease: 'easeInOut', delay: 0.1 }}
        />
        
        {/* Ring finger */}
        <motion.rect
          x="68" y="22" width="15" height={45 + config.fingers[2] * 8} rx="7"
          fill="url(#handGrad)"
          animate={animated ? {
            height: config.fingers[2] > 0.5 ? [53, 56, 53] : [30, 33, 30],
            y: config.fingers[2] > 0.5 ? [22, 20, 22] : [45, 43, 45]
          } : {}}
          transition={{ duration: 0.6, ease: 'easeInOut', delay: 0.15 }}
        />
        
        {/* Pinky finger */}
        <motion.rect
          x="86" y="30" width="14" height={38 + config.fingers[3] * 8} rx="6"
          fill="url(#handGrad)"
          animate={animated ? {
            height: config.fingers[3] > 0.5 ? [46, 50, 46] : [22, 26, 22],
            y: config.fingers[3] > 0.5 ? [30, 28, 30] : [46, 44, 46]
          } : {}}
          transition={{ duration: 0.6, ease: 'easeInOut', delay: 0.2 }}
        />
        
        {/* Finger knuckle details */}
        <circle cx="36" cy="80" r="4" fill="rgba(255,255,255,0.15)" />
        <circle cx="56" cy="80" r="4" fill="rgba(255,255,255,0.15)" />
        <circle cx="75" cy="80" r="4" fill="rgba(255,255,255,0.15)" />
        <circle cx="93" cy="82" r="3.5" fill="rgba(255,255,255,0.15)" />
        
        <defs>
          <linearGradient id="handGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#c4a882" />
            <stop offset="100%" stopColor="#a0845c" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Glow effect */}
      {animated && (
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{
            background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)',
            filter: 'blur(20px)',
          }}
        />
      )}
    </motion.div>
  );
}

// Full avatar body component
export function SignAvatar({ word, isAnimating, size = 'md' }: SignAvatarProps) {
  const [currentLetter, setCurrentLetter] = useState(0);
  const letters = word.replace(/[^a-zA-Z]/g, '').toUpperCase().split('');
  
  useEffect(() => {
    if (!isAnimating || letters.length === 0) return;

    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      if (idx >= letters.length) {
        clearInterval(interval);
      } else {
        setCurrentLetter(idx);
      }
    }, 600);
    return () => {
      clearInterval(interval);
      setCurrentLetter(0);
    };
  }, [isAnimating, letters.length, word]);

  const displayLetter = letters[currentLetter] || 'A';
  const sizes = { sm: 0.6, md: 1, lg: 1.3 };
  const scale = sizes[size];

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ transform: `scale(${scale})` }}>
      {/* Avatar head */}
      <motion.div
        className="relative"
        animate={isAnimating ? { 
          y: [0, -5, 0],
          rotate: [-2, 2, -2]
        } : {}}
        transition={{ duration: 2, repeat: isAnimating ? Infinity : 0, ease: 'easeInOut' }}
      >
        {/* Head */}
        <div className="relative w-28 h-32 rounded-[50%] mx-auto"
          style={{ background: 'linear-gradient(135deg, #c4a882, #a0845c)' }}>
          {/* Face features */}
          <div className="absolute top-8 left-6 flex gap-6">
            <div className="w-3 h-4 rounded-full bg-gray-800" />
            <div className="w-3 h-4 rounded-full bg-gray-800" />
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-10 h-2 rounded-full"
            style={{ background: '#8b6347', opacity: 0.7 }} />
          {/* Hair */}
          <div className="absolute -top-3 left-0 right-0 h-12 rounded-t-[50%]"
            style={{ background: 'linear-gradient(180deg, #3d2c1e, #5c3d2e)' }} />
        </div>
        
        {/* Neck */}
        <div className="w-14 h-10 mx-auto rounded-b-lg"
          style={{ background: 'linear-gradient(180deg, #c4a882, #a0845c)' }} />
      </motion.div>

      {/* Body */}
      <motion.div
        className="relative w-40 h-44 rounded-2xl flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
        animate={isAnimating ? { scaleY: [1, 1.02, 1] } : {}}
        transition={{ duration: 1.5, repeat: isAnimating ? Infinity : 0 }}
      >
        {/* Shirt details */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-1 rounded"
          style={{ background: 'rgba(255,255,255,0.2)' }} />
        
        {/* Arms area */}
        <div className="flex gap-2 items-end pb-2">
          {/* Left arm */}
          <motion.div
            className="w-12 h-32 rounded-xl"
            style={{ background: 'linear-gradient(180deg, #4338ca, #6d28d9)' }}
            animate={isAnimating ? { 
              rotate: [-5, 5, -5],
              scaleX: [1, 1.05, 1]
            } : {}}
            transition={{ duration: 1.5, repeat: isAnimating ? Infinity : 0 }}
          />
          
          {/* Center hand display */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={displayLetter}
                initial={{ opacity: 0, scale: 0.7, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.7, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <HandSign letter={displayLetter} animated={isAnimating} />
              </motion.div>
            </AnimatePresence>
            
            {/* Letter label */}
            {isAnimating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 badge badge-primary text-xs px-3"
              >
                {displayLetter}
              </motion.div>
            )}
          </div>
          
          {/* Right arm */}
          <motion.div
            className="w-12 h-32 rounded-xl"
            style={{ background: 'linear-gradient(180deg, #4338ca, #6d28d9)' }}
            animate={isAnimating ? { 
              rotate: [5, -5, 5],
              scaleX: [1, 1.05, 1]
            } : {}}
            transition={{ duration: 1.5, repeat: isAnimating ? Infinity : 0, delay: 0.3 }}
          />
        </div>
      </motion.div>
      
      {/* Legs */}
      <div className="flex gap-4">
        <div className="w-16 h-20 rounded-b-xl" style={{ background: 'linear-gradient(180deg, #1e1b4b, #312e81)' }} />
        <div className="w-16 h-20 rounded-b-xl" style={{ background: 'linear-gradient(180deg, #1e1b4b, #312e81)' }} />
      </div>
    </div>
  );
}

export default SignAvatar;
