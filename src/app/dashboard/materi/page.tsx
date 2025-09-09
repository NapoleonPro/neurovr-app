// src/app/dashboard/materi/page.tsx
'use client';

import Image from 'next/image';
import { useState } from 'react';
import { FaPlay, FaFileDownload, FaEye, FaTimes } from 'react-icons/fa';

// --- DATA MATERI ---
const learningMaterials = [
  {
    id: 1,
    title: 'Sistem Saraf',
    type: 'PPT',
    thumbnailUrl: '/api/placeholder/400/250', // Placeholder image
    // Contoh real Google Slides embed URL:
    embedUrl: 'https://docs.google.com/presentation/d/e/2PACX-1vSkSUhoDQhy9lzTT7ozIp1Ni5ob3UKhFbidMLVQ_xw8dPShDX3Ym4YHu6nfyR9hMA/pub?start=false&loop=false&delayms=3000',
    downloadUrl: '/files/sistem-saraf.pptx',
    duration: null,
    description: 'Penjelasan lengkap tentang sistem saraf manusia dan fungsinya',
  },
  {
    id: 2,
    title: 'Sistem Saraf',
    type: 'Video',
    thumbnailUrl: '/api/placeholder/400/250', // Placeholder image
    // Contoh YouTube embed URL:
    embedUrl: 'https://youtu.be/hYzkwHfvwbo?si=pdN9N_8nJMUXdtvl',
    downloadUrl: null,
    duration: '3:07',
    description: 'Video animasi interaktif tentang cara kerja sistem saraf',
  },
];

// Modal Component untuk menampilkan konten embed
function ContentModal({ material, isOpen, onClose }: { 
  material: any, 
  isOpen: boolean, 
  onClose: () => void 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-gray-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header Modal */}
        <div className="flex items-center justify-between p-4 sm:p-6 bg-gray-700/50 border-b border-gray-600">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-white">{material.title}</h3>
            <p className="text-sm text-gray-300 mt-1">{material.description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-600 rounded-lg transition-colors duration-200"
          >
            <FaTimes className="w-5 h-5 text-gray-300 hover:text-white" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6">
          <div className="aspect-video w-full bg-gray-900 rounded-lg overflow-hidden">
            {material.type === 'Video' ? (
              // Video Embed
              material.embedUrl.includes('youtube.com') || material.embedUrl.includes('vimeo.com') ? (
                <iframe
                  src={material.embedUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={material.title}
                />
              ) : (
                // Local Video
                <video
                  className="w-full h-full"
                  controls
                  preload="metadata"
                >
                  <source src={material.embedUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )
            ) : (
              // PPT Embed
              <iframe
                src={material.embedUrl}
                className="w-full h-full border-0"
                allowFullScreen
                title={material.title}
              />
            )}
          </div>

          {/* Action Buttons */}
          {material.downloadUrl && (
            <div className="flex justify-center mt-6">
              <a
                href={material.downloadUrl}
                download
                className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 
                         text-white rounded-lg transition-colors duration-200"
              >
                <FaFileDownload className="w-4 h-4" />
                <span>Download {material.type}</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MateriPage() {
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (material: any) => {
    setSelectedMaterial(material);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMaterial(null);
  };

  return (
    <>
      {/* Background dengan gradient seperti di gambar */}
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pt-24 sm:pt-28">
          {/* Header Section */}
          <div className="mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Modul
            </h1>
          </div>

          {/* Grid untuk Kartu Materi - 2 kolom seperti di gambar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl">
            {learningMaterials.map((material) => (
              <div
                key={material.id}
                onClick={() => handleCardClick(material)}
                className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden 
                         group transition-all duration-300 ease-in-out cursor-pointer
                         hover:scale-105 hover:shadow-2xl hover:bg-white/20
                         border border-white/20"
              >
                
                {/* Bagian Thumbnail */}
                <div className="relative w-full h-48 lg:h-56">
                  <Image
                    src={material.thumbnailUrl}
                    alt={`Thumbnail untuk ${material.title}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  
                  {/* Overlay dengan Play/View Button */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 
                                flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {material.type === 'Video' ? (
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                          <FaPlay className="w-6 h-6 text-white ml-1" />
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center">
                          <FaEye className="w-6 h-6 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Tag Tipe (PPT/Video) - Posisi seperti di gambar */}
                  <span className={`absolute top-4 right-4 px-3 py-1 text-sm font-bold text-white rounded-md
                                 ${material.type === 'PPT' ? 'bg-blue-600' : 'bg-purple-600'}`}>
                    {material.type}
                  </span>

                  {/* Durasi (hanya untuk video) - Posisi seperti di gambar */}
                  {material.type === 'Video' && material.duration && (
                    <span className="absolute bottom-4 right-4 px-2 py-1 text-sm text-white bg-black/70 rounded">
                      {material.duration}
                    </span>
                  )}

                  {/* Judul di atas thumbnail seperti di gambar */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <h2 className="text-white font-bold text-xl mb-1">
                      SISTEM SARAF
                    </h2>
                  </div>
                </div>

                {/* Bagian Konten bawah - minimal karena di gambar fokus pada thumbnail */}
                <div className="p-4">
                  <h3 className="text-white font-semibold text-lg mb-2">
                    {material.title}
                  </h3>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
                      {material.type === 'Video' ? 'Tonton' : 'Lihat'}
                    </button>
                    
                    {material.downloadUrl && (
                      <a
                        href={material.downloadUrl}
                        download
                        onClick={(e) => e.stopPropagation()}
                        className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                        title="Download"
                      >
                        <FaFileDownload className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {learningMaterials.length === 0 && (
            <div className="text-center py-12 sm:py-16">
              <div className="text-white/60 text-lg mb-4">Belum ada materi tersedia</div>
              <p className="text-white/40 text-sm">Materi pembelajaran akan segera ditambahkan</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal untuk menampilkan konten */}
      <ContentModal 
        material={selectedMaterial} 
        isOpen={isModalOpen} 
        onClose={closeModal} 
      />
    </>
  );
}