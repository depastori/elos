import React from 'react'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Users, MessageCircle, Clock, Shield, Heart, AlertTriangle, Briefcase, BookOpen, Globe } from 'lucide-react'
import { toast } from 'sonner@2.0.3'

const CATEGORY_ICONS = {
  support: Heart,
  emergency: AlertTriangle,
  professional: Briefcase,
  education: BookOpen,
  general: Globe
}

const CATEGORY_COLORS = {
  support: 'bg-pink-100 text-pink-700',
  emergency: 'bg-red-100 text-red-700',
  professional: 'bg-blue-100 text-blue-700',
  education: 'bg-purple-100 text-purple-700',
  general: 'bg-gray-100 text-gray-700'
}

export function GroupCatalog({ groups, onJoinGroup, searchQuery = '' }) {
  // Filtrar grupos baseado na busca
  const filteredGroups = groups.filter(group => {
    if (!searchQuery) return true
    return (
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const handleJoinGroup = (group) => {
    onJoinGroup(group)
    toast.success(`✅ Você entrou no grupo "${group.name}"`, {
      description: 'Agora você pode participar das conversas',
      duration: 3000
    })
  }

  if (filteredGroups.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg text-gray-600 mb-2">
          {searchQuery ? `Nenhum grupo encontrado para "${searchQuery}"` : 'Nenhum grupo disponível'}
        </h3>
        <p className="text-gray-500">
          {searchQuery ? 'Tente buscar por outros termos' : 'Crie o primeiro grupo da sua categoria'}
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredGroups.map((group) => {
        const IconComponent = CATEGORY_ICONS[group.category] || Globe
        const colorClass = CATEGORY_COLORS[group.category] || 'bg-gray-100 text-gray-700'
        
        return (
          <Card key={group.id} className="hover:shadow-lg transition-shadow bg-white">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${colorClass.split(' ')[0]}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">{group.name}</h3>
                    <Badge className={colorClass}>
                      {group.category === 'support' && 'Apoio'}
                      {group.category === 'emergency' && 'Emergência'}  
                      {group.category === 'professional' && 'Profissional'}
                      {group.category === 'education' && 'Educação'}
                      {group.category === 'general' && 'Geral'}
                    </Badge>
                  </div>
                </div>
                
                {group.isPrivate && (
                  <Shield className="w-4 h-4 text-amber-600" />
                )}
              </div>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {group.description}
              </p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{group.memberCount || 0}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>
                      {group.lastActivity 
                        ? `${Math.floor((Date.now() - new Date(group.lastActivity)) / (1000 * 60 * 60 * 24))}d` 
                        : 'Novo'
                      }
                    </span>
                  </div>
                </div>
                
                {group.isVerified && (
                  <Badge className="bg-green-100 text-green-700">
                    Verificado
                  </Badge>
                )}
              </div>
              
              <Button 
                onClick={() => handleJoinGroup(group)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
                size="sm"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                {group.isPrivate ? 'Solicitar Entrada' : 'Entrar no Grupo'}
              </Button>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}