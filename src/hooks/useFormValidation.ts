import { useState, useCallback } from 'react';
import { logger } from '../utils/logger';
import { errorHandler, ValidationError } from '../utils/errorHandler';

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

interface ValidationRules {
  [key: string]: ValidationRule;
}

interface FormErrors {
  [key: string]: string;
}

interface UseFormValidationOptions {
  component?: string;
  onValidationError?: (errors: FormErrors) => void;
}

export function useFormValidation(
  rules: ValidationRules,
  options: UseFormValidationOptions = {}
) {
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = useCallback((name: string, value: any): string | null => {
    const rule = rules[name];
    if (!rule) return null;

    try {
      // Required validation
      if (rule.required) {
        errorHandler.validateRequired(value, name);
      }

      // Skip other validations if value is empty and not required
      if (!rule.required && (!value || value === '')) {
        return null;
      }

      // Length validations
      if (rule.minLength && value.length < rule.minLength) {
        throw new ValidationError(
          `${name} deve ter pelo menos ${rule.minLength} caracteres`,
          name,
          value
        );
      }

      if (rule.maxLength && value.length > rule.maxLength) {
        throw new ValidationError(
          `${name} deve ter no máximo ${rule.maxLength} caracteres`,
          name,
          value
        );
      }

      // Pattern validation
      if (rule.pattern && !rule.pattern.test(value)) {
        throw new ValidationError(
          `${name} tem formato inválido`,
          name,
          value
        );
      }

      // Custom validation
      if (rule.custom) {
        const customError = rule.custom(value);
        if (customError) {
          throw new ValidationError(customError, name, value);
        }
      }

      // Special validations
      if (name.toLowerCase().includes('email')) {
        errorHandler.validateEmail(value);
      }

      if (name.toLowerCase().includes('phone') || name.toLowerCase().includes('telefone')) {
        errorHandler.validatePhone(value);
      }

      if (name.toLowerCase().includes('cpf')) {
        errorHandler.validateCPF(value);
      }

      return null;
    } catch (error) {
      if (error instanceof ValidationError) {
        logger.debug('Erro de validação de campo', {
          component: options.component || 'useFormValidation',
          action: 'validateField',
          field: name,
          value: typeof value === 'string' ? value.substring(0, 50) : value,
          error: error.message
        });
        return error.message;
      }
      
      logger.error('Erro inesperado na validação', error as Error, {
        component: options.component || 'useFormValidation',
        action: 'validateField',
        field: name
      });
      
      return 'Erro de validação';
    }
  }, [rules, options.component]);

  const validateForm = useCallback((formData: Record<string, any>): boolean => {
    const newErrors: FormErrors = {};
    let hasErrors = false;

    logger.info('Iniciando validação do formulário', {
      component: options.component || 'useFormValidation',
      action: 'validateForm',
      fields: Object.keys(formData)
    });

    Object.keys(rules).forEach(fieldName => {
      const error = validateField(fieldName, formData[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        hasErrors = true;
      }
    });

    setErrors(newErrors);

    if (hasErrors) {
      logger.warn('Formulário contém erros de validação', {
        component: options.component || 'useFormValidation',
        action: 'validateForm',
        errors: Object.keys(newErrors),
        errorCount: Object.keys(newErrors).length
      });

      if (options.onValidationError) {
        options.onValidationError(newErrors);
      }
    } else {
      logger.info('Formulário validado com sucesso', {
        component: options.component || 'useFormValidation',
        action: 'validateForm'
      });
    }

    return !hasErrors;
  }, [rules, validateField, options]);

  const validateSingleField = useCallback((name: string, value: any) => {
    const error = validateField(name, value);
    
    setErrors(prev => ({
      ...prev,
      [name]: error || ''
    }));

    return !error;
  }, [validateField]);

  const setFieldTouched = useCallback((name: string, isTouched: boolean = true) => {
    setTouched(prev => ({
      ...prev,
      [name]: isTouched
    }));
  }, []);

  const clearErrors = useCallback(() => {
    logger.debug('Limpando erros de validação', {
      component: options.component || 'useFormValidation',
      action: 'clearErrors'
    });
    
    setErrors({});
    setTouched({});
  }, [options.component]);

  const getFieldError = useCallback((name: string): string | null => {
    return touched[name] ? errors[name] || null : null;
  }, [errors, touched]);

  const hasErrors = Object.keys(errors).some(key => errors[key]);
  const hasFieldError = (name: string) => Boolean(getFieldError(name));

  return {
    errors,
    touched,
    hasErrors,
    validateForm,
    validateSingleField,
    setFieldTouched,
    clearErrors,
    getFieldError,
    hasFieldError
  };
}