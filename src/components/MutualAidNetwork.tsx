import React, { useState } from 'react';
import { UserPlus, MapPin, Clock, Car, Home, Phone, Heart, Shield, Navigation } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  location?: { lat: number; lng: number; address: string };
  isVolunteer?: boolean;
  volunteerServices?: string[];
  maxDistance?: number;
}

interface MutualAidNetworkProps {
  user: User;
}

type ServiceType = 'shelter' | 'transport' | 'escort' | 'emotional' | 'legal' | 'childcare';

type Volunteer = {
  id: string;
  name: string;
  distance: number;
  services: ServiceType[];
  availability: 'available' | 'busy' | 'offline';
  rating: number;
  responseTime: string;
  maxCapacity?: number;
  currentCapacity?: number;
  verified: boolean;
  lastActive: string;
};

const MutualAidNetwork: React.FC<MutualAidNetworkProps> = ({ user }) => {
  const [isVolunteer, setIsVolunteer] = useState(user.isVolunteer || false);
  const [selectedServices, setSelectedServices] = useState<ServiceType[]>(user.volunteerServices as ServiceType[] || []);
  const [maxDistance, setMaxDistance] = useState(user.maxDistance || 5);
  const [showVolunteerForm, setShowVolunteerForm] = useState(false);
  const [searchRadius, setSearchRadius] = useState(10);
  const [urgentNeed, setUrgentNeed] = useState<ServiceType | null>(null);

  const serviceTypes = [
    {
      id: 'shelter',
      label: 'Abrigo Temporário',
      description: 'Oferecer local seguro para pernoitar',
      icon: Home,
      color: 'bg-blue-500',
    },
    {
      id: 'transport',
      label: 'Transporte/Carona',
      description: 'Levar para local seguro ou delegacia',
      icon: Car,
      color: 'bg-green-500',
    },
    {
      id: 'escort',
      label: 'Acompanhamento',
      description: 'Acompanhar em situações necessárias',
      icon: UserPlus,
      color: 'bg-purple-500',
    },
    {
      id: 'emotional',
      label: 'Apoio Emocional',
      description: 'Conversa e suporte psicológico',
      icon: Heart,
      color: 'bg-pink-500',
    },
    {
      id: 'legal',
      label: 'Orientação Legal',
      description: 'Informações sobre direitos e processos',
      icon: Shield,
      color: 'bg-indigo-500',
    },
    {
      id: 'childcare',
      label: 'Cuidado com Crianças',
      description: 'Ajuda temporária com filhos',
      icon: Heart,
      color: 'bg-orange-500',
    },
  ];

  // Dados simulados de voluntárias próximas
  const nearbyVolunteers: Volunteer[] = [
    {
      id: '1',
      name: 'Maria S.',
      distance: 1.2,
      services: ['shelter', 'emotional'],
      availability: 'available',
      rating: 4.9,
      responseTime: '5-10 min',
      maxCapacity: 2,
      currentCapacity: 0,
      verified: true,
      lastActive: '2 min atrás',
    },
    {
      id: '2',
      name: 'Ana L.',
      distance: 2.8,
      services: ['transport', 'escort'],
      availability: 'available',
      rating: 4.7,
      responseTime: '10-15 min',
      verified: true,
      lastActive: '5 min atrás',
    },
    {
      id: '3',
      name: 'Carla M.',
      distance: 3.5,
      services: ['legal', 'emotional'],
      availability: 'busy',
      rating: 4.8,
      responseTime: '20-30 min',
      verified: false,
      lastActive: '1 hora atrás',
    },
    {
      id: '4',
      name: 'Júlia R.',
      distance: 4.1,
      services: ['childcare', 'shelter'],
      availability: 'available',
      rating: 4.6,
      responseTime: '15-20 min',
      maxCapacity: 3,
      currentCapacity: 1,
      verified: true,
      lastActive: '10 min atrás',
    },
  ];

  const toggleService = (service: ServiceType) => {
    setSelectedServices(prev =>
      prev.includes(service)
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const handleBecomeVolunteer = () => {
    setIsVolunteer(true);
    setShowVolunteerForm(false);
    // Aqui salvaria no backend
  };

  const requestHelp = (service: ServiceType) => {
    setUrgentNeed(service);
    // Aqui enviaria notificação para voluntárias próximas
  };

  const getServiceIcon = (serviceId: ServiceType) => {
    const service = serviceTypes.find(s => s.id === serviceId);
    return service?.icon || UserPlus;
  };

  const getServiceColor = (serviceId: ServiceType) => {
    const service = serviceTypes.find(s => s.id === serviceId);
    return service?.color || 'bg-gray-500';
  };

  const getAvailabilityColor = (availability: string) => {
    const colors = {
      available: 'bg-green-500',
      busy: 'bg-yellow-500',
      offline: 'bg-gray-500',
    };
    return colors[availability as keyof typeof colors];
  };

  const filteredVolunteers = nearbyVolunteers.filter(volunteer =>
    volunteer.distance <= searchRadius &&
    (urgentNeed ? volunteer.services.includes(urgentNeed) : true)
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <UserPlus className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Rede de Ajuda Mútua</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Conecte-se com outras mulheres dispostas a ajudar em situações de emergência. 
          Juntas somos mais fortes e seguras.
        </p>
      </div>

      {/* Emergency Request */}
      {urgentNeed && (
        <div className="bg-red-50 border-l-4 border-red-400 rounded-r-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-medium text-red-800 mb-2">🚨 Pedido de Ajuda Enviado</h3>
              <p className="text-red-700">
                Sua solicitação de {serviceTypes.find(s => s.id === urgentNeed)?.label.toLowerCase()} foi enviada 
                para {filteredVolunteers.filter(v => v.availability === 'available').length} voluntárias próximas.
              </p>
            </div>
            <button
              onClick={() => setUrgentNeed(null)}
              className="text-red-400 hover:text-red-600"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Quick Help Buttons */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Precisa de Ajuda Agora?</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {serviceTypes.map(service => {
            const Icon = service.icon;
            const availableCount = nearbyVolunteers.filter(v => 
              v.services.includes(service.id as ServiceType) && 
              v.availability === 'available'
            ).length;
            
            return (
              <button
                key={service.id}
                onClick={() => requestHelp(service.id as ServiceType)}
                className={`p-4 rounded-lg border-2 border-gray-200 hover:border-purple-300 transition-all duration-200 text-left ${
                  urgentNeed === service.id ? 'border-red-400 bg-red-50' : 'hover:bg-purple-50'
                }`}
              >
                <div className={`w-10 h-10 ${service.color} rounded-lg flex items-center justify-center mb-3`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h4 className="font-medium text-gray-900 text-sm mb-1">{service.label}</h4>
                <p className="text-xs text-gray-600 mb-2">{service.description}</p>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-600">{availableCount} disponível(is)</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Voluntárias Próximas</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Navigation className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Raio: {searchRadius}km</span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              value={searchRadius}
              onChange={(e) => setSearchRadius(Number(e.target.value))}
              className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredVolunteers.map(volunteer => (
            <div key={volunteer.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {volunteer.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{volunteer.name}</span>
                      {volunteer.verified && (
                        <Shield className="h-4 w-4 text-green-500" title="Verificada" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="h-3 w-3" />
                      <span>{volunteer.distance}km de distância</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 ${getAvailabilityColor(volunteer.availability)} rounded-full`}></div>
                  <span className="text-xs text-gray-600 capitalize">{volunteer.availability}</span>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex flex-wrap gap-1 mb-2">
                  {volunteer.services.map(service => {
                    const Icon = getServiceIcon(service);
                    return (
                      <span
                        key={service}
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs text-white ${getServiceColor(service)}`}
                      >
                        <Icon className="h-3 w-3 mr-1" />
                        {serviceTypes.find(s => s.id === service)?.label}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                <span>⭐ {volunteer.rating}/5.0</span>
                <span>
                  <Clock className="inline h-3 w-3 mr-1" />
                  {volunteer.responseTime}
                </span>
                <span>Ativa {volunteer.lastActive}</span>
              </div>

              {volunteer.maxCapacity && (
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>Capacidade</span>
                    <span>{volunteer.currentCapacity}/{volunteer.maxCapacity}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${((volunteer.maxCapacity - (volunteer.currentCapacity || 0)) / volunteer.maxCapacity) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="flex space-x-2">
                <button
                  disabled={volunteer.availability !== 'available'}
                  className="flex-1 bg-purple-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Solicitar Ajuda
                </button>
                <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all duration-200">
                  <Phone className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredVolunteers.length === 0 && (
          <div className="text-center py-8">
            <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma voluntária encontrada</h3>
            <p className="text-gray-600 mb-4">
              Tente aumentar o raio de busca ou considere se tornar uma voluntária.
            </p>
          </div>
        )}
      </div>

      {/* Volunteer Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {!isVolunteer ? (
          <div className="text-center">
            <Heart className="h-12 w-12 text-purple-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Seja uma Voluntária</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Ajude outras mulheres em situações de emergência. Você pode oferecer diferentes tipos de apoio 
              de acordo com sua disponibilidade e capacidade.
            </p>
            <button
              onClick={() => setShowVolunteerForm(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
            >
              Quero Ser Voluntária
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Você é uma Voluntária</h3>
                  <p className="text-gray-600">Obrigada por ajudar nossa comunidade!</p>
                </div>
              </div>
              <button
                onClick={() => setShowVolunteerForm(true)}
                className="text-purple-600 hover:text-purple-700 text-sm font-medium"
              >
                Editar Perfil
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-2">12</div>
                <div className="text-sm text-gray-600">Ajudas Realizadas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-2">4.8</div>
                <div className="text-sm text-gray-600">Avaliação Média</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">{maxDistance}km</div>
                <div className="text-sm text-gray-600">Raio de Atuação</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Volunteer Form Modal */}
      {showVolunteerForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {isVolunteer ? 'Editar Perfil de Voluntária' : 'Tornar-se Voluntária'}
              </h3>
              <button
                onClick={() => setShowVolunteerForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Que tipo de ajuda você pode oferecer?
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {serviceTypes.map(service => {
                    const Icon = service.icon;
                    return (
                      <label
                        key={service.id}
                        className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                          selectedServices.includes(service.id as ServiceType)
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedServices.includes(service.id as ServiceType)}
                          onChange={() => toggleService(service.id as ServiceType)}
                          className="sr-only"
                        />
                        <div className={`w-8 h-8 ${service.color} rounded-lg flex items-center justify-center`}>
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{service.label}</div>
                          <div className="text-xs text-gray-600">{service.description}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Distância máxima para ajudar: {maxDistance}km
                </label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1km</span>
                  <span>50km</span>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowVolunteerForm(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleBecomeVolunteer}
                  disabled={selectedServices.length === 0}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isVolunteer ? 'Salvar Alterações' : 'Tornar-se Voluntária'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MutualAidNetwork;