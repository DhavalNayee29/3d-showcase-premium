'use client'

import { motion } from 'framer-motion'

const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
            className="inline-block glass-card px-6 py-3 mb-8 neon-border"
          >
            <span className="text-white/90 font-medium flex items-center space-x-2">
              <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              <span>Premium 3D Experience</span>
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-tight"
          >
            Showcase Your
            <motion.span 
              initial={{ backgroundPosition: '0% 50%' }}
              animate={{ backgroundPosition: '100% 50%' }}
              transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
              className="block bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent bg-300% animate-glow-pulse"
            >
              3D Creations
            </motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-xl md:text-2xl text-white/70 mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            Upload, visualize, and present your GLB/GLTF models in a stunning interactive environment. 
            <span className="text-blue-400"> Experience the future of 3D portfolio presentation.</span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary text-lg px-8 py-4 neon-glow"
              onClick={() => document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Upload Your Model
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="glass-card text-white px-8 py-4 text-lg font-semibold hover:bg-white/15 transition-all"
            >
              View Demo
            </motion.button>
          </motion.div>

          {/* Feature Highlights */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="mt-16 flex flex-wrap justify-center gap-8 text-white/60"
          >
            {[
              { icon: '🚀', text: 'Instant Upload' },
              { icon: '🎮', text: 'Interactive Controls' },
              { icon: '💎', text: 'Premium Quality' },
            ].map((item, index) => (
              <motion.div 
                key={index}
                whileHover={{ scale: 1.05, color: '#3b82f6' }}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="font-medium">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
