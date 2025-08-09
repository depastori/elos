import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Textarea } from './ui/textarea'
import { Progress } from './ui/progress'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog'
import { 
  User, MapPin, Heart, UserPlus, Ban, Flag, MessageCircle, Shield, 
  ThumbsUp, CheckCircle2, Camera
} from 'lucide-react'
import { toast } from 'sonner@2.0.3'
import { projectId, publicAnonKey } from '../utils/supabase/info'

export function UserProfileDialog({ userId, isOpen, onClose, currentUser }) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showValidateDialog, setShowValidateDialog] = useState(false)
  const [showReportDialog, setShowReportDialog] = useState(false)
  const [reportReason, setReportReason] = useState('')
  const [reportDescription, setReportDescription] = useState('')

  useEffect(() => {
    if (isOpen && userId) {
      loadUserProfile()
    }
  }, [isOpen, userId])

  const loadUserProfile = async () => {
    setLoading(true)
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-47a9aa23/user/profile/${userId}`, {
        headers: {
          'Authorization': `Bearer ${currentUser.access_token || publicAnonKey}`
        }
      })

      if (response.ok) {
        const { profile } = await response.json()
        setProfile(profile)
      } else {
        const { error } = await response.json()
        toast.error(error || 'Erro ao carregar perfil')
        onClose()
      }
    } catch (error) {
      console.log('Erro ao carregar perfil do usuário:', error)
      toast.error('Erro ao carregar perfil')
      onClose()
    } finally {
      setLoading(false)
    }
  }

  const sendFriendRequest = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-47a9aa23/friendship/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.access_token || publicAnonKey}`
        },
        body: JSON.stringify({ targetUserId: userId })
      })

      if (response.ok) {
        toast.success('Pedido de amizade enviado!')
        setProfile(prev => ({ ...prev, friendshipStatus: 'pending' }))
      } else {
        const { error } = await response.json()
        toast.error(error || 'Erro ao enviar pedido')
      }
    } catch (error) {
      console.log('Erro ao enviar pedido de amizade:', error)
      toast.error('Erro ao enviar pedido')
    }
  }

  const validateUser = async (isPositive) => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-47a9aa23/user/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.access_token || publicAnonKey}`
        },
        body: JSON.stringify({ targetUserId: userId, isPositive })
      })

      if (response.ok) {
        toast.success(isPositive ? 'Validação positiva enviada!' : 'Avaliação enviada!')
        setShowValidateDialog(false)
        // Recarregar perfil para atualizar validações
        loadUserProfile()
      } else {
        const { error } = await response.json()
        toast.error(error || 'Erro ao validar usuária')
      }
    } catch (error) {
      console.log('Erro ao validar usuária:', error)
      toast.error('Erro ao validar usuária')
    }
  }

  const blockUser = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-47a9aa23/user/block`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.access_token || publicAnonKey}`
        },
        body: JSON.stringify({ targetUserId: userId })
      })

      if (response.ok) {
        toast.success('Usuária bloqueada')
        onClose()
      } else {
        toast.error('Erro ao bloquear usuária')
      }
    } catch (error) {
      console.log('Erro ao bloquear usuária:', error)
      toast.error('Erro ao bloquear usuária')
    }
  }

  const reportUser = async () => {
    if (!reportReason) {
      toast.error('Selecione um motivo para a denúncia')
      return
    }

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-47a9aa23/user/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.access_token || publicAnonKey}`
        },
        body: JSON.stringify({ 
          targetUserId: userId, 
          reason: reportReason, 
          description: reportDescription 
        })
      })

      if (response.ok) {
        toast.success('Denúncia enviada para análise')
        setShowReportDialog(false)
        setReportReason('')
        setReportDescription('')
      } else {
        toast.error('Erro ao enviar denúncia')
      }
    } catch (error) {
      console.log('Erro ao enviar denúncia:', error)
      toast.error('Erro ao enviar denúncia')
    }
  }

  const getTrustLevel = (validations) => {
    if (!validations || validations.total === 0) return { level: 'Nova', color: 'bg-gray-100 text-gray-600', score: 0 }
    const score = validations.trustScore || 0
    if (score >= 90) return { level: 'Muito Confiável', color: 'bg-emerald-100 text-emerald-700', score }
    if (score >= 75) return { level: 'Confiável', color: 'bg-green-100 text-green-700', score }
    if (score >= 60) return { level: 'Moderadamente Confiável', color: 'bg-blue-100 text-blue-700', score }
    if (score >= 40) return { level: 'Cuidado', color: 'bg-yellow-100 text-yellow-700', score }
    return { level: 'Não Confiável', color: 'bg-red-100 text-red-700', score }
  }

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Carregando perfil</DialogTitle>
            <DialogDescription>
              Aguarde enquanto carregamos as informações do perfil da usuária.
            </DialogDescription>
          </DialogHeader>
          <div className="text-center py-8">
            <Shield className="w-12 h-12 text-purple-600 mx-auto mb-4 animate-pulse" />
            <p className="text-purple-600">Carregando perfil...</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (!profile) {
    return null
  }

  const trust = getTrustLevel(profile.validations)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-purple-800">Perfil da Usuária</DialogTitle>
          <DialogDescription>
            Visualize as informações públicas e interaja com esta usuária da rede Ellos.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Header do perfil */}
          <div className="flex items-start space-x-6">
            <div className="relative">
              <Avatar className="w-20 h-20 shadow-lg ring-4 ring-white">
                <AvatarImage src={profile.profilePhoto} />
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xl">
                  {profile.name?.charAt(0) || <User className="w-8 h-8" />}
                </AvatarFallback>
              </Avatar>
              {profile.validations?.total > 0 && (
                <div className="absolute -bottom-2 -right-2">
                  <Badge className={`text-xs px-2 py-1 ${trust.color} border-0 shadow-lg`}>
                    <Shield className="w-3 h-3 mr-1" />
                    {trust.score}%
                  </Badge>
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <h3 className="text-xl text-purple-800 mb-1">{profile.name || 'Nome não informado'}</h3>
              <div className="flex items-center text-gray-600 mb-3">
                <MapPin className="w-4 h-4 mr-1" />
                <span>
                  {profile.city && profile.state ? 
                    `${profile.city}, ${profile.state}` : 
                    'Localização não informada'
                  }
                </span>
              </div>
              
              {/* Status da amizade */}
              <div className="mb-3">
                {profile.friendshipStatus === 'none' && (
                  <Badge variant="secondary">Sem conexão</Badge>
                )}
                
                {profile.friendshipStatus === 'pending' && (
                  <Badge variant="outline" className="text-orange-600 border-orange-600">
                    Pedido enviado
                  </Badge>
                )}
                
                {profile.friendshipStatus === 'accepted' && (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <Heart className="w-3 h-3 mr-1" />
                    Amigas
                  </Badge>
                )}
              </div>

              {/* Indicador de Confiança */}
              {profile.validations && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Nível de Confiança</span>
                    <Badge className={`${trust.color} border-0 text-xs`}>
                      {trust.level}
                    </Badge>
                  </div>
                  {profile.validations.total > 0 && (
                    <div className="space-y-1">
                      <Progress value={trust.score} className="h-2" />
                      <p className="text-xs text-gray-500">
                        {profile.validations.positive} validações positivas de {profile.validations.total} avaliações
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Descrição (se visível) */}
          {profile.description && (
            <Card>
              <CardContent className="pt-4">
                <h4 className="text-sm text-purple-600 mb-2 flex items-center">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Sobre
                </h4>
                <p className="text-gray-700 text-sm">{profile.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Fotos (se visíveis) */}
          {profile.photos && profile.photos.length > 0 && (
            <Card>
              <CardContent className="pt-4">
                <h4 className="text-sm text-purple-600 mb-3 flex items-center">
                  <Camera className="w-4 h-4 mr-1" />
                  Fotos ({profile.photos.length})
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {profile.photos.slice(0, 6).map((photo, index) => (
                    <img 
                      key={index} 
                      src={photo} 
                      alt={`Foto ${index + 1}`} 
                      className="w-full h-20 object-cover rounded-lg shadow-md" 
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Ações disponíveis */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {/* Botão de amizade */}
              {profile.friendshipStatus === 'none' && (
                <Button 
                  onClick={sendFriendRequest} 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Adicionar como amiga
                </Button>
              )}

              {profile.friendshipStatus === 'accepted' && (
                <Button variant="outline" className="rounded-xl border-purple-200 hover:bg-purple-50">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Enviar mensagem
                </Button>
              )}

              {/* Botão de validação */}
              <Button 
                onClick={() => setShowValidateDialog(true)}
                variant="outline" 
                className="rounded-xl border-green-200 hover:bg-green-50"
                disabled={profile.userValidatedThisProfile}
              >
                <ThumbsUp className="w-4 h-4 mr-2" />
                {profile.userValidatedThisProfile ? 'Já validado' : 'Validar'}
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Botão de denúncia */}
              <Button 
                onClick={() => setShowReportDialog(true)}
                variant="outline" 
                className="text-red-600 hover:text-red-700 rounded-xl border-red-200 hover:bg-red-50"
              >
                <Flag className="w-4 h-4 mr-2" />
                Denunciar
              </Button>
              
              {/* Botão de bloqueio */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="text-red-600 hover:text-red-700 rounded-xl border-red-200 hover:bg-red-50"
                  >
                    <Ban className="w-4 h-4 mr-2" />
                    Bloquear
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Bloquear usuária</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja bloquear {profile.name}? Vocês não poderão mais interagir e a amizade será removida.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={blockUser}
                      className="bg-red-600 hover:bg-red-700 rounded-xl"
                    >
                      Bloquear
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          {/* Aviso de segurança */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">Dica de Segurança</p>
                <p>
                  Mantenha suas informações pessoais seguras. Só compartilhe dados sensíveis 
                  com pessoas que você conhece e confia.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>

      {/* Dialog de validação */}
      <Dialog open={showValidateDialog} onOpenChange={setShowValidateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Validar Confiabilidade</DialogTitle>
            <DialogDescription>
              Você conhece {profile.name} e pode atestar sua confiabilidade na rede?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Sua validação ajuda outras usuárias a identificar perfis confiáveis na rede.
            </p>
            <div className="flex space-x-3">
              <Button 
                onClick={() => validateUser(true)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Sim, é confiável
              </Button>
              <Button 
                onClick={() => validateUser(false)}
                variant="outline"
                className="flex-1 rounded-xl"
              >
                Não recomendo
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de denúncia */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Denunciar usuária</DialogTitle>
            <DialogDescription>
              Relate comportamentos inadequados ou violações das diretrizes da comunidade.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Motivo</label>
              <Select value={reportReason} onValueChange={setReportReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o motivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="harassment">Assédio/Perseguição</SelectItem>
                  <SelectItem value="inappropriate_content">Conteúdo inadequado</SelectItem>
                  <SelectItem value="false_information">Informações falsas</SelectItem>
                  <SelectItem value="hate_speech">Discurso de ódio</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">Descrição (opcional)</label>
              <Textarea
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                placeholder="Descreva o que aconteceu..."
                rows={3}
              />
            </div>
            
            <div className="flex space-x-2 pt-4">
              <Button 
                onClick={reportUser} 
                className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
              >
                Enviar denúncia
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowReportDialog(false)}
                className="rounded-xl"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  )
}