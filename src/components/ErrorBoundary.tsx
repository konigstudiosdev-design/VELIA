import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  sectionName?: string
  fallbackUrl?: string
  onReset?: () => void
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[VÉLIA ErrorBoundary - ${this.props.sectionName || 'Global'}]`, error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null })
    if (this.props.onReset) {
      this.props.onReset()
    }
  }

  private handleGoHome = () => {
    if (typeof window !== 'undefined') {
      window.location.href = this.props.fallbackUrl || '/'
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] w-full flex items-center justify-center p-6 bg-ivory text-center select-none">
          <div className="max-w-md w-full bg-white border border-beige/80 rounded-3xl p-8 sm:p-10 shadow-lg space-y-6">
            <div className="w-16 h-16 rounded-full bg-champagne/15 text-champagne flex items-center justify-center mx-auto text-3xl">
              ✨
            </div>

            <div className="space-y-2">
              <span className="font-body text-[0.62rem] tracking-[0.25em] text-champagne uppercase font-medium">
                VÉLIA · Sistema de Protección
              </span>
              <h2 className="font-display text-2xl sm:text-3xl text-brown font-light">
                Algo no salió como esperábamos
              </h2>
              <p className="font-body text-xs text-brown/60 leading-relaxed">
                Tus datos e información están completamente seguros. Ocurrió un inconveniente temporal al cargar {this.props.sectionName || 'esta sección'}.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-left max-h-36 overflow-y-auto">
                <p className="font-mono text-[10px] text-rose-900 font-semibold break-all">
                  {this.state.error.name}: {this.state.error.message}
                </p>
                {this.state.error.stack && (
                  <p className="font-mono text-[9px] text-rose-700/80 mt-1 whitespace-pre-wrap break-all">
                    {this.state.error.stack.substring(0, 300)}
                  </p>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="w-full sm:w-auto bg-brown text-ivory font-body font-medium text-xs px-6 py-3 rounded-full hover:bg-ink transition-colors cursor-pointer shadow-xs"
              >
                🔄 Reintentar
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="w-full sm:w-auto border border-beige/80 text-brown font-body font-medium text-xs px-6 py-3 rounded-full hover:bg-ivory transition-colors cursor-pointer"
              >
                🏠 Ir al Inicio
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
