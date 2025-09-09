// src/components/viewers/PPTViewer.tsx
'use client';

import { useState } from 'react';
import { FaExpand, FaCompress, FaDownload, FaShare } from 'react-icons/fa';

interface PPTViewerProps {
  embedUrl: string;
  title: string;
  downloadUrl?: string;
}

export function PPTViewer({ embedUrl, title, downloadUrl }: PPTViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : ''}`}>
      {/* Controls Bar */}
      <div className="flex items-center justify-between p-4 bg-slate-700/90 backdrop-blur-sm">
        <h3 className="text-white font-semibold text-sm sm:text-base truncate flex-1 mr-4">
          {title}
        </h3>
        <div className="flex items-center space-x-2">
          {downloadUrl && (
            <a
              href={downloadUrl}
              download
              className="p-2 hover:bg-slate-600 rounded-lg transition-colors"
              title="Download PPT"
            >
              <FaDownload className="w-4 h-4 text-slate-300 hover:text-white" />
            </a>
          )}
          <button
            onClick={toggleFullscreen}
            className="p-2 hover:bg-slate-600 rounded-lg transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? (
              <FaCompress className="w-4 h-4 text-slate-300 hover:text-white" />
            ) : (
              <FaExpand className="w-4 h-4 text-slate-300 hover:text-white" />
            )}
          </button>
        </div>
      </div>

      {/* PPT Embed */}
      <div className={`${isFullscreen ? 'h-[calc(100vh-64px)]' : 'aspect-video'} w-full`}>
        <iframe
          src={embedUrl}
          className="w-full h-full border-0"
          allowFullScreen
          title={title}
          loading="lazy"
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Untuk video lokal (bukan YouTube/Vimeo)
  const isLocalVideo = !embedUrl.includes('youtube.com') && !embedUrl.includes('vimeo.com') && !embedUrl.includes('embed');

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
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
        containerRef.current.requestFullscreen?.();
      } else {
        document.exitFullscreen?.();
      }
      setIsFullscreen(!isFullscreen);
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

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (!isLocalVideo) {
    // YouTube/Vimeo Embed
    return (
      <div ref={containerRef} className="relative w-full aspect-video bg-slate-900 rounded-lg overflow-hidden">
        <iframe
          src={embedUrl}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={title}
        />
      </div>
    );
  }

  // Local Video Player dengan Custom Controls
  return (
    <div ref={containerRef} className="relative w-full aspect-video bg-slate-900 rounded-lg overflow-hidden group">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        poster={thumbnail}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        preload="metadata"
      >
        <source src={embedUrl} type="video/mp4" />
        <source src={embedUrl} type="video/webm" />
        <source src={embedUrl} type="video/ogg" />
        Your browser does not support the video tag.
      </video>

      {/* Custom Video Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        
        {/* Progress Bar */}
        <div className="mb-3">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={togglePlay}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              {isPlaying ? (
                <FaPause className="w-4 h-4 text-white" />
              ) : (
                <FaPlay className="w-4 h-4 text-white ml-0.5" />
              )}
            </button>

            <button
              onClick={toggleMute}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              {isMuted ? (
                <FaVolumeMute className="w-4 h-4 text-white" />
              ) : (
                <FaVolumeUp className="w-4 h-4 text-white" />
              )}
            </button>

            <span className="text-white text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <button
            onClick={toggleFullscreen}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            {isFullscreen ? (
              <FaCompress className="w-4 h-4 text-white" />
            ) : (
              <FaExpand className="w-4 h-4 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Play Button Overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={togglePlay}
            className="w-16 h-16 bg-blue-600/80 hover:bg-blue-600 rounded-full flex items-center justify-center
                     transition-all duration-300 hover:scale-110"
          >
            <FaPlay className="w-6 h-6 text-white ml-1" />
          </button>
        </div>
      )}
    </div>
  );
}

// Custom CSS untuk slider (tambahkan ke globals.css)
const sliderStyles = `
.slider {
  background: linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(currentTime / duration) * 100}%, #64748b ${(currentTime / duration) * 100}%, #64748b 100%);
}

.slider::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}
`;