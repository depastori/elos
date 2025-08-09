import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Badge } from './ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Progress } from './ui/progress'
import { 
  Search, User, Shield, AlertTriangle, Flag, MapPin, Calendar, 
  Phone, FileText, Camera, Star, Clock, UserCheck, Ban, Eye,
  Plus, Edit, Trash2, CheckCircle2, XCircle, Info, Heart,
  Users, Filter, SortAsc, MoreHorizontal, MessageCircle,
  ChevronDown, ChevronUp, ExternalLink, Download, Share2,
  ThumbsUp, ThumbsDown, Bookmark, Report, Warning, Zap
} from 'lucide-react'
import { toast } from 'sonner@2.0.3'
import { AggressorCatalog } from './AggressorCatalog'
import { ReportAggressor } from './ReportAggressor'
import { projectId, publicAnonKey } from '../utils/supabase/info'

export function SearchScreen({ user }) {
  const [activeTab, setActiveTab] = useState('profiles')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [aggressors, setAggressors] = useState([])
  const [loading, setLoading] = useState(false)
  const [showReportForm, setShowReportForm] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState(null)
  const [showProfileDialog, setShowProfileDialog] = useState(false)

  // Estados do formulário de denúncia
  const [reportData, setReportData] = useState({
    name: '',
    cpf: '',
    phone: '',
    knownAddresses: '',
    physicalDescription: '',
    incidentDate: '',
    isApproximateDate: false,
    location: '',
    description: '',
    aggressionType: '',
    evidence: [],
    relationship: '',
    frequency: '',
    additionalInfo: ''
  })

  useEffect(() => {
    loadAggressors()
  }, [])

  // Busca com debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.length >= 1) { // Mudança: apenas 1 caractere necessário
        performSearch(searchQuery)
      } else {
        setSearchResults([])
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  const loadAggressors = async () => {
    // Simular dados de agressores
    const mockAggressors = [
      {
        id: 'aggr_1',
        name: 'João Silva Santos',
        cpf: '123.456.789-00',
        phone: '(11) 99999-9999',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        description: 'Cerca de 1,80m, cabelos castanhos, tatuagem no braço direito',
        lastLocation: 'Vila Madalena, São Paulo',
        reportsCount: 8,
        verifiedReports: 5,
        dangerLevel: 'high',
        incidentTypes: ['Assédio', 'Violência Física', 'Stalking'],
        lastSeen: '2024-01-10',
        status: 'verified'
      },
      {
        id: 'aggr_2', 
        name: 'Pedro Oliveira Lima',
        cpf: '987.654.321-11',
        phone: '(11) 88888-8888',
        photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        description: 'Cerca de 1,75m, barba, cicatriz na testa',
        lastLocation: 'Centro, São Paulo',
        reportsCount: 12,
        verifiedReports: 9,
        dangerLevel: 'extreme',
        incidentTypes: ['Violência Doméstica', 'Ameaças', 'Violência Física'],
        lastSeen: '2024-01-08',
        status: 'verified'
      }
    ]
    
    setAggressors(mockAggressors)
  }

  const performSearch = async (query) => {
    setLoading(true)
    
    try {
      // Busca flexível por nome parcial
      const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0)
      
      // Simular base de dados de usuárias
      const allProfiles = [
        {
          id: 'user_1',
          name: 'Ana Silva Carvalho',
          city: 'São Paulo',
          state: 'SP',
          profilePhoto: 'https://images.unsplash.com/photo-1494790108755-2616c88c5e15?w=150&h=150&fit=crop&crop=face',
          followers: 245,
          posts: 34,
          trustLevel: 89,
          isVerified: true,
          friendshipStatus: 'none'
        },
        {
          id: 'user_2',
          name: 'Maria Santos Oliveira',
          city: 'Rio de Janeiro', 
          state: 'RJ',
          profilePhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face',
          followers: 156,
          posts: 28,
          trustLevel: 92,
          isVerified: true,
          friendshipStatus: 'none'
        },
        {
          id: 'user_3',
          name: 'Lucia Ferreira Costa',
          city: 'Belo Horizonte',
          state: 'MG',
          profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
          followers: 89,
          posts: 67,
          trustLevel: 76,
          isVerified: false,
          friendshipStatus: 'none'
        },
        {
          id: 'user_4',
          name: 'Camila Rodriguez Silva',
          city: 'Salvador',
          state: 'BA',
          profilePhoto: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=150&h=150&fit=crop&crop=face',
          followers: 312,
          posts: 45,
          trustLevel: 94,
          isVerified: true,
          friendshipStatus: 'none'
        },
        {
          id: 'user_5',
          name: 'Beatriz Lima Santos',
          city: 'Fortaleza',
          state: 'CE',
          profilePhoto: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
          followers: 198,
          posts: 52,
          trustLevel: 81,
          isVerified: true,
          friendshipStatus: 'none'
        },
        {
          id: 'user_6',
          name: 'Carolina Pereira Silva',
          city: 'Brasília',
          state: 'DF',
          profilePhoto: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
          followers: 267,
          posts: 73,
          trustLevel: 88,
          isVerified: true,
          friendshipStatus: 'none'
        }
      ]

      // Filtrar perfis que contenham qualquer um dos termos de busca em qualquer parte do nome
      const results = allProfiles.filter(profile => {
        const fullName = profile.name.toLowerCase()
        return searchTerms.some(term => fullName.includes(term))
      })

      setSearchResults(results)
      
    } catch (error) {
      console.error('Erro na busca:', error)
      toast.error('Erro ao buscar perfis')
    } finally {
      setLoading(false)
    }
  }

  const handleProfileClick = (profile) => {
    setSelectedProfile(profile)
    setShowProfileDialog(true)
  }

  const handleFileUpload = (event, fieldName) => {
    const files = Array.from(event.target.files)
    
    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setReportData(prev => ({
          ...prev,
          evidence: [...prev.evidence, {
            type: file.type.startsWith('image/') ? 'image' : 'document',
            name: file.name,
            url: reader.result,
            size: file.size
          }]
        }))
      }
      reader.readAsDataURL(file)
    })
  }

  const removeEvidence = (index) => {
    setReportData(prev => ({
      ...prev,
      evidence: prev.evidence.filter((_, i) => i !== index)
    }))
  }

  const submitReport = async () => {
    // Validações obrigatórias
    if (!reportData.name.trim()) {
      toast.error('Nome do agressor é obrigatório')
      return
    }

    if (!reportData.incidentDate) {
      toast.error('Data do ocorrido é obrigatória')
      return
    }

    if (!reportData.description.trim()) {
      toast.error('Descrição do ocorrido é obrigatória')
      return
    }

    try {
      const report = {
        id: `aggressor_report_${Date.now()}`,
        type: 'aggressor_report',
        reportedPerson: {
          name: reportData.name,
          cpf: reportData.cpf,
          phone: reportData.phone,
          physicalDescription: reportData.physicalDescription,
          knownAddresses: reportData.knownAddresses
        },
        incident: {
          date: reportData.incidentDate,
          isApproximateDate: reportData.isApproximateDate,
          location: reportData.location,
          description: reportData.description,
          aggressionType: reportData.aggressionType,
          relationship: reportData.relationship,
          frequency: reportData.frequency
        },
        evidence: reportData.evidence,
        additionalInfo: reportData.additionalInfo,
        timestamp: new Date().toISOString(),
        status: 'pending',
        reportedBy: user.id
      }

      // Salvar no localStorage
      const existingReports = JSON.parse(localStorage.getItem('user_reports') || '[]')
      existingReports.push(report)
      localStorage.setItem('user_reports', JSON.stringify(existingReports))

      // Disparar evento para atualizar outras telas
      window.dispatchEvent(new CustomEvent('reports-updated'))

      toast.success('🚨 Denúncia enviada com sucesso', {
        description: 'Nossa equipe analisará em até 24h. Sua denúncia foi adicionada anonimamente.',
        duration: 5000
      })

      // Resetar formulário
      setReportData({
        name: '',
        cpf: '',
        phone: '',
        knownAddresses: '',
        physicalDescription: '',
        incidentDate: '',
        isApproximateDate: false,
        location: '',
        description: '',
        aggressionType: '',
        evidence: [],
        relationship: '',
        frequency: '',
        additionalInfo: ''
      })

      setShowReportForm(false)

    } catch (error) {
      console.error('Erro ao enviar denúncia:', error)
      toast.error('Erro ao enviar denúncia. Tente novamente.')
    }
  }

  const ProfileCard = ({ profile }) => {
    const trustLevel = profile.trustLevel || 0
    const getTrustColor = (level) => {
      if (level >= 90) return 'text-green-600'
      if (level >= 70) return 'text-yellow-600'
      return 'text-red-600'
    }

    return (
      <Card className="mb-4 bg-gradient-to-r from-white to-purple-50/30 shadow-lg border-0 hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => handleProfileClick(profile)}>
        <CardContent className="pt-4">
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16 shadow-md ring-2 ring-purple-200">
              <AvatarImage src={profile.profilePhoto} />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                {profile.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="text-purple-800 flex items-center gap-2">
                    {profile.name}
                    {profile.isVerified && (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    )}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {profile.city}, {profile.state}
                  </p>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Users className="w-3 h-3" />
                    <span>{profile.followers}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <FileText className="w-3 h-3" />
                    <span>{profile.posts} posts</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className={`w-4 h-4 ${getTrustColor(trustLevel)}`} />
                  <span className={`text-sm ${getTrustColor(trustLevel)}`}>
                    {trustLevel}% confiável
                  </span>
                </div>
                
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl"
                  onClick={(e) => {
                    e.stopPropagation()
                    toast.success(`Conectando com ${profile.name}...`)
                  }}
                >
                  Conectar
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl p-1 mb-8">
          <TabsTrigger value="profiles" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
            <Users className="w-4 h-4" />
            <span>Buscar Perfis</span>
          </TabsTrigger>
          
          <TabsTrigger value="aggressors" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
            <Shield className="w-4 h-4" />
            <span>Base de Agressores</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profiles" className="space-y-6">
          <Card className="bg-gradient-to-br from-white to-purple-50/30 shadow-xl border-0">
            <CardHeader>
              <CardTitle className="text-purple-800 flex items-center gap-2">
                <Search className="w-5 h-5" />
                Buscar Perfis de Usuárias
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Digite qualquer parte do nome (ex: Ana, Silva, Santos)..."
                  className="pl-12 pr-4 py-3 rounded-xl border-purple-200 focus:border-purple-500 text-lg"
                />
              </div>
              
              {loading && (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  <p className="text-purple-600 mt-2">Buscando perfis...</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {searchQuery.length >= 1 && (
            <div className="space-y-4">
              <h4 className="text-xl text-purple-800">
                Resultados para "{searchQuery}" ({searchResults.length})
              </h4>
              
              {searchResults.length === 0 && !loading ? (
                <Card className="bg-gradient-to-br from-white to-gray-50/30 shadow-xl border-0">
                  <CardContent className="text-center py-12">
                    <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg text-gray-600 mb-2">Nenhum perfil encontrado</h4>
                    <p className="text-gray-500">Tente buscar por outro nome ou apenas parte dele</p>
                  </CardContent>
                </Card>
              ) : (
                searchResults.map((profile) => (
                  <ProfileCard key={profile.id} profile={profile} />
                ))
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="aggressors" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl text-purple-800">
              Base de Dados de Agressores
            </h3>
            <Button 
              onClick={() => setShowReportForm(true)}
              className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white rounded-xl shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Denunciar Agressor
            </Button>
          </div>

          <AggressorCatalog aggressors={aggressors} />
        </TabsContent>
      </Tabs>

      {/* Dialog de Perfil */}
      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Perfil de {selectedProfile?.name}
            </DialogTitle>
            <DialogDescription>
              Visualize informações do perfil e conecte-se com outras usuárias da rede.
            </DialogDescription>
          </DialogHeader>
          
          {selectedProfile && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={selectedProfile.profilePhoto} />
                  <AvatarFallback className="bg-purple-500 text-white">
                    {selectedProfile.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-lg">{selectedProfile.name}</h4>
                  <p className="text-gray-600">{selectedProfile.city}, {selectedProfile.state}</p>
                  <div className="flex items-center space-x-1 text-sm text-green-600">
                    <Shield className="w-4 h-4" />
                    <span>{selectedProfile.trustLevel}% confiável</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl">{selectedProfile.followers}</p>
                  <p className="text-sm text-gray-500">seguidoras</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl">{selectedProfile.posts}</p>
                  <p className="text-sm text-gray-500">publicações</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={() => toast.success(`Mensagem enviada para ${selectedProfile.name}`)}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Mensagem
                </Button>
                <Button 
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                  onClick={() => toast.success(`Pedido de conexão enviado para ${selectedProfile.name}`)}
                >
                  <UserCheck className="w-4 h-4 mr-2" />
                  Conectar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de Denúncia de Agressor */}
      <Dialog open={showReportForm} onOpenChange={setShowReportForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Flag className="w-5 h-5" />
              Denunciar Agressor
            </DialogTitle>
            <DialogDescription>
              Preencha as informações para denunciar um agressor. Todas as informações são tratadas com sigilo absoluto.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Dados do Agressor */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900">Dados do Agressor</h4>
              
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Nome Completo * <span className="text-red-500">(obrigatório)</span>
                </label>
                <Input
                  value={reportData.name}
                  onChange={(e) => setReportData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nome completo do agressor"
                  className="border-red-200 focus:border-red-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">CPF (se conhecido)</label>
                  <Input
                    value={reportData.cpf}
                    onChange={(e) => setReportData(prev => ({ ...prev, cpf: e.target.value }))}
                    placeholder="000.000.000-00"
                    maxLength={14}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Telefone (se conhecido)</label>
                  <Input
                    value={reportData.phone}
                    onChange={(e) => setReportData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Endereços Conhecidos</label>
                <Textarea
                  value={reportData.knownAddresses}
                  onChange={(e) => setReportData(prev => ({ ...prev, knownAddresses: e.target.value }))}
                  placeholder="Endereços onde o agressor mora, trabalha ou frequenta..."
                  rows={3}
                  className="resize-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Descrição Física</label>
                <Textarea
                  value={reportData.physicalDescription}
                  onChange={(e) => setReportData(prev => ({ ...prev, physicalDescription: e.target.value }))}
                  placeholder="Altura, cor dos cabelos, tatuagens, cicatrizes, características marcantes..."
                  rows={3}
                  className="resize-none"
                />
              </div>
            </div>

            {/* Dados do Ocorrido */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900">Dados do Ocorrido</h4>
              
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Data do Ocorrido * <span className="text-red-500">(obrigatório)</span>
                </label>
                <div className="space-y-2">
                  <Input
                    type="date"
                    value={reportData.incidentDate}
                    onChange={(e) => setReportData(prev => ({ ...prev, incidentDate: e.target.value }))}
                    className="border-red-200 focus:border-red-500"
                    required
                  />
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="approximateDate"
                      checked={reportData.isApproximateDate}
                      onChange={(e) => setReportData(prev => ({ ...prev, isApproximateDate: e.target.checked }))}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor="approximateDate" className="text-sm text-gray-600">
                      Data aproximada (não lembro exatamente)
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Local do Ocorrido</label>
                <Input
                  value={reportData.location}
                  onChange={(e) => setReportData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Endereço, bairro ou local onde ocorreu"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Tipo de Agressão</label>
                <Select 
                  value={reportData.aggressionType} 
                  onValueChange={(value) => setReportData(prev => ({ ...prev, aggressionType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="physical">Violência Física</SelectItem>
                    <SelectItem value="psychological">Violência Psicológica</SelectItem>
                    <SelectItem value="sexual">Violência Sexual</SelectItem>
                    <SelectItem value="harassment">Assédio</SelectItem>
                    <SelectItem value="stalking">Perseguição (Stalking)</SelectItem>
                    <SelectItem value="threats">Ameaças</SelectItem>
                    <SelectItem value="financial">Violência Financeira</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Relato Detalhado * <span className="text-red-500">(obrigatório)</span>
                </label>
                <Textarea
                  value={reportData.description}
                  onChange={(e) => setReportData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva detalhadamente o que aconteceu. Inclua o máximo de informações possível..."
                  rows={5}
                  className="resize-none border-red-200 focus:border-red-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Relacionamento</label>
                  <Select 
                    value={reportData.relationship} 
                    onValueChange={(value) => setReportData(prev => ({ ...prev, relationship: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Qual a relação?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unknown">Desconhecido</SelectItem>
                      <SelectItem value="partner">Parceiro/Ex-parceiro</SelectItem>
                      <SelectItem value="family">Familiar</SelectItem>
                      <SelectItem value="acquaintance">Conhecido</SelectItem>
                      <SelectItem value="colleague">Colega de trabalho</SelectItem>
                      <SelectItem value="neighbor">Vizinho</SelectItem>
                      <SelectItem value="other">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Frequência</label>
                  <Select 
                    value={reportData.frequency} 
                    onValueChange={(value) => setReportData(prev => ({ ...prev, frequency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Com que frequência?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="once">Aconteceu uma vez</SelectItem>
                      <SelectItem value="rare">Raramente</SelectItem>
                      <SelectItem value="monthly">Mensalmente</SelectItem>
                      <SelectItem value="weekly">Semanalmente</SelectItem>
                      <SelectItem value="daily">Diariamente</SelectItem>
                      <SelectItem value="ongoing">Ainda está acontecendo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Evidências */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900">Evidências (Opcional)</h4>
              
              <div>
                <label className="block text-sm text-gray-700 mb-2">Anexar Arquivos</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={(e) => handleFileUpload(e, 'evidence')}
                    className="hidden"
                    id="evidence-upload"
                  />
                  <label htmlFor="evidence-upload" className="cursor-pointer">
                    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      Clique para adicionar fotos, documentos ou evidências
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Formatos: JPG, PNG, PDF, DOC (máx. 10MB cada)
                    </p>
                  </label>
                </div>
              </div>

              {reportData.evidence.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-gray-700">Arquivos Anexados:</h5>
                  {reportData.evidence.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeEvidence(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Informações Adicionais */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">Informações Adicionais</label>
              <Textarea
                value={reportData.additionalInfo}
                onChange={(e) => setReportData(prev => ({ ...prev, additionalInfo: e.target.value }))}
                placeholder="Qualquer informação adicional que possa ser relevante..."
                rows={3}
                className="resize-none"
              />
            </div>

            {/* Aviso de Segurança */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-sm text-amber-800 font-medium">Importante:</p>
                  <ul className="text-xs text-amber-700 mt-1 space-y-1">
                    <li>• Sua denúncia será tratada com absoluto sigilo</li>
                    <li>• Dados sensíveis são protegidos e anonimizados</li>
                    <li>• Em caso de risco iminente, acione o botão de pânico</li>
                    <li>• Denúncias falsas são passíveis de responsabilização</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button 
                onClick={submitReport}
                disabled={!reportData.name.trim() || !reportData.incidentDate || !reportData.description.trim()}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                <Flag className="w-4 h-4 mr-2" />
                Enviar Denúncia
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowReportForm(false)}
                className="border-gray-300"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}