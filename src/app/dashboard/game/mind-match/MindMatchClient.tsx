'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaSyncAlt, FaTrophy, FaHome } from 'react-icons/fa';

// Definisikan tipe untuk data game yang diterima dari props
interface GameDataItem {
  id: number;
  term: string;
  definition: string;
}

interface MindMatchClientProps {
  gameData: GameDataItem[];
}

export default function MindMatchClient({ gameData: initialGameData }: MindMatchClientProps) {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'completed'>('menu');
  const [cards, setCards] = useState<any[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const shuffleAndPrepareCards = () => {
    const terms = initialGameData.map(item => ({ ...item, type: 'term' }));
    const definitions = initialGameData.map(item => ({ ...item, type: 'definition' }));
    const allCards = [...terms, ...definitions];
    
    // Shuffle cards
    for (let i = allCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allCards[i], allCards[j]] = [allCards[j], allCards[i]];
    }
    
    setCards(allCards.map((card, index) => ({ ...card, index })));
  };

  const handleCardClick = (cardIndex: number) => {
    if (selectedCards.length === 2 || matchedPairs.includes(cards[cardIndex].id) || selectedCards.includes(cardIndex)) {
      return;
    }

    const newSelectedCards = [...selectedCards, cardIndex];
    setSelectedCards(newSelectedCards);

    if (newSelectedCards.length === 2) {
      setAttempts(prev => prev + 1);
      const card1 = cards[newSelectedCards[0]];
      const card2 = cards[newSelectedCards[1]];

      if (card1.id === card2.id && card1.type !== card2.type) {
        setMatchedPairs(prev => [...prev, card1.id]);
        setScore(prev => prev + 10);
        setSelectedCards([]);
      } else {
        setTimeout(() => {
          setSelectedCards([]);
        }, 1000);
      }
    }
  };
  
  useEffect(() => {
    if (matchedPairs.length === initialGameData.length) {
      setTimeout(() => setGameState('completed'), 500);
    }
  }, [matchedPairs, initialGameData.length]);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setAttempts(0);
    setMatchedPairs([]);
    setSelectedCards([]);
    shuffleAndPrepareCards();
  };

  const resetGame = () => {
    setScore(0);
    setAttempts(0);
    setMatchedPairs([]);
    setSelectedCards([]);
    shuffleAndPrepareCards();
  };

  const backToMenu = () => {
    setGameState('menu');
  };

  // Menu Screen
  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 sm:p-12 border border-white/20 max-w-md mx-auto"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaTrophy className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Mind Match Game</h1>
            <p className="text-gray-300 mb-8 leading-relaxed">
              Cocokkan istilah dengan definisinya untuk menguji pengetahuanmu tentang sistem saraf!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg"
            >
              <FaPlay className="w-5 h-5" />
              <span>Mulai Bermain</span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Completed Screen
  if (gameState === 'completed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 flex items-center justify-center p-4">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 sm:p-12 border border-white/20 max-w-md mx-auto"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <FaTrophy className="w-12 h-12 text-white" />
            </motion.div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Selamat! 🎉</h1>
            <div className="mb-8">
              <p className="text-gray-300 mb-4">Game berhasil diselesaikan!</p>
              <div className="space-y-2 text-white">
                <p><span className="text-yellow-400">Skor:</span> {score} poin</p>
                <p><span className="text-yellow-400">Percobaan:</span> {attempts} kali</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                <FaSyncAlt className="w-4 h-4" />
                <span>Main Lagi</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={backToMenu}
                className="inline-flex items-center justify-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                <FaHome className="w-4 h-4" />
                <span>Menu Utama</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Game Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
        <div className="text-center sm:text-left mb-4 sm:mb-0">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">Mind Match Game</h2>
          <p className="text-gray-300 text-sm">Cocokkan istilah dengan definisinya.</p>
        </div>
        <div className="flex items-center space-x-6 text-white">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">{score}</div>
            <div className="text-xs text-gray-300">Skor</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{attempts}</div>
            <div className="text-xs text-gray-300">Percobaan</div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={resetGame}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-200"
            title="Reset Game"
          >
            <FaSyncAlt className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Game Area */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            onClick={() => handleCardClick(index)}
            className={`relative w-full h-40 rounded-lg cursor-pointer transition-transform duration-500`}
            style={{ transformStyle: 'preserve-3d' }}
            animate={{ rotateY: selectedCards.includes(index) || matchedPairs.includes(card.id) ? 180 : 0 }}
          >
            <div className="absolute w-full h-full bg-white/10 backdrop-blur-lg rounded-lg flex items-center justify-center text-center p-4 text-white font-semibold" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
              {card.type === 'term' ? card.term : card.definition}
            </div>
            <div className="absolute w-full h-full bg-purple-600 rounded-lg" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Back Button */}
      <div className="mt-6 text-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={backToMenu}
          className="inline-flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
        >
          <FaHome className="w-4 h-4" />
          <span>Kembali ke Menu</span>
        </motion.button>
      </div>
    </div>
  );
}
