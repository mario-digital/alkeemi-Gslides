'use client'

import { useEffect } from 'react'
import { useBatchUpdateStore } from '@/stores/batchUpdateStore'

interface SelectionManagerProps {
  children: React.ReactNode
}

export function SelectionManager({ children }: SelectionManagerProps) {
  const { 
    selectedOperationId, 
    selectedElementId,
    syncSelection 
  } = useBatchUpdateStore()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        syncSelection('operation', null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [syncSelection])

  useEffect(() => {
    if (selectedOperationId) {
      const element = document.querySelector(`[data-operation-id="${selectedOperationId}"]`)
      element?.classList.add('selected-cyan-glow')
      
      return () => {
        element?.classList.remove('selected-cyan-glow')
      }
    }
  }, [selectedOperationId])

  useEffect(() => {
    if (selectedElementId) {
      const element = document.querySelector(`[data-element-id="${selectedElementId}"]`)
      element?.classList.add('selected-cyan-glow')
      
      return () => {
        element?.classList.remove('selected-cyan-glow')
      }
    }
  }, [selectedElementId])

  return (
    <div className="selection-manager">
      {children}
      <style jsx global>{`
        .selected-cyan-glow {
          position: relative;
          animation: cyan-glow 2s ease-in-out infinite;
        }

        @keyframes cyan-glow {
          0%, 100% {
            box-shadow: 0 0 10px rgba(0, 255, 255, 0.5),
                        0 0 20px rgba(0, 255, 255, 0.3),
                        0 0 30px rgba(0, 255, 255, 0.1);
          }
          50% {
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.8),
                        0 0 30px rgba(0, 255, 255, 0.5),
                        0 0 40px rgba(0, 255, 255, 0.3);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .selected-cyan-glow {
            animation: none;
            box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
          }
        }
      `}</style>
    </div>
  )
}