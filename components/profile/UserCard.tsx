import React from 'react'
import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { User, CheckCircle2, Heart, UserPlus, MessageCircle, Shield } from 'lucide-react'
import { getTrustLevel } from './helpers'

export function UserCard({ 
  userProfile, 
  isRequest = false, 
  onAction = () => {},
  onProfileClick = () => {},
  favoriteUsers = new Set()
}) {
  const trust = getTrustLevel(userProfile?.validations || { positive: 0, total: 0 })
  const isFavorite = favoriteUsers.has(userProfile?.id)
  
  return (
    <Card className="mb-4 bg-gradient-to-r from-white to-purple-50/30 shadow-lg border-0 hover:shadow-xl transition-shadow">
      <CardContent className="pt-4">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center space-x-4 cursor-pointer hover:bg-purple-50 p-2 rounded-xl transition-colors flex-1"
            onClick={() => onProfileClick(userProfile)}
          >
            <Avatar className="w-12 h-12 shadow-md ring-2 ring-white">
              <AvatarImage src={userProfile?.profilePhoto} />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                {userProfile?.name?.charAt(0) || <User className="w-5 h-5" />}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="text-purple-800 flex items-center gap-2">
                {userProfile?.name}
                {userProfile.friendshipStatus === 'accepted' && (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                )}
                {isFavorite && (
                  <Heart className="w-4 h-4 text-pink-500 fill-current" />
                )}
              </h4>
              <p className="text-sm text-gray-600">
                {userProfile?.city && userProfile?.state && 
                  `${userProfile.city}, ${userProfile.state}`
                }
              </p>
              <p className="text-xs text-gray-500">
                {userProfile.followers} seguidoras • {userProfile.posts?.length || 0} posts
              </p>
              {userProfile?.validations?.total > 0 && (
                <Badge className={`${trust.color} text-xs mt-1`}>
                  <Shield className="w-3 h-3 mr-1" />
                  {trust.level}
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {isRequest ? (
              <>
                <Button 
                  size="sm" 
                  onClick={() => onAction('accept', userProfile)}
                  className="bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-md"
                >
                  ✓ Aceitar
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onAction('reject', userProfile)}
                  className="rounded-xl border-gray-200 hover:bg-gray-50"
                >
                  ✗ Recusar
                </Button>
              </>
            ) : (
              <>
                {userProfile.friendshipStatus === 'none' && (
                  <Button 
                    size="sm" 
                    onClick={() => onAction('follow', userProfile)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl"
                  >
                    <UserPlus className="w-4 h-4 mr-1" />
                    Seguir
                  </Button>
                )}
                
                {userProfile.friendshipStatus === 'pending' && (
                  <Badge variant="secondary" className="px-3 py-1 rounded-xl">
                    Pendente
                  </Badge>
                )}

                <Button 
                  size="sm" 
                  onClick={() => onAction('message', userProfile)}
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                </Button>

                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onProfileClick(userProfile)}
                  className="rounded-xl border-purple-200 hover:bg-purple-50"
                >
                  Ver perfil
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}