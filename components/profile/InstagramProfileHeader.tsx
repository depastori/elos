import React from 'react'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog'
import { 
  User, Heart, MessageCircle, ThumbsUp, Flag, Ban, Shield, 
  ArrowLeft, Plus, Settings, MapPin
} from 'lucide-react'
import { getTrustLevel } from './helpers'

export function InstagramProfileHeader({ 
  userProfile, 
  isOwnProfile = false, 
  onBack = null,
  friends = [],
  validatedUsers = new Set(),
  favoriteUsers = new Set(),
  onAction = () => {},
  onEditClick = () => {},
  onStoryUpload = () => {},
  onSettingsClick = () => {},
  onFollowersClick = () => {},
  onFollowingClick = () => {}
}) {
  const trust = getTrustLevel(userProfile?.validations || { positive: 0, total: 0 })
  const postsCount = userProfile?.posts?.length || 0
  const followersCount = userProfile?.followers || friends.length
  const followingCount = userProfile?.following || friends.length
  const isValidated = validatedUsers.has(userProfile?.id)
  const isFavorite = favoriteUsers.has(userProfile?.id)

  return (
    <div className="bg-white">
      {onBack && (
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={onBack} className="p-2" aria-label="Voltar">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl">{userProfile?.name || 'Usuária'}</h1>
            {userProfile?.validations?.total > 0 && (
              <Badge className={`${trust.color} text-xs`}>
                <Shield className="w-3 h-3 mr-1" />
                Verificada
              </Badge>
            )}
          </div>
          
          {!isOwnProfile && (
            <div className="flex flex-col space-y-2">
              <div className="flex space-x-2">
                <Button 
                  onClick={() => onAction('message', userProfile)}
                  size="sm"
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md flex-1"
                  aria-label={`Enviar mensagem para ${userProfile?.name}`}
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Mensagem
                </Button>
                
                <Button 
                  onClick={() => onAction('toggleFavorite', userProfile)}
                  size="sm"
                  variant="outline"
                  className={`rounded-lg ${isFavorite 
                    ? 'border-pink-500 text-pink-600 bg-pink-50' 
                    : 'border-gray-300 text-gray-600 hover:bg-pink-50'
                  }`}
                  aria-label={isFavorite ? `Remover ${userProfile?.name} dos favoritos` : `Adicionar ${userProfile?.name} aos favoritos`}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                </Button>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  onClick={() => onAction('validate', userProfile)}
                  size="sm"
                  variant="outline"
                  disabled={isValidated}
                  className={`rounded-lg flex-1 ${isValidated 
                    ? 'border-gray-300 text-gray-400 cursor-not-allowed' 
                    : 'border-green-500 text-green-600 hover:bg-green-50'
                  }`}
                  aria-label={isValidated ? `${userProfile?.name} já foi validada` : `Validar confiabilidade de ${userProfile?.name}`}
                >
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  {isValidated ? 'Validada' : 'Validar'}
                </Button>
                
                <Button 
                  onClick={() => onAction('report', userProfile)}
                  size="sm"
                  variant="outline"
                  className="border-red-500 text-red-600 hover:bg-red-50 rounded-lg flex-1"
                  aria-label={`Denunciar ${userProfile?.name}`}
                >
                  <Flag className="w-4 h-4 mr-1" />
                  Denunciar
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      size="sm"
                      variant="outline"
                      className="border-red-600 text-red-700 hover:bg-red-50 rounded-lg"
                      aria-label={`Bloquear ${userProfile?.name}`}
                    >
                      <Ban className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Bloquear Usuária</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja bloquear {userProfile?.name}? Vocês não poderão mais interagir.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => onAction('block', userProfile)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Bloquear
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start space-x-4 mb-4">
          <div className="relative">
            <Avatar className="w-20 h-20 ring-2 ring-gray-200">
              <AvatarImage src={userProfile?.profilePhoto} alt={`Foto de perfil de ${userProfile?.name}`} />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xl">
                {userProfile?.name?.charAt(0) || <User className="w-8 h-8" />}
              </AvatarFallback>
            </Avatar>
            {userProfile?.stories?.length > 0 && (
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-500 p-0.5">
                <div className="w-full h-full bg-white rounded-full"></div>
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex justify-around text-center mb-4">
              <div>
                <div className="text-lg">{postsCount}</div>
                <div className="text-sm text-gray-500">publicações</div>
              </div>
              <button 
                className="cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                onClick={onFollowersClick}
                aria-label={`Ver ${followersCount} seguidoras de ${userProfile?.name}`}
              >
                <div className="text-lg">{followersCount}</div>
                <div className="text-sm text-gray-500">seguidoras</div>
              </button>
              <button 
                className="cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                onClick={onFollowingClick}
                aria-label={`Ver ${followingCount} pessoas que ${userProfile?.name} segue`}
              >
                <div className="text-lg">{followingCount}</div>
                <div className="text-sm text-gray-500">seguindo</div>
              </button>
            </div>

            {isOwnProfile ? (
              <div className="grid grid-cols-3 gap-2">
                {/* Removido o botão "Editar" duplicado - mantém apenas o ícone de configurações */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onStoryUpload}
                  className="rounded-lg"
                  aria-label="Adicionar story"
                >
                  <Plus className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onSettingsClick}
                  className="col-span-2 rounded-lg"
                  aria-label="Configurações"
                >
                  <Settings className="w-4 h-4 mr-1" />
                  Configurações
                </Button>
              </div>
            ) : (
              <div className="flex space-x-2">
                {userProfile?.friendshipStatus === 'none' && (
                  <Button 
                    onClick={() => onAction('follow', userProfile)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                    size="sm"
                    aria-label={`Seguir ${userProfile?.name}`}
                  >
                    Seguir
                  </Button>
                )}
                
                {userProfile?.friendshipStatus === 'pending' && (
                  <Button 
                    variant="outline"
                    disabled
                    className="flex-1 rounded-lg"
                    size="sm"
                    aria-label="Solicitação de amizade enviada"
                  >
                    Solicitação enviada
                  </Button>
                )}
                
                {userProfile?.friendshipStatus === 'accepted' && (
                  <Button 
                    onClick={() => onAction('message', userProfile)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-black rounded-lg"
                    size="sm"
                    aria-label={`Enviar mensagem para ${userProfile?.name}`}
                  >
                    Mensagem
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-gray-900">{userProfile?.name}</span>
            {!isOwnProfile && isFavorite && (
              <Heart className="w-4 h-4 text-pink-500 fill-current" aria-label="Usuária favorita" />
            )}
            {userProfile?.validations?.total > 0 && (
              <Badge className={`${trust.color} text-xs`}>
                {trust.score}% confiável
              </Badge>
            )}
          </div>
          
          {userProfile?.description && (
            <p className="text-gray-700 text-sm">{userProfile.description}</p>
          )}
          
          <div className="flex items-center text-gray-500 text-sm">
            <MapPin className="w-4 h-4 mr-1" />
            {userProfile?.city}, {userProfile?.state}
          </div>

          {userProfile?.validations && userProfile.validations.total > 0 && (
            <div className="mt-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-purple-700">Nível de Confiança</span>
                <span className="text-sm font-medium text-purple-800">{trust.score}%</span>
              </div>
              <Progress value={trust.score} className="h-2" aria-label={`Nível de confiança: ${trust.score}%`} />
              <p className="text-xs text-purple-600 mt-1">
                {userProfile.validations.positive} validações positivas de {userProfile.validations.total} avaliações
              </p>
            </div>
          )}
        </div>

        {userProfile?.stories && userProfile.stories.length > 0 && (
          <div className="mt-4">
            <div className="flex space-x-4 overflow-x-auto pb-2">
              {userProfile.stories.map((story, index) => (
                <div key={story.id || index} className="flex-shrink-0 text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-500 p-0.5">
                    <img 
                      src={story.url} 
                      alt={`Story ${index + 1} de ${userProfile?.name}`}
                      className="w-full h-full rounded-full object-cover bg-white p-0.5"
                      onError={(e) => {
                        e.target.style.backgroundColor = '#f3f4f6'
                        console.log('Story image error:', story.url)
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-600 mt-1 block">Story {index + 1}</span>
                </div>
              ))}
              {isOwnProfile && (
                <div className="flex-shrink-0 text-center">
                  <button
                    onClick={onStoryUpload}
                    className="w-16 h-16 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 hover:bg-gray-200 flex items-center justify-center cursor-pointer"
                    aria-label="Adicionar novo story"
                  >
                    <Plus className="w-6 h-6 text-gray-500" />
                  </button>
                  <span className="text-xs text-gray-600 mt-1 block">Novo</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}