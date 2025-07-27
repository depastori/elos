import React, { useState, useEffect } from 'react';
import { AlertTriangle, Phone, MapPin, Clock, X, Send, Car, Home, UserPlus } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  location?: { lat: number; lng: number; address: string };
}

interface PanicButtonProps {
  user: User;
  onClose: () => void;
}

type EmergencyType = 'immediate' | 'transport' | 'shelter' | 'escort';

type NearbyHelper = {
  id: string;
  name: string;
  distance: number;
  responseTime: string;
  services: string[];
  isAvailable: boolean;
  rating: number;
};

const PanicButton: React.FC<PanicButtonProps> = ({ user, onClose }) => {
  const [step, setStep] = useState<'select' | 'confirm' | 'sending' | 'sent'>('select');
  const [selectedEmergency, setSelectedEmergency] = useState<EmergencyType | null>(null);
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(10);
  const [isCountingDown, setIsCountingDown] = useState(false);

  const emergencyTypes = [
    {
      id: 'immediate',
      title: 'Perigo Imediato',
      description: 'Estou em perigo agora e preciso de ajuda urgente',
      icon: AlertTriangle,
      color: 'bg-red-500',
      priority: 'critical',
    },
    {
      id: 'transport',
      title: 'Preciso de Transporte',
      description: 'Preciso sair daqui com segurança',
      icon: Car,
      color: 'bg-orange-500',
      priority: 'high',
    },
    {
      id: 'shelter',
      title: 'Preciso de Abrigo',
      description: 'Preciso de um local seguro para ficar',
      icon: Home,
      color: 'bg-blue-500',
      priority: 'high',
    },
    {
      id: 'escort',
      title: 'Preciso de Acompanhamento',
      description: 'Preciso de alguém para me acompanhar',
      icon: UserPlus,
      color: 'bg-purple-500',
      priority: 'medium',
    },
  ];

  const nearbyHelpers: NearbyHelper[] = [
    {
      id: '1',
      name: 'Maria S.',
      distance: 0.8,
      responseTime: '3-5 min',
      services: ['Transporte', 'Abrigo'],
      isAvailable: true,
      rating: 4.9,
    },
    {
      id: '2',
      name: 'Ana L.',
      distance: 1.2,
      responseTime: '5-8 min',
      services: ['Acompanhamento', 'Transporte'],
      isAvailable: true,
      rating: 4.8,
    },
    {
      id: '3',
      name: 'Carla M.',
      distance: 2.1,
      responseTime: '8-12 min',
      services: ['Abrigo', 'Apoio Emocional'],
      isAvailable: true,
      rating: 4.7,
    },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCountingDown && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      handleSendEmergency();
    }
    return () => clearInterval(interval);
  }, [isCountingDown, countdown]);

  const handleEmergencySelect = (type: EmergencyType) => {
    setSelectedEmergency(type);
    setStep('confirm');
  };

  const handleConfirm = () => {
    if (selectedEmergency === 'immediate') {
      setIsCountingDown(true);
      setStep('sending');
    } else {
      handleSendEmergency();
    }
  };

  const handleSendEmergency = () => {
    setStep('sent');
    setIsCountingDown(false);
    
    // Aqui seria enviado o alerta para:
    // 1. Voluntárias próximas
    // 2. Contatos de emergência
    // 3. Autoridades (se necessário)
    
    setTimeout(() => {
      onClose();
    }, 5000);
  };

  const handleCancel = () => {
    setIsCountingDown(false);
    setCountdown(10);
    setStep('select');
    setSelectedEmergency(null);
  };

  const selectedType = emergencyTypes.find(t => t.id === selectedEmergency);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Botão de Pânico</h2>
              <p className="text-sm text-gray-600">Ajuda está a caminho</p>
            </div>
          </div>
          {step === 'select' && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          )}
        </div>

        {/* Step 1: Select Emergency Type */}
        {step === 'select' && (
          <div className="space-y-4">
            <p className="text-gray-700 mb-6">Que tipo de ajuda você precisa agora?</p>
            
            {emergencyTypes.map(type => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => handleEmergencySelect(type.id as EmergencyType)}
                  className={`w-full p-4 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 text-left group hover:bg-gray-50`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 ${type.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{type.title}</h3>
                      <p className="text-sm text-gray-600">{type.description}</p>
                      <div className="flex items-center mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          type.priority === 'critical' ? 'bg-red-100 text-red-700' :
                          type.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          Prioridade {type.priority === 'critical' ? 'Crítica' : 
                                    type.priority === 'high' ? 'Alta' : 'Média'}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Step 2: Confirm */}
        {step === 'confirm' && selectedType && (
          <div className="space-y-6">
            <div className="text-center">
              <div className={`w-16 h-16 ${selectedType.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <selectedType.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{selectedType.title}</h3>
              <p className="text-gray-600">{selectedType.description}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mensagem adicional (opcional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Descreva brevemente sua situação..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                rows={3}
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">Voluntárias Próximas Disponíveis:</h4>
              <div className="space-y-2">
                {nearbyHelpers.slice(0, 2).map(helper => (
                  <div key={helper.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-bold">{helper.name.charAt(0)}</span>
                      </div>
                      <span className="text-blue-700">{helper.name}</span>
                    </div>
                    <div className="text-blue-600">
                      <MapPin className="inline h-3 w-3 mr-1" />
                      {helper.distance}km • {helper.responseTime}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleCancel}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                className={`flex-1 ${selectedType.color} text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-all duration-200`}
              >
                Enviar Alerta
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Sending (with countdown for immediate danger) */}
        {step === 'sending' && (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <span className="text-2xl font-bold text-white">{countdown}</span>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Enviando Alerta de Emergência</h3>
              <p className="text-gray-600 mb-4">
                O alerta será enviado em {countdown} segundos para voluntárias próximas e autoridades.
              </p>
              <p className="text-sm text-red-600">
                Cancele apenas se não estiver mais em perigo.
              </p>
            </div>

            <button
              onClick={handleCancel}
              className="bg-gray-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-600 transition-all duration-200"
            >
              Cancelar Alerta
            </button>
          </div>
        )}

        {/* Step 4: Sent */}
        {step === 'sent' && (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto">
              <Send className="h-10 w-10 text-white" />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Alerta Enviado!</h3>
              <p className="text-gray-600 mb-4">
                Sua solicitação de ajuda foi enviada para {nearbyHelpers.length} voluntárias próximas.
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-3">Próximos Passos:</h4>
              <ul className="text-sm text-green-700 space-y-1 text-left">
                <li>• Mantenha-se em local seguro se possível</li>
                <li>• Aguarde contato das voluntárias</li>
                <li>• Em perigo imediato, ligue 190</li>
                <li>• Sua localização foi compartilhada</li>
              </ul>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => window.open('tel:190')}
                className="w-full bg-red-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-600 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Phone className="h-5 w-5" />
                <span>Ligar 190 (Emergência)</span>
              </button>
              
              <button
                onClick={() => window.open('tel:180')}
                className="w-full bg-purple-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-600 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Phone className="h-5 w-5" />
                <span>Ligar 180 (Central da Mulher)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PanicButton;