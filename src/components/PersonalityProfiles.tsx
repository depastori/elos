import React, { useState } from 'react';
import { Brain, AlertTriangle, Search, BookOpen, CheckCircle, XCircle, Eye, FileText, Download } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
}

interface PersonalityProfilesProps {
  user: User;
}

type PersonalityType = 'narcissist' | 'sociopath' | 'psychopath' | 'borderline' | 'antisocial' | 'manipulator';

type RedFlag = {
  id: string;
  category: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  examples: string[];
};

type PersonalityProfile = {
  id: string;
  type: PersonalityType;
  name: string;
  description: string;
  prevalence: string;
  keyTraits: string[];
  redFlags: string[];
  manipulationTactics: string[];
  howToProtect: string[];
  dsmCriteria?: string[];
  color: string;
};

type AssessmentQuestion = {
  id: string;
  question: string;
  category: PersonalityType;
  weight: number;
};

const PersonalityProfiles: React.FC<PersonalityProfilesProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'profiles' | 'redflags' | 'assessment'>('profiles');
  const [selectedProfile, setSelectedProfile] = useState<PersonalityProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<string, boolean>>({});
  const [showResults, setShowResults] = useState(false);

  const personalityProfiles: PersonalityProfile[] = [
    {
      id: 'narcissist',
      type: 'narcissist',
      name: 'Transtorno Narcisista',
      description: 'Padrão invasivo de grandiosidade, necessidade de admiração e falta de empatia',
      prevalence: '1-6% da população',
      keyTraits: [
        'Senso grandioso de autoimportância',
        'Fantasias de sucesso ilimitado',
        'Necessidade excessiva de admiração',
        'Falta de empatia',
        'Comportamento arrogante',
        'Exploração de relacionamentos'
      ],
      redFlags: [
        'Love bombing inicial intenso',
        'Desvalorização súbita após idealização',
        'Nunca assume responsabilidade',
        'Culpa sempre os outros',
        'Ciúmes excessivos e possessividade',
        'Controle financeiro e social'
      ],
      manipulationTactics: [
        'Gaslighting (fazer você duvidar da realidade)',
        'Triangulação (usar terceiros para causar ciúmes)',
        'Hoovering (tentar te trazer de volta)',
        'Silent treatment (tratamento silencioso)',
        'Projeção (acusar você do que ele faz)',
        'DARVO (negar, atacar, reverter vítima/ofensor)'
      ],
      howToProtect: [
        'Documente tudo (mensagens, incidentes)',
        'Mantenha rede de apoio forte',
        'Não tente "consertar" ou mudar a pessoa',
        'Estabeleça limites firmes',
        'Busque terapia especializada',
        'Planeje saída segura se necessário'
      ],
      dsmCriteria: [
        'Senso grandioso de autoimportância',
        'Preocupação com fantasias de sucesso ilimitado',
        'Crença de ser "especial" e único',
        'Necessidade de admiração excessiva',
        'Senso de merecimento',
        'Exploração interpessoal',
        'Falta de empatia',
        'Inveja dos outros',
        'Comportamentos arrogantes'
      ],
      color: 'bg-red-500'
    },
    {
      id: 'sociopath',
      type: 'sociopath',
      name: 'Sociopatia',
      description: 'Padrão de desrespeito e violação dos direitos dos outros',
      prevalence: '0.5-3% da população',
      keyTraits: [
        'Desrespeito por normas sociais',
        'Enganação frequente',
        'Impulsividade',
        'Irritabilidade e agressividade',
        'Desprezo pela segurança',
        'Irresponsabilidade consistente'
      ],
      redFlags: [
        'Histórico de mentiras constantes',
        'Mudanças súbitas de humor',
        'Violência física ou ameaças',
        'Problemas com autoridades',
        'Falta de remorso genuíno',
        'Relacionamentos superficiais'
      ],
      manipulationTactics: [
        'Mentiras patológicas',
        'Chantagem emocional',
        'Intimidação e ameaças',
        'Isolamento da vítima',
        'Alternância entre carinho e crueldade',
        'Exploração de vulnerabilidades'
      ],
      howToProtect: [
        'Confie nos seus instintos',
        'Verifique informações independentemente',
        'Mantenha documentação de ameaças',
        'Não se isole de amigos/família',
        'Busque ajuda profissional',
        'Considere medidas legais se necessário'
      ],
      color: 'bg-orange-500'
    },
    {
      id: 'psychopath',
      type: 'psychopath',
      name: 'Psicopatia',
      description: 'Transtorno caracterizado por falta de empatia e comportamento antissocial',
      prevalence: '0.7-1% da população',
      keyTraits: [
        'Charme superficial',
        'Falta de remorso ou culpa',
        'Manipulação calculada',
        'Falta de empatia emocional',
        'Comportamento parasitário',
        'Controle comportamental pobre'
      ],
      redFlags: [
        'Charme excessivo no início',
        'Histórias que não batem',
        'Falta de amigos de longa data',
        'Crueldade com animais/pessoas vulneráveis',
        'Mentiras mesmo quando desnecessário',
        'Falta de emoções genuínas'
      ],
      manipulationTactics: [
        'Máscara de sanidade',
        'Manipulação emocional fria',
        'Exploração sistemática',
        'Chantagem e coerção',
        'Isolamento gradual',
        'Destruição da autoestima'
      ],
      howToProtect: [
        'Observe ações, não palavras',
        'Questione inconsistências',
        'Mantenha independência financeira',
        'Preserve relacionamentos externos',
        'Documente comportamentos estranhos',
        'Busque ajuda especializada'
      ],
      color: 'bg-purple-500'
    },
    {
      id: 'borderline',
      type: 'borderline',
      name: 'Transtorno Borderline',
      description: 'Padrão de instabilidade em relacionamentos, autoimagem e afetos',
      prevalence: '1-2% da população',
      keyTraits: [
        'Medo intenso de abandono',
        'Relacionamentos instáveis',
        'Perturbação da identidade',
        'Impulsividade autodestrutiva',
        'Instabilidade emocional',
        'Sentimentos crônicos de vazio'
      ],
      redFlags: [
        'Idealização seguida de desvalorização',
        'Ameaças de suicídio para controlar',
        'Raiva intensa e inadequada',
        'Comportamento autodestrutivo',
        'Paranoia em relacionamentos',
        'Mudanças extremas de humor'
      ],
      manipulationTactics: [
        'Chantagem emocional',
        'Ameaças de autolesão',
        'Culpabilização extrema',
        'Alternância amor/ódio',
        'Vitimização constante',
        'Sabotagem de relacionamentos'
      ],
      howToProtect: [
        'Estabeleça limites claros',
        'Não ceda a chantagens emocionais',
        'Encoraje tratamento profissional',
        'Cuide da sua saúde mental',
        'Tenha rede de apoio',
        'Considere terapia de casal'
      ],
      color: 'bg-pink-500'
    }
  ];

  const redFlags: RedFlag[] = [
    {
      id: '1',
      category: 'Controle',
      description: 'Tentativas de controlar onde você vai, com quem fala, o que veste',
      severity: 'high',
      examples: [
        'Verificar seu celular constantemente',
        'Proibir contato com amigos/família',
        'Controlar suas finanças',
        'Decidir sua aparência'
      ]
    },
    {
      id: '2',
      category: 'Isolamento',
      description: 'Afastar você de sua rede de apoio gradualmente',
      severity: 'critical',
      examples: [
        'Criar conflitos com seus amigos',
        'Mudar para longe da família',
        'Criticar pessoas importantes para você',
        'Monopolizar seu tempo livre'
      ]
    },
    {
      id: '3',
      category: 'Gaslighting',
      description: 'Fazer você questionar sua própria realidade e memória',
      severity: 'critical',
      examples: [
        'Negar coisas que claramente disse',
        'Minimizar seus sentimentos',
        'Distorcer eventos passados',
        'Te chamar de "louca" ou "sensível demais"'
      ]
    },
    {
      id: '4',
      category: 'Love Bombing',
      description: 'Demonstrações excessivas de afeto no início do relacionamento',
      severity: 'medium',
      examples: [
        'Presentes caros muito cedo',
        'Declarações de amor prematuras',
        'Atenção constante e sufocante',
        'Promessas de futuro irreais'
      ]
    }
  ];

  const assessmentQuestions: AssessmentQuestion[] = [
    {
      id: '1',
      question: 'Ele/ela nunca assume responsabilidade pelos próprios erros?',
      category: 'narcissist',
      weight: 3
    },
    {
      id: '2',
      question: 'Demonstra falta de empatia genuína pelos seus sentimentos?',
      category: 'narcissist',
      weight: 3
    },
    {
      id: '3',
      question: 'Tem histórico de mentiras frequentes, mesmo sobre coisas pequenas?',
      category: 'sociopath',
      weight: 3
    },
    {
      id: '4',
      question: 'Apresenta mudanças extremas de humor sem motivo aparente?',
      category: 'borderline',
      weight: 2
    },
    {
      id: '5',
      question: 'Usa chantagem emocional para conseguir o que quer?',
      category: 'manipulator',
      weight: 3
    },
    {
      id: '6',
      question: 'Demonstra charme excessivo, especialmente com estranhos?',
      category: 'psychopath',
      weight: 2
    },
    {
      id: '7',
      question: 'Tenta controlar suas atividades, amizades ou aparência?',
      category: 'narcissist',
      weight: 3
    },
    {
      id: '8',
      question: 'Faz você questionar sua própria memória ou percepção?',
      category: 'narcissist',
      weight: 3
    }
  ];

  const handleAssessmentAnswer = (questionId: string, answer: boolean) => {
    setAssessmentAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const calculateResults = () => {
    const scores: Record<PersonalityType | 'manipulator', number> = {
      narcissist: 0,
      sociopath: 0,
      psychopath: 0,
      borderline: 0,
      antisocial: 0,
      manipulator: 0
    };

    assessmentQuestions.forEach(question => {
      if (assessmentAnswers[question.id]) {
        scores[question.category] += question.weight;
      }
    });

    return scores;
  };

  const getSeverityColor = (severity: string) => {
    const colors = {
      low: 'bg-green-100 text-green-700',
      medium: 'bg-yellow-100 text-yellow-700',
      high: 'bg-orange-100 text-orange-700',
      critical: 'bg-red-100 text-red-700'
    };
    return colors[severity as keyof typeof colors];
  };

  const filteredProfiles = personalityProfiles.filter(profile =>
    profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    profile.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Brain className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Perfis de Personalidades Agressoras</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Aprenda a identificar padrões comportamentais perigosos e red flags para se proteger de relacionamentos abusivos.
        </p>
      </div>

      {/* Warning */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-6 w-6 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-medium text-yellow-800">⚠️ Importante</h3>
            <p className="text-yellow-700 mt-1">
              Este conteúdo é educativo e não substitui diagnóstico profissional. 
              Se você está em um relacionamento abusivo, busque ajuda especializada.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex border-b border-gray-200">
          {[
            { id: 'profiles', label: 'Perfis de Personalidade', icon: Brain },
            { id: 'redflags', label: 'Red Flags', icon: AlertTriangle },
            { id: 'assessment', label: 'Avaliação', icon: FileText }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                  activeTab === tab.id
                    ? 'text-purple-700 border-b-2 border-purple-500 bg-purple-50'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {/* Profiles Tab */}
          {activeTab === 'profiles' && (
            <div className="space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar perfis de personalidade..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProfiles.map(profile => (
                  <div key={profile.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 ${profile.color} rounded-lg flex items-center justify-center`}>
                          <Brain className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{profile.name}</h3>
                          <p className="text-sm text-gray-600">{profile.prevalence}</p>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4">{profile.description}</p>

                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Principais Características:</h4>
                      <div className="space-y-1">
                        {profile.keyTraits.slice(0, 3).map((trait, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-600">
                            <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                            {trait}
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedProfile(profile)}
                      className="w-full bg-purple-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-600 transition-all duration-200"
                    >
                      Ver Detalhes Completos
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Red Flags Tab */}
          {activeTab === 'redflags' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sinais de Alerta (Red Flags)</h3>
                <p className="text-gray-600 mb-6">
                  Reconheça os sinais precoces de comportamento abusivo e manipulativo.
                </p>
              </div>

              <div className="space-y-4">
                {redFlags.map(flag => (
                  <div key={flag.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">{flag.category}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(flag.severity)}`}>
                        {flag.severity === 'low' ? 'Baixo' :
                         flag.severity === 'medium' ? 'Médio' :
                         flag.severity === 'high' ? 'Alto' : 'Crítico'}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{flag.description}</p>
                    
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Exemplos:</h5>
                      <ul className="space-y-1">
                        {flag.examples.map((example, index) => (
                          <li key={index} className="flex items-start text-sm text-gray-600">
                            <AlertTriangle className="h-3 w-3 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assessment Tab */}
          {activeTab === 'assessment' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Avaliação de Comportamento</h3>
                <p className="text-gray-600 mb-6">
                  Responda às perguntas sobre o comportamento da pessoa para identificar possíveis padrões preocupantes.
                </p>
              </div>

              {!showResults ? (
                <div className="space-y-4">
                  {assessmentQuestions.map(question => (
                    <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                      <p className="text-gray-900 mb-3">{question.question}</p>
                      <div className="flex space-x-4">
                        <button
                          onClick={() => handleAssessmentAnswer(question.id, true)}
                          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                            assessmentAnswers[question.id] === true
                              ? 'bg-red-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          Sim
                        </button>
                        <button
                          onClick={() => handleAssessmentAnswer(question.id, false)}
                          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                            assessmentAnswers[question.id] === false
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          Não
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => setShowResults(true)}
                    disabled={Object.keys(assessmentAnswers).length < assessmentQuestions.length}
                    className="w-full bg-purple-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    Ver Resultados
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h4 className="font-semibold text-red-800 mb-4">Resultados da Avaliação</h4>
                    
                    {(() => {
                      const scores = calculateResults();
                      const maxScore = Math.max(...Object.values(scores));
                      const dominantTypes = Object.entries(scores)
                        .filter(([_, score]) => score === maxScore && score > 0)
                        .map(([type, _]) => type);

                      if (maxScore === 0) {
                        return (
                          <div className="text-center py-8">
                            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-green-800 mb-2">Resultado Positivo</h3>
                            <p className="text-green-700">
                              Com base nas respostas, não foram identificados padrões preocupantes significativos.
                            </p>
                          </div>
                        );
                      }

                      return (
                        <div>
                          <div className="mb-4">
                            <AlertTriangle className="h-8 w-8 text-red-600 mb-2" />
                            <p className="text-red-700 mb-4">
                              Foram identificados possíveis padrões de comportamento preocupantes. 
                              Recomendamos buscar orientação profissional.
                            </p>
                          </div>
                          
                          <div className="space-y-3">
                            {dominantTypes.map(type => {
                              const profile = personalityProfiles.find(p => p.type === type);
                              if (!profile) return null;
                              
                              return (
                                <div key={type} className="bg-white border border-red-200 rounded-lg p-4">
                                  <h5 className="font-medium text-gray-900 mb-2">{profile.name}</h5>
                                  <p className="text-sm text-gray-700 mb-3">{profile.description}</p>
                                  <button
                                    onClick={() => setSelectedProfile(profile)}
                                    className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                                  >
                                    Ver perfil completo →
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  <button
                    onClick={() => {
                      setShowResults(false);
                      setAssessmentAnswers({});
                    }}
                    className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-600 transition-all duration-200"
                  >
                    Fazer Nova Avaliação
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Profile Details Modal */}
      {selectedProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 ${selectedProfile.color} rounded-lg flex items-center justify-center`}>
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{selectedProfile.name}</h3>
                  <p className="text-gray-600">{selectedProfile.prevalence}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedProfile(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Descrição</h4>
                <p className="text-gray-700">{selectedProfile.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Características Principais</h4>
                  <ul className="space-y-2">
                    {selectedProfile.keyTraits.map((trait, index) => (
                      <li key={index} className="flex items-start text-sm text-gray-700">
                        <div className="w-2 h-2 bg-red-400 rounded-full mr-3 mt-2"></div>
                        {trait}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Red Flags</h4>
                  <ul className="space-y-2">
                    {selectedProfile.redFlags.map((flag, index) => (
                      <li key={index} className="flex items-start text-sm text-gray-700">
                        <AlertTriangle className="h-3 w-3 text-red-500 mr-2 mt-1 flex-shrink-0" />
                        {flag}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Táticas de Manipulação</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedProfile.manipulationTactics.map((tactic, index) => (
                    <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm text-red-800">{tactic}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Como Se Proteger</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedProfile.howToProtect.map((protection, index) => (
                    <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm text-green-800">{protection}</p>
                    </div>
                  ))}
                </div>
              </div>

              {selectedProfile.dsmCriteria && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Critérios DSM-5</h4>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <ul className="space-y-1">
                      {selectedProfile.dsmCriteria.map((criteria, index) => (
                        <li key={index} className="text-sm text-blue-800">
                          {index + 1}. {criteria}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalityProfiles;