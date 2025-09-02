'use client'

import * as React from 'react'
import Editor, { type Monaco } from '@monaco-editor/react'
import { cn } from '@/lib/utils'

const customDarkTheme = {
  base: 'vs-dark' as const,
  inherit: true,
  rules: [
    { token: 'string.key.json', foreground: 'a855f7' },
    { token: 'string.value.json', foreground: '06ffa5' },
    { token: 'number', foreground: '22d3ee' },
    { token: 'keyword', foreground: 'a855f7' },
    { token: 'comment', foreground: '64748b' },
    { token: 'delimiter.bracket.json', foreground: 'f8fafc' },
    { token: 'delimiter.comma.json', foreground: 'f8fafc' },
  ],
  colors: {
    'editor.background': '#16213e',
    'editor.foreground': '#f8fafc',
    'editor.selectionBackground': '#a855f740',
    'editor.lineHighlightBackground': '#1a1a2e40',
    'editorCursor.foreground': '#a855f7',
    'editorWhitespace.foreground': '#64748b40',
    'editorIndentGuide.background': '#64748b30',
    'editorIndentGuide.activeBackground': '#a855f750',
    'editor.selectionHighlightBackground': '#a855f730',
    'editor.wordHighlightBackground': '#a855f720',
    'editor.wordHighlightStrongBackground': '#a855f730',
    'editor.findMatchBackground': '#06ffa530',
    'editor.findMatchHighlightBackground': '#06ffa520',
    'editorBracketMatch.background': '#a855f730',
    'editorBracketMatch.border': '#a855f7',
  },
}

export interface JsonEditorProps {
  value?: string
  onChange?: (value: string | undefined) => void
  height?: string | number
  variant?: 'full' | 'inline' | 'readonly'
  state?: 'default' | 'focus' | 'error' | 'success'
  className?: string
  options?: any
}

const JsonEditor = React.forwardRef<HTMLDivElement, JsonEditorProps>(
  ({ 
    value, 
    onChange, 
    height = 400,
    variant = 'full',
    state = 'default',
    className,
    options = {},
    ...props 
  }, ref) => {
    const handleEditorWillMount = (monaco: Monaco) => {
      monaco.editor.defineTheme('alkeemi-dark', customDarkTheme)
    }
    
    const handleEditorDidMount = (editor: any, monaco: Monaco) => {
      monaco.editor.setTheme('alkeemi-dark')
      
      // Configure JSON language settings
      monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        schemaValidation: 'error',
        comments: 'error',
        trailingCommas: 'error',
        allowComments: false,
      })
      
      // Add focus state handling
      editor.onDidFocusEditorText(() => {
        const container = editor.getContainerDomNode()
        container?.classList.add('editor-focused')
      })
      
      editor.onDidBlurEditorText(() => {
        const container = editor.getContainerDomNode()
        container?.classList.remove('editor-focused')
      })
    }
    
    const defaultOptions = {
      minimap: { enabled: variant === 'full' },
      fontSize: 13,
      fontFamily: 'JetBrains Mono, monospace',
      fontLigatures: true,
      wordWrap: 'on',
      lineNumbers: variant === 'inline' ? 'off' : 'on',
      renderLineHighlight: variant === 'readonly' ? 'none' : 'all',
      scrollBeyondLastLine: false,
      readOnly: variant === 'readonly',
      domReadOnly: variant === 'readonly',
      cursorBlinking: 'smooth',
      smoothScrolling: true,
      padding: { top: 16, bottom: 16 },
      bracketPairColorization: {
        enabled: true,
      },
      'bracketPairColorization.enabled': true,
      ...options,
    }
    
    return (
      <div
        ref={ref}
        className={cn(
          'relative overflow-hidden rounded-glass transition-all duration-200',
          'bg-bg-tertiary/80 backdrop-blur-glass',
          state === 'default' && 'border border-primary-neon/20',
          state === 'focus' && 'border border-primary-neon/50 shadow-glow',
          state === 'error' && 'border border-error/50 shadow-glow-error',
          state === 'success' && 'border border-success/50 shadow-glow-success',
          '[&_.editor-focused]:border-primary-neon [&_.editor-focused]:shadow-glow',
          className
        )}
        {...props}
      >
        <Editor
          height={height}
          defaultLanguage="json"
          language="json"
          value={value}
          onChange={onChange}
          theme="alkeemi-dark"
          beforeMount={handleEditorWillMount}
          onMount={handleEditorDidMount}
          options={defaultOptions}
        />
      </div>
    )
  }
)
JsonEditor.displayName = 'JsonEditor'

export { JsonEditor }