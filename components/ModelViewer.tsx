'use client'

import React, { Suspense, useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF, ContactShadows, Environment } from '@react-three/drei'
import { motion } from 'framer-motion'
import * as THREE from 'three'

interface ModelViewerProps {
  modelUrl: string | null
  modelName: string
}

const Model: React.FC<{ url: string }> = ({ url }) => {
  const { scene } = useGLTF(url)
  const modelRef = useRef<THREE.Group>(null)

  useEffect(() => {
    if (scene && modelRef.current) {
      // Auto-fit model to scene
      const box = new THREE.Box3().setFromObject(scene)
      const size = box.getSize(new THREE.Vector3())
      const center = box.getCenter(new THREE.Vector3())
      
      // Center the model
      scene.position.x = -center.x
      scene.position.y = -center.y
      scene.position.z = -center.z
      
      // Scale to fit
      const maxDimension = Math.max(size.x, size.y, size.z)
      if (maxDimension > 0) {
        const targetSize = 3
        const scale = targetSize / maxDimension
        scene.scale.setScalar(Math.min(scale, 2))
      }
      
      // Position on ground
      const scaledBox = new THREE.Box3().setFromObject(scene)
      if (scaledBox.min.y < 0) {
        scene.position.y -= scaledBox.min.y
      }
    }
  }, [scene])

  return (
    <group ref={modelRef}>
      <primitive object={scene} />
    </group>
  )
}

const PlaceholderModel: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1
    }
  })

  return (
    <group>
      <mesh ref={meshRef} position={[0, 1, 0]} castShadow receiveShadow>
        <dodecahedronGeometry args={[1, 2]} />
        <meshStandardMaterial 
          color="#3b82f6" 
          metalness={0.8}
          roughness={0.2}
          emissive="#1e40af"
          emissiveIntensity={0.1}
        />
      </mesh>
      <ContactShadows 
        opacity={0.6} 
        scale={8} 
        blur={3} 
        far={8} 
        resolution={512} 
        color="#000000" 
      />
    </group>
  )
}

const ModelViewer: React.FC<ModelViewerProps> = ({ modelUrl, modelName }) => {
  return (
    <section id="showcase" className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Interactive Showcase
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            {modelUrl ? `Now viewing: ${modelName}` : 'Your uploaded models will appear here in all their glory'}
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="neon-border bg-black/20 overflow-hidden"
        >
          <div className="relative w-full h-[70vh] md:h-[80vh]">
            <Canvas
              camera={{ position: [0, 3, 8], fov: 50 }}
              shadows
              gl={{ 
                antialias: true, 
                alpha: true,
                powerPreference: "high-performance" 
              }}
            >
              {/* Advanced Lighting Setup */}
              <ambientLight intensity={0.3} />
              <directionalLight 
                position={[10, 10, 5]} 
                intensity={1.5} 
                castShadow 
                shadow-mapSize-width={4096}
                shadow-mapSize-height={4096}
                shadow-camera-far={50}
                shadow-camera-left={-10}
                shadow-camera-right={10}
                shadow-camera-top={10}
                shadow-camera-bottom={-10}
              />
              <pointLight position={[0, 5, 0]} intensity={0.8} />
              <spotLight 
                position={[5, 10, 5]} 
                angle={0.3} 
                penumbra={1} 
                intensity={0.6} 
                castShadow 
              />
              
              {/* Environment for reflections */}
              <Environment preset="studio" />
              
              <Suspense fallback={null}>
                {modelUrl ? (
                  <Model url={modelUrl} />
                ) : (
                  <PlaceholderModel />
                )}
              </Suspense>
              
              <OrbitControls 
                enableZoom={true} 
                enablePan={true} 
                enableRotate={true}
                autoRotate={!modelUrl}
                autoRotateSpeed={0.5}
                minDistance={2}
                maxDistance={20}
                enableDamping
                dampingFactor={0.05}
                minPolarAngle={0}
                maxPolarAngle={Math.PI}
              />
            </Canvas>

            {/* Control Panel */}
            <div className="absolute top-6 right-6 space-y-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="glass-card text-white p-3 hover:bg-white/20 transition-all neon-glow"
                onClick={() => {
                  const canvas = document.querySelector('canvas')
                  if (canvas) canvas.requestFullscreen()
                }}
                title="Fullscreen"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </motion.button>
            </div>

            {/* Instructions */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="glass-card text-white text-sm py-4 px-6 text-center">
                <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-6">
                  <span className="flex items-center space-x-2">
                    <span>🖱️</span>
                    <span><span className="text-blue-400">Drag</span> to rotate</span>
                  </span>
                  <span className="flex items-center space-x-2">
                    <span>⚡</span>
                    <span><span className="text-purple-400">Scroll</span> to zoom</span>
                  </span>
                  <span className="flex items-center space-x-2">
                    <span>🎮</span>
                    <span><span className="text-cyan-400">Right-click</span> to pan</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default ModelViewer
