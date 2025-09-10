// src/app/dashboard/quiz/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { HiOutlineQuestionMarkCircle, HiOutlinePuzzle, HiCheckCircle } from 'react-icons/hi';

// --- DATA UNTUK QUIZ & GAME ---
// Data ini nanti bisa diambil dari database untuk melacak progress pengguna.
const quizData = [
  {
    id: 'pre-test',
    title: 'Pre - Test',
    status: 'Selesai',
    details: 'Selesai pada 31/01/2025',
    href: '/dashboard/quiz/pre-test',
    isEnabled: true,
  },
  {
    id: 'post-test',
    title: 'Post - Test',
    status: 'Belum dikerjakan',
    details: 'Belum dikerjakan',
    href: '/dashboard/quiz/post-test',
    isEnabled: true,
  },
  {
    id: 'coming-soon',
    title: 'Coming Soon',
    status: null,
    details: null,
    href: '#',
    isEnabled: false,
  },
];

const gameData = [
  {
    id: 'mind-match',
    title: 'Mind Match',
    description: 'Tarik dan pasangkan nama-nama di bawah ini ke lokasi yang tepat. Setiap jawaban yang benar akan membawamu lebih dekat untuk membuka badge Brain Master.',
    iconUrl: '/thumbnails/mind-match-icon.png', // Sesuaikan dengan nama file Anda
    href: '/dashboard/game/mind-match',
  },
];

export default function QuizPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* --- BAGIAN QUIZ --- */}
      <section>
        <div className="flex items-center gap-4 mb-8">
          <HiOutlineQuestionMarkCircle className="w-10 h-10 text-blue-400" />
          <h1 className="text-4xl font-bold text-white">Quiz</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizData.map((quiz) => {
            const cardContent = (
              <div 
                className={`w-full p-6 rounded-2xl transition-all duration-300
                            ${quiz.isEnabled 
                              ? 'bg-slate-800/60 backdrop-blur-sm cursor-pointer hover:bg-slate-700/80 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/20 border border-transparent hover:border-blue-500/30' 
                              : 'bg-slate-800/30 text-gray-500 cursor-not-allowed'
                            }`}
              >
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-semibold text-white">{quiz.title}</h2>
                  {quiz.status === 'Selesai' && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-900/50 border border-green-500/50 rounded-full text-xs text-green-300">
                      <HiCheckCircle />
                      <span>Selesai</span>
                    </div>
                  )}
                </div>
                <p className="mt-4 text-sm text-gray-400">
                  {quiz.details || ''}
                </p>
              </div>
            );

            return quiz.isEnabled ? (
              <Link href={quiz.href} key={quiz.id}>
                {cardContent}
              </Link>
            ) : (
              <div key={quiz.id}>
                {cardContent}
              </div>
            );
          })}
        </div>
      </section>

      {/* --- BAGIAN GAME --- */}
      <section className="mt-16">
        <div className="flex items-center gap-4 mb-8">
          <HiOutlinePuzzle className="w-10 h-10 text-purple-400" />
          <h1 className="text-4xl font-bold text-white">Game</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {gameData.map((game) => (
            <Link href={game.href} key={game.id}>
              <div className="w-full p-6 rounded-2xl transition-all duration-300 bg-slate-800/60 backdrop-blur-sm
                            cursor-pointer hover:bg-slate-700/80 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/20
                            border border-transparent hover:border-purple-500/30 flex justify-between items-center gap-6">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-white mb-2">{game.title}</h2>
                  <p className="text-sm text-gray-400">
                    {game.description}
                  </p>
                </div>
                <div className="hidden sm:block">
                  <Image 
                    src={game.iconUrl}
                    alt={`Ikon untuk ${game.title}`}
                    width={80}
                    height={80}
                    className="opacity-80"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}