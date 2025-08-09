import React, { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Alert, AlertDescription } from './ui/alert'
import { Brain, AlertTriangle, CheckCircle, BookOpen, Target, ArrowRight } from 'lucide-react'

export function EducationScreen({ user }) {
  const [selectedProfile, setSelectedProfile] = useState(null)
  const [testAnswers, setTestAnswers] = useState({})
  const [testResult, setTestResult] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [showTest, setShowTest] = useState(false)

  const personalityProfiles = [
    {
      id: 'narcissist',
      name: 'Transtorno de Personalidade Narcisista',
      dsmCode: 'F60.81',
      color: 'red',
      icon: '👑',
      shortDescription: 'Grandiosidade, necessidade de admiração, falta de empatia',
      prevalence: '0,5% - 1,9% da população geral',
      characteristics: [
        'Senso grandioso de importância própria',
        'Fantasias de sucesso, poder, beleza ou amor ideal',
        'Crença de ser especial e único',
        'Necessidade excessiva de admiração',
        'Senso de merecimento',
        'Exploração interpessoal',
        'Falta de empatia',
        'Inveja dos outros',
        'Comportamentos arrogantes'
      ],
      behaviors: [
        'Monopoliza conversas',
        'Desvaloriza ou menospreza os outros',
        'Fica irritado quando não é o centro das atenções',
        'Tem dificuldade em lidar com críticas',
        'Exagera conquistas e talentos',
        'Espera tratamento especial',
        'Tem relacionamentos superficiais'
      ],
      redFlags: [
        '🚩 Te elogia excessivamente no início (love bombing)',
        '🚩 Fala muito sobre ex-parceiros de forma depreciativa',
        '🚩 Nunca assume culpa por problemas',
        '🚩 Te critica sutilmente para baixar sua autoestima',
        '🚩 Quer controlar sua aparência e comportamento',
        '🚩 Fica com raiva quando você tem sucesso',
        '🚩 Te isola de amigos e família',
        '🚩 Alterna entre te idealizar e te desvalorizar'
      ],
      relationshipPattern: 'Início intenso e romântico, seguido de desvalorização gradual e controle emocional.',
      dangerLevel: 'Alto'
    },
    {
      id: 'antisocial',
      name: 'Transtorno de Personalidade Antissocial',
      dsmCode: 'F60.2',
      color: 'orange',
      icon: '⚠️',
      shortDescription: 'Desrespeito e violação dos direitos dos outros',
      prevalence: '0,5% - 3% da população geral',
      characteristics: [
        'Desrespeito por normas sociais',
        'Engano constante (mentiras, golpes)',
        'Impulsividade',
        'Irritabilidade e agressividade',
        'Desprezo pela segurança própria e alheia',
        'Irresponsabilidade persistente',
        'Ausência de remorso'
      ],
      behaviors: [
        'Mente compulsivamente',
        'Manipula para ganho pessoal',
        'Quebra promessas facilmente',
        'Age de forma impulsiva',
        'Tem histórico de problemas legais',
        'Não mantém trabalho estável',
        'Violenta fisicamente sem provocação'
      ],
      redFlags: [
        '🚩 Tem histórico criminal ou legal',
        '🚩 Mente sobre coisas pequenas e grandes',
        '🚩 Não demonstra remorso por machucar você',
        '🚩 Quebra promessas constantemente',
        '🚩 Tem problemas com álcool ou drogas',
        '🚩 É cruel com animais',
        '🚩 Explode em raiva desproporcional',
        '🚩 Culpa os outros por todos os problemas'
      ],
      relationshipPattern: 'Comportamento encantador inicial mascarando tendências manipuladoras e potencialmente violentas.',
      dangerLevel: 'Extremo'
    },
    {
      id: 'borderline',
      name: 'Transtorno de Personalidade Borderline',
      dsmCode: 'F60.3',
      color: 'purple',
      icon: '🎭',
      shortDescription: 'Instabilidade emocional, relacionamentos e autoimagem',
      prevalence: '0,7% - 2,7% da população geral',
      characteristics: [
        'Esforços para evitar abandono',
        'Relacionamentos interpessoais instáveis',
        'Perturbação da identidade',
        'Impulsividade autodestrutiva',
        'Comportamento suicida ou autolesão',
        'Instabilidade afetiva',
        'Sentimentos crônicos de vazio',
        'Raiva inadequada intensa',
        'Ideação paranoide ou sintomas dissociativos'
      ],
      behaviors: [
        'Alterna entre idealizar e desvalorizar',
        'Tem mudanças de humor extremas',
        'Ameaça suicídio quando se sente abandonado',
        'Age impulsivamente (gastos, sexo, drogas)',
        'Tem episódios de raiva intensa',
        'Sente-se vazio constantemente',
        'Tem relações muito intensas'
      ],
      redFlags: [
        '🚩 Fica obcecado rapidamente por você',
        '🚩 Ameaça se machucar se você sair',
        '🚩 Tem mudanças extremas de humor',
        '🚩 Ve você como perfeita ou terrível, nunca meio termo',
        '🚩 Invade sua privacidade constantemente',
        '🚩 Faz cenas dramáticas em público',
        '🚩 Usa chantagem emocional frequentemente',
        '🚩 Tem histórico de relacionamentos destrutivos'
      ],
      relationshipPattern: 'Intensidade emocional extrema com alternância entre adoração e ódio.',
      dangerLevel: 'Moderado a Alto'
    },
    {
      id: 'psychopath',
      name: 'Psicopatia (Transtorno de Conduta)',
      dsmCode: 'F91.9',
      color: 'black',
      icon: '🎪',
      shortDescription: 'Falta de empatia, manipulação e encanto superficial',
      prevalence: '1% da população geral',
      characteristics: [
        'Encanto superficial',
        'Ego inflado',
        'Falta de remorso ou culpa',
        'Falta de empatia',
        'Manipulação enganosa',
        'Comportamento antissocial',
        'Impulsividade',
        'Controle comportamental pobre',
        'Necessidade de estimulação'
      ],
      behaviors: [
        'É extremamente charmoso inicialmente',
        'Conta histórias elaboradas e convincentes',
        'Não demonstra emoções genuínas',
        'Manipula sem demonstrar culpa',
        'Observa suas reações friamente',
        'Tem muitos relacionamentos superficiais',
        'Mente sobre sua história pessoal'
      ],
      redFlags: [
        '🚩 É charmoso demais, parece "bom demais para ser verdade"',
        '🚩 Suas histórias não batem quando contadas de novo',
        '🚩 Não tem amigos de longa data',
        '🚩 Observa você como se fosse um experimento',
        '🚩 Não demonstra emoções em situações apropriadas',
        '🚩 Manipula situações para benefício próprio',
        '🚩 Te faz questionar sua própria sanidade (gaslighting)',
        '🚩 Tem passado misterioso ou contraditório'
      ],
      relationshipPattern: 'Sedução calculada seguida de manipulação fria e descarte emocional.',
      dangerLevel: 'Extremo'
    }
  ]

  const testQuestions = [
    {
      id: 1,
      question: 'Como ele reage quando você recebe elogios ou conquista algo?',
      options: [
        { id: 'a', text: 'Fica genuinamente feliz e te parabeniza', points: { normal: 3 } },
        { id: 'b', text: 'Minimiza sua conquista ou muda de assunto', points: { narcissist: 2, antisocial: 1 } },
        { id: 'c', text: 'Fica irritado ou tenta diminuir sua alegria', points: { narcissist: 3, borderline: 2 } },
        { id: 'd', text: 'Finge felicidade mas você sente que não é genuína', points: { psychopath: 3, antisocial: 1 } }
      ]
    },
    {
      id: 2,
      question: 'Como ele lida com críticas ou quando está errado?',
      options: [
        { id: 'a', text: 'Aceita e tenta melhorar', points: { normal: 3 } },
        { id: 'b', text: 'Nega veementemente e culpa outros', points: { narcissist: 3, antisocial: 2 } },
        { id: 'c', text: 'Tem explosões de raiva ou fica muito deprimido', points: { borderline: 3, narcissist: 1 } },
        { id: 'd', text: 'Concorda superficialmente mas não muda', points: { psychopath: 3, antisocial: 1 } }
      ]
    },
    {
      id: 3,
      question: 'Como ele trata pessoas "inferiores" (garçons, faxineiros, etc.)?',
      options: [
        { id: 'a', text: 'Com respeito e educação', points: { normal: 3 } },
        { id: 'b', text: 'Com indiferença ou desprezo sutil', points: { narcissist: 2, psychopath: 2 } },
        { id: 'c', text: 'De forma rude e arrogante', points: { narcissist: 3, antisocial: 3 } },
        { id: 'd', text: 'Varia drasticamente dependendo do humor', points: { borderline: 3, antisocial: 1 } }
      ]
    },
    {
      id: 4,
      question: 'Qual o padrão de relacionamentos anteriores dele?',
      options: [
        { id: 'a', text: 'Relacionamentos saudáveis que terminaram amigavelmente', points: { normal: 3 } },
        { id: 'b', text: 'Todas as ex são "loucas" ou "problemáticas"', points: { narcissist: 3, antisocial: 2, psychopath: 2 } },
        { id: 'c', text: 'Relacionamentos muito intensos que terminaram dramaticamente', points: { borderline: 3, psychopath: 1 } },
        { id: 'd', text: 'Evita falar sobre o passado ou mente sobre ele', points: { psychopath: 3, antisocial: 3 } }
      ]
    },
    {
      id: 5,
      question: 'Como ele demonstra afeto?',
      options: [
        { id: 'a', text: 'De forma consistente e genuína', points: { normal: 3 } },
        { id: 'b', text: 'Apenas quando quer algo ou em público', points: { narcissist: 3, psychopath: 2 } },
        { id: 'c', text: 'De forma excessiva e intensa', points: { borderline: 3, narcissist: 1 } },
        { id: 'd', text: 'Parece calculado ou performático', points: { psychopath: 3, antisocial: 2 } }
      ]
    },
    {
      id: 6,
      question: 'Qual a reação dele quando você quer tempo com amigas/família?',
      options: [
        { id: 'a', text: 'Incentiva e respeita seu espaço', points: { normal: 3 } },
        { id: 'b', text: 'Fica irritado mas tenta disfarçar', points: { narcissist: 2, antisocial: 1 } },
        { id: 'c', text: 'Faz drama ou ameaça te deixar', points: { borderline: 3, narcissist: 2 } },
        { id: 'd', text: 'Concorda mas sabota sutilmente seus planos', points: { psychopath: 3, antisocial: 2 } }
      ]
    },
    {
      id: 7,
      question: 'Como ele lida com as próprias emoções?',
      options: [
        { id: 'a', text: 'Expressa de forma saudável e adequada', points: { normal: 3 } },
        { id: 'b', text: 'Raramente mostra vulnerabilidade genuína', points: { narcissist: 2, psychopath: 3 } },
        { id: 'c', text: 'Tem explosões emocionais extremas', points: { borderline: 3, antisocial: 2 } },
        { id: 'd', text: 'Parece não ter emoções profundas reais', points: { psychopath: 3, antisocial: 1 } }
      ]
    },
    {
      id: 8,
      question: 'Quando você está passando por dificuldades, ele:',
      options: [
        { id: 'a', text: 'Te oferece apoio genuíno e empático', points: { normal: 3 } },
        { id: 'b', text: 'Faz sobre ele mesmo ou minimiza seus problemas', points: { narcissist: 3, antisocial: 1 } },
        { id: 'c', text: 'Fica ainda mais necessitado de atenção', points: { borderline: 2, narcissist: 2 } },
        { id: 'd', text: 'Parece estudar suas reações com frieza', points: { psychopath: 3, antisocial: 1 } }
      ]
    }
  ]

  const calculateTestResult = () => {
    const scores = {
      normal: 0,
      narcissist: 0,
      borderline: 0,
      antisocial: 0,
      psychopath: 0
    }

    Object.values(testAnswers).forEach(answerId => {
      testQuestions.forEach(question => {
        const selectedOption = question.options.find(opt => opt.id === answerId)
        if (selectedOption) {
          Object.entries(selectedOption.points).forEach(([type, points]) => {
            scores[type] = (scores[type] || 0) + points
          })
        }
      })
    })

    const maxScore = Math.max(...Object.values(scores))
    const resultType = Object.keys(scores).find(key => scores[key] === maxScore)
    
    let result = {
      type: resultType,
      scores,
      confidence: Math.round((maxScore / (testQuestions.length * 3)) * 100)
    }

    if (resultType === 'normal') {
      result.message = 'Baseado nas suas respostas, a pessoa parece ter características de personalidade saudável.'
      result.color = 'green'
    } else {
      const profile = personalityProfiles.find(p => p.id === resultType)
      result.message = `Baseado nas suas respostas, a pessoa pode apresentar características de ${profile.name}.`
      result.color = profile.color
      result.profile = profile
    }

    return result
  }

  const handleTestSubmit = () => {
    const result = calculateTestResult()
    setTestResult(result)
    setCurrentQuestion(0)
  }

  const nextQuestion = () => {
    if (currentQuestion < testQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const resetTest = () => {
    setTestAnswers({})
    setTestResult(null)
    setCurrentQuestion(0)
    setShowTest(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl text-purple-800 mb-2">Educação e Conscientização</h2>
        <p className="text-purple-600">
          Conheça perfis de personalidade e aprenda a identificar red flags em relacionamentos
        </p>
      </div>

      <Tabs defaultValue="profiles" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profiles">Perfis de Personalidade</TabsTrigger>
          <TabsTrigger value="test">Teste Educativo</TabsTrigger>
        </TabsList>

        {/* Perfis de Personalidade */}
        <TabsContent value="profiles" className="mt-6">
          <Alert className="mb-6">
            <Brain className="h-4 w-4" />
            <AlertDescription>
              <strong>Aviso Importante:</strong> Estas informações são baseadas no DSM-5 e destinam-se apenas à 
              educação. O diagnóstico de transtornos de personalidade deve ser feito exclusivamente por 
              profissionais qualificados. Use este conhecimento para se proteger, não para diagnosticar outros.
            </AlertDescription>
          </Alert>

          {!selectedProfile ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {personalityProfiles.map((profile) => (
                <Card 
                  key={profile.id} 
                  className="hover:shadow-lg transition-all cursor-pointer border-l-4"
                  style={{ borderLeftColor: profile.color === 'black' ? '#1f2937' : profile.color }}
                  onClick={() => setSelectedProfile(profile)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="text-3xl">{profile.icon}</div>
                      <div className="flex-1">
                        <h3 className="text-lg text-purple-800 mb-2">{profile.name}</h3>
                        <Badge variant="outline" className="mb-2 text-xs">
                          DSM-5: {profile.dsmCode}
                        </Badge>
                        <p className="text-sm text-gray-600 mb-3">{profile.shortDescription}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Prevalência: {profile.prevalence}</span>
                          <Badge className={`
                            ${profile.dangerLevel === 'Extremo' ? 'bg-red-500' :
                              profile.dangerLevel === 'Alto' ? 'bg-orange-500' :
                              profile.dangerLevel === 'Moderado a Alto' ? 'bg-yellow-500' :
                              'bg-green-500'
                            } text-white text-xs
                          `}>
                            Risco: {profile.dangerLevel}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      Ver Detalhes Completos
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" onClick={() => setSelectedProfile(null)}>
                  ← Voltar
                </Button>
                <div className="text-3xl">{selectedProfile.icon}</div>
                <div>
                  <h1 className="text-2xl text-purple-800">{selectedProfile.name}</h1>
                  <Badge variant="outline" className="text-sm">
                    DSM-5: {selectedProfile.dsmCode}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Características Clínicas */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-800">
                      <Brain className="w-5 h-5" />
                      Características (DSM-5)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {selectedProfile.characteristics.map((char, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          {char}
                        </li>
                      ))}
                    </ul>
                    
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Prevalência:</strong> {selectedProfile.prevalence}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Comportamentos Observáveis */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-800">
                      <Brain className="w-5 h-5" />
                      Como Se Comportam
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {selectedProfile.behaviors.map((behavior, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <Target className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                          {behavior}
                        </li>
                      ))}
                    </ul>
                    
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Padrão em Relacionamentos:</strong><br />
                        {selectedProfile.relationshipPattern}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Red Flags */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-800">
                      <AlertTriangle className="w-5 h-5" />
                      Red Flags - Sinais de Alerta
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedProfile.redFlags.map((flag, index) => (
                        <div key={index} className="p-3 bg-red-50 border-l-4 border-red-400 rounded">
                          <p className="text-sm text-red-800">{flag}</p>
                        </div>
                      ))}
                    </div>
                    
                    <Alert className="mt-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        <strong>Nível de Perigo: {selectedProfile.dangerLevel}</strong><br />
                        Se você reconhece múltiplos sinais, busque ajuda profissional e planeje sua segurança.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Teste Educativo */}
        <TabsContent value="test" className="mt-6">
          <Alert className="mb-6">
            <Brain className="h-4 w-4" />
            <AlertDescription>
              <strong>Teste Educativo:</strong> Este teste é apenas para fins educativos e de conscientização. 
              Não substitui avaliação profissional. Use para reflexão pessoal sobre relacionamentos.
            </AlertDescription>
          </Alert>

          {!showTest && !testResult && (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-6xl mb-4">🧠</div>
                <h3 className="text-xl text-purple-800 mb-4">
                  Teste: Identificando Padrões de Personalidade
                </h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Responda algumas perguntas sobre alguém (parceiro atual, ex, ou alguém que você está conhecendo) 
                  para identificar possíveis padrões de personalidade. Este teste é educativo e pode ajudar 
                  você a reconhecer red flags.
                </p>
                <Button onClick={() => setShowTest(true)} className="bg-purple-600 hover:bg-purple-700">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Iniciar Teste
                </Button>
              </CardContent>
            </Card>
          )}

          {showTest && !testResult && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Pergunta {currentQuestion + 1} de {testQuestions.length}</CardTitle>
                  <Badge variant="outline">
                    {Math.round(((currentQuestion + 1) / testQuestions.length) * 100)}%
                  </Badge>
                </div>
                <Progress value={((currentQuestion + 1) / testQuestions.length) * 100} className="mt-2" />
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <h3 className="text-lg text-purple-800 mb-4">
                    {testQuestions[currentQuestion].question}
                  </h3>
                  
                  <RadioGroup
                    value={testAnswers[currentQuestion + 1]}
                    onValueChange={(value) => setTestAnswers(prev => ({ 
                      ...prev, 
                      [currentQuestion + 1]: value 
                    }))}
                  >
                    {testQuestions[currentQuestion].options.map((option) => (
                      <div key={option.id} className="flex items-start space-x-2 p-3 rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
                        <label htmlFor={option.id} className="text-sm cursor-pointer flex-1">
                          {option.text}
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={prevQuestion}
                    disabled={currentQuestion === 0}
                  >
                    Anterior
                  </Button>
                  
                  {currentQuestion === testQuestions.length - 1 ? (
                    <Button 
                      onClick={handleTestSubmit}
                      disabled={Object.keys(testAnswers).length !== testQuestions.length}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Ver Resultado
                    </Button>
                  ) : (
                    <Button 
                      onClick={nextQuestion}
                      disabled={!testAnswers[currentQuestion + 1]}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Próxima
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {testResult && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-center text-purple-800">
                    🎯 Resultado do Teste
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className={`
                      text-6xl mb-4
                      ${testResult.type === 'normal' ? '😊' : '⚠️'}
                    `}>
                      {testResult.type === 'normal' ? '😊' : '⚠️'}
                    </div>
                    <p className="text-lg text-gray-800 mb-2">{testResult.message}</p>
                    <Badge className={`
                      text-sm px-4 py-2
                      ${testResult.color === 'green' ? 'bg-green-100 text-green-800' :
                        testResult.color === 'red' ? 'bg-red-100 text-red-800' :
                        testResult.color === 'orange' ? 'bg-orange-100 text-orange-800' :
                        testResult.color === 'purple' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }
                    `}>
                      Confiança: {testResult.confidence}%
                    </Badge>
                  </div>

                  {testResult.type !== 'normal' && testResult.profile && (
                    <Alert className="mb-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Importante:</strong> Este resultado indica possíveis red flags. 
                        Se você está em um relacionamento com essa pessoa, considere:
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          <li>Conversar com um profissional (psicólogo, terapeuta)</li>
                          <li>Buscar apoio de amigos e família</li>
                          <li>Avaliar sua segurança emocional e física</li>
                          <li>Considerar se este relacionamento é saudável para você</li>
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="text-center space-x-4">
                    <Button onClick={resetTest} variant="outline">
                      Fazer Novo Teste
                    </Button>
                    {testResult.profile && (
                      <Button 
                        onClick={() => setSelectedProfile(testResult.profile)}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        Saber Mais Sobre Este Perfil
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {testResult.type === 'normal' && (
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-6 text-center">
                    <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                    <h4 className="text-green-800 mb-2">✅ Sinais Positivos!</h4>
                    <p className="text-green-700">
                      Baseado nas suas respostas, a pessoa demonstra características de personalidade saudável. 
                      Continue observando e confiando nos seus instintos sobre o relacionamento.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}