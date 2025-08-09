import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { ArrowLeft, Search, Filter, Users, MapPin, FileText, Eye, AlertTriangle, Plus, Shield } from 'lucide-react'
import { projectId, publicAnonKey } from '../utils/supabase/info'

export function AggressorCatalog({ onBack, onSelectAggressor, user }) {
  const [aggressors, setAggressors] = useState([])
  const [filteredAggressors, setFilteredAggressors] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [riskFilter, setRiskFilter] = useState('all')
  const [locationFilter, setLocationFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name') // Ordem alfabética por padrão

  useEffect(() => {
    loadAggressors()
  }, [])

  useEffect(() => {
    filterAndSortAggressors()
  }, [aggressors, searchTerm, riskFilter, locationFilter, sortBy])

  const loadAggressors = async () => {
    console.log('🔍 Carregando catálogo de agressores...')
    
    // Sempre carregar dados simulados para demonstração
    const simulatedAggressors = [
      {
        id: '7',
        name: 'Bruno Henrique Santos',
        riskScore: 75,
        reports: ['r11', 'r12'],
        locations: ['Vila Olímpia', 'Moema'],
        physicalDescription: {
          height: 'Alto (1.82m)',
          build: '', // FALTANDO - para demonstrar preenchimento colaborativo
          hairColor: 'Castanho escuro',
          eyeColor: '', // FALTANDO
          skinColor: 'Branca',
          age: '32',
          distinctiveMarks: 'Tatuagem no braço direito com nome "Maria"' // Informação já preenchida
        },
        vehicles: [
          { description: 'Civic branco', plate: '', color: 'Branco' }, // Placa faltando
        ],
        patterns: [], // FALTANDO - padrões de comportamento
        lastReportDate: '2024-01-14',
        missingInfo: ['build', 'eyeColor', 'vehiclePlate', 'behaviorPatterns'], // Campos que precisam ser preenchidos
        detailedReports: [
          {
            id: 'r11',
            violenceType: 'fisica',
            description: 'Agrediu ex-namorada na saída do trabalho. Ela trabalha na Vila Olímpia como advogada. Ele chegou no local por volta das 18h e começou a gritar na frente de todos.',
            location: 'Vila Olímpia - Faria Lima',
            createdAt: '2024-01-14T18:30:00Z',
            hasEvidence: true,
            photoUrl: 'evidence1.jpg',
            reporterInfo: 'Denúncia anônima verificada', // Para público
            isAnonymous: true
          },
          {
            id: 'r12',
            violenceType: 'psicologica',
            description: 'Perseguição e ameaças por WhatsApp. Criou perfis falsos nas redes sociais dela para difamar.',
            location: 'Moema',
            createdAt: '2024-01-12T14:20:00Z',
            hasEvidence: true,
            photoUrl: 'evidence2.jpg',
            reporterInfo: 'Relato da comunidade',
            isAnonymous: true
          }
        ]
      },
      {
        id: '3',
        name: 'Carlos Alberto Lima',
        riskScore: 45,
        reports: ['r6'],
        locations: ['Periferia'],
        physicalDescription: {
          height: 'Baixo (1.65m)',
          build: 'Magro',
          hairColor: 'Careca',
          eyeColor: 'Azuis'
        },
        lastReportDate: '2024-01-05',
        detailedReports: [
          {
            id: 'r6',
            violenceType: 'psicologica',
            description: 'Comportamento agressivo e intimidatório em relacionamentos',
            location: 'Periferia Sul',
            createdAt: '2024-01-05T14:30:00Z',
            hasEvidence: false,
            reporterInfo: 'Denúncia anônima',
            isAnonymous: true
          }
        ]
      },
      {
        id: '4',
        name: 'Fernando José Santos',
        riskScore: 70,
        reports: ['r7', 'r8'],
        locations: ['Vila Madalena', 'Pinheiros'],
        physicalDescription: {
          height: 'Médio (1.78m)',
          build: 'Atlético',
          hairColor: 'Loiro',
          eyeColor: 'Verdes'
        },
        lastReportDate: '2024-01-12',
        detailedReports: [
          {
            id: 'r7',
            violenceType: 'fisica',
            description: 'Agressão física durante discussão em bar',
            location: 'Vila Madalena',
            createdAt: '2024-01-12T20:15:00Z',
            hasEvidence: true,
            reporterInfo: 'Denúncia anônima verificada',
            isAnonymous: true
          }
        ]
      },
      {
        id: '1',
        name: 'João Silva Santos',
        riskScore: 85,
        reports: ['r1', 'r2', 'r3'],
        locations: ['Centro', 'Vila Nova', 'Jardim das Flores'],
        physicalDescription: {
          height: 'Alto (1.85m)',
          build: 'Forte',
          hairColor: 'Castanho',
          eyeColor: 'Castanhos'
        },
        lastReportDate: '2024-01-15',
        detailedReports: [
          {
            id: 'r1',
            violenceType: 'fisica',
            description: 'Agressão física contra ex-companheira. Histórico de violência doméstica.',
            location: 'Centro da cidade',
            createdAt: '2024-01-15T14:30:00Z',
            hasEvidence: true,
            reporterInfo: 'Denúncia oficial verificada',
            isAnonymous: true
          },
          {
            id: 'r2',
            violenceType: 'psicologica',
            description: 'Ameaças constantes e perseguição. Comportamento possessivo.',
            location: 'Vila Nova',
            createdAt: '2024-01-10T10:20:00Z',
            hasEvidence: false,
            reporterInfo: 'Relato da comunidade',
            isAnonymous: true
          }
        ]
      },
      {
        id: '5',
        name: 'Marco Antônio Pereira',
        riskScore: 30,
        reports: ['r9'],
        locations: ['Bela Vista'],
        physicalDescription: {
          height: 'Alto (1.88m)',
          build: 'Magro',
          hairColor: 'Grisalho',
          eyeColor: 'Castanhos'
        },
        lastReportDate: '2024-01-08',
        detailedReports: [
          {
            id: 'r9',
            violenceType: 'moral',
            description: 'Difamação e calúnia em redes sociais',
            location: 'Bela Vista',
            createdAt: '2024-01-08T16:45:00Z',
            hasEvidence: true,
            reporterInfo: 'Denúncia anônima',
            isAnonymous: true
          }
        ]
      },
      {
        id: '2',
        name: 'Pedro Oliveira Costa',
        riskScore: 65,
        reports: ['r4', 'r5'],
        locations: ['Bairro Alto', 'Centro'],
        physicalDescription: {
          height: 'Médio (1.75m)',
          build: 'Médio',
          hairColor: 'Preto',
          eyeColor: 'Pretos'
        },
        lastReportDate: '2024-01-10',
        detailedReports: [
          {
            id: 'r4',
            violenceType: 'sexual',
            description: 'Assédio sexual em ambiente de trabalho',
            location: 'Bairro Alto',
            createdAt: '2024-01-10T09:30:00Z',
            hasEvidence: true,
            reporterInfo: 'Denúncia anônima verificada',
            isAnonymous: true
          }
        ]
      },
      {
        id: '6',
        name: 'Roberto Carlos Silva',
        riskScore: 55,
        reports: ['r10'],
        locations: ['Liberdade'],
        physicalDescription: {
          height: 'Baixo (1.68m)',
          build: 'Forte',
          hairColor: 'Preto',
          eyeColor: 'Pretos'
        },
        lastReportDate: '2024-01-06',
        detailedReports: [
          {
            id: 'r10',
            violenceType: 'patrimonial',
            description: 'Destruição de bens pessoais e controle financeiro',
            location: 'Liberdade',
            createdAt: '2024-01-06T13:20:00Z',
            hasEvidence: false,
            reporterInfo: 'Relato da comunidade',
            isAnonymous: true
          }
        ]
      }
    ]
    
    console.log('📋 Agressores carregados:', simulatedAggressors.length)
    setAggressors(simulatedAggressors)
    setLoading(false)
    
    // Tentar carregar dados reais em paralelo (opcional)
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-47a9aa23/aggressors/catalog`, {
        headers: {
          'Authorization': `Bearer ${user.access_token}`
        }
      })

      if (response.ok) {
        const { aggressors } = await response.json()
        if (aggressors && aggressors.length > 0) {
          console.log('📊 Dados reais carregados, atualizando...', aggressors.length)
          setAggressors(aggressors)
        }
      }
    } catch (error) {
      console.log('⚠️ Erro ao carregar dados reais (usando simulados):', error)
    }
  }

  const filterAndSortAggressors = () => {
    let filtered = [...aggressors]

    // Filtro de busca por nome
    if (searchTerm) {
      filtered = filtered.filter(aggressor => 
        aggressor.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtro por nível de risco
    if (riskFilter !== 'all') {
      filtered = filtered.filter(aggressor => {
        const score = aggressor.riskScore
        switch (riskFilter) {
          case 'extreme': return score >= 80
          case 'high': return score >= 50 && score < 80
          case 'medium': return score >= 20 && score < 50
          case 'low': return score < 20
          default: return true
        }
      })
    }

    // Filtro por localização
    if (locationFilter !== 'all') {
      filtered = filtered.filter(aggressor => 
        aggressor.locations?.some(location => 
          location.toLowerCase().includes(locationFilter.toLowerCase())
        )
      )
    }

    // Ordenação
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'risk':
          return b.riskScore - a.riskScore
        case 'name':
          return a.name.localeCompare(b.name)
        case 'reports':
          return (b.reports?.length || 0) - (a.reports?.length || 0)
        case 'recent':
          return new Date(b.lastReportDate) - new Date(a.lastReportDate)
        default:
          return 0
      }
    })

    setFilteredAggressors(filtered)
  }

  const getRiskColor = (score) => {
    if (score >= 80) return 'bg-red-100 text-red-800 border-red-300'
    if (score >= 50) return 'bg-orange-100 text-orange-800 border-orange-300'
    if (score >= 20) return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    return 'bg-green-100 text-green-800 border-green-300'
  }

  const getRiskLabel = (score) => {
    if (score >= 80) return 'EXTREMO'
    if (score >= 50) return 'ALTO'
    if (score >= 20) return 'MÉDIO'
    return 'BAIXO'
  }

  const getUniqueLocations = () => {
    const locations = new Set()
    aggressors.forEach(aggressor => {
      aggressor.locations?.forEach(location => locations.add(location))
    })
    return Array.from(locations).sort()
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-purple-600">Carregando catálogo...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-purple-600"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        
        <div className="flex-1">
          <h1 className="text-2xl text-purple-800 mb-1">Catálogo de Agressores</h1>
          <p className="text-purple-600">
            {aggressors.length} registro(s) • {filteredAggressors.length} encontrado(s)
          </p>
        </div>
      </div>

      {/* Banner Colaborativo */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-blue-800 mb-1">🤝 Construção Colaborativa</h4>
              <p className="text-sm text-blue-700 mb-3">
                Este catálogo é construído pela comunidade. Você pode <strong>adicionar relatos</strong>, 
                <strong>completar informações que faltam</strong> e <strong>enviar evidências</strong> 
                diretamente nos perfis dos agressores.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-blue-700 border-blue-300 text-xs">
                  <Plus className="w-3 h-3 mr-1" />
                  1 perfil com informações faltando
                </Badge>
                <Badge variant="outline" className="text-green-700 border-green-300 text-xs">
                  📝 Clique em "Completar Info" para ajudar
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Banner de Anonimato */}
      <Card className="border-purple-200 bg-purple-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-purple-600 mt-0.5" />
            <div>
              <h4 className="text-purple-800 mb-1">🔒 Privacidade e Anonimato</h4>
              <p className="text-sm text-purple-700">
                Todas as denúncias são <strong>completamente anônimas</strong> para proteção das usuárias. 
                As informações da denunciante são mantidas privadas e seguras em todos os momentos.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerta de Segurança */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="text-yellow-800 mb-1">⚠️ Uso Responsável</h4>
              <p className="text-sm text-yellow-700">
                Este catálogo é uma ferramenta de proteção comunitária. Use apenas para sua segurança.
                Não compartilhe fora da plataforma e não tome ações por conta própria.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filtros e Busca */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <Filter className="w-5 h-5" />
            Filtros e Busca
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Busca por nome */}
            <div>
              <label className="block text-sm mb-1 text-gray-700">Nome</label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Buscar por nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filtro por risco */}
            <div>
              <label className="block text-sm mb-1 text-gray-700">Nível de Risco</label>
              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os níveis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os níveis</SelectItem>
                  <SelectItem value="extreme">Extremo (80+)</SelectItem>
                  <SelectItem value="high">Alto (50-79)</SelectItem>
                  <SelectItem value="medium">Médio (20-49)</SelectItem>
                  <SelectItem value="low">Baixo (0-19)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtro por localização */}
            <div>
              <label className="block text-sm mb-1 text-gray-700">Localização</label>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as localidades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as localidades</SelectItem>
                  {getUniqueLocations().map(location => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Ordenação */}
            <div>
              <label className="block text-sm mb-1 text-gray-700">Ordenar por</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="risk">Nível de Risco</SelectItem>
                  <SelectItem value="name">Nome A-Z</SelectItem>
                  <SelectItem value="reports">Nº de Denúncias</SelectItem>
                  <SelectItem value="recent">Mais Recente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Estatísticas dos filtros */}
          <div className="flex items-center gap-4 text-sm text-gray-600 pt-2 border-t">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {filteredAggressors.length} encontrado(s)
            </span>
            <span>•</span>
            <span>
              Risco médio: {filteredAggressors.length > 0 ? 
                Math.round(filteredAggressors.reduce((sum, a) => sum + a.riskScore, 0) / filteredAggressors.length) : 0
              }
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Agressores */}
      <div className="space-y-4">
        {filteredAggressors.length > 0 ? (
          filteredAggressors.map((aggressor) => (
            <Card key={aggressor.id} className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onSelectAggressor(aggressor)}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg text-purple-800">{aggressor.name}</h4>
                      <Badge className={`${getRiskColor(aggressor.riskScore)} border`}>
                        {getRiskLabel(aggressor.riskScore)}
                      </Badge>
                      {aggressor.missingInfo?.length > 0 && (
                        <Badge variant="outline" className="text-blue-600 border-blue-300">
                          <Plus className="w-3 h-3 mr-1" />
                          Completar Info
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          <span>{aggressor.reports?.length || 0} denúncia(s) anônima(s)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{aggressor.locations?.length || 0} local(is)</span>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Eye className="w-4 h-4" />
                          <span>Características Físicas</span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {[
                            aggressor.physicalDescription?.height,
                            aggressor.physicalDescription?.build,
                            aggressor.physicalDescription?.hairColor
                          ].filter(Boolean).join(' • ') || 'Informações em andamento...'}
                        </p>
                      </div>

                      <div>
                        <div className="text-xs text-gray-500 mb-1">Última denúncia</div>
                        <p className="text-xs">
                          {new Date(aggressor.lastReportDate).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>

                    {aggressor.locations && aggressor.locations.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {aggressor.locations.slice(0, 3).map((location, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {location}
                          </Badge>
                        ))}
                        {aggressor.locations.length > 3 && (
                          <Badge variant="outline" className="text-xs text-purple-600">
                            +{aggressor.locations.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="text-right ml-4">
                    <div className="text-3xl text-red-600 mb-1">{aggressor.riskScore}</div>
                    <div className="text-xs text-gray-500">Score</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhum resultado encontrado</p>
              <p className="text-sm text-gray-500 mt-2">
                Tente ajustar os filtros ou termos de busca
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Footer Informativo */}
      <Card className="border-purple-200 bg-purple-50">
        <CardContent className="p-4 text-center">
          <p className="text-sm text-purple-700 mb-2">
            💜 Este catálogo é mantido colaborativamente pela comunidade
          </p>
          <p className="text-xs text-purple-600">
            Todas as denúncias são anônimas • Dados verificados quando possível • Sempre confirme informações com autoridades competentes
          </p>
        </CardContent>
      </Card>
    </div>
  )
}