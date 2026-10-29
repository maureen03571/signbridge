'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hand, Menu, X, Sparkles } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Text to Sign', href: '#text-to-sign' },
  { label: 'Video Translator', href: '#video-translator' },
  { label: 'Vision Capture', href: '#vision-capture' },
  { label: 'Learn Signs', href: '#learn' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(5,7,20,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          className="flex items-center gap-3 cursor-pointer"
          whileHover={{ scale: 1.02 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="relative w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            <Hand size={20} className="text-white" />
            {/* Glow dot */}
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2"
              style={{ borderColor: 'var(--bg-primary)' }} />
          </div>
          <div>
            <span className="font-bold text-xl tracking-tight text-white">Sign</span>
            <span className="font-bold text-xl tracking-tight gradient-text">Bridge</span>
          </div>
        </motion.div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(link => (
            <button
              key={link.label}
              onClick={() => scrollTo(link.href)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-white/5"
              style={{ color: 'var(--text-secondary)' }}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs badge badge-green">
            <span className="status-dot active" />
            AI Active
          </div>
          <button
            className="btn-primary btn-icon text-sm"
            onClick={() => scrollTo('#text-to-sign')}
            id="header-start-btn"
          >
            <Sparkles size={14} />
            Start Translating
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 rounded-lg"
          style={{ background: 'rgba(255,255,255,0.06)' }}
          onClick={() => setMobileOpen(!mobileOpen)}
          id="mobile-menu-btn"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t"
            style={{ 
              background: 'rgba(5,7,20,0.98)', 
              borderColor: 'rgba(255,255,255,0.06)',
              backdropFilter: 'blur(20px)'
            }}
          >
            <div className="px-6 py-4 space-y-1">
              {NAV_LINKS.map(link => (
                <button
                  key={link.label}
                  onClick={() => scrollTo(link.href)}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all hover:bg-white/5"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {link.label}
                </button>
              ))}
              <div className="pt-2">
                <button
                  className="btn-primary btn-icon w-full justify-center"
                  onClick={() => scrollTo('#text-to-sign')}
                >
                  <Sparkles size={14} />
                  Start Translating
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
