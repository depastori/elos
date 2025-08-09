import React from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Switch } from '../ui/switch'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { HandHeart, Home, Car, Baby, Zap, HeartHandshake, Scale } from 'lucide-react'
import { VOLUNTEER_SPECIALIZATIONS, VOLUNTEER_CAPABILITIES } from './constants'

const getCapabilityIcon = (iconName) => {
  switch(iconName) {
    case 'Home': return <Home className="w-5 h-5" />
    case 'Car': return <Car className="w-5 h-5" />
    case 'Baby': return <Baby className="w-5 h-5" />
    case 'Zap': return <Zap className="w-5 h-5" />
    case 'HeartHandshake': return <HeartHandshake className="w-5 h-5" />
    case 'Scale': return <Scale className="w-5 h-5" />
    default: return <HandHeart className="w-5 h-5" />
  }
}

const getCapabilityBgColor = (color) => {
  switch(color) {
    case 'red': return 'bg-red-50'
    case 'green': return 'bg-green-50'
    case 'orange': return 'bg-orange-50'
    case 'purple': return 'bg-purple-50'
    case 'blue': return 'bg-blue-50'
    case 'pink': return 'bg-pink-50'
    default: return 'bg-gray-50'
  }
}

const getCapabilityTextColor = (color) => {
  switch(color) {
    case 'red': return 'text-red-600'
    case 'green': return 'text-green-600'
    case 'orange': return 'text-orange-600'
    case 'purple': return 'text-purple-600'
    case 'blue': return 'text-blue-600'
    case 'pink': return 'text-pink-600'
    default: return 'text-gray-600'
  }
}

const getCapabilityHeaderColor = (color) => {
  switch(color) {
    case 'red': return 'text-red-800'
    case 'green': return 'text-green-800'
    case 'orange': return 'text-orange-800'
    case 'purple': return 'text-purple-800'
    case 'blue': return 'text-blue-800'
    case 'pink': return 'text-pink-800'
    default: return 'text-gray-800'
  }
}

export function VolunteerFormDialog({ 
  open, 
  onOpenChange, 
  volunteerProfile, 
  setVolunteerProfile, 
  onSave 
}) {
  const updateCapability = (capabilityKey, field, value) => {
    setVolunteerProfile(prev => ({
      ...prev,
      capabilities: {
        ...prev.capabilities,
        [capabilityKey]: {
          ...prev.capabilities[capabilityKey],
          [field]: value
        }
      }
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                {VOLUNTEER_SPECIALIZATIONS.map(spec => (
                  <SelectItem key={spec.value} value={spec.value}>
                    {spec.label}
                  </SelectItem>
                ))}
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
              {Object.entries(VOLUNTEER_CAPABILITIES).map(([key, capability]) => (
                <div 
                  key={key} 
                  className={`flex items-center justify-between p-3 ${getCapabilityBgColor(capability.color)} rounded-lg`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={getCapabilityTextColor(capability.color)}>
                      {getCapabilityIcon(capability.icon)}
                    </div>
                    <div>
                      <p className={`font-medium ${getCapabilityHeaderColor(capability.color)}`}>
                        {capability.label}
                      </p>
                      <p className={`text-sm ${getCapabilityTextColor(capability.color)}`}>
                        {capability.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={volunteerProfile.capabilities[key]?.enabled || false}
                      onCheckedChange={(checked) => updateCapability(key, 'enabled', checked)}
                    />
                    {volunteerProfile.capabilities[key]?.enabled && (
                      <Input
                        type="number"
                        min="1"
                        max={capability.maxLimit}
                        value={volunteerProfile.capabilities[key]?.limit || capability.defaultLimit}
                        onChange={(e) => updateCapability(key, 'limit', parseInt(e.target.value) || capability.defaultLimit)}
                        className="w-16 h-8 text-center"
                        placeholder={capability.defaultLimit.toString()}
                      />
                    )}
                  </div>
                </div>
              ))}
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
              onClick={onSave}
              disabled={!volunteerProfile.specialization || !volunteerProfile.description}
              className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
            >
              <HandHeart className="w-4 h-4 mr-2" />
              Tornar-se Voluntária
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}