'use client'

import { useEffect, useState } from 'react'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'

interface SplitScreenLayoutProps {
  leftPanel: React.ReactNode
  rightPanel: React.ReactNode
}

export function SplitScreenLayout({ leftPanel, rightPanel }: SplitScreenLayoutProps) {
  const [isClient, setIsClient] = useState(false)
  const [sizes, setSizes] = useState<number[]>([50, 50])

  useEffect(() => {
    setIsClient(true)
    const savedSizes = localStorage.getItem('panelSizes')
    if (savedSizes) {
      setSizes(JSON.parse(savedSizes))
    }
  }, [])

  const handleResize = (newSizes: number[]) => {
    setSizes(newSizes)
    localStorage.setItem('panelSizes', JSON.stringify(newSizes))
  }

  if (!isClient) {
    return (
      <div className="flex h-screen">
        <div className="w-1/2 border-r border-border">{leftPanel}</div>
        <div className="w-1/2">{rightPanel}</div>
      </div>
    )
  }

  return (
    <ResizablePanelGroup
      direction="horizontal"
      onLayout={handleResize}
      className="h-screen"
    >
      <ResizablePanel defaultSize={sizes[0]} minSize={30}>
        <div className="h-full overflow-auto">{leftPanel}</div>
      </ResizablePanel>
      <ResizableHandle withHandle className="bg-border hover:bg-primary/20 transition-colors" />
      <ResizablePanel defaultSize={sizes[1]} minSize={30}>
        <div className="h-full overflow-auto">{rightPanel}</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}