import React from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { Star, Clock, Phone, Calendar, Video, MessageCircle, Shield } from 'lucide-react'

export function ProfessionalCard({ professional, onSchedule, onContact }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Avatar className="w-12 h-12">
            <AvatarFallback className="bg-purple-100 text-purple-700">
              {professional.name.split(' ')[1]?.charAt(0) || 'D'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{professional.name}</h3>
                <p className="text-sm text-gray-600">{professional.specialization}</p>
              </div>
              
              <div className="flex items-center gap-1">
                {professional.isOnline && (
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                )}
                {professional.isEmergency && (
                  <Badge variant="outline" className="text-xs bg-red-50 text-red-700">
                    24h
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span>{professional.rating}</span>
                <span>({professional.reviewCount})</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{professional.responseTime}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <p className="text-sm text-gray-600 line-clamp-2">{professional.bio}</p>
        
        <div className="flex flex-wrap gap-1">
          {professional.credentials.map((credential, idx) => (
            <Badge key={idx} variant="outline" className="text-xs">
              {credential}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-medium text-green-600">
                R$ {professional.discountPrice}
              </span>
              <span className="text-sm text-gray-500 line-through">
                R$ {professional.price}
              </span>
            </div>
            <p className="text-xs text-green-600">
              {Math.round((1 - professional.discountPrice / professional.price) * 100)}% desconto Ellos
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onContact(professional)}
            >
              <MessageCircle className="w-3 h-3 mr-1" />
              Chat
            </Button>
            <Button 
              size="sm"
              onClick={() => onSchedule(professional)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Calendar className="w-3 h-3 mr-1" />
              Agendar
            </Button>
          </div>
        </div>
        
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-3">
              {professional.isOnline && (
                <span className="flex items-center gap-1 text-green-600">
                  <Video className="w-3 h-3" />
                  Online
                </span>
              )}
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Verificado
              </span>
            </div>
            <span>{professional.availability[0]}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}