'use client'

import React from 'react'
import { motion } from 'framer-motion'

const tools = [
  {
    step: "01",
    title: "Upload Your Model",
    description: "Drag & drop your .glb or .gltf files directly into the browser. Support for files up to 500MB.",
    icon: "📁"
  },
  {
    step: "02", 
    title: "Automatic Processing",
    description: "Our system automatically optimizes your model for web viewing with advanced compression.",
    icon: "⚙️"
  },
  {
    step: "03",
    title: "Interactive Review",
    description: "Use orbit controls, lighting adjustments, and VR mode to thoroughly review your model.",
    icon: "🎯"
  }
]

const Tools: React.FC = () => {
  return (
    <section id="tools" className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            How It Works
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Simple three-step process to get your 3D models ready for professional review
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {tools.map((tool, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="relative"
            >
              {/* Step Number */}
              <div className="glassmorphism w-20 h-20 rounded-2xl flex items-center justify-center mb-8 text-3xl font-bold text-white">
                {tool.step}
              </div>

              {/* Content */}
              <div className="glassmorphism p-8">
                <div className="text-4xl mb-4">{tool.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {tool.title}
                </h3>
                <p className="text-white/70 leading-relaxed">
                  {tool.description}
                </p>
              </div>

              {/* Connector Line */}
              {index < tools.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-full w-12 h-0.5 bg-gradient-to-r from-white/20 to-transparent transform translate-x-4"></div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Tools
