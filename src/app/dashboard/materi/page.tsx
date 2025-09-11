// src/app/dashboard/materi/page.tsx
'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { FaPlay, FaFileDownload, FaEye, FaTimes, FaClock, FaBook, FaVideo, FaGraduationCap, FaExpand, FaCompress, FaMobile, FaDesktop } from 'react-icons/fa';

interface LearningMaterial {
  id: number;
  title: string;
  type: 'PPT' | 'Video';
  thumbnailUrl: string;
  embedUrl: string;
  downloadUrl: string | null;
  duration?: string | null;
  description: string;
  slides?: number;
  category: string;
  views?: number;
}

// --- DATA MATERI ---
const learningMaterials: LearningMaterial[] = [
  {
    id: 1,
    title: 'Sistem Saraf',
    type: 'PPT',
    thumbnailUrl: '/api/placeholder/400/250',
    embedUrl: 'https://docs.google.com/presentation/d/e/2PACX-1vSkSUhoDQhy9lzTT7ozIp1Ni5ob3UKhFbidMLVQ_xw8dPShDX3Ym4YHu6nfyR9hMA/embed?start=false&loop=false&delayms=3000',
    downloadUrl: '/files/sistem-saraf.pptx',
    duration: null,
    description: 'Penjelasan lengkap tentang sistem saraf manusia dan fungsinya',
    slides: 24,
    category: 'Biologi',
  },
  {
    id: 2,
    title: 'Sistem Saraf',
    type: 'Video',
    thumbnailUrl: '/api/placeholder/400/250',
    embedUrl: 'https://www.youtube.com/embed/qPix_X-9t7E?autoplay=0&controls=1&rel=0',
    downloadUrl: null,
    // duration: '3:07',
    description: 'Video animasi interaktif tentang cara kerja sistem saraf',
    // views: 1250,
    category: 'Biologi',
  },
];

// Hook to detect device orientation and screen size
function useDeviceInfo() {
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isLandscape: false,
    screenHeight: 0,
    screenWidth: 0
  });

  useEffect(() => {
    const updateDeviceInfo = () => {
      const isMobile = window.innerWidth < 768;
      const isLandscape = window.innerWidth > window.innerHeight;
      
      setDeviceInfo({
        isMobile,
        isLandscape,
        screenHeight: window.innerHeight,
        screenWidth: window.innerWidth
      });
    };

    updateDeviceInfo();
    window.addEventListener('resize', updateDeviceInfo);
    window.addEventListener('orientationchange', () => {
      setTimeout(updateDeviceInfo, 100); // Delay to get accurate dimensions after orientation change
    });

    return () => {
      window.removeEventListener('resize', updateDeviceInfo);
      window.removeEventListener('orientationchange', updateDeviceInfo);
    };
  }, []);

  return deviceInfo;
}

// Floating shapes for background decoration
function FloatingShapes() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Large floating circles */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-1/3 -left-16 w-32 h-32 bg-purple-500/10 rounded-full blur-lg animate-bounce" style={{ animationDuration: '3s' }}></div>
      <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-indigo-500/10 rounded-full blur-md animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      {/* Small particles */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-ping"></div>
      <div className="absolute top-3/4 left-3/4 w-1 h-1 bg-purple-400/40 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-indigo-400/30 rounded-full animate-ping" style={{ animationDelay: '3s' }}></div>
    </div>
  );
}

// Enhanced Modal Component with Auto-Hide Header on Mobile Landscape
function ContentModal({ material, isOpen, onClose }: { 
  material: LearningMaterial | null, 
  isOpen: boolean, 
  onClose: () => void 
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<'fit' | 'full'>('fit');
  const [showHeader, setShowHeader] = useState(true);
  const [headerTimeout, setHeaderTimeout] = useState<NodeJS.Timeout | null>(null);
  const deviceInfo = useDeviceInfo();

  // Auto-hide header logic for mobile landscape
  useEffect(() => {
    if (deviceInfo.isMobile && deviceInfo.isLandscape && isOpen) {
      // Hide header after 3 seconds on mobile landscape
      const timeout = setTimeout(() => {
        setShowHeader(false);
      }, 3000);
      setHeaderTimeout(timeout);

      return () => {
        if (timeout) clearTimeout(timeout);
      };
    } else {
      // Always show header on desktop or mobile portrait
      setShowHeader(true);
      if (headerTimeout) {
        clearTimeout(headerTimeout);
        setHeaderTimeout(null);
      }
    }
  }, [isOpen, deviceInfo.isMobile, deviceInfo.isLandscape]);

  // Show header temporarily when user interacts
  const handleMouseMove = () => {
    if (deviceInfo.isMobile && deviceInfo.isLandscape && !showHeader) {
      setShowHeader(true);
      
      // Clear existing timeout
      if (headerTimeout) clearTimeout(headerTimeout);
      
      // Hide again after 3 seconds
      const timeout = setTimeout(() => {
        setShowHeader(false);
      }, 3000);
      setHeaderTimeout(timeout);
    }
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (headerTimeout) clearTimeout(headerTimeout);
    };
  }, [headerTimeout]);

  if (!isOpen || !material) return null;

  const isMobileLandscape = deviceInfo.isMobile && deviceInfo.isLandscape;
  const isMobilePortrait = deviceInfo.isMobile && !deviceInfo.isLandscape;

  // Enhanced content container class with header consideration
  const getContentContainerClass = () => {
    if (material.type === 'PPT') {
      if (isMobileLandscape && isFullscreen) {
        return "fixed inset-0 z-60 bg-black";
      }
      if (isMobileLandscape) {
        // Use more space when header is hidden
        const heightClass = showHeader ? "h-[calc(100vh-120px)]" : "h-[calc(100vh-20px)]";
        return `${heightClass} w-full bg-black/50 rounded-2xl overflow-hidden border border-white/5`;
      }
      if (isMobilePortrait && viewMode === 'full') {
        return "h-[60vh] w-full bg-black/50 rounded-2xl overflow-hidden border border-white/5";
      }
    }
    
    // For videos, also optimize height on mobile landscape
    if (material.type === 'Video' && isMobileLandscape) {
      const heightClass = showHeader ? "h-[calc(100vh-120px)]" : "h-[calc(100vh-20px)]";
      return `${heightClass} w-full bg-black/50 rounded-2xl overflow-hidden border border-white/5`;
    }
    
    return "aspect-video w-full bg-black/50 rounded-2xl overflow-hidden border border-white/5";
  };

  const getModalClass = () => {
    if (isMobileLandscape && isFullscreen) {
      return "fixed inset-0 z-50";
    }
    if (isMobileLandscape) {
      return "fixed inset-2 z-50 flex items-center justify-center";
    }
    return "fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4";
  };

  const getModalContentClass = () => {
    if (isMobileLandscape && isFullscreen) {
      return "relative w-full h-full bg-black";
    }
    if (isMobileLandscape) {
      return "relative w-full max-h-[95vh] bg-gray-900/95 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl border border-white/10";
    }
    return "relative w-full max-w-6xl max-h-[95vh] bg-gray-900/95 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-white/10 animate-in fade-in-0 zoom-in-95 duration-300";
  };

  return (
    <>
      {/* Backdrop */}
      {!isFullscreen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      
      {/* Modal */}
      <div className={getModalClass()} onMouseMove={handleMouseMove} onTouchStart={handleMouseMove}>
        <div className={getModalContentClass()}>
          
          {/* Header with Auto-Hide Animation */}
          {!(isMobileLandscape && isFullscreen) && (
            <div className={`bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-white/10 transition-all duration-500 ${
              isMobileLandscape && !showHeader ? 'transform -translate-y-full opacity-0 pointer-events-none' : 'transform translate-y-0 opacity-100'
            }`}>
              <div className="flex items-center justify-between p-3 sm:p-6">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center ${
                    material.type === 'PPT' ? 'bg-blue-600/20' : 'bg-purple-600/20'
                  }`}>
                    {material.type === 'PPT' ? 
                      <FaBook className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" /> : 
                      <FaVideo className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                    }
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base sm:text-xl font-bold text-white truncate">{material.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-300 mt-1 line-clamp-1">{material.description}</p>
                    <div className="flex items-center space-x-2 sm:space-x-4 mt-2">
                      <span className="text-xs text-gray-400 bg-white/10 px-2 py-1 rounded-full">
                        {material.category}
                      </span>
                      {material.duration && (
                        <span className="text-xs text-gray-400 flex items-center space-x-1">
                          <FaClock className="w-3 h-3" />
                          <span>{material.duration}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {/* View Mode Toggle for PPT on Mobile */}
                  {material.type === 'PPT' && deviceInfo.isMobile && (
                    <>
                      <button
                        onClick={() => setViewMode(viewMode === 'fit' ? 'full' : 'fit')}
                        className="p-2 sm:p-3 hover:bg-white/10 rounded-xl transition-all duration-200 group"
                        title={viewMode === 'fit' ? 'Full Height View' : 'Fit View'}
                      >
                        {viewMode === 'fit' ? 
                          <FaMobile className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" /> :
                          <FaDesktop className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                        }
                      </button>
                      {isMobileLandscape && (
                        <button
                          onClick={() => setIsFullscreen(!isFullscreen)}
                          className="p-2 sm:p-3 hover:bg-white/10 rounded-xl transition-all duration-200 group"
                          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                        >
                          {isFullscreen ? 
                            <FaCompress className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" /> :
                            <FaExpand className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                          }
                        </button>
                      )}
                    </>
                  )}
                  <button
                    onClick={onClose}
                    className="p-2 sm:p-3 hover:bg-white/10 rounded-xl transition-all duration-200 group"
                  >
                    <FaTimes className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-white transition-colors" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Floating Controls for Mobile Landscape (Always Visible) */}
          {isMobileLandscape && !isFullscreen && (
            <div className="absolute top-4 right-4 z-10 flex items-center space-x-2">
              {/* Show Header Toggle */}
              <button
                onClick={() => {
                  setShowHeader(!showHeader);
                  if (!showHeader) {
                    // Auto-hide again after 5 seconds
                    const timeout = setTimeout(() => {
                      setShowHeader(false);
                    }, 5000);
                    if (headerTimeout) clearTimeout(headerTimeout);
                    setHeaderTimeout(timeout);
                  }
                }}
                className="p-2 bg-black/70 hover:bg-black/90 rounded-xl transition-all duration-200"
                title={showHeader ? 'Hide Header' : 'Show Header'}
              >
                {showHeader ? 
                  <FaCompress className="w-4 h-4 text-white" /> :
                  <FaExpand className="w-4 h-4 text-white" />
                }
              </button>
              
              <button
                onClick={onClose}
                className="p-2 bg-black/70 hover:bg-black/90 rounded-xl transition-all duration-200"
              >
                <FaTimes className="w-4 h-4 text-white" />
              </button>
            </div>
          )}

          {/* Fullscreen Mobile Controls */}
          {isMobileLandscape && isFullscreen && (
            <div className="absolute top-4 right-4 z-10 flex items-center space-x-2">
              <button
                onClick={() => setIsFullscreen(false)}
                className="p-3 bg-black/70 hover:bg-black/90 rounded-xl transition-all duration-200"
              >
                <FaCompress className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={onClose}
                className="p-3 bg-black/70 hover:bg-black/90 rounded-xl transition-all duration-200"
              >
                <FaTimes className="w-5 h-5 text-white" />
              </button>
            </div>
          )}

          {/* Content Area with Dynamic Padding */}
          <div className={`${isFullscreen && isMobileLandscape ? "h-full" : ""} ${
            isMobileLandscape && !showHeader && !isFullscreen ? "p-2" : "p-3 sm:p-6"
          } transition-all duration-500`}>
            <div className={getContentContainerClass()}>
              {material.type === 'Video' ? (
                material.embedUrl.includes('youtube.com') || material.embedUrl.includes('vimeo.com') ? (
                  <iframe
                    src={material.embedUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={material.title}
                  />
                ) : (
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
                <iframe
                  src={material.embedUrl}
                  className="w-full h-full border-0"
                  allowFullScreen
                  title={material.title}
                />
              )}
            </div>

            {/* Mobile Landscape Helper Text - Only show when header is visible */}
            {material.type === 'PPT' && isMobileLandscape && !isFullscreen && showHeader && (
              <div className="mt-4 p-3 bg-blue-600/10 rounded-xl border border-blue-600/20 transition-all duration-500">
                <p className="text-blue-300 text-sm flex items-center space-x-2">
                  <FaMobile className="w-4 h-4" />
                  <span>Header akan otomatis tersembunyi untuk memberikan ruang lebih luas</span>
                </p>
              </div>
            )}

            {/* Action Buttons - Only show when header is visible or not in mobile landscape */}
            {material.downloadUrl && (!(isMobileLandscape && !showHeader) && !(isFullscreen && isMobileLandscape)) && (
              <div className="flex justify-center mt-4 sm:mt-6 transition-all duration-500">
                <a
                  href={material.downloadUrl}
                  download
                  className="inline-flex items-center space-x-3 px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 
                           hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl transition-all duration-300 
                           transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  <FaFileDownload className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-semibold">Download {material.type}</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// Enhanced Material Card
function MaterialCard({ material, onClick }: { material: LearningMaterial, onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="group relative bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 
                 transition-all duration-500 ease-out cursor-pointer hover:scale-[1.02] hover:bg-white/10
                 shadow-lg hover:shadow-2xl hover:shadow-blue-500/10"
    >
      {/* Thumbnail Section */}
      <div className="relative w-full h-48 sm:h-56 lg:h-64 overflow-hidden">
        <Image
          src={material.thumbnailUrl}
          alt={`Thumbnail untuk ${material.title}`}
          fill
          className="object-cover transition-all duration-700 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent 
                       group-hover:from-black/60 transition-all duration-300" />
        
        {/* Hover Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="transform scale-75 group-hover:scale-100 transition-all duration-300 opacity-0 group-hover:opacity-100">
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 shadow-2xl ${
              material.type === 'Video' ? 'bg-purple-600/80' : 'bg-blue-600/80'
            }`}>
              {material.type === 'Video' ? (
                <FaPlay className="w-6 h-6 sm:w-8 sm:h-8 text-white ml-1" />
              ) : (
                <FaEye className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              )}
            </div>
          </div>
        </div>
        
        {/* Type Badge */}
        <div className="absolute top-4 right-4">
          <span className={`px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm font-bold text-white rounded-xl backdrop-blur-md border border-white/20 ${
            material.type === 'PPT' ? 'bg-blue-600/80' : 'bg-purple-600/80'
          }`}>
            {material.type}
          </span>
        </div>

        {/* Duration/Info Badge */}
        {material.type === 'Video' && material.duration && (
          <div className="absolute bottom-4 left-4">
            <span className="px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm text-white bg-black/70 backdrop-blur-md rounded-lg border border-white/10 flex items-center space-x-2">
              <FaClock className="w-3 h-3" />
              <span>{material.duration}</span>
            </span>
          </div>
        )}

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 lg:p-6">
          <h2 className="text-white font-bold text-lg sm:text-xl lg:text-2xl mb-2 leading-tight">
            {material.title}
          </h2>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-300">
            <span className="bg-white/20 px-2 py-1 rounded-full">{material.category}</span>
            {material.slides && (
              <span className="flex items-center space-x-1">
                <FaGraduationCap className="w-3 h-3" />
                <span>{material.slides} slides</span>
              </span>
            )}
            {material.views && (
              <span className="flex items-center space-x-1">
                <FaEye className="w-3 h-3" />
                <span>{material.views} views</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content Footer */}
      <div className="p-3 sm:p-4 lg:p-6">
        <p className="text-gray-300 text-sm mb-4 leading-relaxed line-clamp-2">
          {material.description}
        </p>
        
        <div className="flex items-center justify-between">
          <button className="text-blue-400 hover:text-blue-300 font-semibold text-sm transition-colors 
                           flex items-center space-x-2 group/btn">
            <span>{material.type === 'Video' ? 'Tonton Sekarang' : 'Buka Materi'}</span>
            <div className="w-0 group-hover/btn:w-4 transition-all duration-300 overflow-hidden">
              <div className="w-4 h-4 text-blue-400">→</div>
            </div>
          </button>
          
          {material.downloadUrl && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (material.downloadUrl) {
                  window.open(material.downloadUrl, '_blank');
                }
              }}
              className="p-2 sm:p-3 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200
                       transform hover:scale-110"
              title="Download"
            >
              <FaFileDownload className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Glow Effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-600/0 to-purple-600/0 
                     group-hover:from-blue-600/5 group-hover:to-purple-600/5 transition-all duration-500 pointer-events-none" />
    </div>
  );
}

export default function MateriPage() {
  const [selectedMaterial, setSelectedMaterial] = useState<LearningMaterial | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (material: LearningMaterial) => {
    setSelectedMaterial(material);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMaterial(null);
  };

  return (
    <>
      <FloatingShapes />
      
      {/* Main Container */}
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 relative">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDYwIDAgTCAwIDAgMCA2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pt-16 sm:pt-20 lg:pt-24 relative z-10">
          
          {/* Enhanced Header Section */}
          <div className="mb-8 sm:mb-12 lg:mb-16 text-center">
            <div className="inline-flex items-center space-x-3 bg-white/5 backdrop-blur-md px-4 py-2 sm:px-6 sm:py-3 rounded-full border border-white/10 mb-4 sm:mb-6">
              <FaGraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
              <span className="text-gray-300 font-medium text-sm sm:text-base">Learning Materials</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-7xl font-black text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text mb-4 leading-tight">
              Modul Pembelajaran
            </h1>
            
            <p className="text-gray-300 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed px-4">
              Jelajahi materi pembelajaran interaktif yang dirancang khusus untuk pengalaman belajar yang optimal
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8 mt-6 sm:mt-8 lg:mt-12">
              <div className="text-center">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1">
                  {learningMaterials.length}
                </div>
                <div className="text-xs sm:text-sm text-gray-400">Materi Total</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1">
                  {learningMaterials.filter(m => m.type === 'Video').length}
                </div>
                <div className="text-xs sm:text-sm text-gray-400">Video</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1">
                  {learningMaterials.filter(m => m.type === 'PPT').length}
                </div>
                <div className="text-xs sm:text-sm text-gray-400">Presentasi</div>
              </div>
            </div>
          </div>

          {/* Materials Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto">
            {learningMaterials.map((material) => (
              <MaterialCard
                key={material.id}
                material={material}
                onClick={() => handleCardClick(material)}
              />
            ))}
          </div>

          {/* Enhanced Empty State */}
          {learningMaterials.length === 0 && (
            <div className="text-center py-16 sm:py-20 lg:py-32">
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 sm:mb-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl flex items-center justify-center">
                <FaBook className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">Belum Ada Materi</h3>
              <p className="text-gray-400 text-base sm:text-lg mb-6 sm:mb-8 max-w-md mx-auto px-4">
                Materi pembelajaran sedang dalam proses persiapan dan akan segera tersedia
              </p>
              <div className="flex justify-center">
                <button className="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold 
                                 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base">
                  Hubungi Administrator
                </button>
              </div>
            </div>
          )}

          {/* Footer CTA */}
          <div className="mt-16 sm:mt-20 lg:mt-32 text-center">
            <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 lg:p-12 border border-white/10">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-4">
                Butuh bantuan dengan materi?
              </h3>
              <p className="text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base px-4">
                Tim support kami siap membantu Anda memahami setiap materi pembelajaran
              </p>
              <button className="inline-flex items-center space-x-3 px-6 py-3 sm:px-8 sm:py-4 bg-white/10 hover:bg-white/20 
                               text-white rounded-2xl transition-all duration-300 border border-white/20 text-sm sm:text-base">
                <span className="font-semibold">Hubungi Support</span>
                <div className="w-4 h-4 sm:w-5 sm:h-5">→</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Modal */}
      <ContentModal 
        material={selectedMaterial} 
        isOpen={isModalOpen} 
        onClose={closeModal} 
      />
    </>
  );
}