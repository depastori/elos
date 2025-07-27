import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { logger } from '../utils/logger';
import { errorHandler, AppError } from '../utils/errorHandler';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: AppError | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      errorId: Date.now().toString()
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const appError = errorHandler.handleError(error, {
      component: 'ErrorBoundary',
      action: 'componentDidCatch',
      errorInfo
    });

    this.setState({
      error: appError,
      errorInfo
    });

    // Callback personalizado
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log detalhado do erro
    logger.componentError('ErrorBoundary', error, {
      errorInfo,
      componentStack: errorInfo.componentStack,
      errorBoundary: true
    });
  }

  handleRetry = () => {
    logger.userAction('error_boundary_retry', {
      errorId: this.state.errorId,
      component: 'ErrorBoundary'
    });

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    });
  };

  handleReportError = () => {
    if (this.state.error) {
      logger.userAction('error_boundary_report', {
        errorId: this.state.errorId,
        error: this.state.error,
        component: 'ErrorBoundary'
      });

      // Simular envio de relatório
      const errorReport = {
        errorId: this.state.errorId,
        message: this.state.error.message,
        stack: this.state.error.stack,
        componentStack: this.state.errorInfo?.componentStack,
        timestamp: this.state.error.timestamp,
        userAgent: navigator.userAgent,
        url: window.location.href
      };

      console.log('Relatório de erro enviado:', errorReport);
      alert('Relatório de erro enviado com sucesso. Obrigada por nos ajudar a melhorar!');
    }
  };

  render() {
    if (this.state.hasError) {
      // Fallback personalizado
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // UI padrão de erro
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>

            <h1 className="text-xl font-bold text-gray-900 mb-2">
              Ops! Algo deu errado
            </h1>

            <p className="text-gray-600 mb-6">
              {this.state.error?.userMessage || 
               'Ocorreu um erro inesperado. Nossa equipe foi notificada e está trabalhando para resolver.'}
            </p>

            {/* Detalhes do erro (apenas em desenvolvimento) */}
            {import.meta.env.DEV && this.state.error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
                <h3 className="font-medium text-red-800 mb-2">Detalhes do Erro (Dev):</h3>
                <p className="text-sm text-red-700 mb-2">
                  <strong>Tipo:</strong> {this.state.error.type}
                </p>
                <p className="text-sm text-red-700 mb-2">
                  <strong>Código:</strong> {this.state.error.code || 'N/A'}
                </p>
                <p className="text-sm text-red-700 mb-2">
                  <strong>Mensagem:</strong> {this.state.error.message}
                </p>
                <p className="text-sm text-red-700">
                  <strong>ID:</strong> {this.state.errorId}
                </p>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full bg-purple-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-600 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Tentar Novamente</span>
              </button>

              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Home className="h-4 w-4" />
                <span>Voltar ao Início</span>
              </button>

              <button
                onClick={this.handleReportError}
                className="w-full text-gray-500 py-2 px-4 rounded-lg font-medium hover:text-gray-700 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Bug className="h-4 w-4" />
                <span>Reportar Erro</span>
              </button>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Se o problema persistir, entre em contato conosco através do suporte.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook para usar o Error Boundary programaticamente
export const useErrorBoundary = () => {
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  const captureError = React.useCallback((error: Error) => {
    logger.error('Erro capturado programaticamente', error, {
      component: 'useErrorBoundary',
      action: 'captureError'
    });
    setError(error);
  }, []);

  return { captureError };
};