import { FileJson, Download, Upload } from 'lucide-react'

export function Header() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center gap-2">
        <FileJson className="h-5 w-5 text-primary" />
        <h1 className="text-lg font-semibold">Google Slides BatchUpdate Editor</h1>
      </div>
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground transition-colors">
          <Upload className="h-4 w-4" />
          Import
        </button>
        <button className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground transition-colors">
          <Download className="h-4 w-4" />
          Export
        </button>
      </div>
    </header>
  )
}