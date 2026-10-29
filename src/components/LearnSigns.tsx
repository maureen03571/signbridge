'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { SignAvatar } from './SignAvatar';

const ASL_SIGNS = [
  { letter: 'A', desc: 'Fist with thumb beside' },
  { letter: 'B', desc: 'Four fingers flat up' },
  { letter: 'C', desc: 'Curved C shape' },
  { letter: 'D', desc: 'Index up, circle below' },
  { letter: 'E', desc: 'Fingers curled, thumb' },
  { letter: 'F', desc: 'Finger-thumb circle' },
  { letter: 'G', desc: 'Index pointing right' },
  { letter: 'H', desc: 'Two fingers right' },
  { letter: 'I', desc: 'Pinky up' },
  { letter: 'L', desc: 'L-shape hand' },
  { letter: 'O', desc: 'Full circle hand' },
  { letter: 'V', desc: 'Peace sign (V)' },
  { letter: 'W', desc: 'Three fingers spread' },
  { letter: 'Y', desc: 'Thumb and pinky out' },
];

const COMMON_PHRASES = [
  { phrase: 'HELLO', desc: 'Wave from ear outward', category: 'Greetings' },
  { phrase: 'THANK YOU', desc: 'Flat hand from chin forward', category: 'Greetings' },
  { phrase: 'PLEASE', desc: 'Circular motion on chest', category: 'Greetings' },
  { phrase: 'SORRY', desc: 'Fist circle on chest', category: 'Greetings' },
  { phrase: 'YES', desc: 'Fist nodding motion', category: 'Basic' },
  { phrase: 'NO', desc: 'Index and middle snap to thumb', category: 'Basic' },
  { phrase: 'HELP', desc: 'Thumbs up lifted on palm', category: 'Emergency' },
  { phrase: 'STOP', desc: 'Flat hand chops palm', category: 'Emergency' },
  { phrase: 'LOVE', desc: 'Cross arms on chest', category: 'Emotions' },
  { phrase: 'FRIEND', desc: 'Hook index fingers together', category: 'Social' },
  { phrase: 'WATER', desc: 'W to chin, tap twice', category: 'Daily' },
  { phrase: 'EAT', desc: 'Fingers tap mouth', category: 'Daily' },
];

const CATEGORIES = ['All', 'Greetings', 'Basic', 'Emergency', 'Emotions', 'Social', 'Daily'];

export default function LearnSigns() {
  const [activeTab, setActiveTab] = useState<'alphabet' | 'phrases'>('alphabet');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [practiceWord, setPracticeWord] = useState('');
  const [isPracticing, setIsPracticing] = useState(false);
  const [activeCard, setActiveCard] = useState<string | null>(null);

  const filteredPhrases = selectedCategory === 'All' 
    ? COMMON_PHRASES 
    : COMMON_PHRASES.filter(p => p.category === selectedCategory);

  const handlePractice = (word: string) => {
    setPracticeWord(word);
    setIsPracticing(true);
    setActiveCard(word);
    setTimeout(() => {
      setIsPracticing(false);
      setActiveCard(null);
    }, word.length * 650 + 1000);
  };

  return (
    <section id="learn" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="badge badge-cyan mb-4 inline-flex">📚 Sign Language Dictionary</span>
          <h2 className="section-title mb-4 text-white">
            Learn to <span className="gradient-text">Sign</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto' }}>
            Interactive ASL alphabet and common phrases with animated demonstrations. Click any card to see the sign in action.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-2 p-1.5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <button
              id="tab-alphabet"
              className={`tab-btn ${activeTab === 'alphabet' ? 'active' : ''}`}
              onClick={() => setActiveTab('alphabet')}
            >
              🤟 Alphabet
            </button>
            <button
              id="tab-phrases"
              className={`tab-btn ${activeTab === 'phrases' ? 'active' : ''}`}
              onClick={() => setActiveTab('phrases')}
            >
              💬 Common Phrases
            </button>
          </div>
        </div>

        {/* Alphabet grid */}
        {activeTab === 'alphabet' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3"
          >
            {ASL_SIGNS.map((sign, i) => (
              <motion.div
                key={sign.letter}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ scale: 1.05 }}
                className={`feature-card cursor-pointer text-center p-4 ${activeCard === sign.letter ? 'glow-primary' : ''}`}
                onClick={() => handlePractice(sign.letter)}
                id={`sign-card-${sign.letter}`}
              >
                <div className="flex justify-center mb-2" style={{ transform: 'scale(0.7)', height: 70, overflow: 'hidden' }}>
                  <SignAvatar 
                    word={sign.letter} 
                    isAnimating={activeCard === sign.letter} 
                    size="sm" 
                  />
                </div>
                <div className="text-2xl font-bold gradient-text mb-1">{sign.letter}</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{sign.desc}</div>
                <button
                  className="mt-2 text-xs px-3 py-1 rounded-lg transition-all"
                  style={{ 
                    background: 'rgba(99,102,241,0.15)', 
                    color: '#a5b4fc',
                    border: '1px solid rgba(99,102,241,0.2)'
                  }}
                >
                  Animate
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Phrases */}
        {activeTab === 'phrases' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Category filter */}
            <div className="flex gap-2 flex-wrap justify-center mb-6">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  className={`lang-pill ${selectedCategory === cat ? 'selected' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                  id={`category-${cat.toLowerCase()}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredPhrases.map((item, i) => (
                <motion.div
                  key={item.phrase}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className={`feature-card cursor-pointer ${activeCard === item.phrase ? 'glow-primary' : ''}`}
                  onClick={() => handlePractice(item.phrase)}
                  id={`phrase-card-${item.phrase.toLowerCase().replace(' ', '-')}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-xs badge badge-primary mb-2 inline-flex">{item.category}</span>
                      <div className="font-bold text-white text-lg">{item.phrase}</div>
                    </div>
                    {activeCard === item.phrase && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-6 h-6 rounded-full border-2 border-t-transparent"
                        style={{ borderColor: '#6366f1', borderTopColor: 'transparent' }}
                      />
                    )}
                  </div>
                  
                  {/* Mini avatar */}
                  <div className="flex justify-center my-3" style={{ height: 80, overflow: 'hidden' }}>
                    <SignAvatar 
                      word={item.phrase.split(' ')[0]} 
                      isAnimating={activeCard === item.phrase} 
                      size="sm" 
                    />
                  </div>
                  
                  <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
                  
                  <button
                    className="w-full text-xs py-2 rounded-xl transition-all font-medium"
                    style={{ 
                      background: activeCard === item.phrase ? 'rgba(99,102,241,0.3)' : 'rgba(99,102,241,0.1)',
                      color: '#a5b4fc',
                      border: '1px solid rgba(99,102,241,0.2)'
                    }}
                  >
                    {activeCard === item.phrase ? '✋ Signing...' : '▶ Practice Sign'}
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Practice area */}
        {isPracticing && practiceWord && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-8 feature-card text-center"
            style={{ borderColor: 'rgba(99,102,241,0.3)' }}
          >
            <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Now signing:</p>
            <p className="text-2xl font-bold gradient-text mb-4">{practiceWord}</p>
            <div className="flex justify-center">
              <SignAvatar word={practiceWord} isAnimating={true} size="md" />
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
