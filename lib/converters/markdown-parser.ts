import { BatchUpdateOperation } from '@/types/batch-update'

interface ParseResult {
  operations: BatchUpdateOperation[]
  errors: string[]
}

export function parseMarkdownToOperations(markdown: string): ParseResult {
  const operations: BatchUpdateOperation[] = []
  const errors: string[] = []
  
  // Split by operation headers
  const sections = markdown.split(/## Operation \d+:/)
  
  sections.forEach((section, index) => {
    if (index === 0) return // Skip header section
    
    try {
      // Extract JSON code block
      const jsonMatch = section.match(/```json\n([\s\S]*?)\n```/)
      
      if (jsonMatch && jsonMatch[1]) {
        const operation = JSON.parse(jsonMatch[1])
        operations.push(operation)
      } else {
        // Try to find any JSON-like content
        const jsonLikeMatch = section.match(/\{[\s\S]*\}/)
        if (jsonLikeMatch) {
          const operation = JSON.parse(jsonLikeMatch[0])
          operations.push(operation)
        }
      }
    } catch {
      errors.push(`Failed to parse operation ${index}: Invalid JSON structure`)
    }
  })
  
  if (operations.length === 0 && errors.length === 0) {
    // Try to parse as plain JSON array
    try {
      const jsonMatch = markdown.match(/```json\n([\s\S]*?)\n```/)
      if (jsonMatch && jsonMatch[1]) {
        const parsed = JSON.parse(jsonMatch[1])
        if (Array.isArray(parsed)) {
          operations.push(...parsed)
        } else if (parsed.requests && Array.isArray(parsed.requests)) {
          operations.push(...parsed.requests)
        } else {
          operations.push(parsed)
        }
      }
    } catch {
      errors.push('No valid operations found in markdown')
    }
  }
  
  return { operations, errors }
}