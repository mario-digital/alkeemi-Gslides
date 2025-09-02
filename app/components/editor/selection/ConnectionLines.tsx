'use client'

import { useEffect, useRef, useState } from 'react'
import { useBatchUpdateStore } from '@/stores/batchUpdateStore'

export function ConnectionLines() {
  const svgRef = useRef<SVGSVGElement>(null)
  const { selectedOperationId, selectedElementId } = useBatchUpdateStore()
  const [linePath, setLinePath] = useState<string | null>(null)

  useEffect(() => {
    if (!selectedOperationId || !selectedElementId) {
      setLinePath(null)
      return
    }

    const operationElement = document.querySelector(`[data-operation-id="${selectedOperationId}"]`)
    const previewElement = document.querySelector(`[data-element-id="${selectedElementId}"]`)

    if (!operationElement || !previewElement || !svgRef.current) return

    const svg = svgRef.current
    const svgRect = svg.getBoundingClientRect()
    const opRect = operationElement.getBoundingClientRect()
    const prevRect = previewElement.getBoundingClientRect()

    const startX = opRect.right - svgRect.left
    const startY = opRect.top + opRect.height / 2 - svgRect.top
    const endX = prevRect.left - svgRect.left
    const endY = prevRect.top + prevRect.height / 2 - svgRect.top

    const midX = (startX + endX) / 2
    const path = `M ${startX} ${startY} Q ${midX} ${startY}, ${midX} ${(startY + endY) / 2} T ${endX} ${endY}`

    setLinePath(path)
  }, [selectedOperationId, selectedElementId])

  return (
    <svg
      ref={svgRef}
      className="pointer-events-none fixed inset-0 z-50"
      style={{ width: '100vw', height: '100vh' }}
    >
      {linePath && (
        <g>
          <path
            d={linePath}
            stroke="rgba(0, 255, 255, 0.3)"
            strokeWidth="3"
            fill="none"
            filter="url(#glow)"
          />
          <path
            d={linePath}
            stroke="rgba(0, 255, 255, 0.8)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="5 5"
            className="animate-dash"
          />
        </g>
      )}
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <style jsx>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -10;
          }
        }
        
        .animate-dash {
          animation: dash 0.5s linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-dash {
            animation: none;
          }
        }
      `}</style>
    </svg>
  )
}