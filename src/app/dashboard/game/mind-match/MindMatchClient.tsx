'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaSyncAlt, FaTrophy, FaHome, FaStar, FaBrain, FaCheckCircle, FaTimes, FaCheck } from 'react-icons/fa';
import { saveGameResult } from './actions';

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
  correctTermId: number;
}

interface GameResult {
  slotId: number;
  isCorrect: boolean;
  userAnswer: string;
  correctAnswer: string;
}

export default function MindMatchClient({ gameData }: MindMatchClientProps) {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'results' | 'completed'>('menu');
  const [availableTerms, setAvailableTerms] = useState<GameDataItem[]>([]);
  const [dropSlots, setDropSlots] = useState<DropSlot[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<GameDataItem | null>(null);
  const [draggedTerm, setDraggedTerm] = useState<GameDataItem | null>(null);
  const [gameResults, setGameResults] = useState<GameResult[]>([]);
  const [score, setScore] = useState(0);
  const [saveStatus, setSaveStatus] = useState<string>('');

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
    setSelectedTerm(null);
    setDraggedTerm(null);
    setGameResults([]);
    setSaveStatus('');
    
    // Shuffle terms untuk urutan acak
    const shuffledTerms = shuffleArray(gameData);
    setAvailableTerms(shuffledTerms);
    
    // Buat drop slots dengan definisi dalam urutan acak
    const shuffledDefinitions = shuffleArray(gameData);
    const slots: DropSlot[] = shuffledDefinitions.map((item, index) => ({
      id: index,
      definition: item.definition,
      assignedTermId: null,
      correctTermId: item.id
    }));
    setDropSlots(slots);
  };

  const handleTermClick = (term: GameDataItem) => {
    // Jika term sudah digunakan, jangan bisa dipilih
    const isTermUsed = dropSlots.some(slot => slot.assignedTermId === term.id);
    if (isTermUsed) return;
    
    setSelectedTerm(selectedTerm?.id === term.id ? null : term);
  };

  const handleSlotClick = (slotId: number) => {
    if (!selectedTerm) return;
    
    const slot = dropSlots.find(s => s.id === slotId);
    if (!slot) return;
    
    assignTermToSlot(selectedTerm, slotId);
    setSelectedTerm(null);
  };

  const handleDragStart = (e: React.DragEvent, term: GameDataItem) => {
    // Cek apakah term sudah digunakan
    const isTermUsed = dropSlots.some(slot => slot.assignedTermId === term.id);
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
    if (!slot) return;
    
    assignTermToSlot(draggedTerm, slotId);
    setDraggedTerm(null);
  };

  const assignTermToSlot = (term: GameDataItem, slotId: number) => {
    // Update slot dengan term yang dipilih
    const updatedSlots = dropSlots.map(s => {
      if (s.id === slotId) {
        return {
          ...s,
          assignedTermId: term.id
        };
      }
      return s;
    });
    
    setDropSlots(updatedSlots);
  };

  // Fungsi untuk mengosongkan slot
  const clearSlot = (slotId: number) => {
    setDropSlots(prevSlots => 
      prevSlots.map(slot => 
        slot.id === slotId ? 
        { ...slot, assignedTermId: null } : slot
      )
    );
  };

  // Cek apakah semua slot sudah terisi
  const areAllSlotsFilled = () => {
    return dropSlots.every(slot => slot.assignedTermId !== null);
  };

  // Submit jawaban dan tampilkan hasil
  const submitAnswers = async () => {
    const results: GameResult[] = dropSlots.map(slot => {
      const userTerm = availableTerms.find(term => term.id === slot.assignedTermId);
      const correctTerm = gameData.find(term => term.id === slot.correctTermId);
      const isCorrect = slot.assignedTermId === slot.correctTermId;
      
      return {
        slotId: slot.id,
        isCorrect,
        userAnswer: userTerm?.term || '',
        correctAnswer: correctTerm?.term || ''
      };
    });
    
    setGameResults(results);
    
    // Hitung skor
    const correctAnswers = results.filter(r => r.isCorrect).length;
    const finalScore = Math.round((correctAnswers / gameData.length) * 100);
    setScore(finalScore);
    
    // Tentukan achievement
    let achievement = null;
    if (finalScore >= 90) achievement = "Perfect Master";
    else if (finalScore >= 75) achievement = "Brain Expert";
    else if (finalScore >= 50) achievement = "Good Learner";
    
    setGameState('results');
    
    // Simpan hasil ke database
    try {
      setSaveStatus('Menyimpan...');
      const result = await saveGameResult(finalScore, achievement);
      if (result.success) {
        setSaveStatus('Tersimpan ✓');
      } else {
        setSaveStatus('Gagal menyimpan');
      }
    } catch (error) {
      setSaveStatus('Error saat menyimpan');
      console.error('Error saving game result:', error);
    }
  };

  const resetGame = () => {
    startGame();
  };

  const backToMenu = () => {
    setGameState('menu');
  };

  const getRating = () => {
    if (score >= 90) return { stars: 3, message: "Sempurna! 🏆", color: "from-yellow-400 to-orange-400" };
    if (score >= 75) return { stars: 2, message: "Bagus Sekali! 🌟", color: "from-blue-400 to-purple-400" };
    return { stars: 1, message: "Terus Berlatih! 💪", color: "from-green-400 to-blue-400" };
  };

  // Menu Screen
  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-800 via-teal-800 to-cyan-800 flex items-center justify-center p-4 pt-24 lg:pt-32 relative overflow-hidden">
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
            Isi semua kotak dengan istilah yang tepat, lalu submit untuk melihat hasil!
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

  // Results Screen
  if (gameState === 'results') {
    const rating = getRating();
    const correctCount = gameResults.filter(r => r.isCorrect).length;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-rose-900 p-4 pt-24 lg:pt-32">
        <div className="container mx-auto max-w-4xl">
          {/* Header Results */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center mb-8 bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20"
          >
            <motion.div
              animate={{ 
                rotate: [0, 15, -15, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className={`w-24 h-24 bg-gradient-to-r ${rating.color} rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl`}
            >
              <FaTrophy className="w-12 h-12 text-white" />
            </motion.div>
            
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300 mb-4">
              {rating.message}
            </h1>
            
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
            
            {/* Score Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-white/20 rounded-xl p-4">
                <div className="text-3xl font-bold text-yellow-400">{score}</div>
                <div className="text-sm text-gray-300">Skor</div>
              </div>
              <div className="bg-white/20 rounded-xl p-4">
                <div className="text-3xl font-bold text-green-400">{correctCount}/{gameData.length}</div>
                <div className="text-sm text-gray-300">Benar</div>
              </div>
              <div className="bg-white/20 rounded-xl p-4">
                <div className="text-3xl font-bold text-blue-400">{score}%</div>
                <div className="text-sm text-gray-300">Akurasi</div>
              </div>
            </div>
            
            {/* Save Status */}
            {saveStatus && (
              <div className="text-center text-sm text-gray-300 mb-4">
                {saveStatus}
              </div>
            )}
          </motion.div>

          {/* Detailed Results */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 mb-6"
          >
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Hasil Jawaban</h3>
            
            <div className="grid gap-4">
              {gameResults.map((result, index) => {
                const slot = dropSlots.find(s => s.id === result.slotId);
                
                return (
                  <motion.div
                    key={result.slotId}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * index }}
                    className={`p-4 rounded-xl border-2 ${
                      result.isCorrect 
                        ? 'bg-green-500/20 border-green-400' 
                        : 'bg-red-500/20 border-red-400'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="text-gray-200 text-sm mb-2">
                          <strong>Definisi:</strong> {slot?.definition}
                        </div>
                        <div className="flex items-center gap-4">
                          <div>
                            <span className="text-xs text-gray-400">Jawaban Anda:</span>
                            <div className={`font-semibold ${result.isCorrect ? 'text-green-300' : 'text-red-300'}`}>
                              {result.userAnswer}
                            </div>
                          </div>
                          {!result.isCorrect && (
                            <div>
                              <span className="text-xs text-gray-400">Jawaban Benar:</span>
                              <div className="font-semibold text-green-300">
                                {result.correctAnswer}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        result.isCorrect ? 'bg-green-500' : 'bg-red-500'
                      }`}>
                        {result.isCorrect ? (
                          <FaCheck className="w-4 h-4 text-white" />
                        ) : (
                          <FaTimes className="w-4 h-4 text-white" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetGame}
              className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300"
            >
              <FaSyncAlt className="w-5 h-5" />
              <span>Main Lagi</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={backToMenu}
              className="inline-flex items-center justify-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300"
            >
              <FaHome className="w-5 h-5" />
              <span>Menu Utama</span>
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  // Game Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-emerald-800 to-teal-800 p-4 pt-24 lg:pt-32">
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
            <div className="text-2xl font-bold text-blue-400">
              {dropSlots.filter(slot => slot.assignedTermId !== null).length}/{gameData.length}
            </div>
            <div className="text-xs text-gray-300">Terisi</div>
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
              const isUsed = dropSlots.some(slot => slot.assignedTermId === term.id);
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
              
              return (
                <motion.div
                  key={slot.id}
                  onClick={() => handleSlotClick(slot.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, slot.id)}
                  className={`
                    relative p-4 rounded-xl border-2 border-dashed min-h-[100px] transition-all duration-300
                    ${assignedTerm 
                      ? 'bg-blue-500/20 border-blue-400' 
                      : selectedTerm 
                        ? 'bg-blue-500/20 border-blue-400 cursor-pointer hover:bg-blue-500/30' 
                        : 'bg-white/5 border-cyan-400/50 hover:border-cyan-400'
                    }
                  `}
                  whileHover={!assignedTerm ? { scale: 1.02 } : {}}
                >
                  {/* Definition Text */}
                  <div className="text-gray-200 text-sm mb-2">
                    {slot.definition}
                  </div>
                  
                  {/* Assigned Term or Empty Slot */}
                  <div className={`
                    mt-3 p-3 rounded-lg border-2 border-dashed transition-all duration-300
                    ${assignedTerm 
                      ? 'bg-blue-600/30 border-blue-500 text-blue-200'
                      : 'bg-white/5 border-gray-500 text-gray-400'
                    }
                  `}>
                    <div className="text-center font-semibold">
                      {assignedTerm ? assignedTerm.term : 'Kosong'}
                    </div>
                  </div>
                  
                  {/* Clear Button */}
                  {assignedTerm && (
                    <motion.button
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        clearSlot(slot.id);
                      }}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-600"
                      title="Klik untuk mengosongkan"
                    >
                      <FaTimes className="text-white text-xs" />
                    </motion.button>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Submit Button */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 text-center"
      >
        <motion.button
          whileHover={{ scale: areAllSlotsFilled() ? 1.05 : 1 }}
          whileTap={{ scale: areAllSlotsFilled() ? 0.95 : 1 }}
          onClick={submitAnswers}
          disabled={!areAllSlotsFilled()}
          className={`
            inline-flex items-center space-x-3 px-12 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl
            ${areAllSlotsFilled() 
              ? 'bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white cursor-pointer' 
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          <FaCheck className="w-5 h-5" />
          <span>
            {areAllSlotsFilled() ? 'Submit Jawaban' : `Isi Semua (${dropSlots.filter(slot => slot.assignedTermId !== null).length}/${gameData.length})`}
          </span>
        </motion.button>
      </motion.div>

      {/* Progress Bar */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-6 bg-white/10 backdrop-blur-sm rounded-2xl p-6"
      >
        <div className="flex justify-between items-center mb-2">
          <span className="text-white font-medium">Kemajuan</span>
          <span className="text-white font-bold">
            {dropSlots.filter(slot => slot.assignedTermId !== null).length}/{gameData.length}
          </span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${gameData.length > 0 ? (dropSlots.filter(slot => slot.assignedTermId !== null).length / gameData.length) * 100 : 0}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </motion.div>

      {/* Back Button */}
      <div className="mt-6 landscape:mt-4 text-center">
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