'use client'

import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import UploadSection from '@/components/UploadSection'
import ModelViewer from '@/components/ModelViewer'
import Footer from '@/components/Footer'
import { useState } from 'react'

export default function Home() {
  const [modelUrl, setModelUrl] = useState<string | null>(null)
  const [modelName, setModelName] = useState<string>('')

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen"
    >
      <Header />
      <main>
        <Hero />
        <Features />
        <UploadSection onModelUpload={setModelUrl} onModelName={setModelName} />
        <ModelViewer modelUrl={modelUrl} modelName={modelName} />
      </main>
      <Footer />
    </motion.div>
  )
}
