export function StatusBar() {
  return (
    <footer className="flex h-8 items-center justify-between border-t border-border bg-card px-4 text-xs text-muted-foreground">
      <div className="flex items-center gap-4">
        <span>Ready</span>
        <span className="h-2 w-2 rounded-full bg-green-500"></span>
      </div>
      <div className="flex items-center gap-4">
        <span>0 operations</span>
        <span>Valid JSON</span>
      </div>
    </footer>
  )
}