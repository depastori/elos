import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { 
  MapPin, Navigation, Shield, AlertTriangle, Users, Clock, 
  Phone, MessageCircle, Star, Filter, Layers, Target,
  RefreshCw, Settings, Info, CheckCircle2,
  Zap, Heart, Eye, EyeOff, MoreHorizontal, Share2
} from 'lucide-react'
import { toast } from 'sonner@2.0.3'

export function MapScreen({ user }) {
  const [currentLocation, setCurrentLocation] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [volunteers, setVolunteers] = useState([])
  const [safeZones, setSafeZones] = useState([])
  const [selectedAlert, setSelectedAlert] = useState(null)
  const [showAlertDialog, setShowAlertDialog] = useState(false)
  const [mapFilter, setMapFilter] = useState('all')
  const [isLocating, setIsLocating] = useState(false)
  const [locationError, setLocationError] = useState(null)
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)

  useEffect(() => {
    initializeMap()
    loadMapData()
    requestLocation()
  }, [])

  const initializeMap = () => {
    // Verificar se Google Maps está disponível
    if (typeof google !== 'undefined' && google.maps) {
      initGoogleMap()
    } else {
      // Fallback para OpenStreetMap/Leaflet
      initOpenStreetMap()
    }
  }

  const initGoogleMap = () => {
    try {
      const map = new google.maps.Map(mapRef.current, {
        zoom: 14,
        center: { lat: -23.5505, lng: -46.6333 }, // São Paulo como centro padrão
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ],
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true
      })

      mapInstanceRef.current = map
      console.log('✅ Google Maps inicializado')
    } catch (error) {
      console.log('❌ Erro no Google Maps, usando OpenStreetMap')
      initOpenStreetMap()
    }
  }

  const initOpenStreetMap = () => {
    // Simular um mapa básico com HTML/CSS quando Google Maps não estiver disponível
    if (mapRef.current) {
      mapRef.current.innerHTML = `
        <div style="
          width: 100%; 
          height: 400px; 
          background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          position: relative;
          overflow: hidden;
        ">
          <div style="
            background: rgba(255,255,255,0.9);
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          ">
            <div style="
              width: 60px;
              height: 60px;
              background: #4285f4;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 auto 16px;
            ">
              <svg width="30" height="30" fill="white" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
            <h3 style="margin: 0 0 8px; color: #1976d2; font-size: 18px;">Mapa Interativo</h3>
            <p style="margin: 0; color: #666; font-size: 14px;">
              Ative o GPS para ver sua localização e pontos próximos
            </p>
          </div>
        </div>
      `
      
      // Adicionar pontos simulados
      setTimeout(() => {
        addSimulatedMapPoints()
      }, 1000)
    }
  }

  const addSimulatedMapPoints = () => {
    if (!mapRef.current) return

    // Adicionar pontos de alerta e voluntárias como overlays
    const pointsContainer = document.createElement('div')
    pointsContainer.style.position = 'absolute'
    pointsContainer.style.top = '0'
    pointsContainer.style.left = '0'
    pointsContainer.style.width = '100%'
    pointsContainer.style.height = '100%'
    pointsContainer.style.pointerEvents = 'none'

    // Pontos de exemplo
    const points = [
      { x: '20%', y: '30%', type: 'alert', label: 'Alerta recente' },
      { x: '60%', y: '45%', type: 'volunteer', label: 'Voluntária online' },
      { x: '80%', y: '20%', type: 'safe', label: 'Zona segura' },
      { x: '40%', y: '70%', type: 'volunteer', label: 'Profissional' },
      { x: '70%', y: '60%', type: 'alert', label: 'Área de atenção' }
    ]

    points.forEach(point => {
      const marker = document.createElement('div')
      marker.style.position = 'absolute'
      marker.style.left = point.x
      marker.style.top = point.y
      marker.style.transform = 'translate(-50%, -50%)'
      marker.style.pointerEvents = 'auto'
      marker.style.cursor = 'pointer'
      marker.style.zIndex = '10'
      
      const color = point.type === 'alert' ? '#ef4444' : 
                   point.type === 'volunteer' ? '#10b981' : '#3b82f6'
      
      marker.innerHTML = `
        <div style="
          width: 24px;
          height: 24px;
          background: ${color};
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          animation: pulse 2s infinite;
        "></div>
      `
      
      marker.onclick = () => {
        toast.info(`📍 ${point.label}`, {
          description: `Tipo: ${point.type === 'alert' ? 'Alerta' : point.type === 'volunteer' ? 'Voluntária' : 'Zona Segura'}`,
          duration: 3000
        })
      }
      
      pointsContainer.appendChild(marker)
    })

    // Adicionar animação CSS
    const style = document.createElement('style')
    style.textContent = `
      @keyframes pulse {
        0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.7; }
        100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
      }
    `
    document.head.appendChild(style)

    mapRef.current.appendChild(pointsContainer)
  }

  const requestLocation = async () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocalização não suportada pelo navegador')
      toast.error('GPS não disponível', {
        description: 'Seu navegador não suporta geolocalização'
      })
      return
    }

    setIsLocating(true)
    console.log('📍 Solicitando localização do usuário...')

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        }
        
        setCurrentLocation(location)
        setLocationError(null)
        setIsLocating(false)
        
        console.log('✅ Localização obtida:', location)
        
        toast.success('📍 Localização detectada', {
          description: `Precisão: ±${Math.round(location.accuracy)}m`,
          duration: 3000
        })

        // Centralizar mapa na localização do usuário
        if (mapInstanceRef.current && typeof google !== 'undefined') {
          mapInstanceRef.current.setCenter(location)
          mapInstanceRef.current.setZoom(16)
          
          // Adicionar marcador do usuário
          new google.maps.Marker({
            position: location,
            map: mapInstanceRef.current,
            title: 'Sua localização',
            icon: {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="20" r="18" fill="#4285f4" stroke="white" stroke-width="4"/>
                  <circle cx="20" cy="20" r="8" fill="white"/>
                </svg>
              `),
              scaledSize: new google.maps.Size(40, 40)
            }
          })
        }
      },
      (error) => {
        setIsLocating(false)
        
        let errorMessage = 'Erro ao obter localização'
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permissão de localização negada'
            toast.error('GPS negado', {
              description: 'Ative a localização nas configurações do navegador',
              duration: 5000
            })
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Localização indisponível'
            toast.error('GPS indisponível', {
              description: 'Não foi possível obter sua localização'
            })
            break
          case error.TIMEOUT:
            errorMessage = 'Timeout na localização'
            toast.error('GPS demorou muito', {
              description: 'Tente novamente em local aberto'
            })
            break
          default:
            toast.error('Erro no GPS', {
              description: 'Problema desconhecido com a localização'
            })
        }
        
        setLocationError(errorMessage)
        console.log('❌ Erro de localização:', error)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    )
  }

  const loadMapData = () => {
    // Simular dados do mapa
    const mockAlerts = [
      {
        id: 'alert_1',
        type: 'danger',
        title: 'Área de Risco',
        description: 'Relatos de assédio na região',
        location: { lat: -23.5505, lng: -46.6333 },
        address: 'Vila Madalena, São Paulo',
        timestamp: '2024-01-15T14:30:00Z',
        severity: 'high',
        reports: 3
      },
      {
        id: 'alert_2',
        type: 'warning',
        title: 'Atenção Redobrada',
        description: 'Movimento suspeito relatado',
        location: { lat: -23.5515, lng: -46.6343 },
        address: 'Pinheiros, São Paulo',
        timestamp: '2024-01-15T12:15:00Z',
        severity: 'medium',
        reports: 1
      }
    ]

    const mockVolunteers = [
      {
        id: 'vol_1',
        name: 'Ana Carvalho',
        type: 'volunteer',
        specialization: 'Apoio Emocional',
        location: { lat: -23.5495, lng: -46.6323 },
        distance: '0.8 km',
        isOnline: true,
        responseTime: '3 min'
      },
      {
        id: 'vol_2',
        name: 'Dr. Maria Santos',
        type: 'professional',
        specialization: 'Psicóloga',
        location: { lat: -23.5525, lng: -46.6353 },
        distance: '1.2 km',
        isOnline: true,
        responseTime: '5 min'
      }
    ]

    const mockSafeZones = [
      {
        id: 'safe_1',
        name: 'Hospital Sírio-Libanês',
        type: 'hospital',
        location: { lat: -23.5475, lng: -46.6313 },
        address: 'R. Dona Adma Jafet, 91',
        isOpen24h: true
      },
      {
        id: 'safe_2',
        name: 'Delegacia da Mulher',
        type: 'police',
        location: { lat: -23.5535, lng: -46.6363 },
        address: 'R. Tutóia, 624',
        isOpen24h: false,
        hours: '08:00 - 18:00'
      }
    ]

    setAlerts(mockAlerts)
    setVolunteers(mockVolunteers)
    setSafeZones(mockSafeZones)
  }

  const handleAlertClick = (alert) => {
    setSelectedAlert(alert)
    setShowAlertDialog(true)
  }

  const formatTimeAgo = (timestamp) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now - time) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Agora'
    if (diffInMinutes < 60) return `${diffInMinutes}m atrás`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h atrás`
    return `${Math.floor(diffInMinutes / 1440)}d atrás`
  }

  const getAlertIcon = (type, severity) => {
    if (type === 'danger' || severity === 'high') {
      return <AlertTriangle className="w-4 h-4 text-red-600" />
    }
    return <AlertTriangle className="w-4 h-4 text-orange-600" />
  }

  const getAlertColor = (type, severity) => {
    if (type === 'danger' || severity === 'high') {
      return 'from-red-50 to-red-100 border-red-200'
    }
    return 'from-orange-50 to-orange-100 border-orange-200'
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header do Mapa */}
      <Card className="bg-gradient-to-br from-white to-blue-50/30 shadow-xl border-0">
        <CardHeader>
          <CardTitle className="text-blue-800 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Mapa de Segurança Interativo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Button 
                onClick={requestLocation}
                disabled={isLocating}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
              >
                {isLocating ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Target className="w-4 h-4 mr-2" />
                )}
                {isLocating ? 'Localizando...' : 'Minha Localização'}
              </Button>

              {currentLocation && (
                <Badge className="bg-green-100 text-green-700">
                  <Navigation className="w-3 h-3 mr-1" />
                  GPS Ativo
                </Badge>
              )}

              {locationError && (
                <Badge className="bg-red-100 text-red-700">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {locationError}
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <select 
                value={mapFilter} 
                onChange={(e) => setMapFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">Todos os pontos</option>
                <option value="alerts">Apenas alertas</option>
                <option value="volunteers">Apenas voluntárias</option>
                <option value="safe">Apenas locais seguros</option>
              </select>
            </div>
          </div>

          {/* Container do Mapa */}
          <div 
            ref={mapRef}
            className="w-full h-96 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-inner border border-blue-200"
            style={{ minHeight: '400px' }}
          />

          {/* Legenda do Mapa */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Alertas de Risco</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Voluntárias Online</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Locais Seguros</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white"></div>
              <span className="text-sm text-gray-600">Sua Localização</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Alertas Próximos */}
      <Card className="bg-gradient-to-br from-white to-red-50/30 shadow-xl border-0">
        <CardHeader>
          <CardTitle className="text-red-800 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Alertas Próximos ({alerts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h4 className="text-lg text-green-700 mb-2">Nenhum alerta na região</h4>
              <p className="text-green-600">Área aparentemente segura no momento</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map(alert => (
                <Card 
                  key={alert.id} 
                  className={`bg-gradient-to-r ${getAlertColor(alert.type, alert.severity)} shadow-md border-0 cursor-pointer hover:shadow-lg transition-shadow`}
                  onClick={() => handleAlertClick(alert)}
                >
                  <CardContent className="pt-4">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        {getAlertIcon(alert.type, alert.severity)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{alert.title}</h4>
                          <Badge className={
                            alert.severity === 'high' ? 'bg-red-600 text-white' :
                            alert.severity === 'medium' ? 'bg-orange-500 text-white' :
                            'bg-yellow-500 text-white'
                          }>
                            {alert.severity === 'high' ? 'Alto Risco' :
                             alert.severity === 'medium' ? 'Atenção' : 'Baixo'}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-700 mb-2">{alert.description}</p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>{alert.address}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span>{formatTimeAgo(alert.timestamp)}</span>
                            <span>{alert.reports} relato(s)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Voluntárias Próximas */}
      <Card className="bg-gradient-to-br from-white to-green-50/30 shadow-xl border-0">
        <CardHeader>
          <CardTitle className="text-green-800 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Voluntárias Próximas ({volunteers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {volunteers.map(volunteer => (
              <Card key={volunteer.id} className="bg-gradient-to-r from-white to-green-50/30 shadow-md border-0">
                <CardContent className="pt-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white">
                        <Users className="w-6 h-6" />
                      </div>
                      {volunteer.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{volunteer.name}</h4>
                      <p className="text-sm text-gray-600">{volunteer.specialization}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          {volunteer.distance} • ~{volunteer.responseTime}
                        </span>
                        <div className="flex space-x-1">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white rounded-lg">
                            <MessageCircle className="w-3 h-3 mr-1" />
                            Chamar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dialog de Detalhes do Alerta */}
      <Dialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Detalhes do Alerta
            </DialogTitle>
            <DialogDescription>
              Informações detalhadas sobre o alerta de segurança.
            </DialogDescription>
          </DialogHeader>
          
          {selectedAlert && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">{selectedAlert.title}</h4>
                <p className="text-sm text-gray-700">{selectedAlert.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Localização</p>
                  <p className="text-sm">{selectedAlert.address}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Reportado</p>
                  <p className="text-sm">{formatTimeAgo(selectedAlert.timestamp)}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <Badge className={
                  selectedAlert.severity === 'high' ? 'bg-red-600 text-white' :
                  selectedAlert.severity === 'medium' ? 'bg-orange-500 text-white' :
                  'bg-yellow-500 text-white'
                }>
                  {selectedAlert.severity === 'high' ? 'Alto Risco' :
                   selectedAlert.severity === 'medium' ? 'Atenção' : 'Baixo Risco'}
                </Badge>
                <span className="text-sm text-gray-600">
                  {selectedAlert.reports} relato(s)
                </span>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => {
                    toast.info('🗺️ Abrindo no Google Maps...')
                    setShowAlertDialog(false)
                  }}
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Ver no Mapa
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    toast.success('📢 Alerta compartilhado!')
                    setShowAlertDialog(false)
                  }}
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}