'use client'

import { SplitScreenLayout } from '@/components/layout/SplitScreenLayout'
import { Header } from '@/components/layout/Header'
import { StatusBar } from '@/components/layout/StatusBar'

export default function EditorPage() {
  const leftPanel = (
    <div className="flex h-full flex-col">
      <div className="border-b border-border p-4">
        <h2 className="text-lg font-semibold">BatchUpdate Operations</h2>
      </div>
      <div className="flex-1 p-4">
        <p className="text-sm text-muted-foreground">
          Add and configure Google Slides API operations here.
        </p>
      </div>
    </div>
  )

  const rightPanel = (
    <div className="flex h-full flex-col">
      <div className="border-b border-border p-4">
        <h2 className="text-lg font-semibold">Preview</h2>
      </div>
      <div className="flex-1 bg-muted/20 p-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <pre className="text-xs">
            <code>{JSON.stringify({ requests: [] }, null, 2)}</code>
          </pre>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex-1">
        <SplitScreenLayout leftPanel={leftPanel} rightPanel={rightPanel} />
      </div>
      <StatusBar />
    </div>
  )
}