import React from 'react';
import { Phone, MapPin, Globe, Clock, AlertTriangle, Heart, Shield } from 'lucide-react';

const EmergencyResources: React.FC = () => {
  const emergencyContacts = [
    {
      name: 'Polícia Militar',
      number: '190',
      description: 'Para emergências e casos de violência em andamento',
      available: '24h',
      color: 'bg-red-500',
    },
    {
      name: 'Central de Atendimento à Mulher',
      number: '180',
      description: 'Orientação e denúncias de violência contra a mulher',
      available: '24h',
      color: 'bg-purple-500',
    },
    {
      name: 'Disque Direitos Humanos',
      number: '100',
      description: 'Denúncias de violações de direitos humanos',
      available: '24h',
      color: 'bg-blue-500',
    },
    {
      name: 'SAMU',
      number: '192',
      description: 'Atendimento médico de urgência',
      available: '24h',
      color: 'bg-green-500',
    },
  ];

  const supportCenters = [
    {
      name: 'Delegacia da Mulher',
      address: 'Rua da Consolação, 1234 - Centro',
      phone: '(11) 3333-4444',
      hours: 'Segunda a Sexta: 8h às 18h',
      services: ['Boletim de Ocorrência', 'Medida Protetiva', 'Orientação Jurídica'],
    },
    {
      name: 'Casa da Mulher Brasileira',
      address: 'Av. Paulista, 5678 - Bela Vista',
      phone: '(11) 5555-6666',
      hours: 'Segunda a Sexta: 8h às 17h',
      services: ['Atendimento Psicológico', 'Assistência Social', 'Abrigo Temporário'],
    },
    {
      name: 'Centro de Referência da Mulher',
      address: 'Rua Augusta, 9012 - Jardins',
      phone: '(11) 7777-8888',
      hours: 'Segunda a Sexta: 9h às 18h',
      services: ['Acompanhamento Psicossocial', 'Grupos de Apoio', 'Capacitação Profissional'],
    },
  ];

  const onlineResources = [
    {
      name: 'Mapa do Acolhimento',
      url: 'https://www.mapadoacolhimento.org',
      description: 'Rede de psicólogas e advogadas voluntárias',
      icon: Heart,
    },
    {
      name: 'Instituto Maria da Penha',
      url: 'https://www.institutomariadapenha.org.br',
      description: 'Informações sobre direitos e prevenção',
      icon: Shield,
    },
    {
      name: 'Observatório da Mulher',
      url: 'https://www12.senado.leg.br/institucional/omv',
      description: 'Dados e estatísticas sobre violência',
      icon: Globe,
    },
  ];

  const safetyTips = [
    {
      title: 'Tenha um plano de segurança',
      description: 'Pense antecipadamente em rotas de fuga e lugares seguros para ir.',
    },
    {
      title: 'Guarde evidências',
      description: 'Documente lesões, mensagens ameaçadoras e outros tipos de evidência.',
    },
    {
      title: 'Conte para pessoas de confiança',
      description: 'Informe amigos e familiares sobre sua situação.',
    },
    {
      title: 'Mantenha documentos seguros',
      description: 'Tenha cópias de documentos importantes em local seguro.',
    },
    {
      title: 'Tenha dinheiro de emergência',
      description: 'Mantenha uma quantia reservada para emergências.',
    },
    {
      title: 'Conheça seus direitos',
      description: 'Informe-se sobre medidas protetivas e outros recursos legais.',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Phone className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Recursos de Emergência</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Encontre ajuda imediata e recursos de apoio. Em situações de perigo, não hesite em pedir ajuda.
        </p>
      </div>

      {/* Emergency Alert */}
      <div className="bg-red-50 border-l-4 border-red-400 rounded-r-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-6 w-6 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-medium text-red-800">⚠️ Em Perigo Imediato?</h3>
            <p className="text-red-700 mt-1">
              Se você está em perigo imediato, ligue <strong>190</strong> agora mesmo. 
              Sua segurança é a prioridade número um.
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Contacts */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Contatos de Emergência</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {emergencyContacts.map((contact, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 ${contact.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{contact.name}</h4>
                    <span className="flex items-center text-sm text-green-600">
                      <Clock className="h-4 w-4 mr-1" />
                      {contact.available}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{contact.description}</p>
                  <a
                    href={`tel:${contact.number}`}
                    className={`inline-flex items-center ${contact.color} text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-all duration-200`}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    {contact.number}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Support Centers */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Centros de Apoio</h3>
        <div className="space-y-6">
          {supportCenters.map((center, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2">{center.name}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        <MapPin className="inline h-4 w-4 mr-1" />
                        {center.address}
                      </p>
                      <p className="text-sm text-gray-600">
                        <Phone className="inline h-4 w-4 mr-1" />
                        {center.phone}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        <Clock className="inline h-4 w-4 mr-1" />
                        {center.hours}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-900 mb-2">Serviços:</h5>
                    <div className="flex flex-wrap gap-2">
                      {center.services.map((service, serviceIndex) => (
                        <span
                          key={serviceIndex}
                          className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Online Resources */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Recursos Online</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {onlineResources.map((resource, index) => {
            const Icon = resource.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{resource.name}</h4>
                <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-purple-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-600 transition-all duration-200"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Acessar
                </a>
              </div>
            );
          })}
        </div>
      </div>

      {/* Safety Tips */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Dicas de Segurança</h3>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {safetyTips.map((tip, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-green-600">{index + 1}</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">{tip.title}</h4>
                  <p className="text-sm text-gray-600">{tip.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Emergency Button */}
      <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-8 text-white text-center">
        <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">Precisa de Ajuda Imediata?</h3>
        <p className="mb-6 text-red-100">
          Não espere. Sua segurança é importante e há pessoas prontas para ajudar.
        </p>
        <div className="flex justify-center space-x-4">
          <a
            href="tel:190"
            className="bg-white text-red-600 px-6 py-3 rounded-lg font-medium hover:bg-red-50 transition-all duration-200"
          >
            Ligar 190
          </a>
          <a
            href="tel:180"
            className="bg-white text-purple-600 px-6 py-3 rounded-lg font-medium hover:bg-purple-50 transition-all duration-200"
          >
            Ligar 180
          </a>
        </div>
      </div>
    </div>
  );
};

export default EmergencyResources;