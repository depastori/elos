import React from 'react'
import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { 
  Star, Circle, MessageCircle, Zap, Home, Car, Baby, 
  HeartHandshake, Scale
} from 'lucide-react'
import { getSupportTypeColor } from './helpers'

const getSupportTypeIcon = (type) => {
  switch(type) {
    case 'acolhimento': return <Home className="w-3 h-3 mr-1" />
    case 'carona': return <Car className="w-3 h-3 mr-1" />
    case 'cuidadoInfantil': return <Baby className="w-3 h-3 mr-1" />
    case 'criseImediata': return <Zap className="w-3 h-3 mr-1" />
    case 'apoioEmocional': return <HeartHandshake className="w-3 h-3 mr-1" />
    case 'orientacaoLegal': return <Scale className="w-3 h-3 mr-1" />
    default: return null
  }
}

const getSupportTypeLabel = (type) => {
  switch(type) {
    case 'acolhimento': return 'Acolhimento'
    case 'carona': return 'Carona'
    case 'cuidadoInfantil': return 'Cuidado Infantil'
    case 'criseImediata': return 'Crise Imediata'
    case 'apoioEmocional': return 'Apoio Emocional'
    case 'orientacaoLegal': return 'Orientação Legal'
    default: return 'Apoio'
  }
}

export function VolunteerCard({ volunteer, showRequestButtons = true, onRequestSupport }) {
  return (
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

            {/* Capacidades */}
            <div className="flex flex-wrap gap-2 mb-3">
              {Object.entries(volunteer.capabilities || {}).map(([type, capability]) => (
                capability.enabled && (
                  <Badge 
                    key={type} 
                    variant="outline" 
                    className={getSupportTypeColor(type)}
                  >
                    {getSupportTypeIcon(type)}
                    {getSupportTypeLabel(type)} ({capability.limit})
                  </Badge>
                )
              ))}
            </div>

            {showRequestButtons && (
              <div className="flex flex-wrap gap-2">
                <Button 
                  size="sm" 
                  className="bg-green-600 hover:bg-green-700 text-white rounded-lg"
                  onClick={() => onRequestSupport?.(volunteer, 'conversa')}
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Conversar
                </Button>
                
                {volunteer.capabilities?.criseImediata?.enabled && (
                  <Button 
                    size="sm" 
                    className="bg-red-600 hover:bg-red-700 text-white rounded-lg"
                    onClick={() => onRequestSupport?.(volunteer, 'criseImediata')}
                  >
                    <Zap className="w-4 h-4 mr-1" />
                    Crise
                  </Button>
                )}
                
                {volunteer.capabilities?.apoioEmocional?.enabled && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="border-green-300 text-green-700 hover:bg-green-50 rounded-lg"
                    onClick={() => onRequestSupport?.(volunteer, 'apoioEmocional')}
                  >
                    <HeartHandshake className="w-4 h-4 mr-1" />
                    Apoio
                  </Button>
                )}
                
                {volunteer.capabilities?.orientacaoLegal?.enabled && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="border-orange-300 text-orange-700 hover:bg-orange-50 rounded-lg"
                    onClick={() => onRequestSupport?.(volunteer, 'orientacaoLegal')}
                  >
                    <Scale className="w-4 h-4 mr-1" />
                    Legal
                  </Button>
                )}
                
                {volunteer.capabilities?.acolhimento?.enabled && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="border-purple-300 text-purple-700 hover:bg-purple-50 rounded-lg"
                    onClick={() => onRequestSupport?.(volunteer, 'acolhimento')}
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
}