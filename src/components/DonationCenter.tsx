import React, { useState } from 'react';
import { Heart, CreditCard, Gift, Users, Target, DollarSign, Award, ExternalLink, Download } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
}

interface DonationCenterProps {
  user: User;
}

type DonationAmount = 10 | 25 | 50 | 100 | 200;
type DonationType = 'monthly' | 'single';

type Organization = {
  id: string;
  name: string;
  description: string;
  logo: string;
  website: string;
  impact: string;
  totalRaised: number;
  donorCount: number;
  projects: string[];
  verified: boolean;
};

const DonationCenter: React.FC<DonationCenterProps> = ({ user }) => {
  const [selectedAmount, setSelectedAmount] = useState<DonationAmount>(25);
  const [customAmount, setCustomAmount] = useState('');
  const [donationType, setDonationType] = useState<DonationType>('monthly');
  const [selectedOrganization, setSelectedOrganization] = useState<string>('maria-penha');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const organizations: Organization[] = [
    {
      id: 'maria-penha',
      name: 'Instituto Maria da Penha',
      description: 'Organização que trabalha pela implementação efetiva da Lei Maria da Penha e pelo fim da violência doméstica contra a mulher.',
      logo: '🛡️',
      website: 'https://www.institutomariadapenha.org.br',
      impact: 'Mais de 2 milhões de mulheres impactadas',
      totalRaised: 125000,
      donorCount: 3420,
      projects: [
        'Capacitação de profissionais',
        'Campanhas de conscientização',
        'Atendimento jurídico gratuito',
        'Pesquisas sobre violência doméstica'
      ],
      verified: true
    },
    {
      id: 'casa-mulher',
      name: 'Casa da Mulher Brasileira',
      description: 'Espaços de acolhimento e atendimento integral às mulheres em situação de violência.',
      logo: '🏠',
      website: 'https://www.gov.br/mdh/pt-br/navegue-por-temas/politicas-para-mulheres/arquivo/assuntos/violencia/programa-mulher-viver-sem-violencia',
      impact: 'Atendimento em 8 estados brasileiros',
      totalRaised: 89000,
      donorCount: 2156,
      projects: [
        'Abrigos temporários',
        'Atendimento psicossocial',
        'Capacitação profissional',
        'Reinserção social'
      ],
      verified: true
    },
    {
      id: 'mapa-acolhimento',
      name: 'Mapa do Acolhimento',
      description: 'Rede de psicólogas e advogadas voluntárias que oferece acolhimento online gratuito para mulheres.',
      logo: '🗺️',
      website: 'https://www.mapadoacolhimento.org',
      impact: 'Mais de 15.000 atendimentos realizados',
      totalRaised: 67000,
      donorCount: 1890,
      projects: [
        'Atendimento psicológico gratuito',
        'Orientação jurídica',
        'Capacitação de voluntárias',
        'Tecnologia para acolhimento'
      ],
      verified: true
    },
    {
      id: 'think-eva',
      name: 'Think Eva',
      description: 'Organização que desenvolve tecnologias e soluções inovadoras para combater a violência contra a mulher.',
      logo: '💡',
      website: 'https://www.thinkeva.com',
      impact: 'Tecnologia salvando vidas',
      totalRaised: 45000,
      donorCount: 1234,
      projects: [
        'Aplicativos de segurança',
        'Inteligência artificial para prevenção',
        'Plataformas de denúncia',
        'Educação digital'
      ],
      verified: true
    }
  ];

  const predefinedAmounts: DonationAmount[] = [10, 25, 50, 100, 200];

  const selectedOrg = organizations.find(org => org.id === selectedOrganization)!;
  const finalAmount = customAmount ? parseFloat(customAmount) : selectedAmount;

  const handleDonation = () => {
    setShowPaymentModal(true);
  };

  const platformImpact = {
    totalDonated: 326000,
    totalDonors: 8700,
    organizationsSupported: 4,
    mariaPenhaPercentage: 10
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Centro de Doações</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Apoie organizações que trabalham pela proteção e empoderamento das mulheres. 
          Sua contribuição faz a diferença na vida de milhares de mulheres.
        </p>
      </div>

      {/* Platform Impact */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 text-white">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold mb-2">Impacto da Rede Violeta</h3>
          <p className="text-purple-100">Juntas, estamos transformando vidas e construindo um futuro mais seguro</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">R$ {platformImpact.totalDonated.toLocaleString()}</div>
            <div className="text-sm text-purple-100">Total Arrecadado</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">{platformImpact.totalDonors.toLocaleString()}</div>
            <div className="text-sm text-purple-100">Doadoras</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">{platformImpact.organizationsSupported}</div>
            <div className="text-sm text-purple-100">Organizações Apoiadas</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">{platformImpact.mariaPenhaPercentage}%</div>
            <div className="text-sm text-purple-100">Para Instituto Maria da Penha</div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-white bg-opacity-20 rounded-lg">
          <div className="flex items-center space-x-3">
            <Award className="h-6 w-6 text-white" />
            <div>
              <h4 className="font-semibold">Compromisso Social</h4>
              <p className="text-sm text-purple-100">
                10% de todos os lucros da plataforma são automaticamente doados ao Instituto Maria da Penha
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Donation Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Fazer uma Doação</h3>
        
        {/* Organization Selection */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-4">Escolha a organização:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {organizations.map(org => (
              <button
                key={org.id}
                onClick={() => setSelectedOrganization(org.id)}
                className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                  selectedOrganization === org.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">{org.logo}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h5 className="font-semibold text-gray-900">{org.name}</h5>
                      {org.verified && (
                        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{org.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>R$ {org.totalRaised.toLocaleString()} arrecadados</span>
                      <span>{org.donorCount} doadores</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Organization Details */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-4">
            <div className="text-3xl">{selectedOrg.logo}</div>
            <div className="flex-1">
              <h4 className="font-semibold text-blue-800 mb-2">{selectedOrg.name}</h4>
              <p className="text-sm text-blue-700 mb-3">{selectedOrg.impact}</p>
              <div className="mb-3">
                <h5 className="font-medium text-blue-800 mb-2">Projetos apoiados:</h5>
                <div className="flex flex-wrap gap-2">
                  {selectedOrg.projects.map((project, index) => (
                    <span key={index} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                      {project}
                    </span>
                  ))}
                </div>
              </div>
              <a
                href={selectedOrg.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Visitar site oficial
              </a>
            </div>
          </div>
        </div>

        {/* Donation Type */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Tipo de doação:</h4>
          <div className="flex space-x-4">
            <button
              onClick={() => setDonationType('monthly')}
              className={`flex-1 p-3 rounded-lg border-2 text-center transition-all duration-200 ${
                donationType === 'monthly'
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium">Mensal</div>
              <div className="text-sm text-gray-600">Impacto contínuo</div>
            </button>
            <button
              onClick={() => setDonationType('single')}
              className={`flex-1 p-3 rounded-lg border-2 text-center transition-all duration-200 ${
                donationType === 'single'
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium">Única</div>
              <div className="text-sm text-gray-600">Contribuição pontual</div>
            </button>
          </div>
        </div>

        {/* Amount Selection */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Valor da doação:</h4>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-4">
            {predefinedAmounts.map(amount => (
              <button
                key={amount}
                onClick={() => {
                  setSelectedAmount(amount);
                  setCustomAmount('');
                }}
                className={`p-3 rounded-lg border-2 text-center font-medium transition-all duration-200 ${
                  selectedAmount === amount && !customAmount
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                R$ {amount}
              </button>
            ))}
          </div>
          
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="number"
              placeholder="Outro valor"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setSelectedAmount(25); // Reset selected amount
              }}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Donation Summary */}
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-medium text-green-800 mb-3">Resumo da doação:</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-green-700">Organização:</span>
              <span className="font-medium text-green-800">{selectedOrg.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">Tipo:</span>
              <span className="font-medium text-green-800">
                {donationType === 'monthly' ? 'Mensal' : 'Única'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">Valor:</span>
              <span className="font-medium text-green-800">R$ {finalAmount.toFixed(2)}</span>
            </div>
            {donationType === 'monthly' && (
              <div className="flex justify-between">
                <span className="text-green-700">Impacto anual:</span>
                <span className="font-medium text-green-800">R$ {(finalAmount * 12).toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Donation Button */}
        <button
          onClick={handleDonation}
          disabled={!finalAmount || finalAmount <= 0}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <Heart className="h-5 w-5" />
          <span>Doar R$ {finalAmount.toFixed(2)}</span>
        </button>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Finalizar Doação</h3>
            
            <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <div className="text-2xl">{selectedOrg.logo}</div>
                <div>
                  <h4 className="font-semibold text-purple-800">{selectedOrg.name}</h4>
                  <p className="text-sm text-purple-600">
                    Doação {donationType === 'monthly' ? 'mensal' : 'única'} de R$ {finalAmount.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <input
                type="text"
                placeholder="Nome completo"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <input
                type="email"
                placeholder="E-mail para recibo"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Número do cartão"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="MM/AA"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="CVV"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  alert('Doação realizada com sucesso! Obrigada por apoiar nossa causa. 💜');
                }}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 flex items-center justify-center space-x-2"
              >
                <CreditCard className="h-4 w-4" />
                <span>Confirmar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tax Benefits */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <Download className="h-6 w-6 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-lg font-medium text-blue-800 mb-2">Benefícios Fiscais</h4>
            <p className="text-blue-700 mb-4">
              Suas doações para organizações qualificadas podem ser deduzidas do Imposto de Renda, 
              conforme legislação vigente. Você receberá o recibo oficial para declaração.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-medium text-blue-800 mb-1">Pessoa Física:</h5>
                <p className="text-blue-700">Até 6% da renda bruta anual</p>
              </div>
              <div>
                <h5 className="font-medium text-blue-800 mb-1">Pessoa Jurídica:</h5>
                <p className="text-blue-700">Até 2% do lucro operacional</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Impact Stories */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Histórias de Impacto</h3>
        
        <div className="space-y-6">
          <div className="border-l-4 border-purple-400 pl-6">
            <h4 className="font-semibold text-gray-900 mb-2">Maria, 34 anos - São Paulo</h4>
            <p className="text-gray-700 mb-2">
              "Graças ao apoio do Instituto Maria da Penha, consegui sair de um relacionamento abusivo 
              e hoje tenho uma nova vida. As doações fazem toda a diferença."
            </p>
            <span className="text-sm text-purple-600">Apoiada em 2023</span>
          </div>
          
          <div className="border-l-4 border-green-400 pl-6">
            <h4 className="font-semibold text-gray-900 mb-2">Ana, 28 anos - Rio de Janeiro</h4>
            <p className="text-gray-700 mb-2">
              "O atendimento psicológico gratuito do Mapa do Acolhimento me ajudou a reconstruir 
              minha autoestima e confiança. Hoje sou voluntária e ajudo outras mulheres."
            </p>
            <span className="text-sm text-green-600">Apoiada em 2022</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationCenter;