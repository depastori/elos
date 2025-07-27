import React, { useState } from 'react';
import { Search, Star, MapPin, Clock, Phone, Video, Calendar, CreditCard, Shield, Award, ExternalLink, Download } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
}

interface ProfessionalMarketplaceProps {
  user: User;
}

type ProfessionalType = 'psychologist' | 'lawyer' | 'social_worker' | 'therapist' | 'psychiatrist' | 'coach';
type ServiceType = 'emergency' | 'consultation' | 'therapy' | 'legal_advice' | 'group_session';

type Professional = {
  id: string;
  name: string;
  type: ProfessionalType;
  specialties: string[];
  bio: string;
  photo: string;
  rating: number;
  reviewCount: number;
  location: string;
  languages: string[];
  experience: number;
  credentials: string[];
  services: ServiceType[];
  pricing: {
    emergency: number;
    consultation: number;
    therapy: number;
    group: number;
  };
  availability: {
    emergency: boolean;
    nextSlot: string;
    schedule: string[];
  };
  platformDiscount: number;
  isVerified: boolean;
  responseTime: string;
  successRate: number;
};

type EmergencySession = {
  professionalId: string;
  type: 'chat' | 'video' | 'phone';
  duration: number;
  price: number;
  discount: number;
};

const ProfessionalMarketplace: React.FC<ProfessionalMarketplaceProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'browse' | 'emergency' | 'appointments' | 'favorites'>('browse');
  const [selectedType, setSelectedType] = useState<ProfessionalType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const professionalTypes = [
    { id: 'all', label: 'Todos', icon: '👥', color: 'bg-gray-500' },
    { id: 'psychologist', label: 'Psicólogas', icon: '🧠', color: 'bg-purple-500' },
    { id: 'lawyer', label: 'Advogadas', icon: '⚖️', color: 'bg-blue-500' },
    { id: 'social_worker', label: 'Assistentes Sociais', icon: '❤️', color: 'bg-green-500' },
    { id: 'therapist', label: 'Terapeutas', icon: '💜', color: 'bg-pink-500' },
    { id: 'psychiatrist', label: 'Psiquiatras', icon: '🧠', color: 'bg-indigo-500' },
    { id: 'coach', label: 'Coaches', icon: '🌟', color: 'bg-orange-500' },
  ];

  const professionals: Professional[] = [
    {
      id: '1',
      name: 'Dra. Ana Carolina Silva',
      type: 'psychologist',
      specialties: ['Violência Doméstica', 'Trauma', 'Ansiedade', 'Depressão'],
      bio: 'Psicóloga especializada em atendimento a mulheres vítimas de violência. 15 anos de experiência em trauma e recuperação emocional.',
      photo: 'A',
      rating: 4.9,
      reviewCount: 127,
      location: 'São Paulo, SP',
      languages: ['Português', 'Inglês'],
      experience: 15,
      credentials: ['CRP 06/123456', 'Especialização em Trauma', 'Mestrado em Psicologia Clínica'],
      services: ['emergency', 'consultation', 'therapy'],
      pricing: {
        emergency: 150,
        consultation: 200,
        therapy: 180,
        group: 80,
      },
      availability: {
        emergency: true,
        nextSlot: '2024-01-25 14:00',
        schedule: ['Segunda 9h-17h', 'Terça 9h-17h', 'Quarta 9h-17h'],
      },
      platformDiscount: 20,
      isVerified: true,
      responseTime: '< 5 min',
      successRate: 94,
    },
    {
      id: '2',
      name: 'Dra. Mariana Santos',
      type: 'lawyer',
      specialties: ['Lei Maria da Penha', 'Direito de Família', 'Medidas Protetivas'],
      bio: 'Advogada especializada em direitos da mulher e violência doméstica. Atendimento humanizado e sigiloso.',
      photo: 'M',
      rating: 4.8,
      reviewCount: 89,
      location: 'Rio de Janeiro, RJ',
      languages: ['Português'],
      experience: 12,
      credentials: ['OAB/RJ 123456', 'Especialização em Direito da Mulher'],
      services: ['consultation', 'legal_advice'],
      pricing: {
        emergency: 200,
        consultation: 250,
        therapy: 0,
        group: 100,
      },
      availability: {
        emergency: false,
        nextSlot: '2024-01-26 10:00',
        schedule: ['Segunda 8h-18h', 'Terça 8h-18h'],
      },
      platformDiscount: 15,
      isVerified: true,
      responseTime: '< 10 min',
      successRate: 96,
    },
    {
      id: '3',
      name: 'Carla Mendes',
      type: 'social_worker',
      specialties: ['Reintegração Social', 'Assistência Familiar', 'Orientação Social'],
      bio: 'Assistente social com foco em reintegração de mulheres em situação de vulnerabilidade.',
      photo: 'C',
      rating: 4.7,
      reviewCount: 56,
      location: 'Belo Horizonte, MG',
      languages: ['Português'],
      experience: 8,
      credentials: ['CRESS 123456', 'Especialização em Violência Doméstica'],
      services: ['consultation', 'group_session'],
      pricing: {
        emergency: 100,
        consultation: 120,
        therapy: 0,
        group: 60,
      },
      availability: {
        emergency: true,
        nextSlot: '2024-01-25 16:00',
        schedule: ['Segunda 14h-20h', 'Quarta 14h-20h'],
      },
      platformDiscount: 25,
      isVerified: true,
      responseTime: '< 15 min',
      successRate: 91,
    },
  ];

  const emergencyProfessionals = professionals.filter(p => p.availability.emergency);

  const filteredProfessionals = professionals.filter(prof => {
    const matchesType = selectedType === 'all' || prof.type === selectedType;
    const matchesSearch = prof.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prof.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const handleEmergencySession = (professional: Professional) => {
    setSelectedProfessional(professional);
    setShowEmergencyModal(true);
  };

  const handleBookAppointment = (professional: Professional) => {
    setSelectedProfessional(professional);
    setShowBookingModal(true);
  };

  const getProfessionalTypeColor = (type: ProfessionalType) => {
    const typeData = professionalTypes.find(t => t.id === type);
    return typeData?.color || 'bg-gray-500';
  };

  const getProfessionalTypeLabel = (type: ProfessionalType) => {
    const typeData = professionalTypes.find(t => t.id === type);
    return typeData?.label || 'Profissional';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">👥</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Profissionais Especializadas</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Conecte-se com psicólogas, advogadas e assistentes sociais especializadas em apoio à mulher. 
          Atendimento emergencial 24h e consultas agendadas com desconto exclusivo.
        </p>
      </div>

      {/* Emergency Banner */}
      <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">🚨 Plantão Psicológico 24h</h3>
            <p className="text-red-100 mb-4">
              {emergencyProfessionals.length} profissionais disponíveis agora para atendimento emergencial
            </p>
            <div className="flex items-center space-x-4 text-sm">
              <span>⚡ Resposta em até 5 minutos</span>
              <span>💜 Atendimento humanizado</span>
              <span>🔒 100% sigiloso</span>
            </div>
          </div>
          <button
            onClick={() => setShowEmergencyModal(true)}
            className="bg-white text-red-600 px-6 py-3 rounded-lg font-bold hover:bg-red-50 transition-all duration-200 animate-pulse"
          >
            Preciso de Ajuda Agora
          </button>
        </div>
      </div>

      {/* Platform Benefits */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 text-white">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold mb-2">Benefícios Exclusivos da Plataforma</h3>
          <p className="text-purple-100">Conectamos você com profissionais especializadas com vantagens únicas</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold mb-2">Descontos Exclusivos</h4>
            <p className="text-sm text-purple-100">Até 25% de desconto em consultas através da plataforma</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold mb-2">Profissionais Verificadas</h4>
            <p className="text-sm text-purple-100">Todas as profissionais são verificadas e especializadas</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold mb-2">Plantão 24h</h4>
            <p className="text-sm text-purple-100">Atendimento emergencial disponível a qualquer hora</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold mb-2">Compromisso Social</h4>
            <p className="text-sm text-purple-100">10% dos lucros doados ao Instituto Maria da Penha</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome ou especialidade..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {professionalTypes.map(type => (
              <option key={type.id} value={type.id}>{type.label}</option>
            ))}
          </select>
        </div>

        {/* Professional Types */}
        <div className="flex flex-wrap gap-3">
          {professionalTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedType === type.id
                  ? `${type.color} text-white shadow-sm`
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{type.icon}</span>
              <span>{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Professionals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProfessionals.map(professional => (
          <div key={professional.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200">
            {/* Professional Header */}
            <div className="flex items-start space-x-4 mb-4">
              <div className="relative">
                <div className={`w-16 h-16 ${getProfessionalTypeColor(professional.type)} rounded-full flex items-center justify-center`}>
                  <span className="text-xl font-bold text-white">{professional.photo}</span>
                </div>
                {professional.isVerified && (
                  <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-1 rounded-full">
                    <Shield className="h-3 w-3" />
                  </div>
                )}
                {professional.availability.emergency && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white p-1 rounded-full animate-pulse">
                    <Phone className="h-3 w-3" />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-semibold text-gray-900">{professional.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProfessionalTypeColor(professional.type)} text-white`}>
                    {getProfessionalTypeLabel(professional.type)}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span>{professional.rating}</span>
                    <span className="ml-1">({professional.reviewCount})</span>
                  </div>
                  <span className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {professional.location}
                  </span>
                  <span>{professional.experience} anos</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="h-3 w-3 text-green-500" />
                  <span className="text-green-600">Resposta: {professional.responseTime}</span>
                  {professional.availability.emergency && (
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                      Disponível Agora
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Bio */}
            <p className="text-gray-700 text-sm mb-4 line-clamp-2">{professional.bio}</p>

            {/* Specialties */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {professional.specialties.slice(0, 3).map(specialty => (
                  <span key={specialty} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                    {specialty}
                  </span>
                ))}
                {professional.specialties.length > 3 && (
                  <span className="text-xs text-gray-500">+{professional.specialties.length - 3} mais</span>
                )}
              </div>
            </div>

            {/* Pricing */}
            <div className="mb-4 p-3 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-600">Consulta: </span>
                  <span className="font-semibold text-gray-900">R$ {professional.pricing.consultation}</span>
                  {professional.platformDiscount > 0 && (
                    <span className="ml-2 bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                      -{professional.platformDiscount}% na plataforma
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3">
              {professional.availability.emergency && (
                <button
                  onClick={() => handleEmergencySession(professional)}
                  className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-600 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Phone className="h-4 w-4" />
                  <span>Emergência</span>
                </button>
              )}
              <button
                onClick={() => handleBookAppointment(professional)}
                className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-600 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Calendar className="h-4 w-4" />
                <span>Agendar</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Emergency Modal */}
      {showEmergencyModal && selectedProfessional && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Atendimento Emergencial</h3>
            
            <div className="flex items-center space-x-3 mb-6">
              <div className={`w-12 h-12 ${getProfessionalTypeColor(selectedProfessional.type)} rounded-full flex items-center justify-center`}>
                <span className="text-lg font-bold text-white">{selectedProfessional.photo}</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{selectedProfessional.name}</h4>
                <p className="text-sm text-gray-600">{getProfessionalTypeLabel(selectedProfessional.type)}</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h5 className="font-medium text-red-800 mb-2">Detalhes do Atendimento</h5>
                <div className="space-y-2 text-sm text-red-700">
                  <p>• Duração: 50 minutos</p>
                  <p>• Modalidade: Videochamada segura</p>
                  <p>• Início: Imediato (até 5 minutos)</p>
                  <p>• Valor: R$ {selectedProfessional.pricing.emergency}</p>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h5 className="font-medium text-green-800 mb-2">Desconto da Plataforma</h5>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-700">Desconto aplicado:</span>
                  <span className="font-bold text-green-800">-{selectedProfessional.platformDiscount}%</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-green-700">Valor final:</span>
                  <span className="font-bold text-green-800">
                    R$ {(selectedProfessional.pricing.emergency * (1 - selectedProfessional.platformDiscount / 100)).toFixed(0)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowEmergencyModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center justify-center space-x-2">
                <CreditCard className="h-4 w-4" />
                <span>Pagar e Iniciar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && selectedProfessional && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Agendar Consulta</h3>
            
            <div className="flex items-center space-x-3 mb-6">
              <div className={`w-12 h-12 ${getProfessionalTypeColor(selectedProfessional.type)} rounded-full flex items-center justify-center`}>
                <span className="text-lg font-bold text-white">{selectedProfessional.photo}</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{selectedProfessional.name}</h4>
                <p className="text-sm text-gray-600">{getProfessionalTypeLabel(selectedProfessional.type)}</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Próximo horário disponível</label>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="font-medium text-blue-800">{selectedProfessional.availability.nextSlot}</p>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-green-700">Valor da consulta:</span>
                  <span className="font-medium text-green-800">R$ {selectedProfessional.pricing.consultation}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-green-700">Desconto da plataforma:</span>
                  <span className="font-medium text-green-800">-{selectedProfessional.platformDiscount}%</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-green-200">
                  <span className="font-medium text-green-800">Total:</span>
                  <span className="font-bold text-green-800">
                    R$ {(selectedProfessional.pricing.consultation * (1 - selectedProfessional.platformDiscount / 100)).toFixed(0)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowBookingModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center justify-center space-x-2">
                <CreditCard className="h-4 w-4" />
                <span>Confirmar e Pagar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessionalMarketplace;