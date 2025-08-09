import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Input } from './ui/input'
import { HandHeart, MapPin, Phone, AlertTriangle, Users, Clock, Shield, Search, Filter, Star } from 'lucide-react'
import { projectId, publicAnonKey } from '../utils/supabase/info'

export function SupportScreen({ user }) {
  const [volunteers, setVolunteers] = useState([])
  const [filteredVolunteers, setFilteredVolunteers] = useState([])
  const [loading, setLoading] = useState(true)
  const [userLocation, setUserLocation] = useState(null)
  const [maxDistance, setMaxDistance] = useState(10)
  const [serviceFilter, setServiceFilter] = useState('all')
  const [sortBy, setSortBy] = useState('distance')
  
  const serviceTypes = [
    { id: 'emergency', label: 'Emergência/Resgate', icon: '🚨' },
    { id: 'shelter', label: 'Abrigo Temporário', icon: '🏠' },
    { id: 'transport', label: 'Transporte', icon: '🚗' },
    { id: 'emotional', label: 'Apoio Emocional', icon: '💙' },
    { id: 'legal', label: 'Orientação Legal', icon: '⚖️' },
    { id: 'medical', label: 'Acompanhamento Médico', icon: '🏥' },
    { id: 'childcare', label: 'Cuidado Infantil', icon: '👶' },
    { id: 'financial', label: 'Ajuda Financeira', icon: '💰' }
  ]

  useEffect(() => {
    getCurrentLocation()
    loadVolunteers()
  }, [])

  useEffect(() => {
    filterAndSortVolunteers()
  }, [volunteers, serviceFilter, maxDistance, sortBy, userLocation])

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        },
        (error) => {
          console.log('Location error:', error)
          // Localização padrão (Centro de São Paulo)
          setUserLocation({
            latitude: -23.5505,
            longitude: -46.6333
          })
        }
      )
    }
  }

  const loadVolunteers = async () => {
    try {
      // Simular dados de voluntárias (em produção viria da API)
      const mockVolunteers = [
        {
          id: '1',
          name: 'Ana Silva',
          services: ['emergency', 'shelter', 'transport'],
          rating: 4.9,
          helpCount: 23,
          location: { latitude: -23.5505, longitude: -46.6333 },
          address: 'Centro, São Paulo',
          isAvailable: true,
          responseTime: '5 min',
          capacity: {
            shelter: 2,
            transport: 3,
            childcare: 1
          },
          description: 'Psicóloga com experiência em violência doméstica. Apartamento seguro para abrigo temporário.',
          verified: true,
          phone: '+55 11 99999-1234'
        },
        {
          id: '2',
          name: 'Maria Santos',
          services: ['emotional', 'legal', 'medical'],
          rating: 4.8,
          helpCount: 31,
          location: { latitude: -23.5615, longitude: -46.6256 },
          address: 'Vila Madalena, São Paulo',
          isAvailable: true,
          responseTime: '8 min',
          capacity: {
            emotional: 5,
            legal: 2
          },
          description: 'Advogada especializada em direito da mulher. Atendimento 24h para orientações legais.',
          verified: true,
          phone: '+55 11 99999-5678'
        },
        {
          id: '3',
          name: 'Carla Oliveira',
          services: ['childcare', 'transport', 'financial'],
          rating: 4.7,
          helpCount: 18,
          location: { latitude: -23.5489, longitude: -46.6388 },
          address: 'Bela Vista, São Paulo',
          isAvailable: true,
          responseTime: '12 min',
          capacity: {
            childcare: 3,
            transport: 2,
            financial: 1
          },
          description: 'Educadora e mãe de família. Ajuda com crianças e pequenos auxílios financeiros.',
          verified: true,
          phone: '+55 11 99999-9012'
        }
      ]

      setVolunteers(mockVolunteers)
    } catch (error) {
      console.log('Error loading volunteers:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateDistance = (volunteer) => {
    if (!userLocation) return 0
    
    const R = 6371 // Raio da Terra em km
    const dLat = (volunteer.location.latitude - userLocation.latitude) * Math.PI / 180
    const dLon = (volunteer.location.longitude - userLocation.longitude) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(userLocation.latitude * Math.PI / 180) * Math.cos(volunteer.location.latitude * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c // Distância em km
  }

  const filterAndSortVolunteers = () => {
    let filtered = volunteers.filter(volunteer => {
      // Filtrar apenas voluntárias disponíveis
      if (!volunteer.isAvailable) return false
      
      // Filtrar por distância
      const distance = calculateDistance(volunteer)
      if (distance > maxDistance) return false
      
      // Filtrar por tipo de serviço
      if (serviceFilter !== 'all' && !volunteer.services.includes(serviceFilter)) return false
      
      return true
    })

    // Calcular distância para cada voluntária
    filtered = filtered.map(volunteer => ({
      ...volunteer,
      distance: calculateDistance(volunteer)
    }))

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return a.distance - b.distance
        case 'rating':
          return b.rating - a.rating
        case 'experience':
          return b.helpCount - a.helpCount
        case 'response':
          return parseInt(a.responseTime) - parseInt(b.responseTime)
        default:
          return 0
      }
    })

    setFilteredVolunteers(filtered)
  }

  const sendEmergencyAlert = async (volunteerId) => {
    if (!confirm('🆘 ALERTA DE EMERGÊNCIA\n\nDeseja enviar um sinal de alarme para esta voluntária?\n\nEla receberá uma notificação imediata com sua localização.')) {
      return
    }

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-47a9aa23/volunteers/emergency-alert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.access_token}`
        },
        body: JSON.stringify({
          volunteerId,
          location: userLocation,
          urgent: true
        })
      })

      if (response.ok) {
        alert('✅ Alerta enviado!\n\nA voluntária foi notificada e receberá sua localização. Mantenha-se em local seguro.')
      } else {
        alert('❌ Erro ao enviar alerta. Tente novamente.')
      }
    } catch (error) {
      console.log('Emergency alert error:', error)
      alert('❌ Erro ao enviar alerta. Tente novamente.')
    }
  }

  const callVolunteer = (phone) => {
    if (confirm('📞 CHAMADA DIRETA\n\nDeseja ligar para esta voluntária?\n\nO número só é revelado quando você autoriza o contato.')) {
      window.open(`tel:${phone}`)
    }
  }

  const getServiceIcon = (serviceId) => {
    return serviceTypes.find(s => s.id === serviceId)?.icon || '🤝'
  }

  const getServiceLabel = (serviceId) => {
    return serviceTypes.find(s => s.id === serviceId)?.label || serviceId
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-purple-600">Carregando rede de apoio...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl text-purple-800 mb-2">Rede de Apoio Mútuo</h2>
        <p className="text-purple-600">
          Voluntárias disponíveis na sua região para ajuda imediata
        </p>
      </div>

      {/* Alerta de Emergência */}
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h4 className="text-red-800 mb-1">🆘 Situação de Emergência?</h4>
              <p className="text-sm text-red-700 mb-3">
                Use o sinal de alarme para alertar voluntárias próximas imediatamente.
                Para emergências extremas, ligue 190 ou 180.
              </p>
              <div className="flex items-center gap-2 text-xs text-red-600">
                <Clock className="w-3 h-3" />
                <span>Resposta média: 5 minutos • {filteredVolunteers.length} voluntárias online</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <Filter className="w-5 h-5" />
            Filtros de Busca
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm mb-1 text-gray-700">Distância Máxima</label>
              <Select value={maxDistance.toString()} onValueChange={(value) => setMaxDistance(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 km</SelectItem>
                  <SelectItem value="10">10 km</SelectItem>
                  <SelectItem value="20">20 km</SelectItem>
                  <SelectItem value="50">50 km</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-700">Tipo de Ajuda</label>
              <Select value={serviceFilter} onValueChange={setServiceFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  {serviceTypes.map(service => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.icon} {service.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-700">Ordenar por</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="distance">Mais Próxima</SelectItem>
                  <SelectItem value="rating">Melhor Avaliação</SelectItem>
                  <SelectItem value="experience">Mais Experiente</SelectItem>
                  <SelectItem value="response">Resposta Mais Rápida</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <div className="text-sm text-gray-600">
                <div className="flex items-center gap-1 mb-1">
                  <Users className="w-4 h-4" />
                  <span>{filteredVolunteers.length} disponíveis</span>
                </div>
                <div className="text-xs text-green-600">
                  🟢 Todas online agora
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Voluntárias */}
      <div className="space-y-4">
        {filteredVolunteers.length > 0 ? (
          filteredVolunteers.map((volunteer) => (
            <Card key={volunteer.id} className="border-l-4 border-l-purple-400 hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <HandHeart className="w-6 h-6 text-purple-600" />
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg text-purple-800">{volunteer.name}</h3>
                        {volunteer.verified && (
                          <Badge className="bg-blue-100 text-blue-800 text-xs">
                            <Shield className="w-3 h-3 mr-1" />
                            Verificada
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span>{volunteer.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <HandHeart className="w-4 h-4" />
                          <span>{volunteer.helpCount} ajudas</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>Resposta em {volunteer.responseTime}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                        <MapPin className="w-4 h-4" />
                        <span>{volunteer.address}</span>
                        <span className="text-purple-600">• {volunteer.distance?.toFixed(1)} km</span>
                      </div>

                      <p className="text-sm text-gray-700 mb-3 max-w-2xl">
                        {volunteer.description}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl text-green-600 mb-1">🟢</div>
                    <div className="text-xs text-gray-500">Online</div>
                  </div>
                </div>

                {/* Serviços Disponíveis */}
                <div className="mb-4">
                  <h4 className="text-sm text-gray-700 mb-2">Tipos de Ajuda Disponíveis:</h4>
                  <div className="flex flex-wrap gap-2">
                    {volunteer.services.map(serviceId => (
                      <Badge key={serviceId} variant="outline" className="flex items-center gap-1">
                        <span>{getServiceIcon(serviceId)}</span>
                        <span>{getServiceLabel(serviceId)}</span>
                        {volunteer.capacity[serviceId] && (
                          <span className="text-xs text-purple-600">
                            ({volunteer.capacity[serviceId]})
                          </span>
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Botões de Ação */}
                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => sendEmergencyAlert(volunteer.id)}
                    className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    🆘 Sinal de Alarme
                  </Button>

                  <Button
                    onClick={() => callVolunteer(volunteer.phone)}
                    variant="outline"
                    className="border-green-300 text-green-700 hover:bg-green-50 flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    📞 Ligar Agora
                  </Button>

                  <div className="text-xs text-gray-500 ml-auto">
                    Telefone revelado apenas quando autorizado
                  </div>
                </div>

                {/* Capacidades Específicas */}
                {Object.keys(volunteer.capacity).length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="text-xs text-gray-600">
                      <span className="font-medium">Capacidades: </span>
                      {Object.entries(volunteer.capacity).map(([service, capacity]) => (
                        <span key={service} className="mr-3">
                          {getServiceLabel(service)}: {capacity} pessoa(s)
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <HandHeart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Nenhuma voluntária disponível na sua região</p>
              <p className="text-sm text-gray-500 mb-4">
                Tente aumentar a distância de busca ou aguarde novas voluntárias se conectarem
              </p>
              <Button onClick={() => setMaxDistance(50)} variant="outline">
                Ampliar busca para 50km
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Footer Informativo */}
      <Card className="border-purple-200 bg-purple-50">
        <CardContent className="p-4 text-center">
          <p className="text-sm text-purple-700 mb-2">
            💜 Todas as voluntárias passaram por verificação de segurança
          </p>
          <p className="text-xs text-purple-600">
            Sistema criptografado • Localização protegida • Contato seguro
          </p>
        </CardContent>
      </Card>
    </div>
  )
}