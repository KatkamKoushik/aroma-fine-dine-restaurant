'use client'
import { ReactLenis } from '@studio-freight/react-lenis'
import React from 'react'

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.05, duration: 1.2, smoothWheel: true, wheelMultiplier: 1, touchMultiplier: 2 }}>
      {/* @ts-ignore */}
      {children}
    </ReactLenis>
  )
}
