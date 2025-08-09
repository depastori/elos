import React, { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Badge } from './ui/badge'
import { Alert, AlertDescription } from './ui/alert'
import { Search, FileText, AlertTriangle, Scale, Shield, Clock, ExternalLink, Download } from 'lucide-react'
import { projectId, publicAnonKey } from '../utils/supabase/info'

export function LegalVerificationScreen({ user }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState('cpf')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  
  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    
    setLoading(true)
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-47a9aa23/legal/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.access_token}`
        },
        body: JSON.stringify({
          query: searchQuery,
          type: searchType
        })
      })

      if (response.ok) {
        const { results } = await response.json()
        setResults(results)
      } else {
        const error = await response.json()
        alert(`❌ Erro na busca: ${error.error}`)
      }
    } catch (error) {
      console.log('Legal search error:', error)
      alert('❌ Erro na busca. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const formatCPF = (cpf) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'condenado':
        return 'bg-red-100 text-red-800'
      case 'em andamento':
        return 'bg-yellow-100 text-yellow-800'
      case 'arquivado':
        return 'bg-gray-100 text-gray-800'
      case 'absolvido':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl text-purple-800 mb-2">Verificações Legais</h2>
        <p className="text-purple-600">
          Consulte processos judiciais e registros criminais em bases oficiais
        </p>
      </div>

      {/* Aviso Legal */}
      <Alert className="border-yellow-200 bg-yellow-50">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Aviso Legal:</strong> Este serviço consulta bases de dados públicas oficiais. 
          Use as informações com responsabilidade e apenas para fins de proteção pessoal. 
          Não divulgue informações obtidas aqui.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="search" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="search">Busca por Pessoa</TabsTrigger>
          <TabsTrigger value="processes">Consulta de Processos</TabsTrigger>
          <TabsTrigger value="databases">Bases de Dados</TabsTrigger>
        </TabsList>

        {/* Busca por Pessoa */}
        <TabsContent value="search" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-800">
                <Search className="w-5 h-5" />
                Buscar Informações de Pessoa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm mb-2 text-gray-700">Tipo de Busca</label>
                  <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="cpf">CPF</option>
                    <option value="name">Nome Completo</option>
                    <option value="oab">OAB (Advogados)</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm mb-2 text-gray-700">
                    {searchType === 'cpf' ? 'CPF' : 
                     searchType === 'name' ? 'Nome Completo' : 'Número OAB'}
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={
                        searchType === 'cpf' ? '000.000.000-00' :
                        searchType === 'name' ? 'Nome completo da pessoa' :
                        'OAB/UF 123456'
                      }
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <Button
                      onClick={handleSearch}
                      disabled={loading || !searchQuery.trim()}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Search className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                <h4 className="text-blue-800 mb-2">📋 O que será consultado:</h4>
                <ul className="space-y-1 text-blue-700">
                  <li>• Processos criminais e cíveis</li>
                  <li>• Medidas protetivas de urgência</li>
                  <li>• Antecedentes criminais</li>
                  <li>• Registros de violência doméstica</li>
                  <li>• Certidões e distribuições</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Resultados da Busca */}
          {results && (
            <div className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-800">
                    <FileText className="w-5 h-5" />
                    Resultados da Consulta
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Informações Básicas */}
                    <div>
                      <h4 className="text-purple-800 mb-3">📝 Dados Identificados</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Nome:</span>
                          <span className="text-purple-800">{results.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">CPF:</span>
                          <span className="text-purple-800">{formatCPF(results.cpf)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <Badge className={results.found ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {results.found ? 'Encontrado' : 'Não encontrado'}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Resumo dos Registros */}
                    <div>
                      <h4 className="text-purple-800 mb-3">📊 Resumo dos Registros</h4>
                      <div className="space-y-3">
                        <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
                          <div className="flex justify-between items-center">
                            <span className="text-red-700">Processos Criminais</span>
                            <Badge className="bg-red-100 text-red-800">
                              {results.processes?.filter(p => p.charges.some(c => 
                                ['lesão corporal', 'ameaça', 'violência doméstica'].includes(c.toLowerCase())
                              )).length || 0}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                          <div className="flex justify-between items-center">
                            <span className="text-orange-700">Medidas Protetivas</span>
                            <Badge className="bg-orange-100 text-orange-800">
                              {results.civilRecords?.restrainingOrders || 0}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                          <div className="flex justify-between items-center">
                            <span className="text-yellow-700">Condenações</span>
                            <Badge className="bg-yellow-100 text-yellow-800">
                              {results.criminalRecords?.convictions || 0}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Processos Detalhados */}
              {results.processes && results.processes.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-800">
                      <Scale className="w-5 h-5" />
                      Processos Judiciais ({results.processes.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {results.processes.map((process, index) => (
                        <div key={index} className="p-4 border rounded-lg bg-gray-50">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="text-purple-800 mb-1">
                                Processo nº {process.number}
                              </h4>
                              <p className="text-sm text-gray-600">{process.court}</p>
                            </div>
                            <div className="text-right">
                              <Badge className={getStatusColor(process.status)}>
                                {process.status}
                              </Badge>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(process.date).toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                          </div>
                          
                          <div className="mb-3">
                            <h5 className="text-sm text-gray-700 mb-2">Acusações/Crimes:</h5>
                            <div className="flex flex-wrap gap-2">
                              {process.charges.map((charge, i) => (
                                <Badge key={i} variant="outline" className={
                                  ['lesão corporal', 'ameaça', 'violência doméstica'].includes(charge.toLowerCase())
                                    ? 'border-red-300 text-red-700'
                                    : 'border-gray-300 text-gray-700'
                                }>
                                  {charge}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Ver no Tribunal
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="w-3 h-3 mr-1" />
                              Baixar Certidão
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Alerta de Risco */}
              {results.processes?.some(p => 
                p.charges.some(c => ['lesão corporal', 'ameaça', 'violência doméstica'].includes(c.toLowerCase()))
              ) && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>⚠️ ALERTA DE RISCO:</strong> Esta pessoa possui registros relacionados à violência. 
                    Mantenha distância segura e, se necessário, procure medidas protetivas. 
                    Em emergências, ligue 190 ou 180.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </TabsContent>

        {/* Consulta de Processos */}
        <TabsContent value="processes" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-800">
                <Scale className="w-5 h-5" />
                Consulta Direta de Processos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm mb-2 text-gray-700">Tribunal</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="">Selecione</option>
                    <option value="tjsp">TJSP - São Paulo</option>
                    <option value="tjrj">TJRJ - Rio de Janeiro</option>
                    <option value="tjmg">TJMG - Minas Gerais</option>
                    <option value="stf">STF - Supremo</option>
                    <option value="stj">STJ - Superior</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm mb-2 text-gray-700">Número do Processo</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="0000000-00.0000.0.00.0000"
                      className="flex-1"
                    />
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      <Search className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex-col">
                  <FileText className="w-6 h-6 mb-2" />
                  <span>Certidão de Distribuição</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Scale className="w-6 h-6 mb-2" />
                  <span>Consulta de Vara</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Shield className="w-6 h-6 mb-2" />
                  <span>Medidas Protetivas</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Clock className="w-6 h-6 mb-2" />
                  <span>Prazos Processuais</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bases de Dados */}
        <TabsContent value="databases" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-purple-800">🏛️ Tribunais de Justiça</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  TJSP - São Paulo
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  TJRJ - Rio de Janeiro
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  TJMG - Minas Gerais
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  CNJ - Consulta Nacional
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-purple-800">👮 Segurança Pública</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Antecedentes Criminais
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Certidão de Distribuição
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  IIRGD - SP
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Polícia Civil
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-purple-800">⚖️ Violência Doméstica</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Medidas Protetivas
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  FONAVID
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Juizados Especializados
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Delegacias da Mulher
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-purple-800">🎓 Profissionais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  OAB - Advogados
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  CRP - Psicólogos
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  CRESS - Assistentes Sociais
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  CFM - Médicos
                </Button>
              </CardContent>
            </Card>
          </div>

          <Alert className="mt-6">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Importante:</strong> Todas as consultas são realizadas em bases de dados públicas 
              e oficiais. As informações obtidas são de caráter público e podem ser consultadas por qualquer cidadão.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  )
}