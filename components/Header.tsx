'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'glass backdrop-blur-xl py-4' : 'py-6'
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center neon-glow">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L13.09 8.26L22 9L16 14L18 22L12 19L6 22L8 14L2 9L10.91 8.26L12 2Z"/>
              </svg>
            </div>
            <span className="text-2xl font-bold text-white">3D Portfolio</span>
          </motion.div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {['Home', 'Experience', 'Upload', 'Showcase'].map((item) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                whileHover={{ scale: 1.05, color: '#3b82f6' }}
                className="text-white/80 hover:text-blue-400 transition-colors font-medium"
              >
                {item}
              </motion.a>
            ))}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary"
            >
              Get Started
            </motion.button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-white p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header
