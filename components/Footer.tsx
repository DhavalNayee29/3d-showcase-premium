'use client'

import { motion } from 'framer-motion'

const Footer = () => {
  return (
    <footer className="py-16 relative border-t border-white/10">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12"
        >
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center neon-glow">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L13.09 8.26L22 9L16 14L18 22L12 19L6 22L8 14L2 9L10.91 8.26L12 2Z"/>
                </svg>
              </div>
              <span className="text-2xl font-bold text-white">3D Portfolio</span>
            </div>
            <p className="text-white/70 leading-relaxed max-w-sm">
              The premier platform for showcasing 3D models with professional-grade visualization 
              and immersive interactive experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-6 text-lg">Quick Links</h4>
            <ul className="space-y-4">
              {[
                { name: 'Home', href: '#home' },
                { name: 'Experience', href: '#experience' },
                { name: 'Upload', href: '#upload' },
                { name: 'Showcase', href: '#showcase' },
              ].map((link) => (
                <li key={link.name}>
                  <motion.a
                    href={link.href}
                    whileHover={{ x: 5, color: '#3b82f6' }}
                    className="text-white/70 hover:text-blue-400 transition-colors"
                  >
                    {link.name}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-white font-semibold mb-6 text-lg">Connect</h4>
            <div className="flex space-x-4">
              {[
                { name: 'GitHub', icon: '📱' },
                { name: 'Twitter', icon: '🐦' },
                { name: 'LinkedIn', icon: '💼' },
                { name: 'Discord', icon: '🎮' },
              ].map((social) => (
                <motion.button
                  key={social.name}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 glass-card flex items-center justify-center text-2xl hover:neon-glow transition-all"
                >
                  {social.icon}
                </motion.button>
              ))}
            </div>
            <div className="mt-6">
              <p className="text-white/60 text-sm">hello@3dportfolio.com</p>
            </div>
          </div>
        </motion.div>

        {/* Bottom */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-white/60 text-sm">
            © 2025 3D Portfolio. Crafted with Next.js & Three.js
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <span className="text-white/40 text-xs">Built with</span>
            <div className="flex items-center space-x-2">
              <span className="text-blue-400 text-sm font-medium">Next.js</span>
              <span className="text-white/40">•</span>
              <span className="text-purple-400 text-sm font-medium">Three.js</span>
              <span className="text-white/40">•</span>
              <span className="text-cyan-400 text-sm font-medium">Tailwind</span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer
