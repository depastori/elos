import { logger } from './logger';

export enum ErrorType {
  VALIDATION = 'VALIDATION',
  NETWORK = 'NETWORK',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NOT_FOUND = 'NOT_FOUND',
  SERVER_ERROR = 'SERVER_ERROR',
  CLIENT_ERROR = 'CLIENT_ERROR',
  SECURITY = 'SECURITY',
  UNKNOWN = 'UNKNOWN'
}

export interface AppError extends Error {
  type: ErrorType;
  code?: string;
  statusCode?: number;
  context?: Record<string, any>;
  userMessage?: string;
  isRetryable?: boolean;
  timestamp: string;
}

export class CustomError extends Error implements AppError {
  public readonly type: ErrorType;
  public readonly code?: string;
  public readonly statusCode?: number;
  public readonly context?: Record<string, any>;
  public readonly userMessage?: string;
  public readonly isRetryable?: boolean;
  public readonly timestamp: string;

  constructor(
    message: string,
    type: ErrorType = ErrorType.UNKNOWN,
    options: {
      code?: string;
      statusCode?: number;
      context?: Record<string, any>;
      userMessage?: string;
      isRetryable?: boolean;
      cause?: Error;
    } = {}
  ) {
    super(message);
    this.name = 'CustomError';
    this.type = type;
    this.code = options.code;
    this.statusCode = options.statusCode;
    this.context = options.context;
    this.userMessage = options.userMessage;
    this.isRetryable = options.isRetryable ?? false;
    this.timestamp = new Date().toISOString();

    if (options.cause) {
      this.cause = options.cause;
    }

    // Manter stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }
  }
}

export class ValidationError extends CustomError {
  constructor(message: string, field?: string, value?: any) {
    super(message, ErrorType.VALIDATION, {
      code: 'VALIDATION_FAILED',
      userMessage: 'Por favor, verifique os dados informados.',
      context: { field, value }
    });
  }
}

export class NetworkError extends CustomError {
  constructor(message: string, statusCode?: number, endpoint?: string) {
    super(message, ErrorType.NETWORK, {
      code: 'NETWORK_ERROR',
      statusCode,
      userMessage: 'Erro de conexão. Verifique sua internet e tente novamente.',
      isRetryable: true,
      context: { endpoint }
    });
  }
}

export class AuthenticationError extends CustomError {
  constructor(message: string = 'Não autenticado') {
    super(message, ErrorType.AUTHENTICATION, {
      code: 'AUTH_REQUIRED',
      statusCode: 401,
      userMessage: 'Você precisa fazer login para continuar.'
    });
  }
}

export class AuthorizationError extends CustomError {
  constructor(message: string = 'Não autorizado', resource?: string) {
    super(message, ErrorType.AUTHORIZATION, {
      code: 'ACCESS_DENIED',
      statusCode: 403,
      userMessage: 'Você não tem permissão para realizar esta ação.',
      context: { resource }
    });
  }
}

export class SecurityError extends CustomError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, ErrorType.SECURITY, {
      code: 'SECURITY_VIOLATION',
      userMessage: 'Ação bloqueada por motivos de segurança.',
      context: details
    });
  }
}

class ErrorHandler {
  private retryAttempts = new Map<string, number>();
  private maxRetries = 3;

  handleError(error: Error | AppError, context?: Record<string, any>): AppError {
    const appError = this.normalizeError(error, context);
    
    // Log do erro
    logger.error(
      `Erro capturado: ${appError.message}`,
      appError,
      {
        component: context?.component || 'ErrorHandler',
        action: context?.action || 'handleError',
        errorType: appError.type,
        errorCode: appError.code,
        ...context
      }
    );

    // Eventos especiais para erros de segurança
    if (appError.type === ErrorType.SECURITY) {
      logger.securityEvent(appError.message, {
        error: appError,
        ...context
      });
    }

    return appError;
  }

  private normalizeError(error: Error | AppError, context?: Record<string, any>): AppError {
    if (this.isAppError(error)) {
      return error;
    }

    // Detectar tipo de erro baseado na mensagem ou propriedades
    let type = ErrorType.UNKNOWN;
    let statusCode: number | undefined;
    let userMessage = 'Ocorreu um erro inesperado. Tente novamente.';
    let isRetryable = false;

    if (error.message.includes('fetch') || error.message.includes('network')) {
      type = ErrorType.NETWORK;
      userMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
      isRetryable = true;
    } else if (error.message.includes('401') || error.message.includes('unauthorized')) {
      type = ErrorType.AUTHENTICATION;
      statusCode = 401;
      userMessage = 'Sessão expirada. Faça login novamente.';
    } else if (error.message.includes('403') || error.message.includes('forbidden')) {
      type = ErrorType.AUTHORIZATION;
      statusCode = 403;
      userMessage = 'Você não tem permissão para esta ação.';
    } else if (error.message.includes('404') || error.message.includes('not found')) {
      type = ErrorType.NOT_FOUND;
      statusCode = 404;
      userMessage = 'Recurso não encontrado.';
    } else if (error.message.includes('validation') || error.message.includes('invalid')) {
      type = ErrorType.VALIDATION;
      userMessage = 'Dados inválidos. Verifique as informações.';
    }

    return new CustomError(error.message, type, {
      statusCode,
      userMessage,
      isRetryable,
      context,
      cause: error
    });
  }

  private isAppError(error: any): error is AppError {
    return error && typeof error.type === 'string' && error.timestamp;
  }

  async retry<T>(
    operation: () => Promise<T>,
    key: string,
    maxRetries: number = this.maxRetries
  ): Promise<T> {
    const attempts = this.retryAttempts.get(key) || 0;

    try {
      const result = await operation();
      this.retryAttempts.delete(key); // Sucesso, limpar tentativas
      return result;
    } catch (error) {
      const appError = this.handleError(error as Error, {
        component: 'ErrorHandler',
        action: 'retry',
        key,
        attempt: attempts + 1
      });

      if (!appError.isRetryable || attempts >= maxRetries) {
        this.retryAttempts.delete(key);
        throw appError;
      }

      this.retryAttempts.set(key, attempts + 1);
      
      // Delay exponencial
      const delay = Math.min(1000 * Math.pow(2, attempts), 10000);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      logger.info(`Tentativa ${attempts + 1} de ${maxRetries} para ${key}`, {
        component: 'ErrorHandler',
        action: 'retry',
        delay
      });

      return this.retry(operation, key, maxRetries);
    }
  }

  createErrorBoundary(component: string) {
    return (error: Error, errorInfo: any) => {
      this.handleError(error, {
        component,
        action: 'errorBoundary',
        errorInfo
      });
    };
  }

  // Utilitários para validação
  validateRequired(value: any, fieldName: string): void {
    if (value === null || value === undefined || value === '') {
      throw new ValidationError(`${fieldName} é obrigatório`, fieldName, value);
    }
  }

  validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ValidationError('E-mail inválido', 'email', email);
    }
  }

  validatePhone(phone: string): void {
    const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    if (!phoneRegex.test(phone)) {
      throw new ValidationError('Telefone inválido', 'phone', phone);
    }
  }

  validateCPF(cpf: string): void {
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    if (!cpfRegex.test(cpf)) {
      throw new ValidationError('CPF inválido', 'cpf', cpf);
    }
  }
}

export const errorHandler = new ErrorHandler();

// Hook para React Error Boundary
export const useErrorHandler = () => {
  return {
    handleError: errorHandler.handleError.bind(errorHandler),
    retry: errorHandler.retry.bind(errorHandler),
    validateRequired: errorHandler.validateRequired.bind(errorHandler),
    validateEmail: errorHandler.validateEmail.bind(errorHandler),
    validatePhone: errorHandler.validatePhone.bind(errorHandler),
    validateCPF: errorHandler.validateCPF.bind(errorHandler)
  };
};