import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Badge } from './ui/badge'
import { Switch } from './ui/switch'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { 
  Heart, Users, MapPin, Clock, Shield, Star, Phone, MessageCircle, 
  HandHeart, CheckCircle2, AlertTriangle, Baby, Car, Home, Plus, Settings,
  UserCheck, Wifi, WifiOff, Circle, Zap, Scale, HeartHandshake, Brain
} from 'lucide-react'
import { toast } from 'sonner@2.0.3'
import { projectId, publicAnonKey } from '../utils/supabase/info'

export function VolunteerScreen({ user }) {
  const [activeTab, setActiveTab] = useState('nearby')
  const [isVolunteer, setIsVolunteer] = useState(false)
  const [isOnline, setIsOnline] = useState(false)
  const [volunteerProfile, setVolunteerProfile] = useState({
    specialization: '',
    description: '',
    location: '',
    capabilities: {
      acolhimento: { enabled: false, limit: 1 },
      carona: { enabled: false, limit: 2 },
      cuidadoInfantil: { enabled: false, limit: 3 },
      criseImediata: { enabled: false, limit: 1 }, // Nova capacidade
      apoioEmocional: { enabled: false, limit: 2 }, // Nova capacidade
      orientacaoLegal: { enabled: false, limit: 1 } // Nova capacidade
    },
    phone: '',
    availability: 'immediate'
  })
  const [nearbyVolunteers, setNearbyVolunteers] = useState([])
  const [supportRequests, setSupportRequests] = useState([])
  const [mySupports, setMySupports] = useState([])
  const [showVolunteerForm, setShowVolunteerForm] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadVolunteerData()
    loadNearbyVolunteers()
    loadSupportRequests()
  }, [])

  // Salvar status online no localStorage
  useEffect(() => {
    if (isVolunteer) {
      localStorage.setItem('volunteer_online_status', JSON.stringify({
        userId: user.id,
        isOnline,
        timestamp: Date.now(),
        profile: volunteerProfile
      }))
      
      if (isOnline) {
        toast.success('✅ Você está ONLINE como voluntária', {
          description: 'Outras usuárias podem te encontrar para apoio',
          duration: 3000
        })
      } else {
        toast.info('⚪ Você está OFFLINE', {
          description: 'Ative para aparecer disponível para outras usuárias',
          duration: 3000
        })
      }
    }
  }, [isOnline, isVolunteer, volunteerProfile])

  const loadVolunteerData = async () => {
    try {
      // Verificar se usuária é voluntária
      const savedVolunteer = localStorage.getItem('volunteer_profile')
      if (savedVolunteer) {
        const profile = JSON.parse(savedVolunteer)
        setIsVolunteer(true)
        setVolunteerProfile(profile)
        
        // Verificar status online
        const onlineStatus = localStorage.getItem('volunteer_online_status')
        if (onlineStatus) {
          const status = JSON.parse(onlineStatus)
          if (status.userId === user.id) {
            setIsOnline(status.isOnline)
          }
        }
      }
    } catch (error) {
      console.log('Erro ao carregar dados de voluntária:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadNearbyVolunteers = async () => {
    // Carregar voluntárias online com as novas especializações
    const networkVolunteers = [
      {
        id: 'vol_1',
        name: 'Ana Carvalho',
        specialization: 'Amiga/Voluntária',
        description: 'Sempre disponível para conversar e dar apoio emocional imediato.',
        city: 'São Paulo',
        state: 'SP',
        distance: '0.8 km',
        rating: 4.9,
        responseTime: '2 min',
        isOnline: true,
        photo: 'https://images.unsplash.com/photo-1494790108755-2616c88c5e15?w=150&h=150&fit=crop&crop=face',
        capabilities: {
          acolhimento: { enabled: true, limit: 2 },
          carona: { enabled: false, limit: 0 },
          cuidadoInfantil: { enabled: true, limit: 1 },
          criseImediata: { enabled: true, limit: 1 },
          apoioEmocional: { enabled: true, limit: 3 },
          orientacaoLegal: { enabled: false, limit: 0 }
        },
        lastSeen: 'Online agora'
      },
      {
        id: 'vol_2',
        name: 'Maria Santos',
        specialization: 'Enfermeira',
        description: 'Enfermeira especializada em atendimento de crise e primeiros socorros.',
        city: 'São Paulo',
        state: 'SP',
        distance: '1.2 km',
        rating: 4.8,
        responseTime: '5 min',
        isOnline: true,
        photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
        capabilities: {
          acolhimento: { enabled: true, limit: 1 },
          carona: { enabled: true, limit: 3 },
          cuidadoInfantil: { enabled: false, limit: 0 },
          criseImediata: { enabled: true, limit: 2 },
          apoioEmocional: { enabled: true, limit: 2 },
          orientacaoLegal: { enabled: false, limit: 0 }
        },
        lastSeen: 'Online agora'
      },
      {
        id: 'vol_3',
        name: 'Dra. Lucia Ferreira',
        specialization: 'Assistente Social',
        description: 'Trabalho com apoio psicossocial, orientação de direitos e crise imediata.',
        city: 'São Paulo',
        state: 'SP',
        distance: '2.1 km',
        rating: 4.7,
        responseTime: '8 min',
        isOnline: true,
        photo: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
        capabilities: {
          acolhimento: { enabled: true, limit: 3 },
          carona: { enabled: false, limit: 0 },
          cuidadoInfantil: { enabled: true, limit: 2 },
          criseImediata: { enabled: true, limit: 1 },
          apoioEmocional: { enabled: true, limit: 4 },
          orientacaoLegal: { enabled: true, limit: 2 }
        },
        lastSeen: 'Online agora'
      },
      {
        id: 'vol_4',
        name: 'Camila Rodriguez',
        specialization: 'Amiga/Voluntária',
        description: 'Mãe de família especializada em apoio emocional e cuidado infantil.',
        city: 'São Paulo',
        state: 'SP',
        distance: '0.5 km',
        rating: 4.6,
        responseTime: '3 min',
        isOnline: true,
        photo: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=150&h=150&fit=crop&crop=face',
        capabilities: {
          acolhimento: { enabled: true, limit: 1 },
          carona: { enabled: true, limit: 2 },
          cuidadoInfantil: { enabled: true, limit: 4 },
          criseImediata: { enabled: false, limit: 0 },
          apoioEmocional: { enabled: true, limit: 3 },
          orientacaoLegal: { enabled: false, limit: 0 }
        },
        lastSeen: 'Online agora'
      },
      {
        id: 'vol_5',
        name: 'Dra. Patricia Lima',
        specialization: 'Psicóloga',
        description: 'Psicóloga clínica especializada em traumas, violência e crise emocional.',
        city: 'São Paulo',
        state: 'SP',
        distance: '3.2 km',
        rating: 4.9,
        responseTime: '10 min',
        isOnline: true,
        photo: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=150&h=150&fit=crop&crop=face',
        capabilities: {
          acolhimento: { enabled: true, limit: 2 },
          carona: { enabled: false, limit: 0 },
          cuidadoInfantil: { enabled: false, limit: 0 },
          criseImediata: { enabled: true, limit: 2 },
          apoioEmocional: { enabled: true, limit: 5 },
          orientacaoLegal: { enabled: false, limit: 0 }
        },
        lastSeen: 'Online agora'
      },
      {
        id: 'vol_6',
        name: 'Dra. Beatriz Oliveira',
        specialization: 'Advogada',
        description: 'Advogada especializada em direito da mulher e orientação legal.',
        city: 'São Paulo',
        state: 'SP',
        distance: '1.8 km',
        rating: 4.8,
        responseTime: '12 min',
        isOnline: true,
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        capabilities: {
          acolhimento: { enabled: false, limit: 0 },
          carona: { enabled: false, limit: 0 },
          cuidadoInfantil: { enabled: false, limit: 0 },
          criseImediata: { enabled: false, limit: 0 },
          apoioEmocional: { enabled: true, limit: 2 },
          orientacaoLegal: { enabled: true, limit: 3 }
        },
        lastSeen: 'Online agora'
      }
    ]

    setNearbyVolunteers(networkVolunteers)
  }

  const loadSupportRequests = async () => {
    // Simular pedidos de apoio recebidos
    const requests = [
      {
        id: 'req_1',
        from: {
          name: 'Beatriz Silva',
          photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face'
        },
        type: 'criseImediata',
        message: 'Preciso de ajuda imediata, estou em situação de risco.',
        timestamp: '2024-01-15T14:30:00Z',
        status: 'pending',
        priority: 'urgent'
      },
      {
        id: 'req_2',
        from: {
          name: 'Roberta Martins',
          photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face'
        },
        type: 'apoioEmocional',
        message: 'Preciso conversar com alguém, estou muito abalada.',
        timestamp: '2024-01-15T13:15:00Z',
        status: 'pending',
        priority: 'high'
      },
      {
        id: 'req_3',
        from: {
          name: 'Carolina Dias',
          photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
        },
        type: 'orientacaoLegal',
        message: 'Preciso de orientação sobre meus direitos.',
        timestamp: '2024-01-15T12:45:00Z',
        status: 'pending',
        priority: 'medium'
      }
    ]

    setSupportRequests(requests)
  }

  const toggleVolunteerStatus = async () => {
    if (!isVolunteer) {
      setShowVolunteerForm(true)
    } else {
      const newOnlineStatus = !isOnline
      setIsOnline(newOnlineStatus)
    }
  }

  const saveVolunteerProfile = async () => {
    try {
      if (!volunteerProfile.specialization || !volunteerProfile.description) {
        toast.error('Preencha especialização e descrição')
        return
      }

      // Verificar se pelo menos uma capacidade está habilitada
      const hasCapability = Object.values(volunteerProfile.capabilities).some(cap => cap.enabled)
      if (!hasCapability) {
        toast.error('Selecione pelo menos uma forma de apoio')
        return
      }

      // Salvar perfil de voluntária
      localStorage.setItem('volunteer_profile', JSON.stringify(volunteerProfile))
      
      setIsVolunteer(true)
      setIsOnline(true)
      setShowVolunteerForm(false)

      toast.success('✅ Perfil de voluntária criado!', {
        description: 'Você agora está disponível para ajudar outras usuárias',
        duration: 4000
      })
    } catch (error) {
      console.error('Erro ao salvar perfil de voluntária:', error)
      toast.error('Erro ao salvar perfil')
    }
  }

  const handleSupportRequest = (requestId, action) => {
    setSupportRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { ...req, status: action }
        : req
    ))

    const request = supportRequests.find(r => r.id === requestId)
    if (action === 'accepted') {
      toast.success(`✅ Apoio aceito para ${request.from.name}`, {
        description: 'Vocês podem se comunicar agora',
        duration: 3000
      })
    } else {
      toast.info('Pedido recusado', {
        duration: 2000
      })
    }
  }

  const requestSupport = (volunteer, supportType) => {
    toast.success(`📞 Pedido enviado para ${volunteer.name}`, {
      description: `Solicitação de ${getSupportTypeName(supportType)} enviada`,
      duration: 3000
    })
  }

  const getSupportTypeName = (type) => {
    switch(type) {
      case 'acolhimento': return 'acolhimento'
      case 'carona': return 'carona'
      case 'cuidadoInfantil': return 'cuidado infantil'
      case 'criseImediata': return 'ajuda em crise'
      case 'apoioEmocional': return 'apoio emocional'
      case 'orientacaoLegal': return 'orientação legal'
      default: return 'apoio'
    }
  }

  const getSupportTypeIcon = (type) => {
    switch(type) {
      case 'acolhimento': return <Home className="w-3 h-3 mr-1" />
      case 'carona': return <Car className="w-3 h-3 mr-1" />
      case 'cuidadoInfantil': return <Baby className="w-3 h-3 mr-1" />
      case 'criseImediata': return <Zap className="w-3 h-3 mr-1" />
      case 'apoioEmocional': return <HeartHandshake className="w-3 h-3 mr-1" />
      case 'orientacaoLegal': return <Scale className="w-3 h-3 mr-1" />
      default: return <Heart className="w-3 h-3 mr-1" />
    }
  }

  const getSupportTypeColor = (type) => {
    switch(type) {
      case 'acolhimento': return 'border-purple-300 text-purple-700'
      case 'carona': return 'border-blue-300 text-blue-700'
      case 'cuidadoInfantil': return 'border-pink-300 text-pink-700'
      case 'criseImediata': return 'border-red-300 text-red-700'
      case 'apoioEmocional': return 'border-green-300 text-green-700'
      case 'orientacaoLegal': return 'border-orange-300 text-orange-700'
      default: return 'border-gray-300 text-gray-700'
    }
  }

  const VolunteerCard = ({ volunteer, showRequestButtons = true }) => (
    <Card className="mb-4 bg-gradient-to-r from-white to-green-50/30 shadow-lg border-0 hover:shadow-xl transition-shadow">
      <CardContent className="pt-4">
        <div className="flex items-start space-x-4">
          <div className="relative">
            <Avatar className="w-16 h-16 shadow-md ring-2 ring-green-200">
              <AvatarImage src={volunteer.photo} />
              <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-500 text-white">
                {volunteer.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {volunteer.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                <Circle className="w-2 h-2 fill-current text-white" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                  {volunteer.name}
                  <Badge className="bg-green-100 text-green-700 text-xs">
                    {volunteer.specialization}
                  </Badge>
                </h4>
                <p className="text-sm text-gray-600">
                  {volunteer.city}, {volunteer.state} • {volunteer.distance}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Star className="w-3 h-3 fill-current text-yellow-500" />
                  <span>{volunteer.rating}</span>
                </div>
                <p className="text-xs text-green-600">{volunteer.lastSeen}</p>
              </div>
            </div>

            <p className="text-sm text-gray-700 mb-3">{volunteer.description}</p>

            {/* Capacidades com as novas opções */}
            <div className="flex flex-wrap gap-2 mb-3">
              {volunteer.capabilities.acolhimento.enabled && (
                <Badge variant="outline" className={getSupportTypeColor('acolhimento')}>
                  {getSupportTypeIcon('acolhimento')}
                  Acolhimento ({volunteer.capabilities.acolhimento.limit})
                </Badge>
              )}
              {volunteer.capabilities.carona.enabled && (
                <Badge variant="outline" className={getSupportTypeColor('carona')}>
                  {getSupportTypeIcon('carona')}
                  Carona ({volunteer.capabilities.carona.limit})
                </Badge>
              )}
              {volunteer.capabilities.cuidadoInfantil.enabled && (
                <Badge variant="outline" className={getSupportTypeColor('cuidadoInfantil')}>
                  {getSupportTypeIcon('cuidadoInfantil')}
                  Cuidado Infantil ({volunteer.capabilities.cuidadoInfantil.limit})
                </Badge>
              )}
              {volunteer.capabilities.criseImediata.enabled && (
                <Badge variant="outline" className={getSupportTypeColor('criseImediata')}>
                  {getSupportTypeIcon('criseImediata')}
                  Crise Imediata ({volunteer.capabilities.criseImediata.limit})
                </Badge>
              )}
              {volunteer.capabilities.apoioEmocional.enabled && (
                <Badge variant="outline" className={getSupportTypeColor('apoioEmocional')}>
                  {getSupportTypeIcon('apoioEmocional')}
                  Apoio Emocional ({volunteer.capabilities.apoioEmocional.limit})
                </Badge>
              )}
              {volunteer.capabilities.orientacaoLegal.enabled && (
                <Badge variant="outline" className={getSupportTypeColor('orientacaoLegal')}>
                  {getSupportTypeIcon('orientacaoLegal')}
                  Orientação Legal ({volunteer.capabilities.orientacaoLegal.limit})
                </Badge>
              )}
            </div>

            {showRequestButtons && (
              <div className="flex flex-wrap gap-2">
                <Button 
                  size="sm" 
                  className="bg-green-600 hover:bg-green-700 text-white rounded-lg"
                  onClick={() => requestSupport(volunteer, 'conversa')}
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Conversar
                </Button>
                
                {volunteer.capabilities.criseImediata.enabled && (
                  <Button 
                    size="sm" 
                    className="bg-red-600 hover:bg-red-700 text-white rounded-lg"
                    onClick={() => requestSupport(volunteer, 'criseImediata')}
                  >
                    <Zap className="w-4 h-4 mr-1" />
                    Crise
                  </Button>
                )}
                
                {volunteer.capabilities.apoioEmocional.enabled && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="border-green-300 text-green-700 hover:bg-green-50 rounded-lg"
                    onClick={() => requestSupport(volunteer, 'apoioEmocional')}
                  >
                    <HeartHandshake className="w-4 h-4 mr-1" />
                    Apoio
                  </Button>
                )}
                
                {volunteer.capabilities.orientacaoLegal.enabled && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="border-orange-300 text-orange-700 hover:bg-orange-50 rounded-lg"
                    onClick={() => requestSupport(volunteer, 'orientacaoLegal')}
                  >
                    <Scale className="w-4 h-4 mr-1" />
                    Legal
                  </Button>
                )}
                
                {volunteer.capabilities.acolhimento.enabled && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="border-purple-300 text-purple-700 hover:bg-purple-50 rounded-lg"
                    onClick={() => requestSupport(volunteer, 'acolhimento')}
                  >
                    <Home className="w-4 h-4 mr-1" />
                    Acolher
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="text-center py-12">
        <HandHeart className="w-16 h-16 text-green-600 mx-auto mb-4 animate-pulse" />
        <p className="text-green-600 text-lg">Carregando rede de voluntárias...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Status de Voluntária */}
      <Card className="mb-6 bg-gradient-to-br from-green-50 to-blue-50 shadow-xl border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-green-600 to-blue-600 rounded-xl shadow-lg">
                <HandHeart className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-900">
                  {isVolunteer ? 'Você é uma Voluntária' : 'Torne-se uma Voluntária'}
                </h3>
                <p className="text-gray-600">
                  {isVolunteer 
                    ? `Status: ${isOnline ? '🟢 ONLINE - Visível para outras usuárias' : '⚪ OFFLINE - Não aparece nas buscas'}`
                    : 'Ajude outras mulheres com apoio em crise, emocional, legal e mais'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {isVolunteer && (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">
                    {isOnline ? 'Online' : 'Offline'}
                  </span>
                  <Switch 
                    checked={isOnline} 
                    onCheckedChange={setIsOnline}
                    className="data-[state=checked]:bg-green-600"
                  />
                  {isOnline ? (
                    <Wifi className="w-5 h-5 text-green-600" />
                  ) : (
                    <WifiOff className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              )}
              
              <Button 
                onClick={toggleVolunteerStatus}
                className={`${
                  isVolunteer 
                    ? 'bg-gray-600 hover:bg-gray-700' 
                    : 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700'
                } text-white rounded-xl shadow-lg`}
              >
                {isVolunteer ? (
                  <>
                    <Settings className="w-4 h-4 mr-2" />
                    Configurar
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Ser Voluntária
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl p-1 mb-8">
          <TabsTrigger value="nearby" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-blue-500 data-[state=active]:text-white">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Voluntárias Online</span>
          </TabsTrigger>
          
          <TabsTrigger value="requests" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-blue-500 data-[state=active]:text-white">
            <Heart className="w-4 h-4" />
            <span className="hidden sm:inline">Pedidos Recebidos</span>
            {supportRequests.filter(r => r.status === 'pending').length > 0 && (
              <Badge variant="destructive" className="ml-1 px-1 min-w-[1.2rem] h-5 rounded-full">
                {supportRequests.filter(r => r.status === 'pending').length}
              </Badge>
            )}
          </TabsTrigger>
          
          <TabsTrigger value="history" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-blue-500 data-[state=active]:text-white">
            <Clock className="w-4 h-4" />
            <span className="hidden sm:inline">Meus Apoios</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="nearby" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl text-green-800">
              Voluntárias Online ({nearbyVolunteers.filter(v => v.isOnline).length})
            </h3>
            <Badge className="bg-green-100 text-green-700">
              🟢 {nearbyVolunteers.filter(v => v.isOnline).length} disponíveis agora
            </Badge>
          </div>

          {nearbyVolunteers.filter(v => v.isOnline).length === 0 ? (
            <Card className="bg-gradient-to-br from-white to-gray-50/30 shadow-xl border-0">
              <CardContent className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg text-gray-600 mb-2">Nenhuma voluntária online no momento</h4>
                <p className="text-gray-500">Tente novamente em alguns minutos</p>
              </CardContent>
            </Card>
          ) : (
            nearbyVolunteers.filter(v => v.isOnline).map(volunteer => (
              <VolunteerCard key={volunteer.id} volunteer={volunteer} />
            ))
          )}
        </TabsContent>

        <TabsContent value="requests" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl text-green-800">
              Pedidos de Apoio ({supportRequests.filter(r => r.status === 'pending').length})
            </h3>
          </div>

          {!isVolunteer ? (
            <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 shadow-xl border-0">
              <CardContent className="text-center py-12">
                <AlertTriangle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                <h4 className="text-lg text-orange-700 mb-2">Torne-se uma voluntária</h4>
                <p className="text-orange-600 mb-4">Para receber pedidos de apoio, você precisa ser uma voluntária</p>
                <Button 
                  onClick={() => setShowVolunteerForm(true)}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-xl"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ser Voluntária
                </Button>
              </CardContent>
            </Card>
          ) : supportRequests.filter(r => r.status === 'pending').length === 0 ? (
            <Card className="bg-gradient-to-br from-white to-gray-50/30 shadow-xl border-0">
              <CardContent className="text-center py-12">
                <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg text-gray-600 mb-2">Nenhum pedido pendente</h4>
                <p className="text-gray-500">Quando alguém precisar de apoio, aparecerá aqui</p>
              </CardContent>
            </Card>
          ) : (
            supportRequests.filter(r => r.status === 'pending').map(request => (
              <Card key={request.id} className={`bg-gradient-to-r from-white shadow-lg border-0 ${
                request.priority === 'urgent' ? 'to-red-50/30 border-l-4 border-l-red-500' :
                request.priority === 'high' ? 'to-orange-50/30 border-l-4 border-l-orange-500' :
                'to-purple-50/30'
              }`}>
                <CardContent className="pt-4">
                  <div className="flex items-start space-x-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={request.from.photo} />
                      <AvatarFallback className="bg-purple-500 text-white">
                        {request.from.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{request.from.name}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge className={
                            request.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                            request.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                            'bg-purple-100 text-purple-700'
                          }>
                            {getSupportTypeIcon(request.type)}
                            {request.type === 'criseImediata' && 'Crise Imediata'}
                            {request.type === 'apoioEmocional' && 'Apoio Emocional'}
                            {request.type === 'orientacaoLegal' && 'Orientação Legal'}
                            {request.type === 'acolhimento' && 'Acolhimento'}
                            {request.type === 'carona' && 'Carona'}
                            {request.type === 'cuidadoInfantil' && 'Cuidado Infantil'}
                          </Badge>
                          {request.priority === 'urgent' && (
                            <Badge className="bg-red-600 text-white animate-pulse">
                              URGENTE
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-3">{request.message}</p>
                      
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleSupportRequest(request.id, 'accepted')}
                          className={`${
                            request.priority === 'urgent' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                          } text-white rounded-lg`}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Aceitar
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleSupportRequest(request.id, 'declined')}
                          className="rounded-lg"
                        >
                          Recusar
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl text-green-800">
              Histórico de Apoios
            </h3>
          </div>

          <Card className="bg-gradient-to-br from-white to-gray-50/30 shadow-xl border-0">
            <CardContent className="text-center py-12">
              <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg text-gray-600 mb-2">Histórico em construção</h4>
              <p className="text-gray-500">Em breve você verá seus apoios realizados aqui</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog de Cadastro de Voluntária com novas opções */}
      <Dialog open={showVolunteerForm} onOpenChange={setShowVolunteerForm}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-700">
              <HandHeart className="w-5 h-5" />
              Cadastro de Voluntária
            </DialogTitle>
            <DialogDescription>
              Preencha as informações para ajudar outras mulheres da rede
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-green-700 mb-2">Especialização *</label>
              <Select 
                value={volunteerProfile.specialization} 
                onValueChange={(value) => setVolunteerProfile(prev => ({ ...prev, specialization: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione sua especialização..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Amiga/Voluntária">Amiga/Voluntária</SelectItem>
                  <SelectItem value="Psicóloga">Psicóloga</SelectItem>
                  <SelectItem value="Assistente Social">Assistente Social</SelectItem>
                  <SelectItem value="Advogada">Advogada</SelectItem>
                  <SelectItem value="Enfermeira">Enfermeira</SelectItem>
                  <SelectItem value="Médica">Médica</SelectItem>
                  <SelectItem value="Educadora">Educadora</SelectItem>
                  <SelectItem value="Terapeuta">Terapeuta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm text-green-700 mb-2">Descrição *</label>
              <Textarea
                value={volunteerProfile.description}
                onChange={(e) => setVolunteerProfile(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descreva como você pode ajudar outras mulheres..."
                rows={3}
                className="resize-none"
              />
            </div>

            <div>
              <label className="block text-sm text-green-700 mb-2">Telefone de contato</label>
              <Input
                value={volunteerProfile.phone}
                onChange={(e) => setVolunteerProfile(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="(11) 99999-9999"
              />
            </div>

            <div>
              <label className="block text-sm text-green-700 mb-3">Formas de Apoio Disponíveis</label>
              
              <div className="space-y-4">
                {/* Crise Imediata - NOVA */}
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Zap className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="font-medium text-red-800">Crise Imediata</p>
                      <p className="text-sm text-red-600">Atendimento de urgência em situações de risco</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={volunteerProfile.capabilities.criseImediata.enabled}
                      onCheckedChange={(checked) => setVolunteerProfile(prev => ({
                        ...prev,
                        capabilities: {
                          ...prev.capabilities,
                          criseImediata: { ...prev.capabilities.criseImediata, enabled: checked }
                        }
                      }))}
                    />
                    {volunteerProfile.capabilities.criseImediata.enabled && (
                      <Input
                        type="number"
                        min="1"
                        max="5"
                        value={volunteerProfile.capabilities.criseImediata.limit}
                        onChange={(e) => setVolunteerProfile(prev => ({
                          ...prev,
                          capabilities: {
                            ...prev.capabilities,
                            criseImediata: { ...prev.capabilities.criseImediata, limit: parseInt(e.target.value) || 1 }
                          }
                        }))}
                        className="w-16 h-8 text-center"
                        placeholder="1"
                      />
                    )}
                  </div>
                </div>

                {/* Apoio Emocional - NOVA */}
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <HeartHandshake className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">Apoio Emocional</p>
                      <p className="text-sm text-green-600">Conversa e suporte psicológico</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={volunteerProfile.capabilities.apoioEmocional.enabled}
                      onCheckedChange={(checked) => setVolunteerProfile(prev => ({
                        ...prev,
                        capabilities: {
                          ...prev.capabilities,
                          apoioEmocional: { ...prev.capabilities.apoioEmocional, enabled: checked }
                        }
                      }))}
                    />
                    {volunteerProfile.capabilities.apoioEmocional.enabled && (
                      <Input
                        type="number"
                        min="1"
                        max="10"
                        value={volunteerProfile.capabilities.apoioEmocional.limit}
                        onChange={(e) => setVolunteerProfile(prev => ({
                          ...prev,
                          capabilities: {
                            ...prev.capabilities,
                            apoioEmocional: { ...prev.capabilities.apoioEmocional, limit: parseInt(e.target.value) || 2 }
                          }
                        }))}
                        className="w-16 h-8 text-center"
                        placeholder="2"
                      />
                    )}
                  </div>
                </div>

                {/* Orientação Legal - NOVA */}
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Scale className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="font-medium text-orange-800">Orientação Legal</p>
                      <p className="text-sm text-orange-600">Orientação sobre direitos e procedimentos</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={volunteerProfile.capabilities.orientacaoLegal.enabled}
                      onCheckedChange={(checked) => setVolunteerProfile(prev => ({
                        ...prev,
                        capabilities: {
                          ...prev.capabilities,
                          orientacaoLegal: { ...prev.capabilities.orientacaoLegal, enabled: checked }
                        }
                      }))}
                    />
                    {volunteerProfile.capabilities.orientacaoLegal.enabled && (
                      <Input
                        type="number"
                        min="1"
                        max="5"
                        value={volunteerProfile.capabilities.orientacaoLegal.limit}
                        onChange={(e) => setVolunteerProfile(prev => ({
                          ...prev,
                          capabilities: {
                            ...prev.capabilities,
                            orientacaoLegal: { ...prev.capabilities.orientacaoLegal, limit: parseInt(e.target.value) || 1 }
                          }
                        }))}
                        className="w-16 h-8 text-center"
                        placeholder="1"
                      />
                    )}
                  </div>
                </div>

                {/* Capacidades existentes */}
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Home className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-purple-800">Acolhimento</p>
                      <p className="text-sm text-purple-600">Oferecer lugar seguro temporário</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={volunteerProfile.capabilities.acolhimento.enabled}
                      onCheckedChange={(checked) => setVolunteerProfile(prev => ({
                        ...prev,
                        capabilities: {
                          ...prev.capabilities,
                          acolhimento: { ...prev.capabilities.acolhimento, enabled: checked }
                        }
                      }))}
                    />
                    {volunteerProfile.capabilities.acolhimento.enabled && (
                      <Input
                        type="number"
                        min="1"
                        max="10"
                        value={volunteerProfile.capabilities.acolhimento.limit}
                        onChange={(e) => setVolunteerProfile(prev => ({
                          ...prev,
                          capabilities: {
                            ...prev.capabilities,
                            acolhimento: { ...prev.capabilities.acolhimento, limit: parseInt(e.target.value) || 1 }
                          }
                        }))}
                        className="w-16 h-8 text-center"
                        placeholder="1"
                      />
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Car className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-800">Carona</p>
                      <p className="text-sm text-blue-600">Transporte para locais seguros</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={volunteerProfile.capabilities.carona.enabled}
                      onCheckedChange={(checked) => setVolunteerProfile(prev => ({
                        ...prev,
                        capabilities: {
                          ...prev.capabilities,
                          carona: { ...prev.capabilities.carona, enabled: checked }
                        }
                      }))}
                    />
                    {volunteerProfile.capabilities.carona.enabled && (
                      <Input
                        type="number"
                        min="1"
                        max="5"
                        value={volunteerProfile.capabilities.carona.limit}
                        onChange={(e) => setVolunteerProfile(prev => ({
                          ...prev,
                          capabilities: {
                            ...prev.capabilities,
                            carona: { ...prev.capabilities.carona, limit: parseInt(e.target.value) || 2 }
                          }
                        }))}
                        className="w-16 h-8 text-center"
                        placeholder="2"
                      />
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Baby className="w-5 h-5 text-pink-600" />
                    <div>
                      <p className="font-medium text-pink-800">Cuidado Infantil</p>
                      <p className="text-sm text-pink-600">Cuidar de crianças temporariamente</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={volunteerProfile.capabilities.cuidadoInfantil.enabled}
                      onCheckedChange={(checked) => setVolunteerProfile(prev => ({
                        ...prev,
                        capabilities: {
                          ...prev.capabilities,
                          cuidadoInfantil: { ...prev.capabilities.cuidadoInfantil, enabled: checked }
                        }
                      }))}
                    />
                    {volunteerProfile.capabilities.cuidadoInfantil.enabled && (
                      <Input
                        type="number"
                        min="1"
                        max="10"
                        value={volunteerProfile.capabilities.cuidadoInfantil.limit}
                        onChange={(e) => setVolunteerProfile(prev => ({
                          ...prev,
                          capabilities: {
                            ...prev.capabilities,
                            cuidadoInfantil: { ...prev.capabilities.cuidadoInfantil, limit: parseInt(e.target.value) || 3 }
                          }
                        }))}
                        className="w-16 h-8 text-center"
                        placeholder="3"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-800">
                ✅ Sua disponibilidade será controlada pelo status Online/Offline. 
                Quando estiver online, você aparecerá para outras usuárias.
              </p>
            </div>

            <div className="flex space-x-2">
              <Button 
                onClick={saveVolunteerProfile}
                disabled={!volunteerProfile.specialization || !volunteerProfile.description}
                className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
              >
                <HandHeart className="w-4 h-4 mr-2" />
                Tornar-se Voluntária
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowVolunteerForm(false)}
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