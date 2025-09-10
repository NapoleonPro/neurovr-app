'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaSyncAlt, FaTrophy, FaHome, FaStar, FaBrain, FaFire, FaCheckCircle, FaTimes } from 'react-icons/fa';

interface GameDataItem {
  id: number;
  term: string;
  definition: string;
}

interface MindMatchClientProps {
  gameData: GameDataItem[];
}

interface DropSlot {
  id: number;
  definition: string;
  assignedTermId: number | null;
  isCorrect: boolean | null;
}

export default function MindMatchClient({ gameData }: MindMatchClientProps) {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'completed'>('menu');
  const [availableTerms, setAvailableTerms] = useState<GameDataItem[]>([]);
  const [dropSlots, setDropSlots] = useState<DropSlot[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<GameDataItem | null>(null);
  const [draggedTerm, setDraggedTerm] = useState<GameDataItem | null>(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [completedSlots, setCompletedSlots] = useState(0);
  const [showFeedback, setShowFeedback] = useState<{slotId: number, isCorrect: boolean} | null>(null);

  const shuffleArray = (array: any[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setAttempts(0);
    setCompletedSlots(0);
    setSelectedTerm(null);
    setDraggedTerm(null);
    setShowFeedback(null);
    
    // Shuffle terms untuk urutan acak
    const shuffledTerms = shuffleArray(gameData);
    setAvailableTerms(shuffledTerms);
    
    // Buat drop slots dengan definisi dalam urutan acak
    const shuffledDefinitions = shuffleArray(gameData);
    const slots: DropSlot[] = shuffledDefinitions.map((item, index) => ({
      id: index,
      definition: item.definition,
      assignedTermId: null,
      isCorrect: null,
      correctTermId: item.id // Menyimpan ID term yang benar untuk slot ini
    }));
    setDropSlots(slots);
  };

  const handleTermClick = (term: GameDataItem) => {
    // Jika term sudah digunakan, jangan bisa dipilih
    const isTermUsed = dropSlots.some(slot => slot.assignedTermId === term.id && slot.isCorrect === true);
    if (isTermUsed) return;
    
    setSelectedTerm(selectedTerm?.id === term.id ? null : term);
  };

  const handleSlotClick = (slotId: number) => {
    if (!selectedTerm) return;
    
    const slot = dropSlots.find(s => s.id === slotId);
    if (!slot || slot.isCorrect === true) return;
    
    assignTermToSlot(selectedTerm, slotId);
    setSelectedTerm(null);
  };

  const handleDragStart = (e: React.DragEvent, term: GameDataItem) => {
    // Cek apakah term sudah digunakan
    const isTermUsed = dropSlots.some(slot => slot.assignedTermId === term.id && slot.isCorrect === true);
    if (isTermUsed) {
      e.preventDefault();
      return;
    }
    
    setDraggedTerm(term);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, slotId: number) => {
    e.preventDefault();
    
    if (!draggedTerm) return;
    
    const slot = dropSlots.find(s => s.id === slotId);
    if (!slot || slot.isCorrect === true) return;
    
    assignTermToSlot(draggedTerm, slotId);
    setDraggedTerm(null);
  };

  const assignTermToSlot = (term: GameDataItem, slotId: number) => {
    setAttempts(prev => prev + 1);
    
    const slot = dropSlots.find(s => s.id === slotId);
    if (!slot) return;
    
    // Cari term yang benar untuk slot ini
    const correctTerm = gameData.find(item => item.definition === slot.definition);
    const isCorrect = correctTerm?.id === term.id;
    
    // Update slot
    const updatedSlots = dropSlots.map(s => {
      if (s.id === slotId) {
        return {
          ...s,
          assignedTermId: term.id,
          isCorrect: isCorrect
        };
      }
      return s;
    });
    
    setDropSlots(updatedSlots);
    
    // Show feedback
    setShowFeedback({ slotId, isCorrect });
    setTimeout(() => setShowFeedback(null), 1500);
    
    if (isCorrect) {
      setScore(prev => prev + 100);
      setCompletedSlots(prev => prev + 1);
    } else {
      // Jika salah, bisa dicoba lagi dengan mengosongkan slot setelah delay
      setTimeout(() => {
        setDropSlots(prevSlots => 
          prevSlots.map(s => 
            s.id === slotId && !s.isCorrect ? 
            { ...s, assignedTermId: null, isCorrect: null } : s
          )
        );
      }, 1500);
    }
  };

  // Fungsi untuk mengosongkan slot yang salah
  const clearSlot = (slotId: number) => {
    setDropSlots(prevSlots => 
      prevSlots.map(slot => 
        slot.id === slotId ? 
        { ...slot, assignedTermId: null, isCorrect: null } : slot
      )
    );
  };

  useEffect(() => {
    if (completedSlots === gameData.length && gameData.length > 0) {
      setTimeout(() => setGameState('completed'), 1000);
    }
  }, [completedSlots, gameData.length]);

  const resetGame = () => {
    startGame();
  };

  const backToMenu = () => {
    setGameState('menu');
  };

  const getAccuracy = () => {
    if (attempts === 0) return 100;
    return Math.round((completedSlots / attempts) * 100);
  };

  const getRating = () => {
    const accuracy = getAccuracy();
    if (accuracy >= 90) return { stars: 3, message: "Sempurna! 🏆", color: "from-yellow-400 to-orange-400" };
    if (accuracy >= 75) return { stars: 2, message: "Bagus Sekali! 🌟", color: "from-blue-400 to-purple-400" };
    return { stars: 1, message: "Terus Berlatih! 💪", color: "from-green-400 to-blue-400" };
  };

  // Menu Screen
  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-800 via-teal-800 to-cyan-800 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%),
                              radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)`
          }} />
        </div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 sm:p-12 border border-white/20 max-w-lg mx-auto shadow-2xl text-center relative z-10"
        >
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-24 h-24 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <FaBrain className="w-12 h-12 text-white" />
          </motion.div>
          
          <motion.h1 
            className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-300 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Mind Match
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-2 mb-6"
          >
            <span className="text-2xl">🎯</span>
            <span className="text-lg text-emerald-200 font-medium">Click & Drag Edition</span>
            <span className="text-2xl">🧩</span>
          </motion.div>
          
          <motion.p 
            className="text-gray-200 mb-8 leading-relaxed text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Pilih istilah dan drag ke kotak definisi yang tepat. Cocokkan semua untuk menyelesaikan puzzle!
          </motion.p>
          
          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(6, 182, 212, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="group relative inline-flex items-center space-x-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <FaPlay className="w-5 h-5" />
            <span>Mulai Puzzle</span>
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Completed Screen
  if (gameState === 'completed') {
    const rating = getRating();

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-rose-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Success Animation */}
        <AnimatePresence>
          {[...Array(25)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 bg-yellow-400 rounded-full"
              style={{
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                y: [-100, -300],
                x: [0, (Math.random() - 0.5) * 200]
              }}
              transition={{
                duration: 3,
                delay: Math.random() * 2,
                repeat: Infinity,
                repeatDelay: 4
              }}
            />
          ))}
        </AnimatePresence>

        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotateY: 180 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 sm:p-12 border border-white/20 max-w-lg mx-auto shadow-2xl text-center"
        >
          <motion.div
            animate={{ 
              rotate: [0, 15, -15, 0],
              scale: [1, 1.3, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className={`w-32 h-32 bg-gradient-to-r ${rating.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl`}
          >
            <FaTrophy className="w-16 h-16 text-white" />
          </motion.div>
          
          <motion.h1 
            className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300 mb-4"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {rating.message}
          </motion.h1>
          
          {/* Star Rating */}
          <div className="flex justify-center gap-2 mb-6">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3 + i * 0.1, type: "spring" }}
              >
                <FaStar className={`w-8 h-8 ${i < rating.stars ? 'text-yellow-400' : 'text-gray-500'}`} />
              </motion.div>
            ))}
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white/20 rounded-xl p-4">
              <div className="text-2xl font-bold text-yellow-400">{score}</div>
              <div className="text-xs text-gray-300">Poin</div>
            </div>
            <div className="bg-white/20 rounded-xl p-4">
              <div className="text-2xl font-bold text-green-400">{getAccuracy()}%</div>
              <div className="text-xs text-gray-300">Akurasi</div>
            </div>
            <div className="bg-white/20 rounded-xl p-4">
              <div className="text-2xl font-bold text-blue-400">{attempts}</div>
              <div className="text-xs text-gray-300">Percobaan</div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetGame}
              className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300"
            >
              <FaSyncAlt className="w-4 h-4" />
              <span>Main Lagi</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={backToMenu}
              className="inline-flex items-center justify-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300"
            >
              <FaHome className="w-4 h-4" />
              <span>Menu Utama</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Game Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-emerald-800 to-teal-800 p-4">
      {/* Header */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col lg:flex-row justify-between items-center mb-6 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl"
      >
        <div className="text-center lg:text-left mb-4 lg:mb-0">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <FaBrain className="text-emerald-400" />
            Mind Match Puzzle
          </h2>
          <p className="text-gray-300">Drag istilah ke kotak definisi yang tepat</p>
        </div>
        
        <div className="flex items-center space-x-6 text-white">
          <div className="text-center">
            <motion.div 
              className="text-3xl font-bold text-yellow-400"
              key={score}
              initial={{ scale: 1.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.3 }}
            >
              {score}
            </motion.div>
            <div className="text-xs text-gray-300">Skor</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{completedSlots}/{gameData.length}</div>
            <div className="text-xs text-gray-300">Selesai</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{getAccuracy()}%</div>
            <div className="text-xs text-gray-300">Akurasi</div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            onClick={resetGame}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-300 shadow-lg"
            title="Reset Game"
          >
            <FaSyncAlt className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>

      {/* Main Game Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Terms Column (Left Side) */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-2xl font-bold text-emerald-300 mb-6 text-center flex items-center justify-center gap-2">
            <span className="text-3xl">📝</span>
            Istilah-istilah
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            {availableTerms.map((term) => {
              const isUsed = dropSlots.some(slot => slot.assignedTermId === term.id && slot.isCorrect === true);
              const isSelected = selectedTerm?.id === term.id;
              const isDragged = draggedTerm?.id === term.id;
              
              return (
                <motion.div
                  key={term.id}
                  draggable={!isUsed}
                  onDragStart={(e: any) => handleDragStart(e, term)}
                  onClick={() => handleTermClick(term)}
                  className={`
                    p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer text-center font-semibold
                    ${isUsed 
                      ? 'bg-green-500/20 border-green-400 text-green-300 cursor-not-allowed opacity-50' 
                      : isSelected 
                        ? 'bg-yellow-500/30 border-yellow-400 text-yellow-200 shadow-lg shadow-yellow-400/20' 
                        : 'bg-white/10 border-emerald-400/50 text-white hover:border-emerald-400 hover:bg-white/20 hover:shadow-lg'
                    }
                    ${isDragged ? 'opacity-50 scale-95' : ''}
                  `}
                  whileHover={!isUsed ? { scale: 1.05, y: -2 } : {}}
                  whileTap={!isUsed ? { scale: 0.98 } : {}}
                >
                  <div className="text-sm font-bold">
                    {term.term}
                  </div>
                  {isUsed && (
                    <div className="mt-2">
                      <FaCheckCircle className="w-4 h-4 text-green-400 mx-auto" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
          
          {selectedTerm && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-yellow-500/20 border border-yellow-400 rounded-lg text-center text-yellow-200"
            >
              <span className="text-sm">Terpilih: </span>
              <span className="font-bold">{selectedTerm.term}</span>
            </motion.div>
          )}
        </motion.div>

        {/* Drop Slots Column (Right Side) */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-2xl font-bold text-cyan-300 mb-6 text-center flex items-center justify-center gap-2">
            <span className="text-3xl">🎯</span>
            Definisi
          </h3>
          
          <div className="space-y-4">
            {dropSlots.map((slot) => {
              const assignedTerm = availableTerms.find(term => term.id === slot.assignedTermId);
              const feedback = showFeedback?.slotId === slot.id ? showFeedback : null;
              
              return (
                <motion.div
                  key={slot.id}
                  onClick={() => handleSlotClick(slot.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, slot.id)}
                  className={`
                    relative p-4 rounded-xl border-2 border-dashed min-h-[100px] transition-all duration-300
                    ${slot.isCorrect === true 
                      ? 'bg-green-500/20 border-green-400 cursor-default' 
                      : slot.isCorrect === false 
                        ? 'bg-red-500/20 border-red-400' 
                        : selectedTerm 
                          ? 'bg-blue-500/20 border-blue-400 cursor-pointer hover:bg-blue-500/30' 
                          : 'bg-white/5 border-cyan-400/50 hover:border-cyan-400'
                    }
                  `}
                  whileHover={slot.isCorrect !== true ? { scale: 1.02 } : {}}
                >
                  {/* Definition Text */}
                  <div className="text-gray-200 text-sm mb-2">
                    {slot.definition}
                  </div>
                  
                  {/* Assigned Term or Empty Slot */}
                  <div className={`
                    mt-3 p-3 rounded-lg border-2 border-dashed transition-all duration-300
                    ${assignedTerm 
                      ? slot.isCorrect === true 
                        ? 'bg-green-600/30 border-green-500 text-green-200' 
                        : slot.isCorrect === false 
                          ? 'bg-red-600/30 border-red-500 text-red-200' 
                          : 'bg-blue-600/30 border-blue-500 text-blue-200'
                      : 'bg-white/5 border-gray-500 text-gray-400'
                    }
                  `}>
                    <div className="text-center font-semibold">
                      {assignedTerm ? assignedTerm.term : 'Kosong'}
                    </div>
                  </div>
                  
                  {/* Success/Error Icons */}
                  {slot.isCorrect === true && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                    >
                      <FaCheckCircle className="text-white text-xs" />
                    </motion.div>
                  )}
                  
                  {slot.isCorrect === false && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearSlot(slot.id);
                      }}
                      title="Klik untuk mengosongkan"
                    >
                      <FaTimes className="text-white text-xs" />
                    </motion.div>
                  )}
                  
                  {/* Feedback Animation */}
                  {feedback && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className={`absolute inset-0 rounded-xl flex items-center justify-center font-bold text-lg ${
                        feedback.isCorrect 
                          ? 'bg-green-500/40 text-green-100' 
                          : 'bg-red-500/40 text-red-100'
                      }`}
                    >
                      {feedback.isCorrect ? '✓ Benar!' : '✗ Salah!'}
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Progress Bar */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6"
      >
        <div className="flex justify-between items-center mb-2">
          <span className="text-white font-medium">Kemajuan</span>
          <span className="text-white font-bold">{completedSlots}/{gameData.length}</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${gameData.length > 0 ? (completedSlots / gameData.length) * 100 : 0}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </motion.div>

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