import React from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { AlertTriangle, Clock, Video, Phone } from 'lucide-react'
import { emergencyProfessionals } from './data'

export function EmergencySupport({ onEmergencyCall }) {
  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-red-700">
          <AlertTriangle className="w-5 h-5" />
          🆘 Plantão Psicológico 24h
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-center p-4 bg-white rounded-lg border border-red-200">
          <h3 className="font-medium text-red-800 mb-2">Atendimento de Emergência</h3>
          <p className="text-sm text-red-600 mb-4">
            Resposta em até 5 minutos • Disponível 24 horas
          </p>
          
          <Button 
            onClick={onEmergencyCall}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            <Phone className="w-4 h-4 mr-2" />
            Solicitar Atendimento Urgente
          </Button>
        </div>
        
        <div>
          <h4 className="font-medium text-red-800 mb-2">Profissionais Disponíveis Agora</h4>
          <div className="space-y-2">
            {emergencyProfessionals.slice(0, 3).map((prof) => (
              <div key={prof.id} className="flex items-center justify-between p-2 bg-white rounded border">
                <div>
                  <p className="font-medium text-gray-800 text-sm">{prof.name}</p>
                  <p className="text-xs text-gray-600">{prof.specialization}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                    <Clock className="w-3 h-3 mr-1" />
                    {prof.responseTime}
                  </Badge>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-center text-xs text-red-600">
          <p>
            💜 Atendimento especializado para mulheres em situação de violência
          </p>
        </div>
      </CardContent>
    </Card>
  )
}