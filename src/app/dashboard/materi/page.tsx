// src/app/dashboard/materi/page.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FaPlay, FaFileDownload, FaEye, FaTimes } from 'react-icons/fa';

// --- DATA MATERI ---
const learningMaterials = [
  {
    id: 1,
    title: 'Sistem Saraf Manusia',
    type: 'PPT',
    thumbnailUrl: '/thumbnails/ppt-sistem-saraf.png',
    // Untuk PPT, bisa menggunakan Google Drive embed atau SlideShare
    embedUrl: 'https://docs.google.com/presentation/d/YOUR_PRESENTATION_ID/embed?start=false&loop=false&delayms=3000',
    downloadUrl: '/files/sistem-saraf.pptx',
    duration: null,
    description: 'Penjelasan lengkap tentang sistem saraf manusia dan fungsinya',
  },
  {
    id: 2,
    title: 'Sistem Saraf dalam Animasi',
    type: 'Video',
    thumbnailUrl: '/thumbnails/video-sistem-saraf.png',
    // Untuk video, bisa menggunakan YouTube, Vimeo, atau file lokal
    embedUrl: 'https://www.youtube.com/embed/YOUR_VIDEO_ID',
    // embedUrl: '/videos/sistem-saraf.mp4', // Untuk video lokal
    downloadUrl: null,
    duration: '3:07',
    description: 'Video animasi interaktif tentang cara kerja sistem saraf',
  },
  {
    id: 3,
    title: 'Neuron dan Sinapsis',
    type: 'PPT',
    thumbnailUrl: '/thumbnails/ppt-neuron.png',
    embedUrl: 'https://docs.google.com/presentation/d/YOUR_NEURON_PRESENTATION_ID/embed?start=false&loop=false&delayms=3000',
    downloadUrl: '/files/neuron-sinapsis.pptx',
    duration: null,
    description: 'Memahami struktur neuron dan proses transmisi sinyal',
  },
  {
    id: 4,
    title: 'Otak dan Fungsinya',
    type: 'Video',
    thumbnailUrl: '/thumbnails/video-otak.png',
    embedUrl: 'https://www.youtube.com/embed/YOUR_BRAIN_VIDEO_ID',
    downloadUrl: null,
    duration: '5:23',
    description: 'Eksplorasi mendalam tentang anatomi dan fungsi otak manusia',
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
      <div className="relative w-full max-w-6xl max-h-[90vh] bg-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header Modal */}
        <div className="flex items-center justify-between p-4 sm:p-6 bg-slate-700/50 border-b border-slate-600">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-white">{material.title}</h3>
            <p className="text-sm text-slate-300 mt-1">{material.description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-600 rounded-lg transition-colors duration-200"
          >
            <FaTimes className="w-5 h-5 text-slate-300 hover:text-white" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6">
          <div className="aspect-video w-full bg-slate-900 rounded-lg overflow-hidden">
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
                className="w-full h-full"
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pt-24 sm:pt-28">
        {/* Header Section */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Modul Pembelajaran
          </h1>
          <p className="text-slate-300 text-sm sm:text-base lg:text-lg max-w-2xl">
            Jelajahi berbagai materi pembelajaran neurosains melalui presentasi interaktif dan video edukatif
          </p>
        </div>

        {/* Filter Tabs (Optional) */}
        <div className="flex flex-wrap gap-2 sm:gap-4 mb-8">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
            Semua
          </button>
          <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white rounded-lg text-sm font-medium transition-colors">
            Presentasi
          </button>
          <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white rounded-lg text-sm font-medium transition-colors">
            Video
          </button>
        </div>

        {/* Grid untuk Kartu Materi - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {learningMaterials.map((material) => (
            <div
              key={material.id}
              onClick={() => handleCardClick(material)}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg overflow-hidden 
                       group transition-all duration-300 ease-in-out cursor-pointer
                       hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20
                       border border-transparent hover:border-blue-500/30
                       transform-gpu"
            >
              
              {/* Bagian Thumbnail */}
              <div className="relative w-full h-40 sm:h-48 lg:h-52">
                <Image
                  src={material.thumbnailUrl}
                  alt={`Thumbnail untuk ${material.title}`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                
                {/* Overlay dengan Play/View Button */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 
                              flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {material.type === 'Video' ? (
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-full flex items-center justify-center">
                        <FaPlay className="w-4 h-4 sm:w-6 sm:h-6 text-white ml-1" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-indigo-600 rounded-full flex items-center justify-center">
                        <FaEye className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Tag Tipe (PPT/Video) */}
                <span className={`absolute top-2 sm:top-3 right-2 sm:right-3 px-2 sm:px-3 py-1 text-xs font-bold text-white rounded-md
                               ${material.type === 'PPT' ? 'bg-blue-600' : 'bg-indigo-600'}`}>
                  {material.type}
                </span>

                {/* Durasi (hanya untuk video) */}
                {material.type === 'Video' && material.duration && (
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 text-xs text-white bg-black/70 rounded">
                    {material.duration}
                  </span>
                )}
              </div>

              {/* Bagian Konten */}
              <div className="p-4 sm:p-5 lg:p-6">
                <h2 className="text-base sm:text-lg font-semibold text-white mb-2 line-clamp-2">
                  {material.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 mb-3">
                  {material.description}
                </p>
                
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
                      className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-700 rounded-lg"
                      title="Download"
                    >
                      <FaFileDownload className="w-3 h-3 sm:w-4 sm:h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State (jika tidak ada materi) */}
        {learningMaterials.length === 0 && (
          <div className="text-center py-12 sm:py-16">
            <div className="text-slate-400 text-lg mb-4">Belum ada materi tersedia</div>
            <p className="text-slate-500 text-sm">Materi pembelajaran akan segera ditambahkan</p>
          </div>
        )}
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