'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Hand, ChevronDown, Sparkles, Globe, ArrowRight } from 'lucide-react';
import { SignAvatar } from './SignAvatar';

// Floating particle component
function Particle({ delay, duration, x, size, hue }: { delay: number; duration: number; x: string; size: number; hue: number }) {
  return (
    <motion.div
      className="absolute rounded-full opacity-40"
      style={{
        left: x,
        bottom: -20,
        width: size,
        height: size,
        background: `hsl(${hue}, 70%, 65%)`,
        filter: 'blur(1px)',
      }}
      animate={{
        y: [0, -800],
        opacity: [0, 0.6, 0.6, 0],
        scale: [0.5, 1, 1, 0.3],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeOut',
      }}
    />
  );
}

const HERO_WORDS = ['HELLO', 'WELCOME', 'LEARN', 'CONNECT', 'LOVE', 'SIGN', 'BRIDGE'];

const STATIC_PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  delay: i * 0.8,
  duration: 6 + ((i * 7) % 40) / 10,
  x: `${5 + (i / 18) * 90}%`,
  size: 4 + ((i * 11) % 80) / 10,
  hue: 240 + ((i * 19) % 60),
}));

export default function HeroSection() {
  const [currentHeroWord, setCurrentHeroWord] = useState(HERO_WORDS[0]);
  const [isAvatarAnimating, setIsAvatarAnimating] = useState(true);
  const particles = STATIC_PARTICLES;

  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      setIsAvatarAnimating(false);
      setTimeout(() => {
        idx = (idx + 1) % HERO_WORDS.length;
        setCurrentHeroWord(HERO_WORDS[idx]);
        setIsAvatarAnimating(true);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const scrollToFeatures = () => {
    document.querySelector('#text-to-sign')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden mesh-bg" style={{ paddingTop: '80px' }}>
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Large glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent)', filter: 'blur(80px)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-12"
          style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)', filter: 'blur(80px)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #06b6d4, transparent)', filter: 'blur(100px)' }} />
        
        {/* Grid */}
        <div className="absolute inset-0 grid-pattern opacity-30" />
        
        {/* Floating particles */}
        {particles.map(p => <Particle key={p.id} {...p} />)}
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
          
          {/* Left: Text content */}
          <div className="space-y-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="badge badge-primary inline-flex items-center gap-2">
                <Sparkles size={12} />
                AI-Powered Sign Language Platform
              </span>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="space-y-3"
            >
              <h1 className="section-title text-white" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
                Breaking barriers
                <br />
                <span className="gradient-text glow-text">through sign</span>
                <br />
                <span className="text-white">language.</span>
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg leading-relaxed"
              style={{ color: 'var(--text-secondary)', maxWidth: '500px' }}
            >
              SignBridge translates text, videos, and live gestures into animated sign language — and back again. Real-time, accessible, and beautiful.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex gap-8"
            >
              {[
                { value: '6+', label: 'Sign Languages' },
                { value: 'Real-time', label: 'AI Detection' },
                { value: '100%', label: 'Free & Open' },
              ].map(stat => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
                </div>
              ))}
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-wrap gap-3"
            >
              <button
                id="hero-start-btn"
                onClick={scrollToFeatures}
                className="btn-primary btn-icon text-base px-8 py-4"
              >
                <Hand size={18} />
                Start Signing
                <ArrowRight size={16} />
              </button>
              <button
                id="hero-learn-btn"
                onClick={() => document.querySelector('#learn')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-secondary btn-icon text-base px-8 py-4"
              >
                <Globe size={16} />
                Learn Signs
              </button>
            </motion.div>

            {/* Supported languages */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="flex items-center gap-3 flex-wrap"
            >
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Supports:</span>
              {['ASL', 'BSL', 'Auslan', 'ISL', 'LSF', 'DGS'].map(lang => (
                <span key={lang} className="text-xs px-2.5 py-1 rounded-lg"
                  style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {lang}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right: Avatar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center justify-center"
          >
            <div className="relative">
              {/* Outer rings */}
              {[300, 380, 460].map((size, i) => (
                <motion.div
                  key={size}
                  className="absolute rounded-full border"
                  style={{
                    width: size,
                    height: size,
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    borderColor: `rgba(99, 102, 241, ${0.15 - i * 0.04})`,
                  }}
                  animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                  transition={{ duration: 20 + i * 10, repeat: Infinity, ease: 'linear' }}
                >
                  {/* Dot on ring */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
                    style={{ background: i === 0 ? '#6366f1' : i === 1 ? '#8b5cf6' : '#06b6d4' }} />
                </motion.div>
              ))}

              {/* Main avatar container */}
              <motion.div
                className="relative rounded-full flex items-center justify-center"
                style={{
                  width: 280,
                  height: 320,
                  background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.18) 0%, rgba(5,7,20,0.9) 70%)',
                  border: '1px solid rgba(99,102,241,0.25)',
                  boxShadow: '0 0 60px rgba(99,102,241,0.2), inset 0 0 40px rgba(99,102,241,0.05)'
                }}
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <SignAvatar word={currentHeroWord} isAnimating={isAvatarAnimating} size="sm" />
                
                {/* Word label */}
                <motion.div
                  key={currentHeroWord}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute -bottom-4 badge badge-primary px-5 py-2 text-sm font-bold"
                  style={{ left: '50%', transform: 'translateX(-50%)' }}
                >
                  ✋ {currentHeroWord}
                </motion.div>
              </motion.div>

              {/* Corner labels */}
              {[
                { pos: { top: '5%', right: '-8%' }, label: 'ASL', color: 'badge-primary' },
                { pos: { bottom: '15%', right: '-12%' }, label: 'Real-time', color: 'badge-cyan' },
                { pos: { top: '20%', left: '-12%' }, label: 'AI Powered', color: 'badge-green' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className={`absolute badge ${item.color} text-xs`}
                  style={item.pos}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + i * 0.2 }}
                >
                  {item.label}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        onClick={scrollToFeatures}
      >
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Scroll to explore</span>
        <ChevronDown size={20} style={{ color: 'var(--text-muted)' }} />
      </motion.div>
    </section>
  );
}
