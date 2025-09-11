// src/app/dashboard/brain-journey/BrainJourney3D.tsx (Advanced Version)
'use client';

import React, { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { Canvas, useFrame, useThree, ThreeEvent } from '@react-three/fiber';
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

// Enhanced Brain Model dengan Debug Info dan Better Click Detection
function AdvancedBrainModel({ 
  onPartClick, 
  selectedPart 
}: {
  onPartClick: (part: typeof brainParts[0]) => void;
  selectedPart: typeof brainParts[0] | null;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');
  
  // Load model 3D brain
  let brainScene = null;
  try {
    const gltf = useGLTF('/models/brain_project.glb');
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

  // Enhanced click detection dengan debug
  const handleBrainClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    const clickPoint = event.point;
    
    console.log('🖱️ Click detected at:', clickPoint);
    
    let closestPart: (typeof brainParts)[0] | null = null;
    let minDistance = Infinity;
    let debugMessage = `Click at (${clickPoint.x.toFixed(2)}, ${clickPoint.y.toFixed(2)}, ${clickPoint.z.toFixed(2)})\n`;
    
    brainParts.forEach(part => {
      const partPos = new THREE.Vector3(...part.position);
      const distance = clickPoint.distanceTo(partPos);
      
      debugMessage += `${part.name}: distance ${distance.toFixed(2)} (radius: ${part.clickRadius})\n`;
      
      if (distance < part.clickRadius && distance < minDistance) {
        minDistance = distance;
        closestPart = part;
      }
    });
    
    console.log(debugMessage);
    setDebugInfo(debugMessage);
    
    if (closestPart) {
      const finalPart: typeof brainParts[0] = closestPart;
      console.log('✅ Clicked on:', finalPart.name);
      onPartClick(finalPart);
    } else {
      console.log('❌ No part detected in click area');
    }
  };

  // Alternative: Direct mesh click handlers
  const handleDirectMeshClick = (part: typeof brainParts[0]) => {
    console.log('🎯 Direct mesh click:', part.name);
    onPartClick(part);
  };

  return (
    <group ref={groupRef}>
      {/* Debug Info Display */}
      {debugInfo && (
        <Html position={[0, 2, 0]} center style={{ pointerEvents: 'none' }}>
          <div className="bg-black/80 text-white p-2 rounded text-xs max-w-xs border border-white/20">
            <div className="font-semibold mb-1">🔍 Debug Info:</div>
            <pre className="whitespace-pre-wrap text-green-300">{debugInfo}</pre>
          </div>
        </Html>
      )}

      {/* Main brain model */}
      {brainScene ? (
        <primitive 
          object={brainScene.clone()} 
          scale={[2, 2, 2]} 
          position={[0, 0, 0]}
          onClick={handleBrainClick}
          onPointerOver={() => document.body.style.cursor = 'pointer'}
          onPointerOut={() => {
            document.body.style.cursor = 'default';
            setHoveredPart(null);
          }}
        />
      ) : (
        // Fallback: Individual Mesh Click Areas dengan Visual yang Lebih Baik
        <group>
          {/* Method 1: Global Click Detection */}
          <mesh
            position={[0, 0, 0]}
            onClick={handleBrainClick}
            visible={false}
          >
            <boxGeometry args={[4, 4, 4]} />
            <meshBasicMaterial transparent opacity={0} />
          </mesh>

          {/* Method 2: Individual Mesh Click Areas */}
          {brainParts.map((part) => (
            <group key={part.id} position={part.position}>
              {/* Clickable Area */}
              <mesh
                onClick={(e) => {
                  e.stopPropagation();
                  handleDirectMeshClick(part);
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
                <sphereGeometry args={[part.clickRadius, 32, 32]} />
                <meshStandardMaterial 
                  color={part.color}
                  transparent
                  opacity={
                    selectedPart?.id === part.id ? 0.8 :
                    hoveredPart === part.id ? 0.6 : 0.3
                  }
                  wireframe={hoveredPart === part.id}
                  emissive={selectedPart?.id === part.id ? part.color : '#000000'}
                  emissiveIntensity={selectedPart?.id === part.id ? 0.3 : 0}
                />
              </mesh>
              
              {/* Visual Label */}
              <Html
                position={[0, part.clickRadius * 1.2, 0]}
                center
                distanceFactor={8}
                style={{ pointerEvents: 'none' }}
              >
                <div 
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 ${
                    selectedPart?.id === part.id 
                      ? 'bg-white text-black shadow-lg transform scale-110' 
                      : hoveredPart === part.id
                      ? 'bg-yellow-400 text-black shadow-md'
                      : 'bg-black/70 text-white'
                  }`}
                >
                  {part.name}
                  {hoveredPart === part.id && ' 👆'}
                  {selectedPart?.id === part.id && ' ✅'}
                </div>
              </Html>
            </group>
          ))}
        </group>
      )}
      
      {/* Selection Indicators */}
      {selectedPart && (
        <group position={selectedPart.position}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[selectedPart.clickRadius * 1.1, selectedPart.clickRadius * 1.3, 32]} />
            <meshStandardMaterial 
              color={selectedPart.color}
              transparent
              opacity={0.8}
              side={THREE.DoubleSide}
            />
          </mesh>
          
          {/* Animated selection indicator */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[selectedPart.clickRadius * 0.9, selectedPart.clickRadius * 1.0, 32]} />
            <meshStandardMaterial 
              color="#ffffff"
              transparent
              opacity={0.6}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      )}
    </group>
  );
}

// Camera controller tetap sama
function CameraController({ selectedPart }: {
  selectedPart: typeof brainParts[0] | null;
}) {
  const { camera, controls } = useThree();
  
  useEffect(() => {
    const orbitControls = controls as any;
    if (selectedPart && orbitControls) {
      const targetPosition = new THREE.Vector3(...selectedPart.position);
      orbitControls.target.copy(targetPosition);
      orbitControls.update();
    } else if (orbitControls) {
      orbitControls.target.set(0, 0, 0);
      orbitControls.update();
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
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    const loadTimer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(loadTimer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Loading Screen */}
      <AnimatePresence>
        {isLoading && <LoadingScreen />}
      </AnimatePresence>

      {/* Animated background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(120,119,198,0.15),transparent)]" />
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent,rgba(120,119,198,0.1),transparent)] animate-spin" 
             style={{ animationDuration: '60s' }} />
      </div>

      {/* Header */}
      <div className="relative z-10 p-4 sm:p-6 pt-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div className="flex items-center gap-4 mb-4 sm:mb-0">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <FaBrain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Brain Journey 3D</h1>
              <p className="text-gray-300">Klik langsung pada model untuk eksplorasi interaktif</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={resetView}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white border border-white/20"
            >
              <FaHome className="w-4 h-4" />
              Reset View
            </button>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <FaEye className="w-4 h-4" />
              <span>{brainParts.length} Bagian Otak</span>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20"
          >
            <div className="bg-black/50 backdrop-blur-lg rounded-xl p-6 border border-white/10 max-w-md mx-4">
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-2">Cara Menggunakan</h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <p>🖱️ Klik bagian otak untuk info detail</p>
                  <p>🔄 Drag untuk memutar model</p>
                  <p>🔍 Scroll untuk zoom in/out</p>
                  <p>⌨️ Tekan ESC untuk tutup info panel</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D Canvas */}
      <div className="relative h-screen">
        <Canvas
          camera={{ position: [5, 2, 5], fov: 60 }}
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            {/* Lighting */}
            <ambientLight intensity={0.4} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.3} color="#4F46E5" />
            <pointLight position={[10, -10, 10]} intensity={0.3} color="#7C3AED" />
            
            {/* Environment */}
            <Environment preset="city" />
            
            {/* Brain Model */}
            <AdvancedBrainModel 
              onPartClick={handlePartClick} 
              selectedPart={selectedPart}
            />
            
            {/* Controls */}
            <OrbitControls 
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={2}
              maxDistance={10}
              autoRotate={!selectedPart}
              autoRotateSpeed={0.5}
            />
            
            {/* Camera Controller */}
            <CameraController selectedPart={selectedPart} />
          </Suspense>
        </Canvas>
        
        {/* Overlay Controls */}
        <div className="absolute bottom-4 left-4 z-10">
          <div className="bg-black/50 backdrop-blur-lg rounded-lg p-3 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="text-white text-sm">
                {selectedPart ? `Melihat: ${selectedPart.name}` : 'Mode Eksplorasi'}
              </div>
              {selectedPart && (
                <button
                  onClick={resetView}
                  className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded text-white transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Quick Info - Bottom Right */}
        <div className="absolute bottom-4 right-4 z-10">
          <div className="bg-black/50 backdrop-blur-lg rounded-lg p-3 border border-white/10 max-w-xs">
            <div className="text-white text-sm">
              {selectedPart ? (
                <>
                  <div className="font-semibold mb-1">{selectedPart.name}</div>
                  <div className="text-gray-300 text-xs">{selectedPart.description}</div>
                </>
              ) : (
                <div className="text-gray-300 text-xs">
                  Klik pada bagian otak untuk mempelajari fungsinya
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Info Panel */}
      <AnimatePresence>
        {selectedPart && (
          <InfoPanel 
            part={selectedPart} 
            onClose={resetView}
          />
        )}
      </AnimatePresence>

      {/* ESC Key Handler */}
      <div
        className="fixed inset-0 pointer-events-none"
        onKeyDown={(e) => {
          if (e.key === 'Escape' && selectedPart) {
            resetView();
          }
        }}
        tabIndex={-1}
      />
    </div>
  );
}