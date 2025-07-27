import React, { useState } from 'react';
import { Heart, Shield, Eye, EyeOff } from 'lucide-react';
import { logger } from '../utils/logger';
import { errorHandler, ValidationError } from '../utils/errorHandler';
import { useFormValidation } from '../hooks/useFormValidation';
import { useAsyncOperation } from '../hooks/useAsyncOperation';

type User = {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
};

interface LoginFormProps {
  onLogin: (user: User) => void;
  onEnterDisguise: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onEnterDisguise }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  // Validação do formulário
  const validationRules = {
    name: { 
      required: !isLogin, 
      minLength: 2,
      maxLength: 100 
    },
    email: { 
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: { 
      required: true, 
      minLength: 6 
    },
    confirmPassword: { 
      required: !isLogin,
      custom: (value: string) => {
        if (!isLogin && value !== formData.password) {
          return 'As senhas não coincidem';
        }
        return null;
      }
    },
    agreeTerms: {
      custom: (value: boolean) => {
        if (!isLogin && !value) {
          return 'Você deve concordar com os termos';
        }
        return null;
      }
    }
  };

  const {
    errors,
    validateForm,
    validateSingleField,
    setFieldTouched,
    getFieldError,
    hasFieldError,
    clearErrors
  } = useFormValidation(validationRules, {
    component: 'LoginForm',
    onValidationError: (errors) => {
      logger.warn('Erros de validação no formulário de login', {
        component: 'LoginForm',
        action: 'validation_error',
        errors: Object.keys(errors),
        isLogin
      });
    }
  });

  // Operação assíncrona de login/cadastro
  const {
    loading,
    error: authError,
    execute: performAuth
  } = useAsyncOperation(
    async (formData: typeof formData, isLogin: boolean) => {
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simular possível erro de rede (5% de chance)
      if (Math.random() < 0.05) {
        throw new Error('Erro de conexão com o servidor');
      }
      
      // Simular erro de credenciais inválidas para login
      if (isLogin && formData.email === 'erro@teste.com') {
        throw new ValidationError('E-mail ou senha incorretos');
      }
      
      return {
        id: '1',
        name: formData.name || 'Maria Silva',
        email: formData.email || 'maria@email.com',
        isVerified: true,
        location: { lat: -23.5505, lng: -46.6333, address: 'São Paulo, SP' },
        isVolunteer: false,
        volunteerServices: [],
        maxDistance: 5,
      };
    },
    {
      component: 'LoginForm',
      retryKey: 'auth_operation',
      maxRetries: 2,
      onSuccess: (userData) => {
        logger.userAction(isLogin ? 'login_success' : 'register_success', {
          component: 'LoginForm',
          userId: userData.id,
          userEmail: userData.email
        });
        onLogin(userData);
      },
      onError: (error) => {
        logger.error(`Erro na ${isLogin ? 'autenticação' : 'criação de conta'}`, error, {
          component: 'LoginForm',
          action: isLogin ? 'login_error' : 'register_error',
          email: formData.email
        });
      }
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    logger.userAction(isLogin ? 'login_attempt' : 'register_attempt', {
      component: 'LoginForm',
      email: formData.email,
      hasName: Boolean(formData.name)
    });

    try {
      // Validar formulário
      if (!validateForm(formData)) {
        return;
      }

      // Executar autenticação
      performAuth(formData, isLogin);
    } catch (error) {
      errorHandler.handleError(error as Error, {
        component: 'LoginForm',
        action: 'handleSubmit'
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Validar campo individual após mudança
    if (name !== 'agreeTerms') {
      setFieldTouched(name);
      validateSingleField(name, newValue);
    }
  };

  const handleModeChange = (newIsLogin: boolean) => {
    logger.userAction('auth_mode_change', {
      component: 'LoginForm',
      from: isLogin ? 'login' : 'register',
      to: newIsLogin ? 'login' : 'register'
    });
    
    setIsLogin(newIsLogin);
    clearErrors();
  };

  const handleDisguiseMode = () => {
    logger.userAction('disguise_mode_enter', {
      component: 'LoginForm'
    });
    onEnterDisguise();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Rede Violeta
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            Uma rede segura de apoio e proteção para mulheres. 
            Juntas somos mais fortes.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-purple-100">
          <div className="flex bg-purple-50 rounded-lg p-1 mb-6">
            <button
              type="button"
              onClick={() => handleModeChange(true)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                isLogin
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-purple-600 hover:text-purple-700'
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => handleModeChange(false)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                !isLogin
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-purple-600 hover:text-purple-700'
              }`}
            >
              Cadastrar
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  onBlur={() => setFieldTouched('name')}
                  required={!isLogin}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                    hasFieldError('name') ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Seu nome completo"
                />
                {getFieldError('name') && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError('name')}</p>
                )}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                E-mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={() => setFieldTouched('email')}
                required
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                  hasFieldError('email') ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="seu@email.com"
              />
              {getFieldError('email') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('email')}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={() => setFieldTouched('password')}
                  required
                  className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                    hasFieldError('password') ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Sua senha"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {getFieldError('password') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('password')}</p>
              )}
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Senha
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  onBlur={() => setFieldTouched('confirmPassword')}
                  required={!isLogin}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                    hasFieldError('confirmPassword') ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Confirme sua senha"
                />
                {getFieldError('confirmPassword') && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError('confirmPassword')}</p>
                )}
              </div>
            )}

            {!isLogin && (
              <>
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    required={!isLogin}
                    className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="agreeTerms" className="text-xs text-gray-600 leading-relaxed">
                    Declaro ser mulher e concordo com os{' '}
                    <span className="text-purple-600 underline cursor-pointer">termos de uso</span> e{' '}
                    <span className="text-purple-600 underline cursor-pointer">política de privacidade</span>.
                    Entendo que este é um espaço seguro exclusivo para mulheres.
                  </label>
                </div>
                {getFieldError('agreeTerms') && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError('agreeTerms')}</p>
                )}
              </>
            )}

            {/* Exibir erro de autenticação */}
            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{authError.userMessage}</p>
                {authError.isRetryable && (
                  <button
                    type="button"
                    onClick={() => performAuth(formData, isLogin)}
                    className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
                  >
                    Tentar novamente
                  </button>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Criar Conta')}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-start space-x-2">
              <Shield className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-green-800">Ambiente Seguro</h4>
                <p className="text-xs text-green-700 mt-1">
                  Seus dados são protegidos e este espaço é monitorado para garantir a segurança de todas as usuárias.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-2">Em caso de emergência imediata:</p>
          <div className="flex justify-center space-x-4 text-sm">
            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-medium">
              Polícia: 190
            </span>
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
              Central da Mulher: 180
            </span>
          </div>
          
          {/* Disguise Mode Button */}
          <div className="mt-4">
            <button
              onClick={handleDisguiseMode}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Modo Calculadora 🔒
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;