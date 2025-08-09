import React from 'react'
import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Users, Lock, Crown, MessageCircle, Settings, UserPlus, MapPin } from 'lucide-react'
import { getCategoryInfo } from './helpers'

interface GroupCardProps {
  group: any
  isOwn?: boolean
  onJoinGroup?: (groupId: string) => void
  onLeaveGroup?: (groupId: string) => void
  onOpenChat?: (group: any) => void
  onManageGroup?: (groupId: string) => void
}

export function GroupCard({ 
  group, 
  isOwn = false, 
  onJoinGroup, 
  onLeaveGroup, 
  onOpenChat, 
  onManageGroup 
}: GroupCardProps) {
  const categoryInfo = getCategoryInfo(group.category)

  if (isOwn) {
    return (
      <Card className="hover:shadow-md transition-shadow border-purple-100">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{categoryInfo.icon}</span>
                <h4 className="text-purple-800 font-medium">{group.name}</h4>
                {group.isPrivate && (
                  <Badge variant="outline" className="text-xs border-purple-200">
                    <Lock className="w-3 h-3 mr-1" />
                    Privado
                  </Badge>
                )}
                {group.isAdmin && (
                  <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                    <Crown className="w-3 h-3 mr-1" />
                    Admin
                  </Badge>
                )}
              </div>
              
              <p className="text-sm text-gray-600 mb-2">{group.description}</p>
              
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{group.memberCount} membros</span>
                </div>
                <div>
                  {categoryInfo.label}
                </div>
              </div>

              {group.lastMessage && (
                <div className="mt-2 p-2 bg-purple-50 rounded text-sm">
                  <p className="text-gray-700 truncate">{group.lastMessage}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(group.lastMessageTime).toLocaleString('pt-BR')}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={() => onOpenChat?.(group)}
              className="bg-purple-600 hover:bg-purple-700 rounded-xl"
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              Abrir Chat
            </Button>
            
            {group.isAdmin && (
              <Button 
                size="sm" 
                variant="outline" 
                className="rounded-xl"
                onClick={() => onManageGroup?.(group.id)}
              >
                <Settings className="w-4 h-4 mr-1" />
                Gerenciar
              </Button>
            )}
            
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => onLeaveGroup?.(group.id)}
              className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50 rounded-xl"
            >
              Sair
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Available group card (catalog/search)
  return (
    <Card className="hover:shadow-md transition-shadow border-purple-100">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-purple-800 font-medium text-sm">{group.name}</h4>
              {group.isPrivate && (
                <Badge variant="outline" className="text-xs">
                  <Lock className="w-3 h-3 mr-1" />
                  Privado
                </Badge>
              )}
            </div>
            
            <p className="text-xs text-gray-600 mb-2 line-clamp-2">{group.description}</p>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{group.memberCount}</span>
              </div>
              {group.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{group.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <Button 
          onClick={() => onJoinGroup?.(group.id)}
          size="sm"
          className="w-full bg-purple-600 hover:bg-purple-700 rounded-lg text-xs"
        >
          <UserPlus className="w-3 h-3 mr-1" />
          Entrar no Grupo
        </Button>
      </CardContent>
    </Card>
  )
}