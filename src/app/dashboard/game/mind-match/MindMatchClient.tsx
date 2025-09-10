// src/app/dashboard/game/mind-match/MindMatchClient.tsx
'use client';

import { useState, useEffect } from 'react';
import { saveGameResult } from './actions'; // Impor si "kurir"
import { HiAcademicCap, HiSparkles } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

// Tipe data untuk props yang diterima dari server
type GameDataItem = {
    id: number;
    term: string;
    definition: string;
};

type MindMatchClientProps = {
    gameData: GameDataItem[];
};

// Helper function untuk mengacak array
const shuffleArray = (array: any[]) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

type Term = { id: number; term: string };
type Definition = { id: number; definition: string };

export default function MindMatchClient({ gameData }: MindMatchClientProps) {
  const [terms, setTerms] = useState<Term[]>([]);
  const [definitions, setDefinitions] = useState<Definition[]>([]);
  const [selectedTermId, setSelectedTermId] = useState<number | null>(null);
  const [matches, setMatches] = useState<Record<number, number>>({});
  
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [achievementUnlocked, setAchievementUnlocked] = useState(false);

  useEffect(() => {
    const gameTerms = gameData.map(item => ({ id: item.id, term: item.term }));
    const gameDefinitions = gameData.map(item => ({ id: item.id, definition: item.definition }));
    
    setTerms(gameTerms);
    setDefinitions(shuffleArray(gameDefinitions));
  }, [gameData]);

  const handleTermClick = (termId: number) => {
    if (Object.keys(matches).map(Number).includes(termId)) {
      const newMatches = { ...matches };
      delete newMatches[termId];
      setMatches(newMatches);
      return;
    }
    setSelectedTermId(termId);
  };

  const handleDefinitionClick = (definitionId: number) => {
    if (selectedTermId !== null) {
      if (Object.values(matches).includes(definitionId)) {
        const oldTermId = Object.keys(matches).find(key => matches[Number(key)] === definitionId);
        if (oldTermId) {
          const newMatches = { ...matches };
          delete newMatches[Number(oldTermId)];
          setMatches(newMatches);
        }
      }
      setMatches(prev => ({ ...prev, [selectedTermId]: definitionId }));
      setSelectedTermId(null);
    }
  };

  const handleSubmit = async () => { // Jadikan fungsi ini async
    let correctMatches = 0;
    Object.keys(matches).forEach(termIdStr => {
      const termId = Number(termIdStr);
      const definitionId = matches[termId];
      if (termId === definitionId) {
        correctMatches++;
      }
    });
    
    const finalScore = Math.round((correctMatches / terms.length) * 100);
    setScore(finalScore);

    let unlockedAchievement: string | null = null;
    if (finalScore === 100) {
      setAchievementUnlocked(true);
      unlockedAchievement = 'Brain Master'; // Nama achievement yang akan disimpan
    }
    
    setShowResults(true);

    // Kirim hasil ke server untuk disimpan di database
    try {
      const result = await saveGameResult(finalScore, unlockedAchievement);
      if (result.error) {
        console.error("Gagal menyimpan progres:", result.error);
      } else {
        console.log("Progres berhasil disimpan ke database!");
      }
    } catch (e) {
      console.error("Terjadi kesalahan saat menyimpan progres:", e);
    }
  };

  const handlePlayAgain = () => {
    setMatches({});
    setSelectedTermId(null);
    setShowResults(false);
    setAchievementUnlocked(false);
    setDefinitions(shuffleArray([...definitions]));
  };

  return (
    <div className="min-h-screen p-4 sm:p-8" style={{ background: 'url(/bg.jpeg) center center / cover no-repeat fixed' }}>
      <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 sm:p-8 max-w-6xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-white text-center mb-8 flex items-center justify-center gap-3">
          <HiAcademicCap className="text-blue-400" />
          Mind Match Challenge
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-3">
            {terms.map(term => {
              const isSelected = selectedTermId === term.id;
              const isMatched = Object.keys(matches).map(Number).includes(term.id);
              return (
                <button
                  key={term.id}
                  onClick={() => handleTermClick(term.id)}
                  className={`w-full p-4 text-left rounded-lg transition-all duration-200 border-2
                              ${isSelected ? 'bg-blue-500/30 border-blue-400 scale-105 shadow-lg' : ''}
                              ${isMatched ? 'bg-green-500/30 border-green-400' : 'bg-slate-800/70 border-slate-700 hover:bg-slate-700/90'}
                              `}
                >
                  {term.term}
                </button>
              );
            })}
          </div>

          <div className="space-y-3">
            {definitions.map(def => {
              const isMatched = Object.values(matches).includes(def.id);
              return (
                <button
                  key={def.id}
                  onClick={() => handleDefinitionClick(def.id)}
                  disabled={!selectedTermId}
                  className={`w-full p-4 text-left rounded-lg transition-all duration-200 border-2
                              ${isMatched ? 'bg-green-500/30 border-green-400' : 'bg-slate-800/70 border-slate-700'}
                              ${selectedTermId ? 'cursor-pointer hover:bg-slate-700/90' : 'cursor-not-allowed opacity-60'}
                              `}
                >
                  {def.definition}
                </button>
              );
            })}
          </div>
        </div>

        <div className="text-center mt-10">
          <button
            onClick={handleSubmit}
            disabled={Object.keys(matches).length !== terms.length}
            className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg
                       hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                       disabled:hover:scale-100 shadow-lg"
          >
            Kirim Jawaban
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.7, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
            >
              <h2 className="text-3xl font-bold text-white mb-4">Hasil Kuis</h2>
              <p className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6">
                {score}
              </p>
              
              <AnimatePresence>
                {achievementUnlocked && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-6 p-4 bg-yellow-500/20 border border-yellow-400/50 rounded-lg flex items-center justify-center gap-3"
                  >
                    <HiSparkles className="text-yellow-300 w-6 h-6" />
                    <div className="text-left">
                      <h3 className="font-bold text-yellow-300">Achievement Unlocked!</h3>
                      <p className="text-sm text-yellow-400/80">Brain Master</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={handlePlayAgain}
                className="mt-4 px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Coba Lagi
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
