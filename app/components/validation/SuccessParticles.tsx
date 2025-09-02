'use client'

import { useEffect, useState } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
}

interface SuccessParticlesProps {
  trigger: boolean
  x?: number
  y?: number
  onComplete?: () => void
}

export function SuccessParticles({ 
  trigger, 
  x = window.innerWidth / 2, 
  y = window.innerHeight / 2,
  onComplete 
}: SuccessParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([])
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (!trigger || isAnimating) return

    const colors = ['#10b981', '#22d3ee', '#3b82f6', '#8b5cf6']
    const newParticles: Particle[] = []

    for (let i = 0; i < 20; i++) {
      const angle = (Math.PI * 2 * i) / 20 + Math.random() * 0.5
      const velocity = 3 + Math.random() * 5
      
      newParticles.push({
        id: Date.now() + i,
        x,
        y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        size: 4 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)]
      })
    }

    setParticles(newParticles)
    setIsAnimating(true)

    const timeout = setTimeout(() => {
      setParticles([])
      setIsAnimating(false)
      onComplete?.()
    }, 1000)

    return () => clearTimeout(timeout)
  }, [trigger, x, y, isAnimating, onComplete])

  if (particles.length === 0) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-particle-fade"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            borderRadius: '50%',
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            transform: `translate(${particle.vx * 20}px, ${particle.vy * 20}px)`,
          }}
        />
      ))}
      
      <style jsx>{`
        @keyframes particle-fade {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(var(--tx, 0), var(--ty, 0)) scale(0.5);
          }
        }
        
        .animate-particle-fade {
          animation: particle-fade 1s ease-out forwards;
          --tx: calc(var(--vx, 0) * 100px);
          --ty: calc(var(--vy, 0) * 100px);
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-particle-fade {
            animation: none;
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}