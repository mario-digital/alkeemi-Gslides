import { FileJson, Download, Upload, Sparkles, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HeaderProps {
  onImport?: () => void
  onExport?: () => void
}

export function Header({ onImport, onExport }: HeaderProps) {
  return (
    <header className={cn(
      "relative h-14 flex items-center justify-between px-6",
      "backdrop-blur-2xl bg-black/80",
      "border-b border-cyan-500/20",
      "shadow-[0_2px_20px_rgba(6,255,165,0.1)]"
    )}>
      {/* Animated gradient line at top */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50 animate-pulse" />
      
      <div className="flex items-center gap-3">
        {/* Logo with glow effect */}
        <div className="relative">
          <div className="absolute inset-0 bg-cyan-500/30 blur-xl rounded-full" />
          <div className={cn(
            "relative p-2 rounded-lg",
            "bg-gradient-to-br from-cyan-500/20 to-purple-500/20",
            "border border-cyan-500/30"
          )}>
            <Sparkles className="h-5 w-5 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,255,165,0.8)]" />
          </div>
        </div>
        
        {/* Title with gradient text */}
        <div className="flex flex-col">
          <h1 className={cn(
            "text-lg font-bold",
            "bg-gradient-to-r from-cyan-400 via-emerald-400 to-purple-400",
            "bg-clip-text text-transparent",
            "drop-shadow-[0_0_20px_rgba(6,255,165,0.5)]"
          )}>
            BatchUpdate Editor
          </h1>
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
            Google Slides API
          </span>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-2 ml-6 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
          <Activity className="h-3 w-3 text-emerald-400 animate-pulse" />
          <span className="text-xs text-emerald-400 font-medium">Ready</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Import Button */}
        <button 
          onClick={onImport}
          className={cn(
            "group relative px-4 py-2 rounded-lg",
            "bg-black/40 backdrop-blur-xl",
            "border border-cyan-500/30",
            "transition-all duration-300",
            "hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(6,255,165,0.3)]",
            "active:scale-95"
          )}
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-emerald-500/10 to-purple-500/10" />
          </div>
          <div className="relative flex items-center gap-2">
            <Upload className="h-4 w-4 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
            <span className="text-sm font-medium text-zinc-300 group-hover:text-zinc-100 transition-colors">
              Import
            </span>
          </div>
        </button>

        {/* Export Button */}
        <button 
          onClick={onExport}
          className={cn(
            "group relative px-4 py-2 rounded-lg",
            "bg-black/40 backdrop-blur-xl",
            "border border-purple-500/30",
            "transition-all duration-300",
            "hover:border-purple-400/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]",
            "active:scale-95"
          )}
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-cyan-500/10" />
          </div>
          <div className="relative flex items-center gap-2">
            <Download className="h-4 w-4 text-purple-400 group-hover:text-purple-300 transition-colors" />
            <span className="text-sm font-medium text-zinc-300 group-hover:text-zinc-100 transition-colors">
              Export
            </span>
          </div>
        </button>
      </div>

      {/* Bottom glow effect */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
    </header>
  )
}