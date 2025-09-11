// src/app/dashboard/brain-journey/BrainJourney3D.tsx (Advanced Version)
'use client';

import React, { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html, Environment } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaTimes, 
  FaBrain, 
  FaEye, 
  FaHome
} from 'react-icons/fa';
import * as THREE from 'three';

// Data bagian otak dengan posisi yang lebih akurat
const brainParts = [
  {
    id: 'cerebrum',
    name: 'Cerebrum',
    position: [0, 0.3, 0.2] as [number, number, number],
    description: 'Bagian terbesar otak yang mengontrol fungsi kognitif seperti berpikir, berbicara, dan gerakan volunter.',
    functions: [
      'Berpikir dan reasoning',
      'Memori dan pembelajaran', 
      'Bahasa dan komunikasi',
      'Gerakan volunter',
      'Persepsi sensorik',
      'Emosi dan kepribadian'
    ],
    color: '#4F46E5',
    medicalFacts: 'Cerebrum membentuk 85% dari total berat otak dan mengandung sekitar 15-20 miliar neuron.',
    clickRadius: 0.8 // area detection radius
  },
  {
    id: 'cerebellum',
    name: 'Cerebellum',
    position: [0, -0.5, -0.6] as [number, number, number],
    description: 'Otak kecil yang mengatur keseimbangan, koordinasi gerakan, dan postur tubuh.',
    functions: [
      'Keseimbangan tubuh',
      'Koordinasi gerakan halus',
      'Kontrol postur',
      'Motor learning',
      'Koordinasi mata'
    ],
    color: '#059669',
    medicalFacts: 'Cerebellum memiliki struktur seperti pohon yang disebut "arbor vitae".',
    clickRadius: 0.6
  },
  {
    id: 'brainstem',
    name: 'Brainstem',
    position: [0, -0.3, 0] as [number, number, number],
    description: 'Menghubungkan otak dengan sumsum tulang belakang, mengontrol fungsi vital.',
    functions: [
      'Kontrol pernapasan',
      'Detak jantung',
      'Tekanan darah',
      'Refleks vital',
      'Siklus tidur-bangun'
    ],
    color: '#DC2626',
    medicalFacts: 'Brainstem terdiri dari medulla, pons, dan midbrain.',
    clickRadius: 0.4
  },
  {
    id: 'frontal-lobe',
    name: 'Frontal Lobe',
    position: [0, 0.2, 0.8] as [number, number, number],
    description: 'Lobus frontal mengontrol kepribadian dan pengambilan keputusan.',
    functions: [
      'Kepribadian dan karakter',
      'Pengambilan keputusan',
      'Perencanaan masa depan',
      'Kontrol impuls',
      'Kemampuan berbahasa'
    ],
    color: '#7C3AED',
    medicalFacts: 'Prefrontal cortex tidak matang hingga usia 25 tahun.',
    clickRadius: 0.7
  },
  {
    id: 'temporal-lobe',
    name: 'Temporal Lobe',
    position: [-0.6, -0.1, 0.2] as [number, number, number],
    description: 'Mengproses informasi pendengaran dan pembentukan memori.',
    functions: [
      'Pendengaran dan suara',
      'Memori jangka panjang',
      'Pemahaman bahasa',
      'Pengenalan wajah',
      'Pemrosesan musik'
    ],
    color: '#EA580C',
    medicalFacts: 'Hippocampus di temporal lobe adalah kunci pembentukan memori baru.',
    clickRadius: 0.5
  },
  {
    id: 'parietal-lobe',
    name: 'Parietal Lobe',
    position: [0, 0.4, -0.3] as [number, number, number],
    description: 'Memproses informasi sensorik seperti sentuhan dan posisi tubuh.',
    functions: [
      'Sensasi sentuhan',
      'Kesadaran ruang',
      'Integrasi sensorik',
      'Koordinasi mata-tangan',
      'Orientasi tubuh'
    ],
    color: '#0891B2',
    medicalFacts: 'Berisi peta somatosensorik yang memetakan seluruh permukaan tubuh.',
    clickRadius: 0.6
  }
];

// Advanced Brain Model dengan click detection yang lebih baik
function AdvancedBrainModel({ 
  onPartClick, 
  selectedPart 
}: {
  onPartClick: (part: typeof brainParts[0]) => void;
  selectedPart: typeof brainParts[0] | null;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  
  // Load model 3D brain
  let brainScene = null;
  try {
    const gltf = useGLTF('/models/brain.glb');
    brainScene = gltf.scene;
  } catch (error) {
    console.warn('Brain model not found, using fallback geometry');
  }
  
  // Auto rotation
  useFrame((state, delta) => {
    if (groupRef.current && !selectedPart) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  // Advanced click detection
  const handleBrainClick = (event: any) => {
    const clickPoint = event.point;
    
    // Cari bagian terdekat
    let closestPart = null;
    let minDistance = Infinity;
    
    brainParts.forEach(part => {
      const partPos = new THREE.Vector3(...part.position);
      const distance = clickPoint.distanceTo(partPos);
      
      if (distance < part.clickRadius && distance < minDistance) {
        minDistance = distance;
        closestPart = part;
      }
    });
    
    if (closestPart) {
      onPartClick(closestPart);
    }
  };

  // Mouse hover detection untuk area
  const handleMouseMove = (event: any) => {
    const hoverPoint = event.point;
    
    let hoveredArea = null;
    brainParts.forEach(part => {
      const partPos = new THREE.Vector3(...part.position);
      const distance = hoverPoint.distanceTo(partPos);
      
      if (distance < part.clickRadius) {
        hoveredArea = part.id;
      }
    });
    
    setHoveredPart(hoveredArea);
  };

  return (
    <group ref={groupRef}>
      {/* Main brain model */}
      {brainScene ? (
        <primitive 
          object={brainScene.clone()} 
          scale={[2, 2, 2]} 
          position={[0, 0, 0]}
          onClick={handleBrainClick}
          onPointerMove={handleMouseMove}
          onPointerOver={() => document.body.style.cursor = 'pointer'}
          onPointerOut={() => {
            document.body.style.cursor = 'default';
            setHoveredPart(null);
          }}
        />
      ) : (
        // Fallback: Anatomical brain sections
        <group>
          {brainParts.map((part) => (
            <group key={part.id} position={part.position}>
              <mesh
                onClick={(e) => {
                  e.stopPropagation();
                  onPartClick(part);
                }}
                onPointerOver={(e) => {
                  e.stopPropagation();
                  setHoveredPart(part.id);
                  document.body.style.cursor = 'pointer';
                }}
                onPointerOut={(e) => {
                  e.stopPropagation();
                  setHoveredPart(null);
                  document.body.style.cursor = 'default';
                }}
              >
                <sphereGeometry args={[part.clickRadius * 0.6, 32, 32]} />
                <meshStandardMaterial 
                  color={part.color}
                  transparent
                  opacity={
                    selectedPart?.id === part.id ? 0.8 :
                    hoveredPart === part.id ? 0.6 : 0.4
                  }
                  emissive={selectedPart?.id === part.id ? part.color : '#000000'}
                  emissiveIntensity={selectedPart?.id === part.id ? 0.2 : 0}
                />
              </mesh>
              
              {/* Always show labels for fallback */}
              <Html
                position={[0, part.clickRadius * 0.8, 0]}
                center
                distanceFactor={8}
                style={{ pointerEvents: 'none' }}
              >
                <div className="bg-black/70 text-white px-2 py-1 rounded text-xs font-semibold whitespace-nowrap">
                  {part.name}
                </div>
              </Html>
            </group>
          ))}
        </group>
      )}
      
      {/* Interactive visual feedback */}
      {brainParts.map((part) => (
        <group key={`indicator-${part.id}`} position={part.position}>
          {/* Hover indicator */}
          {hoveredPart === part.id && (
            <mesh>
              <sphereGeometry args={[part.clickRadius, 16, 16]} />
              <meshStandardMaterial 
                color={part.color}
                transparent
                opacity={0.1}
                wireframe
              />
            </mesh>
          )}
          
          {/* Selection indicator */}
          {selectedPart?.id === part.id && (
            <>
              {/* Pulsing ring */}
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[part.clickRadius * 0.8, part.clickRadius * 1.1, 32]} />
                <meshStandardMaterial 
                  color={part.color}
                  transparent
                  opacity={0.7}
                  side={THREE.DoubleSide}
                />
              </mesh>
              
              {/* Label */}
              <Html
                position={[0, part.clickRadius * 1.3, 0]}
                center
                distanceFactor={6}
                style={{ pointerEvents: 'none' }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-white text-black px-4 py-2 rounded-lg shadow-lg font-bold text-sm"
                >
                  {part.name}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                    <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                  </div>
                </motion.div>
              </Html>
            </>
          )}
        </group>
      ))}
    </group>
  );
}

// Camera controller tetap sama
function CameraController({ selectedPart }: {
  selectedPart: typeof brainParts[0] | null;
}) {
  const { camera, controls } = useThree();
  
  useEffect(() => {
    if (selectedPart && controls) {
      const targetPosition = new THREE.Vector3(...selectedPart.position);
      controls.target.copy(targetPosition);
      controls.update();
    } else if (controls) {
      controls.target.set(0, 0, 0);
      controls.update();
    }
  }, [selectedPart, camera, controls]);

  return null;
}

// Loading screen
function LoadingScreen() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 z-50">
      <div className="text-center text-white">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-purple-500/30 rounded-full"></div>
          <div className="absolute top-0 w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h2 className="text-2xl font-bold mt-6 mb-2">Memuat Brain Journey</h2>
        <p className="text-gray-300">Sedang mempersiapkan model 3D...</p>
        <div className="mt-4 flex justify-center space-x-1">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    </div>
  );
}

// Info Panel (sama seperti sebelumnya)
function InfoPanel({ part, onClose }: {
  part: typeof brainParts[0] | null;
  onClose: () => void;
}) {
  if (!part) return null;

  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed top-0 right-0 h-full w-96 bg-gray-900/95 backdrop-blur-xl border-l border-white/10 z-50 overflow-y-auto"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div 
              className="w-5 h-5 rounded-full shadow-lg"
              style={{ 
                backgroundColor: part.color,
                boxShadow: `0 0 20px ${part.color}50`
              }}
            />
            <h3 className="text-2xl font-bold text-white">{part.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-8">
          <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <span className="text-blue-400">ℹ️</span>
            Deskripsi
          </h4>
          <p className="text-gray-300 leading-relaxed">
            {part.description}
          </p>
        </div>

        <div className="mb-8">
          <h4 className="text-lg font-semibold text-white mb-4">Fungsi Utama</h4>
          <ul className="space-y-3">
            {part.functions.map((func, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 text-gray-300 p-2 bg-white/5 rounded-lg"
              >
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: part.color }}
                />
                <span>{func}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-xl p-4 border border-white/10">
          <h4 className="text-lg font-semibold text-white mb-3">🧠 Fakta Medis</h4>
          <p className="text-gray-300 text-sm leading-relaxed">
            {part.medicalFacts}
          </p>
        </div>

        <div className="mt-6 bg-white/5 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-white mb-2">💡 Tip Eksplorasi</h4>
          <p className="text-gray-300 text-sm">
            Klik area lain pada model otak untuk mempelajari fungsi berbeda. 
            Gunakan mouse untuk memutar dan memperbesar tampilan!
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// Main component
export default function BrainJourney3D() {
  const [selectedPart, setSelectedPart] = useState<typeof brainParts[0] | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);

  const handlePartClick = (part: typeof brainParts[0]) => {
    setSelectedPart(part);
  };

  const resetView = () => {
    setSelectedPart(null);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInstructions(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(120,119,198,0.15),transparent)]" />
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent,rgba(120,119,198,0.1),transparent)] animate-spin" 
             style={{ animationDuration: '60s' }} />
      </div>

      {/* Header */}
      <div className="relative z-10 p-4 sm:p-6 pt-24">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div className="flex items-center gap-4 mb-4 sm:mb-0">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <FaBrain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Brain Journey 3D</h1>
              <p className="text-gray-300">Klik langsung pada model untuk eksp