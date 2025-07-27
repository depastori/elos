import { useState, useCallback } from 'react';
import { logger } from '../utils/logger';
import { errorHandler, AppError } from '../utils/errorHandler';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: AppError | null;
}

interface UseAsyncOperationOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: AppError) => void;
  retryKey?: string;
  maxRetries?: number;
  component?: string;
}

export function useAsyncOperation<T = any>(
  operation: (...args: any[]) => Promise<T>,
  options: UseAsyncOperationOptions = {}
) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null
  });

  const execute = useCallback(async (...args: any[]) => {
    const startTime = Date.now();
    const operationId = `${options.component || 'unknown'}_${Date.now()}`;

    setState(prev => ({
      ...prev,
      loading: true,
      error: null
    }));

    logger.info('Iniciando operação assíncrona', {
      component: options.component || 'useAsyncOperation',
      action: 'execute',
      operationId,
      args: args.length > 0 ? 'com argumentos' : 'sem argumentos'
    });

    try {
      let result: T;

      if (options.retryKey && options.maxRetries) {
        result = await errorHandler.retry(
          () => operation(...args),
          options.retryKey!,
          options.maxRetries
        );
      } else {
        result = await operation(...args);
      }

      const duration = Date.now() - startTime;

      logger.info('Operação assíncrona concluída com sucesso', {
        component: options.component || 'useAsyncOperation',
        action: 'execute_success',
        operationId,
        duration
      });

      setState({
        data: result,
        loading: false,
        error: null
      });

      if (options.onSuccess) {
        options.onSuccess(result);
      }

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      const appError = errorHandler.handleError(error as Error, {
        component: options.component || 'useAsyncOperation',
        action: 'execute_error',
        operationId,
        duration,
        args: args.length > 0 ? 'com argumentos' : 'sem argumentos'
      });

      setState({
        data: null,
        loading: false,
        error: appError
      });

      if (options.onError) {
        options.onError(appError);
      }

      throw appError;
    }
  }, [operation, options]);

  const reset = useCallback(() => {
    logger.debug('Reset do estado da operação assíncrona', {
      component: options.component || 'useAsyncOperation',
      action: 'reset'
    });

    setState({
      data: null,
      loading: false,
      error: null
    });
  }, [options.component]);

  const retry = useCallback(() => {
    if (state.error && state.error.isRetryable) {
      logger.userAction('async_operation_retry', {
        component: options.component || 'useAsyncOperation',
        error: state.error
      });
      return execute();
    }
  }, [execute, state.error, options.component]);

  return {
    ...state,
    execute,
    reset,
    retry,
    isRetryable: state.error?.isRetryable || false
  };
}