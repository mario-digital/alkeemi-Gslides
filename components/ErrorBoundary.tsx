'use client'

import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex h-screen items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-destructive">Something went wrong</h2>
              <p className="mt-2 text-muted-foreground">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}