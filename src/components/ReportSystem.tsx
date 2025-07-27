import React, { useState } from 'react';
import { AlertTriangle, FileText, Camera, Map, Calendar, Send, Lock, Shield } from 'lucide-react';
import { logger } from '../utils/logger';
import { errorHandler, ValidationError } from '../utils/errorHandler';
import { useFormValidation } from '../hooks/useFormValidation';
import { useAsyncOperation } from '../hooks/useAsyncOperation';

interface User {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
}

interface ReportSystemProps {
  user: User;
}

type ReportData = {
  type: 'physical' | 'psychological' | 'digital' | 'workplace' | 'public';
  isAnonymous: boolean;
  description: string;
  location: string;
  date: string;
  aggressorInfo: string;
  hasEvidence: boolean;
  wantsHelp: boolean;
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
};

const ReportSystem: React.FC<ReportSystemProps> = ({ user }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [reportData, setReportData] = useState<ReportData>({
    type: 'physical',
    isAnonymous: false,
    description: '',
    location: '',
    date: '',
    aggressorInfo: '',
    hasEvidence: false,
    wantsHelp: true,
    urgencyLevel: 'medium',
  });

  // Validação do formulário de denúncia
  const validationRules = {
    description: {
      required: true,
      minLength: 20,
      maxLength: 2000
    },
    date: {
      required: true,
      custom: (value: string) => {
        if (value && new Date(value) > new Date()) {
          return 'A data não pode ser no futuro';
        }
        return null;
      }
    },
    location: {
      maxLength: 200
    },
    aggressorInfo: {
      maxLength: 1000
    }
  };

  const {
    validateForm,
    validateSingleField,
    setFieldTouched,
    getFieldError,
    hasFieldError,
    clearErrors
  } = useFormValidation(validationRules, {
    component: 'ReportSystem',
    onValidationError: (errors) => {
      logger.warn('Erros de validação no formulário de denúncia', {
        component: 'ReportSystem',
        action: 'validation_error',
        errors: Object.keys(errors),
        step: currentStep
      });
    }
  });

  // Operação assíncrona de envio da denúncia
  const {
    loading: submitting,
    error: submitError,
    execute: submitReport
  } = useAsyncOperation(
    async (data: ReportData) => {
      // Simular delay de envio
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simular possível erro de rede (5% de chance)
      if (Math.random() < 0.05) {
        throw new Error('Erro de conexão. Tente novamente.');
      }
      
      // Simular processamento
      return {
        reportId: `REP-${Date.now()}`,
        status: 'received',
        estimatedProcessingTime: '24 horas'
      };
    },
    {
      component: 'ReportSystem',
      retryKey: 'submit_report',
      maxRetries: 3,
      onSuccess: (result) => {
        logger.userAction('report_submitted', {
          component: 'ReportSystem',
          reportId: result.reportId,
          reportType: reportData.type,
          urgencyLevel: reportData.urgencyLevel,
          isAnonymous: reportData.isAnonymous,
          userId: user.id
        });
        
        alert(`Denúncia enviada com sucesso! ID: ${result.reportId}. Nossa equipe analisará o caso em até ${result.estimatedProcessingTime}.`);
        
        // Reset do formulário
        setCurrentStep(1);
        setReportData({
          type: 'physical',
          isAnonymous: false,
          description: '',
          location: '',
          date: '',
          aggressorInfo: '',
          hasEvidence: false,
          wantsHelp: true,
          urgencyLevel: 'medium',
        });
        clearErrors();
      },
      onError: (error) => {
        logger.error('Erro ao enviar denúncia', error, {
          component: 'ReportSystem',
          reportType: reportData.type,
          urgencyLevel: reportData.urgencyLevel,
          userId: user.id
        });
      }
    }
  );

  React.useEffect(() => {
    logger.info('Sistema de denúncias carregado', {
      component: 'ReportSystem',
      action: 'mount',
      userId: user.id
    });
  }, [user.id]);

  const violenceTypes = [
    {
      id: 'physical',
      title: 'Violência Física',
      description: 'Agressões corporais, empurrões, tapas, socos',
      icon: '👊',
    },
    {
      id: 'psychological',
      title: 'Violência Psicológica',
      description: 'Ameaças, humilhações, controle, chantagem',
      icon: '🧠',
    },
    {
      id: 'stalking',
      title: 'Perseguição Física',
      description: 'Seguir, vigiar, aparecer em locais frequentados',
      icon: '👁️',
    },
    {
      id: 'defamation',
      title: 'Difamação e Calúnia',
      description: 'Espalhar mentiras, destruir reputação, vingança',
      icon: '🗣️',
    },
    {
      id: 'digital',
      title: 'Violência Digital',
      description: 'Cyberbullying, exposição íntima, perseguição online',
      icon: '📱',
    },
    {
      id: 'workplace',
      title: 'Assédio no Trabalho',
      description: 'Assédio sexual ou moral no ambiente profissional',
      icon: '🏢',
    },
    {
      id: 'public',
      title: 'Violência em Espaço Público',
      description: 'Assédio na rua, transporte público, estabelecimentos',
      icon: '🌍',
    },
  ];

  const urgencyLevels = [
    { id: 'low', label: 'Baixa', color: 'bg-green-500', description: 'Situação controlada' },
    { id: 'medium', label: 'Média', color: 'bg-yellow-500', description: 'Precisa de atenção' },
    { id: 'high', label: 'Alta', color: 'bg-orange-500', description: 'Situação preocupante' },
    { id: 'critical', label: 'Crítica', color: 'bg-red-500', description: 'Risco imediato' },
  ];

  const handleInputChange = (field: keyof ReportData, value: any) => {
    try {
    setReportData(prev => ({ ...prev, [field]: value }));
      
      // Validar campo individual se for um campo validável
      if (['description', 'date', 'location', 'aggressorInfo'].includes(field)) {
        setFieldTouched(field);
        validateSingleField(field, value);
      }
      
      logger.debug('Campo do formulário alterado', {
        component: 'ReportSystem',
        action: 'handleInputChange',
        field,
        hasValue: Boolean(value),
        step: currentStep
      });
    } catch (error) {
      errorHandler.handleError(error as Error, {
        component: 'ReportSystem',
        action: 'handleInputChange',
        field
      });
    }
  };

  const handleSubmitReport = async () => {
    try {
      logger.userAction('report_submit_attempt', {
        component: 'ReportSystem',
        reportType: reportData.type,
        urgencyLevel: reportData.urgencyLevel,
        isAnonymous: reportData.isAnonymous,
        userId: user.id
      });

      // Validar dados antes de enviar
      if (!validateForm(reportData)) {
        logger.warn('Tentativa de envio com dados inválidos', {
          component: 'ReportSystem',
          action: 'handleSubmitReport',
          step: currentStep
        });
        return;
      }

      await submitReport(reportData);
    } catch (error) {
      errorHandler.handleError(error as Error, {
        component: 'ReportSystem',
        action: 'handleSubmitReport'
      });
    }
  };

  const handleStepChange = (newStep: number) => {
    try {
      // Validar step atual antes de avançar
      if (newStep > currentStep) {
        if (currentStep === 1) {
          // Validar seleções do step 1
          if (!reportData.type || !reportData.urgencyLevel) {
            throw new ValidationError('Selecione o tipo de violência e nível de urgência');
          }
        } else if (currentStep === 2) {
          // Validar campos obrigatórios do step 2
          if (!validateForm(reportData)) {
            return;
          }
        }
      }

      logger.userAction('report_step_change', {
        component: 'ReportSystem',
        fromStep: currentStep,
        toStep: newStep,
        userId: user.id
      });

      setCurrentStep(newStep);
    } catch (error) {
      if (error instanceof ValidationError) {
        alert(error.userMessage || error.message);
      } else {
        errorHandler.handleError(error as Error, {
          component: 'ReportSystem',
          action: 'handleStepChange',
          fromStep: currentStep,
          toStep: newStep
        });
      }
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tipo de Violência</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {violenceTypes.map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => handleInputChange('type', type.id)}
              className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                reportData.type === type.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start space-x-3">
                <span className="text-2xl">{type.icon}</span>
                <div>
                  <h4 className="font-medium text-gray-900">{type.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Nível de Urgência</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {urgencyLevels.map((level) => (
            <button
              key={level.id}
              type="button"
              onClick={() => handleInputChange('urgencyLevel', level.id)}
              className={`p-3 rounded-lg border-2 text-center transition-all duration-200 ${
                reportData.urgencyLevel === level.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`w-4 h-4 ${level.color} rounded-full mx-auto mb-2`}></div>
              <div className="font-medium text-gray-900 text-sm">{level.label}</div>
              <div className="text-xs text-gray-600 mt-1">{level.description}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descrição do Ocorrido *
        </label>
        <textarea
          value={reportData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          onBlur={() => setFieldTouched('description')}
          placeholder="Descreva o que aconteceu. Seja o mais detalhada possível, isso ajuda nossa equipe a entender melhor a situação."
          className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none ${
            hasFieldError('description') ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
          rows={6}
          required
        />
        {getFieldError('description') && (
          <p className="mt-1 text-sm text-red-600">{getFieldError('description')}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="inline h-4 w-4 mr-1" />
            Data da Ocorrência
          </label>
          <input
            type="date"
            value={reportData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            onBlur={() => setFieldTouched('date')}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
              hasFieldError('date') ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
          />
          {getFieldError('date') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('date')}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Map className="inline h-4 w-4 mr-1" />
            Local (opcional)
          </label>
          <input
            type="text"
            value={reportData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            onBlur={() => setFieldTouched('location')}
            placeholder="Cidade, bairro ou endereço aproximado"
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
              hasFieldError('location') ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
          />
          {getFieldError('location') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('location')}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Informações sobre o Agressor (opcional)
        </label>
        <textarea
          value={reportData.aggressorInfo}
          onChange={(e) => handleInputChange('aggressorInfo', e.target.value)}
          onBlur={() => setFieldTouched('aggressorInfo')}
          placeholder="Nome, características físicas, relacionamento com você, etc. Essas informações ajudam a alertar outras mulheres."
          className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none ${
            hasFieldError('aggressorInfo') ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
          rows={3}
        />
        {getFieldError('aggressorInfo') && (
          <p className="mt-1 text-sm text-red-600">{getFieldError('aggressorInfo')}</p>
        )}
      </div>

      {/* Exibir erro de envio */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-red-800">Erro ao Enviar Denúncia</h4>
              <p className="text-sm text-red-700 mt-1">{submitError.userMessage}</p>
              {submitError.isRetryable && (
                <button
                  onClick={() => submitReport(reportData)}
                  disabled={submitting}
                  className="mt-2 text-sm text-red-600 hover:text-red-700 underline disabled:opacity-50"
                >
                  Tentar novamente
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="hasEvidence"
            checked={reportData.hasEvidence}
            onChange={(e) => handleInputChange('hasEvidence', e.target.checked)}
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
          <label htmlFor="hasEvidence" className="text-sm font-medium text-gray-700">
            Possuo evidências (fotos, mensagens, áudios, etc.)
          </label>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="wantsHelp"
            checked={reportData.wantsHelp}
            onChange={(e) => handleInputChange('wantsHelp', e.target.checked)}
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
          <label htmlFor="wantsHelp" className="text-sm font-medium text-gray-700">
            Gostaria de receber apoio e orientações
          </label>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="isAnonymous"
            checked={reportData.isAnonymous}
            onChange={(e) => handleInputChange('isAnonymous', e.target.checked)}
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
          <label htmlFor="isAnonymous" className="text-sm font-medium text-gray-700 flex items-center">
            <Lock className="h-4 w-4 mr-1" />
            Enviar denúncia anonimamente
          </label>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-blue-800">Sua Segurança é Prioridade</h4>
            <p className="text-sm text-blue-700 mt-1">
              Todas as informações são criptografadas e tratadas com total confidencialidade. 
              Nossa equipe especializada analisará seu caso e entrará em contato se necessário.
            </p>
          </div>
        </div>
      </div>

      {reportData.urgencyLevel === 'critical' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-red-800">Situação Crítica Identificada</h4>
              <p className="text-sm text-red-700 mt-1">
                Recomendamos que você procure ajuda imediata. Em caso de perigo iminente, 
                ligue 190 (Polícia) ou 180 (Central de Atendimento à Mulher).
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sistema de Denúncias</h2>
          <p className="text-gray-600">
            Reporte casos de violência de forma segura e confidencial
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <React.Fragment key={step}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-12 h-0.5 ${
                      currentStep > step ? 'bg-purple-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="mb-8">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={() => handleStepChange(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            Voltar
          </button>

          {currentStep < 3 ? (
            <button
              onClick={() => handleStepChange(currentStep + 1)}
              disabled={submitting}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {submitting ? 'Processando...' : 'Próximo'}
            </button>
          ) : (
            <button
              onClick={handleSubmitReport}
              disabled={submitting}
              className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-200 flex items-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span>{submitting ? 'Enviando...' : 'Enviar Denúncia'}</span>
            </button>
          )}
        </div>

        {/* Emergency Notice */}
        <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-center">
            <h4 className="text-sm font-medium text-red-800 mb-2">Em Caso de Emergência</h4>
            <div className="flex justify-center space-x-4 text-sm">
              <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-medium">
                Polícia: 190
              </span>
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
                Central da Mulher: 180
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportSystem;