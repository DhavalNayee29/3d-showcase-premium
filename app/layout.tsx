import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Premium 3D Portfolio | Interactive Model Showcase',
  description: 'Experience cutting-edge 3D model visualization with our premium interactive portfolio platform. Upload and showcase your GLB/GLTF models in stunning detail.',
  keywords: '3D portfolio, model viewer, GLB GLTF, interactive showcase, premium design',
  openGraph: {
    title: 'Premium 3D Portfolio',
    description: 'Interactive 3D model showcase platform',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
