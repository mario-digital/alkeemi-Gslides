'use client'

import React, { useState, useRef, useEffect, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { GlassPanel } from '@/components/ui/glass-panel'

interface AutoCompleteFieldProps {
  value: string
  onChange: (value: string) => void
  suggestions?: string[]
  recentItems?: string[]
  placeholder?: string
  label?: string
  className?: string
  fuzzySearch?: boolean
}

function fuzzyMatch(query: string, target: string): boolean {
  const queryLower = query.toLowerCase()
  const targetLower = target.toLowerCase()
  
  // Direct substring match
  if (targetLower.includes(queryLower)) return true
  
  // Fuzzy character matching
  let queryIndex = 0
  for (let i = 0; i < targetLower.length && queryIndex < queryLower.length; i++) {
    if (targetLower[i] === queryLower[queryIndex]) {
      queryIndex++
    }
  }
  
  return queryIndex === queryLower.length
}

export function AutoCompleteField({
  value,
  onChange,
  suggestions = [],
  recentItems = [],
  placeholder = 'Start typing...',
  label,
  className = '',
  fuzzySearch = true
}: AutoCompleteFieldProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const filteredSuggestions = useMemo(() => {
    if (!value) {
      return recentItems.length > 0 ? recentItems : suggestions.slice(0, 5)
    }
    
    const matchFn = fuzzySearch ? 
      (item: string) => fuzzyMatch(value, item) :
      (item: string) => item.toLowerCase().includes(value.toLowerCase())
    
    const filtered = suggestions.filter(matchFn)
    const recent = recentItems.filter(matchFn)
    
    // Combine recent items first, then other suggestions
    const combined = [...new Set([...recent, ...filtered])]
    return combined.slice(0, 10)
  }, [value, suggestions, recentItems, fuzzySearch])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        inputRef.current && 
        !inputRef.current.contains(e.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen && e.key === 'ArrowDown') {
      setIsOpen(true)
      setFocusedIndex(0)
      e.preventDefault()
      return
    }

    if (!isOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setFocusedIndex(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : 0
        )
        break
        
      case 'ArrowUp':
        e.preventDefault()
        setFocusedIndex(prev => 
          prev > 0 ? prev - 1 : filteredSuggestions.length - 1
        )
        break
        
      case 'Enter':
        e.preventDefault()
        if (focusedIndex >= 0 && focusedIndex < filteredSuggestions.length) {
          onChange(filteredSuggestions[focusedIndex])
          setIsOpen(false)
          setFocusedIndex(-1)
        }
        break
        
      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        setFocusedIndex(-1)
        break
    }
  }

  const handleSelect = (item: string) => {
    onChange(item)
    setIsOpen(false)
    setFocusedIndex(-1)
    inputRef.current?.focus()
  }

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const parts = text.split(regex)
    
    return (
      <>
        {parts.map((part, i) => (
          regex.test(part) ? 
            <span key={i} className="text-cyan-400 font-semibold">{part}</span> : 
            <span key={i}>{part}</span>
        ))}
      </>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-200 mb-2 block">
          {label}
        </label>
      )}
      
      <Input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          setIsOpen(true)
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full"
        aria-autocomplete="list"
        aria-expanded={isOpen}
        aria-controls="autocomplete-list"
        aria-activedescendant={
          focusedIndex >= 0 ? `suggestion-${focusedIndex}` : undefined
        }
      />
      
      {isOpen && filteredSuggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 animate-in slide-in-from-top-2 duration-200"
        >
          <GlassPanel className="p-2 max-h-60 overflow-y-auto">
            {recentItems.length > 0 && filteredSuggestions.some(s => recentItems.includes(s)) && (
              <div className="text-xs text-gray-400 px-2 py-1 mb-1">Recent</div>
            )}
            
            <ul
              id="autocomplete-list"
              role="listbox"
              className="space-y-1"
            >
              {filteredSuggestions.map((suggestion, index) => {
                const isRecent = recentItems.includes(suggestion)
                
                return (
                  <li
                    key={suggestion}
                    id={`suggestion-${index}`}
                    role="option"
                    aria-selected={index === focusedIndex}
                    className={`
                      px-3 py-2 rounded cursor-pointer transition-colors
                      ${index === focusedIndex ? 
                        'bg-cyan-500/20 text-cyan-400' : 
                        'hover:bg-white/10 text-gray-200'
                      }
                      ${isRecent ? 'border-l-2 border-cyan-500/50' : ''}
                    `}
                    onClick={() => handleSelect(suggestion)}
                    onMouseEnter={() => setFocusedIndex(index)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm">
                        {highlightMatch(suggestion, value)}
                      </span>
                      {isRecent && (
                        <span className="text-xs text-cyan-500/70 ml-2">recent</span>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          </GlassPanel>
        </div>
      )}
    </div>
  )
}