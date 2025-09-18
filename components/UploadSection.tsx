'use client'

import { motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { useState, useCallback } from 'react'

interface UploadSectionProps {
  onModelUpload: (url: string) => void
  onModelName: (name: string) => void
}

const UploadSection: React.FC<UploadSectionProps> = ({ onModelUpload, onModelName }) => {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [progress, setProgress] = useState(0)
  const [fileName, setFileName] = useState('')

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    const validExtensions = ['.glb', '.gltf']
    const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'))
    
    if (!validExtensions.includes(fileExtension)) {
      setUploadStatus('error')
      return
    }

    setFileName(file.name)
    setUploadStatus('uploading')
    onModelName(file.name)
    
    // Simulate upload progress
    let currentProgress = 0
    const interval = setInterval(() => {
      currentProgress += Math.random() * 15 + 5
      if (currentProgress >= 100) {
        currentProgress = 100
        clearInterval(interval)
        setProgress(100)
        setUploadStatus('success')
        
        // Create object URL and pass to parent
        const url = URL.createObjectURL(file)
        onModelUpload(url)
      }
      setProgress(currentProgress)
    }, 100)
  }, [onModelUpload, onModelName])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'model/gltf-binary': ['.glb'],
      'model/gltf+json': ['.gltf']
    },
    multiple: false,
    maxSize: 500 * 1024 * 1024, // 500MB
  })

  return (
    <section id="upload" className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Upload Your Creation
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Drag and drop your GLB or GLTF files to see them come to life in our premium 3D environment
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div
            {...getRootProps()}
            className={`
              relative neon-border cursor-pointer transition-all duration-300 min-h-[400px] flex items-center justify-center
              ${isDragActive 
                ? 'neon-glow scale-105 bg-blue-500/10' 
                : 'hover:neon-glow hover:scale-102'
              }
              ${uploadStatus === 'success' ? 'border-green-500' : ''}
              ${uploadStatus === 'error' ? 'border-red-500' : ''}
            `}
          >
            <input {...getInputProps()} />
            
            <div className="text-center p-12">
              {uploadStatus === 'uploading' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  <div className="w-32 h-32 mx-auto relative">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="8"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 50}`}
                        strokeDashoffset={`${2 * Math.PI * 50 * (1 - progress / 100)}`}
                        className="transition-all duration-300"
                      />
                      <defs>
                        <linearGradient id="gradient">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#9333ea" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">{Math.round(progress)}%</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Processing {fileName}</h3>
                    <p className="text-white/70">Optimizing your model for the best experience...</p>
                  </div>
                </motion.div>
              ) : uploadStatus === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  <div className="w-20 h-20 mx-auto bg-green-500 rounded-full flex items-center justify-center neon-glow">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-green-400 mb-2">Upload Successful!</h3>
                    <p className="text-white/70">Your model is ready to view. Scroll down to see it in action.</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <div className="w-24 h-24 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center neon-glow animate-float">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  
                  {isDragActive ? (
                    <div>
                      <h3 className="text-3xl font-bold text-blue-400 mb-4">Drop it here!</h3>
                      <p className="text-xl text-white/80">Release to upload your model</p>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-3xl font-bold text-white mb-4">
                        Drop your 3D model here
                      </h3>
                      <p className="text-xl text-white/70 mb-8">
                        or click to browse your files
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn-primary text-lg px-8 py-4"
                      >
                        Choose Files
                      </motion.button>
                      <div className="mt-8 text-sm text-white/50 space-y-1">
                        <p>✓ Supports .glb and .gltf files</p>
                        <p>✓ Maximum file size: 500MB</p>
                        <p>✓ Instant preview and optimization</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default UploadSection
