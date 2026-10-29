'use client';

import { motion } from 'framer-motion';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import TextToSign from '@/components/TextToSign';
import VideoTranslator from '@/components/VideoTranslator';
import VisionCapture from '@/components/VisionCapture';
import LearnSigns from '@/components/LearnSigns';
import { Hand, Accessibility, Globe2, Brain, Shield, Zap } from 'lucide-react';

const FEATURES = [
  {
    icon: <Hand size={24} />,
    title: 'Animated Avatar',
    desc: 'Realistic 3D humanoid avatar demonstrates sign language gestures with smooth, natural movements.',
    color: '#6366f1',
  },
  {
    icon: <Globe2 size={24} />,
    title: 'Multi-Language Support',
    desc: 'Supports ASL, BSL, Auslan, ISL, LSF, DGS and more sign language systems worldwide.',
    color: '#8b5cf6',
  },
  {
    icon: <Brain size={24} />,
    title: 'AI Vision Detection',
    desc: 'Real-time computer vision detects hand gestures and translates them to spoken words instantly.',
    color: '#06b6d4',
  },
  {
    icon: <Zap size={24} />,
    title: 'Video Translation',
    desc: 'Paste any YouTube or Spotify link — audio is transcribed and signed alongside in real-time.',
    color: '#10b981',
  },
  {
    icon: <Accessibility size={24} />,
    title: 'Full Accessibility',
    desc: 'Built with accessibility first — works with screen readers, keyboard navigation and assistive tech.',
    color: '#f59e0b',
  },
  {
    icon: <Shield size={24} />,
    title: 'Privacy First',
    desc: 'Camera data is processed locally on your device. Nothing is stored or sent to servers.',
    color: '#ec4899',
  },
];

function FeatureHighlights() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="badge badge-primary mb-4 inline-flex">✨ Platform Features</span>
          <h2 className="section-title text-white mb-4">
            Everything you need for
            <br />
            <span className="gradient-text">sign language access</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="feature-card glass-hover group"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                style={{ background: `${feature.color}22`, color: feature.color }}
              >
                {feature.icon}
              </div>
              <h3 className="font-bold text-white text-lg mb-2">{feature.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 max-w-7xl mx-auto px-6 mb-8">
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.3))' }} />
      <span className="badge badge-primary text-sm px-4">{label}</span>
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(99,102,241,0.3), transparent)' }} />
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t py-12 px-6" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                <Hand size={16} className="text-white" />
              </div>
              <span className="font-bold text-lg text-white">Sign<span className="gradient-text">Bridge</span></span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Breaking communication barriers through AI-powered sign language translation. Making the world more accessible for everyone.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Features</h4>
            <ul className="space-y-2">
              {['Text to Sign', 'Video Translation', 'Vision Capture', 'Learn Signs', 'Multi-Language'].map(item => (
                <li key={item}>
                  <span className="text-sm transition-colors hover:text-white cursor-pointer" style={{ color: 'var(--text-muted)' }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Languages</h4>
            <ul className="space-y-2">
              {['American Sign Language (ASL)', 'British Sign Language (BSL)', 'Auslan (Australia)', 'Irish Sign Language (ISL)', 'Langue des Signes (LSF)', 'Deutsche Gebärdensprache (DGS)'].map(item => (
                <li key={item}>
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            © 2026 SignBridge. Built for accessibility and inclusion.
          </p>
          <div className="flex items-center gap-3">
            <span className="badge badge-green flex items-center gap-2">
              <span className="status-dot active" />
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Header />
      <HeroSection />

      {/* Feature highlights */}
      <FeatureHighlights />

      {/* Main Features Section */}
      <section className="py-8 px-6" id="features">
        <SectionDivider label="🤟 Core Tools" />
        
        <div className="max-w-7xl mx-auto">
          {/* Text to Sign */}
          <motion.div
            id="text-to-sign"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Feature intro */}
              <div className="lg:col-span-2 flex flex-col justify-center space-y-4">
                <span className="badge badge-primary inline-flex w-fit">✍️ Feature 1</span>
                <h2 className="text-3xl font-bold text-white">
                  Type text,<br />
                  <span className="gradient-text">watch it sign.</span>
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Enter any text or use your voice, and our animated avatar will perform the corresponding sign language gestures letter by letter and word by word.
                </p>
                <ul className="space-y-2">
                  {['Voice input via microphone', 'Letter-by-letter animation', 'Multi-language support', 'Text-to-speech output'].map(item => (
                    <li key={item} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <div className="w-4 h-4 rounded-full flex items-center justify-center"
                        style={{ background: 'rgba(99,102,241,0.2)', color: '#a5b4fc', fontSize: '10px' }}>✓</div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="lg:col-span-3">
                <TextToSign />
              </div>
            </div>
          </motion.div>

          <div className="my-8 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }} />

          {/* Video Translator */}
          <motion.div
            id="video-translator"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-3 lg:order-1">
                <VideoTranslator />
              </div>
              <div className="lg:col-span-2 flex flex-col justify-center space-y-4 lg:order-2">
                <span className="badge badge-cyan inline-flex w-fit">🎥 Feature 2</span>
                <h2 className="text-3xl font-bold text-white">
                  Any video,<br />
                  <span className="gradient-text-pink">fully signed.</span>
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Paste a YouTube video or Spotify podcast link. We extract the audio, transcribe it, and synchronize a sign language animation alongside the content.
                </p>
                <ul className="space-y-2">
                  {['YouTube & Spotify support', 'Auto audio transcription', 'Live sign synchronization', 'Transcript display'].map(item => (
                    <li key={item} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <div className="w-4 h-4 rounded-full flex items-center justify-center"
                        style={{ background: 'rgba(6,182,212,0.2)', color: '#67e8f9', fontSize: '10px' }}>✓</div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          <div className="my-8 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }} />

          {/* Vision Capture */}
          <motion.div
            id="vision-capture"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-2 flex flex-col justify-center space-y-4">
                <span className="badge badge-green inline-flex w-fit">📷 Feature 3</span>
                <h2 className="text-3xl font-bold text-white">
                  Sign with hands,<br />
                  <span className="gradient-text">hear your words.</span>
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Use your webcam to perform sign language gestures. Our AI model detects your hands in real-time and speaks the translated words aloud.
                </p>
                <ul className="space-y-2">
                  {['Real-time hand detection', 'Visual landmark overlay', 'Automatic speech output', 'Detection confidence score'].map(item => (
                    <li key={item} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <div className="w-4 h-4 rounded-full flex items-center justify-center"
                        style={{ background: 'rgba(16,185,129,0.2)', color: '#6ee7b7', fontSize: '10px' }}>✓</div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="lg:col-span-3">
                <VisionCapture />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Learn Section */}
      <div className="mt-8">
        <SectionDivider label="📚 Learn" />
        <LearnSigns />
      </div>

      {/* CTA Banner */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="feature-card text-center py-16"
            style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.1) 50%, rgba(6,182,212,0.1) 100%)',
              borderColor: 'rgba(99,102,241,0.25)',
            }}
          >
            <div className="text-6xl mb-6">🤟</div>
            <h2 className="section-title mb-4 text-white">
              Start communicating<br />
              <span className="gradient-text">without barriers</span>
            </h2>
            <p className="text-lg mb-8" style={{ color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto 2rem' }}>
              Join millions of people using SignBridge to bridge the communication gap between the hearing and deaf communities.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                className="btn-primary btn-icon text-base px-8 py-4"
                onClick={() => document.querySelector('#text-to-sign')?.scrollIntoView({ behavior: 'smooth' })}
                id="cta-start-btn"
              >
                <Hand size={18} />
                Start Signing Now
              </button>
              <button
                className="btn-secondary btn-icon text-base px-8 py-4"
                onClick={() => document.querySelector('#learn')?.scrollIntoView({ behavior: 'smooth' })}
                id="cta-learn-btn"
              >
                📚 Learn Sign Language
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
