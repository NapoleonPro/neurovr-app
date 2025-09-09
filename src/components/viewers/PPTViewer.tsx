// src/components/viewers/PPTViewer.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { FaExpand, FaCompress, FaDownload, FaShare } from 'react-icons/fa';

interface PPTViewerProps {
  embedUrl: string;
  title: string;
  downloadUrl?: string;
}

export function PPTViewer({ embedUrl, title, downloadUrl }: PPTViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (!isFullscreen) {
        // Enter fullscreen
        if (containerRef.current.requestFullscreen) {
          containerRef.current.requestFullscreen();
        }
      } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    }
  };

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`relative bg-gray-900 rounded-lg overflow-hidden ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'w-full'
      }`}
    >
      {/* Controls Bar */}
      <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-700/90 backdrop-blur-sm">
        <h3 className="text-white font-semibold text-sm sm:text-base truncate flex-1 mr-4">
          {title}
        </h3>
        <div className="flex items-center space-x-2">
          {downloadUrl && (
            <a
              href={downloadUrl}
              download
              className="p-2 hover:bg-gray-600 rounded-lg transition-colors duration-200"
              title="Download PPT"
            >
              <FaDownload className="w-3 h-3 sm:w-4 sm:h-4 text-gray-300 hover:text-white" />
            </a>
          )}
          <button
            onClick={toggleFullscreen}
            className="p-2 hover:bg-gray-600 rounded-lg transition-colors duration-200"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? (
              <FaCompress className="w-3 h-3 sm:w-4 sm:h-4 text-gray-300 hover:text-white" />
            ) : (
              <FaExpand className="w-3 h-3 sm:w-4 sm:h-4 text-gray-300 hover:text-white" />
            )}
          </button>
        </div>
      </div>

      {/* PPT Embed */}
      <div className={`w-full ${isFullscreen ? 'h-[calc(100vh-56px)] sm:h-[calc(100vh-64px)]' : 'aspect-video'}`}>
        <iframe
          src={embedUrl}
          className="w-full h-full border-0"
          allowFullScreen
          title={title}
          loading="lazy"
          allow="fullscreen"
        />
      </div>
    </div>
  );
}

// src/components/viewers/VideoViewer.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaExpand, FaCompress } from 'react-icons/fa';

interface VideoViewerProps {
  embedUrl: string;
  title: string;
  isYouTube?: boolean;
  thumbnail?: string;
}

export function VideoViewer({ embedUrl, title, isYouTube = false, thumbnail }: VideoViewerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check if it's a local video (not YouTube/Vimeo)
  const isLocalVideo = !embedUrl.includes('youtube.com') && 
                      !embedUrl.includes('youtu.be') && 
                      !embedUrl.includes('vimeo.com') && 
                      !embedUrl.includes('embed');

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (!isFullscreen) {
        // Enter fullscreen
        if (containerRef.current.requestFullscreen) {
          containerRef.current.requestFullscreen();
        }
      } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const newTime = parseFloat(e.target.value);
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const newVolume = parseFloat(e.target.value);
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // YouTube/Vimeo Embed
  if (!isLocalVideo) {
    return (
      <div 
        ref={containerRef} 
        className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden"
      >
        <iframe
          src={embedUrl}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          title={title}
          loading="lazy"
        />
      </div>
    );
  }

  // Local Video Player dengan Custom Controls
  return (
    <div 
      ref={containerRef} 
      className={`relative bg-gray-900 rounded-lg overflow-hidden group ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'w-full aspect-video'
      }`}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        poster={thumbnail}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        preload="metadata"
        playsInline
      >
        <source src={embedUrl} type="video/mp4" />
        <source src={embedUrl} type="video/webm" />
        <source src={embedUrl} type="video/ogg" />
        Your browser does not support the video tag.
      </video>

      {/* Custom Video Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 sm:p-4 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        
        {/* Progress Bar */}
        <div className="mb-3">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
                duration > 0 ? (currentTime / duration) * 100 : 0
              }%, #64748b ${
                duration > 0 ? (currentTime / duration) * 100 : 0
              }%, #64748b 100%)`
            }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={togglePlay}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              {isPlaying ? (
                <FaPause className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              ) : (
                <FaPlay className="w-3 h-3 sm:w-4 sm:h-4 text-white ml-0.5" />
              )}
            </button>

            <button
              onClick={toggleMute}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              {isMuted ? (
                <FaVolumeMute className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              ) : (
                <FaVolumeUp className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              )}
            </button>

            {/* Volume Slider - Hidden on small screens */}
            <div className="hidden sm:flex items-center">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <span className="text-white text-xs sm:text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <button
            onClick={toggleFullscreen}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            {isFullscreen ? (
              <FaCompress className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            ) : (
              <FaExpand className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Play Button Overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={togglePlay}
            className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600/80 hover:bg-blue-600 rounded-full 
                     flex items-center justify-center transition-all duration-300 hover:scale-110"
          >
            <FaPlay className="w-4 h-4 sm:w-6 sm:h-6 text-white ml-0.5 sm:ml-1" />
          </button>
        </div>
      )}
    </div>
  );
}