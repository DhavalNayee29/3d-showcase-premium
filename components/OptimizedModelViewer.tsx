'use client'

import React, { useState, Suspense, useRef, useCallback, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls, ContactShadows } from '@react-three/drei'
import { useDropzone } from 'react-dropzone'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js'

// TypeScript Interfaces
interface ModelProps {
  url: string
  onProgress?: (progress: number) => void
  onLoad?: () => void
  onError?: (error: any) => void
}

interface ViewerState {
  modelUrl: string | null
  loading: boolean
  fileName: string
  error: string
  fileSize: string
  loadingProgress: number
  warning: string
  memoryUsage: number
}

// Memory Monitor Hook
const useMemoryMonitor = () => {
  const [memoryInfo, setMemoryInfo] = useState<any>(null)

  useEffect(() => {
    const checkMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory
        setMemoryInfo({
          used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
          total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
          limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024)
        })
      }
    }

    const interval = setInterval(checkMemory, 2000)
    checkMemory()
    return () => clearInterval(interval)
  }, [])

  return memoryInfo
}

// Premium Loading Progress Component
const LoadingProgress: React.FC<{ progress: number; fileName: string; fileSize: string }> = ({ 
  progress, fileName, fileSize 
}) => {
  return (
    <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-30 backdrop-blur-md">
      <div className="text-center text-white max-w-md mx-auto">
        {/* Animated Loading Ring */}
        <div className="relative w-40 h-40 mx-auto mb-8">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="8"
            />
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 70}`}
              strokeDashoffset={`${2 * Math.PI * 70 * (1 - progress / 100)}`}
              className="transition-all duration-300"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="50%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* Loading Info */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Loading Large Model
          </h3>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <p className="text-sm text-gray-300 mb-1">File: {fileName}</p>
            <p className="text-sm text-gray-300">Size: {fileSize}</p>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-xs text-gray-400">
            Optimizing geometry and textures...
          </p>
        </div>
      </div>
    </div>
  )
}

// Optimized Model Component with Streaming GLTFLoader
const OptimizedModel: React.FC<ModelProps> = ({ url, onProgress, onLoad, onError }) => {
  const modelRef = useRef<THREE.Group>(null)
  const [gltf, setGltf] = useState<any>(null)

  // Initialize loaders with optimization
  const loaders = useMemo(() => {
    const gltfLoader = new GLTFLoader()
    
    // Setup Draco loader for geometry compression
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')
    dracoLoader.setDecoderConfig({ type: 'js' })
    gltfLoader.setDRACOLoader(dracoLoader)

    // Setup KTX2 loader for texture compression
    const ktx2Loader = new KTX2Loader()
    ktx2Loader.setTranscoderPath('https://unpkg.com/three@0.157.0/examples/jsm/libs/basis/')
    gltfLoader.setKTX2Loader(ktx2Loader)

    return { gltfLoader, dracoLoader, ktx2Loader }
  }, [])

  useEffect(() => {
    if (!url) return

    console.log('Loading model:', url)
    setGltf(null)

    // Load with progress tracking
    loaders.gltfLoader.load(
      url,
      (gltf) => {
        console.log('Model loaded successfully:', gltf)
        
        // Memory optimization
        const scene = gltf.scene
        
        // Optimize materials and textures
        scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            // Enable frustum culling
            child.frustumCulled = true
            
            // Optimize materials
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach(material => optimizeMaterial(material))
              } else {
                optimizeMaterial(child.material)
              }
            }
          }
        })

        setGltf(gltf)
        onLoad?.()
      },
      (progress) => {
        const percentComplete = (progress.loaded / progress.total) * 100
        console.log('Loading progress:', percentComplete)
        onProgress?.(percentComplete)
      },
      (error) => {
        console.error('Error loading model:', error)
        onError?.(error)
      }
    )

    return () => {
      // Cleanup
      if (gltf) {
        gltf.scene.traverse((child: any) => {
          if (child.geometry) child.geometry.dispose()
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((mat: any) => mat.dispose())
            } else {
              child.material.dispose()
            }
          }
        })
      }
    }
  }, [url, loaders, onProgress, onLoad, onError])

  // Optimize materials
  const optimizeMaterial = (material: THREE.Material) => {
    if (material instanceof THREE.MeshStandardMaterial || 
        material instanceof THREE.MeshPhysicalMaterial) {
      // Reduce texture resolution if too high
      if (material.map && material.map.image) {
        const texture = material.map
        if (texture.image.width > 2048 || texture.image.height > 2048) {
          // Create lower resolution version
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          canvas.width = Math.min(texture.image.width, 2048)
          canvas.height = Math.min(texture.image.height, 2048)
          ctx?.drawImage(texture.image, 0, 0, canvas.width, canvas.height)
          
          const newTexture = new THREE.CanvasTexture(canvas)
          newTexture.wrapS = texture.wrapS
          newTexture.wrapT = texture.wrapT
          newTexture.minFilter = THREE.LinearMipmapLinearFilter
          newTexture.magFilter = THREE.LinearFilter
          material.map = newTexture
          texture.dispose()
        }
      }
    }
  }

  useEffect(() => {
    if (gltf && modelRef.current) {
      const scene = gltf.scene
      
      // Auto-fit model
      const box = new THREE.Box3().setFromObject(scene)
      const size = box.getSize(new THREE.Vector3())
      const center = box.getCenter(new THREE.Vector3())
      
      // Center the model
      scene.position.x = -center.x
      scene.position.y = -center.y
      scene.position.z = -center.z
      
      // Smart scaling
      const maxDimension = Math.max(size.x, size.y, size.z)
      if (maxDimension > 0) {
        const targetSize = 5
        const scale = targetSize / maxDimension
        scene.scale.setScalar(Math.min(scale, 3))
      }
      
      // Position on ground
      const scaledBox = new THREE.Box3().setFromObject(scene)
      if (scaledBox.min.y < 0) {
        scene.position.y -= scaledBox.min.y
      }
    }
  }, [gltf])

  if (!gltf) return null

  return (
    <group ref={modelRef}>
      <primitive object={gltf.scene} />
    </group>
  )
}

// Placeholder Component
const PlaceholderCube: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01
    }
  })

  return (
    <group>
      <mesh ref={meshRef} position={[0, 1, 0]} castShadow>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#667eea" metalness={0.3} roughness={0.4} />
      </mesh>
      <ContactShadows opacity={0.4} scale={10} blur={2} far={10} resolution={256} />
    </group>
  )
}

// Warning Component for Heavy Models
const ModelWarning: React.FC<{ fileSize: number; onContinue: () => void; onCancel: () => void }> = ({
  fileSize, onContinue, onCancel
}) => {
  const sizeInMB = fileSize / (1024 * 1024)
  
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-md">
      <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-3xl p-8 max-w-md mx-auto backdrop-blur-sm">
        <div className="text-center text-white">
          <div className="mb-6">
            <svg className="w-16 h-16 text-orange-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="text-2xl font-bold text-orange-400 mb-2">Large Model Detected</h3>
            <p className="text-gray-300 mb-4">
              Your model is {sizeInMB.toFixed(1)}MB. This might affect performance.
            </p>
          </div>

          <div className="bg-white/10 rounded-lg p-4 mb-6 text-left">
            <h4 className="font-semibold mb-2 text-yellow-400">💡 Optimization Tips:</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Use Blender's Decimate modifier to reduce polygons</li>
              <li>• Compress textures to 1K or 2K resolution</li>
              <li>• Export with Draco compression enabled</li>
              <li>• Remove unnecessary materials and objects</li>
              <li>• Use GLB format instead of GLTF</li>
            </ul>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={onCancel}
              className="flex-1 bg-gray-500/20 hover:bg-gray-500/30 text-white px-4 py-3 rounded-xl font-semibold transition-all"
            >
              Cancel
            </button>
            <button
              onClick={onContinue}
              className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-4 py-3 rounded-xl font-semibold transition-all"
            >
              Load Anyway
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main Optimized ModelViewer Component
const OptimizedModelViewer: React.FC = () => {
  const [state, setState] = useState<ViewerState>({
    modelUrl: null,
    loading: false,
    fileName: '',
    error: '',
    fileSize: '',
    loadingProgress: 0,
    warning: '',
    memoryUsage: 0
  })
  
  const [showWarning, setShowWarning] = useState(false)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const memoryInfo = useMemoryMonitor()

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleFileUpload = useCallback((file: File) => {
    const validExtensions = ['.glb', '.gltf']
    const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'))
    
    if (!validExtensions.includes(fileExtension)) {
      setState(prev => ({ 
        ...prev, 
        error: 'Invalid file format. Please upload .glb or .gltf files only.',
        loading: false 
      }))
      return
    }

    const fileSizeInMB = file.size / (1024 * 1024)
    
    // Show warning for files larger than 100MB
    if (fileSizeInMB > 100) {
      setPendingFile(file)
      setShowWarning(true)
      return
    }

    processFile(file)
  }, [])

  const processFile = useCallback((file: File) => {
    if (state.modelUrl) {
      URL.revokeObjectURL(state.modelUrl)
    }

    setState(prev => ({ 
      ...prev, 
      loading: true, 
      error: '',
      warning: '',
      fileName: file.name,
      fileSize: formatFileSize(file.size),
      loadingProgress: 0
    }))

    const url = URL.createObjectURL(file)
    
    // Delay setting model URL to allow loading state to show
    setTimeout(() => {
      setState(prev => ({ ...prev, modelUrl: url }))
    }, 100)
  }, [state.modelUrl])

  const handleWarningContinue = () => {
    if (pendingFile) {
      processFile(pendingFile)
      setPendingFile(null)
    }
    setShowWarning(false)
  }

  const handleWarningCancel = () => {
    setPendingFile(null)
    setShowWarning(false)
  }

  const handleProgress = useCallback((progress: number) => {
    setState(prev => ({ ...prev, loadingProgress: progress }))
  }, [])

  const handleLoad = useCallback(() => {
    setState(prev => ({ ...prev, loading: false, loadingProgress: 100 }))
  }, [])

  const handleError = useCallback((error: any) => {
    setState(prev => ({ 
      ...prev, 
      loading: false, 
      error: 'Failed to load model. Please check the file format and try again.',
      modelUrl: null
    }))
    console.error('Model loading error:', error)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        handleFileUpload(acceptedFiles[0])
      }
    },
    accept: {
      'model/gltf-binary': ['.glb'],
      'model/gltf+json': ['.gltf']
    },
    multiple: false,
    maxSize: 500 * 1024 * 1024, // 500MB limit
  })

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
    event.target.value = ''
  }

  const handleReset = () => {
    if (state.modelUrl) {
      URL.revokeObjectURL(state.modelUrl)
    }
    setState({
      modelUrl: null,
      loading: false,
      fileName: '',
      error: '',
      fileSize: '',
      loadingProgress: 0,
      warning: '',
      memoryUsage: 0
    })
  }

  useEffect(() => {
    return () => {
      if (state.modelUrl) {
        URL.revokeObjectURL(state.modelUrl)
      }
    }
  }, [state.modelUrl])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Warning Modal */}
        {showWarning && pendingFile && (
          <ModelWarning 
            fileSize={pendingFile.size}
            onContinue={handleWarningContinue}
            onCancel={handleWarningCancel}
          />
        )}
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-7xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
            Optimized 3D Viewer
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto">
            Load massive 3D models up to 500MB with advanced optimization
          </p>
          
          {/* Memory Usage Display */}
          {memoryInfo && (
            <div className="mt-4 inline-block bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
              <p className="text-sm text-gray-300">
                Memory: {memoryInfo.used}MB / {memoryInfo.limit}MB 
                ({Math.round((memoryInfo.used / memoryInfo.limit) * 100)}%)
              </p>
            </div>
          )}
        </div>

        {/* Upload Section */}
        <div className="mb-10">
          <div
            {...getRootProps()}
            className={`
              relative overflow-hidden rounded-3xl p-8 md:p-16 cursor-pointer transition-all duration-300
              ${isDragActive 
                ? 'bg-blue-500/30 border-2 border-dashed border-blue-400 scale-105' 
                : 'bg-white/5 hover:bg-white/10 border border-white/20'
              } 
              backdrop-blur-2xl
            `}
          >
            <input {...getInputProps()} />
            <div className="text-center text-white">
              <div className="mb-8">
                <svg className="w-20 h-20 mx-auto mb-6 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              
              <h3 className="text-3xl font-bold mb-6">Upload Optimized Models</h3>
              <p className="text-xl text-gray-300 mb-8">
                Supports Draco compression & KTX2 textures for faster loading
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button 
                  type="button"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-110"
                >
                  Choose Large Files
                </button>
                <input
                  type="file"
                  accept=".glb,.gltf"
                  onChange={handleFileInput}
                  className="hidden"
                  id="file-upload-input"
                />
                <label 
                  htmlFor="file-upload-input" 
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-semibold cursor-pointer transition-all"
                >
                  Browse Files
                </label>
              </div>
              
              <div className="mt-6 text-sm text-gray-400">
                <p>✓ Up to 500MB • ✓ Draco & KTX2 optimized • ✓ Memory efficient</p>
              </div>
            </div>
          </div>

          {/* File Status */}
          {state.fileName && (
            <div className="mt-6 p-6 bg-green-500/20 border border-green-500/30 rounded-2xl backdrop-blur-sm">
              <div className="text-center text-white">
                <p className="font-bold text-lg">{state.fileName}</p>
                <p className="text-green-300">Size: {state.fileSize}</p>
                {state.loading && (
                  <p className="text-blue-300 mt-2">Loading: {Math.round(state.loadingProgress)}%</p>
                )}
              </div>
            </div>
          )}
          
          {state.error && (
            <div className="mt-6 p-6 bg-red-500/20 border border-red-500/30 rounded-2xl backdrop-blur-sm">
              <p className="text-red-300 text-center">{state.error}</p>
            </div>
          )}
        </div>

        {/* 3D Viewer */}
        <div className="relative">
          <div className="bg-white/5 backdrop-blur-2xl rounded-3xl overflow-hidden border border-white/10">
            <div className="relative w-full h-[90vh]">
              
              {/* Loading Overlay */}
              {state.loading && (
                <LoadingProgress 
                  progress={state.loadingProgress} 
                  fileName={state.fileName}
                  fileSize={state.fileSize}
                />
              )}
              
              {/* Optimized 3D Canvas */}
              <Canvas
                camera={{ 
                  position: [0, 5, 15], 
                  fov: 60,
                  near: 0.1,
                  far: 1000
                }}
                className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
                shadows
                gl={{ 
                  antialias: true, 
                  alpha: true,
                  powerPreference: "high-performance",
                  stencil: false,
                  depth: true
                }}
                onCreated={({ gl }) => {
                  // Optimize renderer for large models
                  gl.setClearColor('#0f0f23', 1)
                  gl.shadowMap.enabled = true
                  gl.shadowMap.type = THREE.PCFSoftShadowMap
                }}
              >
                {/* Optimized Lighting */}
                <ambientLight intensity={0.6} />
                <directionalLight 
                  position={[20, 20, 10]} 
                  intensity={1.2} 
                  castShadow 
                  shadow-mapSize-width={2048}
                  shadow-mapSize-height={2048}
                />
                <pointLight position={[0, 10, 0]} intensity={0.8} />
                
                <Suspense fallback={null}>
                  {state.modelUrl ? (
                    <OptimizedModel 
                      url={state.modelUrl} 
                      onProgress={handleProgress}
                      onLoad={handleLoad}
                      onError={handleError}
                    />
                  ) : (
                    <PlaceholderCube />
                  )}
                </Suspense>
                
                <OrbitControls 
                  enableZoom={true} 
                  enablePan={true} 
                  enableRotate={true}
                  autoRotate={!state.modelUrl}
                  autoRotateSpeed={0.5}
                  minDistance={1}
                  maxDistance={100}
                  enableDamping
                  dampingFactor={0.05}
                />
              </Canvas>

              {/* Control Buttons */}
              <div className="absolute top-6 right-6 flex flex-col space-y-3">
                {state.modelUrl && (
                  <button
                    onClick={handleReset}
                    className="bg-red-500/20 hover:bg-red-500/30 backdrop-blur-md text-white p-4 rounded-2xl transition-all"
                    title="Reset Viewer"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Instructions */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-black/40 backdrop-blur-md text-white text-sm py-4 px-6 rounded-2xl">
                  <div className="text-center">
                    <p className="font-medium">
                      🖱️ Drag to rotate • 🖱️ Right-click to pan • 🖱️ Scroll to zoom
                    </p>
                    {state.modelUrl && (
                      <p className="text-xs text-gray-400 mt-2">
                        Optimized model loaded • {state.fileSize}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OptimizedModelViewer
