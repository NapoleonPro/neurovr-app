// src/app/dashboard/brain-journey/page.tsx
'use client';

import dynamic from 'next/dynamic';

// Dynamic import untuk menghindari SSR issues dengan Three.js
const BrainJourney3D = dynamic(() => import('./BrainJourney3D'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center pt-24">
      <div className="text-center text-white">
        <div className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <h2 className="text-3xl font-bold mb-2">Memuat Brain Journey</h2>
        <p className="text-gray-300 text-lg">Sedang mempersiapkan pengalaman 3D...</p>
        <div className="mt-4 flex justify-center space-x-1">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-100"></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-200"></div>
        </div>
      </div>
    </div>
  )
});

export default function BrainJourneyPage() {
  return <BrainJourney3D />;
}