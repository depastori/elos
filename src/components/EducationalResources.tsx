import React, { useState } from 'react';
import { BookOpen, Download, ExternalLink, Play, FileText, Users, Scale, Heart } from 'lucide-react';

const EducationalResources: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('rights');

  const categories = [
    { id: 'rights', label: 'Direitos Legais', icon: Scale },
    { id: 'support', label: 'Apoio Psicológico', icon: Heart },
    { id: 'prevention', label: 'Prevenção', icon: BookOpen },
    { id: 'community', label: 'Comunidade', icon: Users },
  ];

  const resources = {
    rights: [
      {
        title: 'Lei Maria da Penha - Guia Completo',
        type: 'PDF',
        description: 'Entenda todos os seus direitos previstos na Lei 11.340/2006',
        url: '#',
        downloadable: true,
        icon: FileText,
      },
      {
        title: 'Como Solicitar Medida Protetiva',
        type: 'Vídeo',
        description: 'Passo a passo para requerer proteção legal',
        url: '#',
        downloadable: false,
        icon: Play,
      },
      {
        title: 'Direitos Trabalhistas da Mulher Vítima de Violência',
        type: 'Artigo',
        description: 'Conheça as garantias no ambiente de trabalho',
        url: '#',
        downloadable: false,
        icon: FileText,
      },
      {
        title: 'Pensão Alimentícia e Guarda dos Filhos',
        type: 'Guia',
        description: 'Informações sobre direitos familiares',
        url: '#',
        downloadable: true,
        icon: FileText,
      },
    ],
    support: [
      {
        title: 'Técnicas de Autocontrole Emocional',
        type: 'Vídeo',
        description: 'Estratégias para lidar com ansiedade e stress',
        url: '#',
        downloadable: false,
        icon: Play,
      },
      {
        title: 'Identificando Relacionamentos Abusivos',
        type: 'Checklist',
        description: 'Sinais de alerta para reconhecer situações de risco',
        url: '#',
        downloadable: true,
        icon: FileText,
      },
      {
        title: 'Reconstruindo a Autoestima',
        type: 'E-book',
        description: 'Guia para recuperar a confiança e amor próprio',
        url: '#',
        downloadable: true,
        icon: BookOpen,
      },
      {
        title: 'Terapia Online para Mulheres',
        type: 'Diretório',
        description: 'Lista de profissionais especializados',
        url: '#',
        downloadable: false,
        icon: Users,
      },
    ],
    prevention: [
      {
        title: 'Plano de Segurança Pessoal',
        type: 'Template',
        description: 'Modelo para criar seu plano de proteção',
        url: '#',
        downloadable: true,
        icon: FileText,
      },
      {
        title: 'Sinais de Alerta em Relacionamentos',
        type: 'Infográfico',
        description: 'Identifique comportamentos preocupantes',
        url: '#',
        downloadable: true,
        icon: FileText,
      },
      {
        title: 'Segurança Digital para Mulheres',
        type: 'Curso Online',
        description: 'Proteja sua privacidade na internet',
        url: '#',
        downloadable: false,
        icon: Play,
      },
      {
        title: 'Autodefesa Básica',
        type: 'Vídeo Tutorial',
        description: 'Técnicas básicas de proteção pessoal',
        url: '#',
        downloadable: false,
        icon: Play,
      },
    ],
    community: [
      {
        title: 'Grupos de Apoio Locais',
        type: 'Diretório',
        description: 'Encontre grupos de apoio na sua região',
        url: '#',
        downloadable: false,
        icon: Users,
      },
      {
        title: 'Como Ajudar uma Amiga em Situação de Violência',
        type: 'Guia',
        description: 'Orientações para oferecer apoio adequado',
        url: '#',
        downloadable: true,
        icon: Heart,
      },
      {
        title: 'Voluntariado em ONGs',
        type: 'Oportunidades',
        description: 'Formas de contribuir com a causa',
        url: '#',
        downloadable: false,
        icon: Users,
      },
      {
        title: 'Eventos e Workshops',
        type: 'Agenda',
        description: 'Atividades educativas e de conscientização',
        url: '#',
        downloadable: false,
        icon: BookOpen,
      },
    ],
  };

  const statistics = [
    {
      value: '1 em cada 4',
      label: 'mulheres sofrem violência doméstica',
      color: 'text-red-600',
    },
    {
      value: '80%',
      label: 'dos casos não são denunciados',
      color: 'text-orange-600',
    },
    {
      value: '73%',
      label: 'das agressões são cometidas por parceiros',
      color: 'text-purple-600',
    },
    {
      value: '85%',
      label: 'das mulheres que denunciam se sentem mais seguras',
      color: 'text-green-600',
    },
  ];

  const getResourceTypeColor = (type: string) => {
    const colors = {
      'PDF': 'bg-red-100 text-red-700',
      'Vídeo': 'bg-blue-100 text-blue-700',
      'Artigo': 'bg-green-100 text-green-700',
      'Guia': 'bg-purple-100 text-purple-700',
      'E-book': 'bg-indigo-100 text-indigo-700',
      'Checklist': 'bg-yellow-100 text-yellow-700',
      'Template': 'bg-pink-100 text-pink-700',
      'Infográfico': 'bg-orange-100 text-orange-700',
      'Curso Online': 'bg-cyan-100 text-cyan-700',
      'Vídeo Tutorial': 'bg-blue-100 text-blue-700',
      'Diretório': 'bg-gray-100 text-gray-700',
      'Oportunidades': 'bg-green-100 text-green-700',
      'Agenda': 'bg-purple-100 text-purple-700',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <BookOpen className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Recursos Educativos</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Acesse materiais educativos, guias práticos e informações essenciais para se proteger e ajudar outras mulheres.
        </p>
      </div>

      {/* Statistics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Dados Importantes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statistics.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`text-2xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`p-4 rounded-lg text-center transition-all duration-200 ${
                  activeCategory === category.id
                    ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-transparent'
                }`}
              >
                <Icon className="h-6 w-6 mx-auto mb-2" />
                <div className="text-sm font-medium">{category.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {resources[activeCategory as keyof typeof resources].map((resource, index) => {
          const Icon = resource.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{resource.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getResourceTypeColor(resource.type)}`}>
                      {resource.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
                  <div className="flex items-center space-x-3">
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-600 transition-all duration-200"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Acessar
                    </a>
                    {resource.downloadable && (
                      <button className="inline-flex items-center text-purple-600 hover:text-purple-700 text-sm font-medium transition-colors">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Emergency Tips */}
      <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-8 text-white">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold mb-2">Dicas Rápidas de Emergência</h3>
          <p className="text-red-100">Informações essenciais que podem salvar vidas</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-semibold">🚨 Se você está em perigo agora:</h4>
            <ul className="space-y-1 text-sm text-red-100">
              <li>• Ligue 190 (Polícia) ou 180 (Central da Mulher)</li>
              <li>• Vá para um local público e seguro</li>
              <li>• Peça ajuda a pessoas de confiança</li>
              <li>• Documente tudo (fotos, mensagens, etc.)</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold">📱 Apps importantes:</h4>
            <ul className="space-y-1 text-sm text-red-100">
              <li>• Clique 180 (denúncias online)</li>
              <li>• SOS Mulher (botão de pânico)</li>
              <li>• Mapa do Acolhimento</li>
              <li>• PLP 2.0 (registro de ocorrências)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <Heart className="h-12 w-12 text-purple-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Compartilhe Conhecimento</h3>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Ajude outras mulheres compartilhando estes recursos em suas redes sociais. 
          Juntas, podemos criar uma comunidade mais informada e protegida.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button className="bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition-all duration-200">
            Compartilhar no Facebook
          </button>
          <button className="bg-pink-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-pink-600 transition-all duration-200">
            Compartilhar no Instagram
          </button>
          <button className="bg-green-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-600 transition-all duration-200">
            Compartilhar no WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

export default EducationalResources;