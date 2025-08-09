import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { 
  User, Search, Users, UserPlus, Settings, Edit, 
  Bell, X, Shield, Upload, FileText, AlertTriangle, Flag
} from 'lucide-react'
import { toast } from 'sonner@2.0.3'
import { projectId, publicAnonKey } from '../utils/supabase/info'
import { EditProfileForm } from './profile/EditProfileForm'
import { InstagramProfileHeader } from './profile/InstagramProfileHeader'
import { InstagramContentGrid } from './profile/InstagramContentGrid'
import { UserCard } from './profile/UserCard'
import { PrivateChatDialog } from './profile/PrivateChatDialog'
import { useProfileActions } from './profile/useProfileActions'
import { 
  SIMULATED_FRIEND_REQUESTS, 
  SIMULATED_FRIENDS, 
  SIMULATED_SEARCH_USERS, 
  DEFAULT_PROFILE 
} from './profile/constants'
import { 
  getTrustLevel, 
  saveProfileData, 
  searchUsers as searchUsersHelper 
} from './profile/helpers'

export function ProfileScreen({ user }) {
  const [activeTab, setActiveTab] = useState('myProfile')
  const [currentView, setCurrentView] = useState('main')
  const [selectedUserData, setSelectedUserData] = useState(null)
  
  const [profile, setProfile] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    city: '',
    state: '',
    description: '',
    profilePhoto: ''
  })
  const [friendRequests, setFriendRequests] = useState([])
  const [friends, setFriends] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  
  const [profileTab, setProfileTab] = useState('posts')
  const [showSettings, setShowSettings] = useState(false)
  const [showFollowersDialog, setShowFollowersDialog] = useState(false)
  const [showFollowingDialog, setShowFollowingDialog] = useState(false)
  const [showReportDialog, setShowReportDialog] = useState(false)
  
  const [validatedUsers, setValidatedUsers] = useState(new Set())
  const [favoriteUsers, setFavoriteUsers] = useState(new Set())
  const [blockedUsers, setBlockedUsers] = useState(new Set())
  
  const [reportData, setReportData] = useState({
    reason: '',
    description: '',
    evidence: []
  })

  const { 
    openChat, 
    closeChat, 
    handleFileUpload, 
    privateChatTarget, 
    showPrivateChat, 
    setShowPrivateChat 
  } = useProfileActions()

  useEffect(() => {
    loadProfile()
    loadFriendRequests()
    loadFriends()
    loadBlockedUsers()
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.length >= 2) {
        performSearch(searchQuery)
      } else if (searchQuery.length < 2) {
        setSearchResults([])
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  const loadProfile = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-47a9aa23/user/profile`, {
        headers: {
          'Authorization': `Bearer ${user.access_token || publicAnonKey}`
        }
      })

      if (response.ok) {
        const { profile } = await response.json()
        const defaultProfile = {
          name: user?.profile?.name || user?.user_metadata?.name || '',
          city: user?.profile?.city || '',
          state: user?.profile?.state || '',
          description: user?.profile?.description || '',
          profilePhoto: user?.profile?.profilePhoto || '',
          ...DEFAULT_PROFILE
        }
        
        setProfile({ ...defaultProfile, ...profile })
        setEditForm({
          name: defaultProfile.name,
          city: defaultProfile.city,
          state: defaultProfile.state,
          description: defaultProfile.description,
          profilePhoto: defaultProfile.profilePhoto
        })
      }
    } catch (error) {
      console.log('Erro ao carregar perfil:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadFriendRequests = async () => {
    setFriendRequests(SIMULATED_FRIEND_REQUESTS)
  }

  const loadFriends = async () => {
    setFriends(SIMULATED_FRIENDS)
  }

  const loadBlockedUsers = () => {
    const blocked = JSON.parse(localStorage.getItem('blocked_users') || '[]')
    setBlockedUsers(new Set(blocked))
  }

  const saveBlockedUsers = (blocked) => {
    localStorage.setItem('blocked_users', JSON.stringify([...blocked]))
  }

  const performSearch = async (query) => {
    setSearchLoading(true)
    const results = await searchUsersHelper(query, SIMULATED_SEARCH_USERS)
    // Filtrar usuários bloqueados dos resultados
    const filteredResults = results.filter(user => !blockedUsers.has(user.id))
    setSearchResults(filteredResults)
    setSearchLoading(false)
  }

  const openUserProfile = (userData) => {
    console.log(`🔍 Abrindo perfil do usuário: ${userData.id}`)
    setSelectedUserData(userData)
    setCurrentView('userProfile')
  }

  const saveProfile = async () => {
    const result = await saveProfileData(editForm, user)
    
    setProfile({ ...profile, ...editForm })
    setIsEditing(false)
    toast.success('✅ Perfil salvo com sucesso!', {
      description: 'Suas informações foram atualizadas'
    })
  }

  const processFileUpload = async (file, type) => {
    console.log('🖼️ Processando upload:', { type, fileName: file.name, fileSize: file.size })

    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
    
    if (type === 'image' && !validImageTypes.includes(file.type)) {
      toast.error('Tipo de arquivo não suportado', {
        description: 'Selecione uma imagem (JPG, PNG, GIF, WebP)'
      })
      return null
    }
    
    if (type === 'video' && !validVideoTypes.includes(file.type)) {
      toast.error('Tipo de arquivo não suportado', {
        description: 'Selecione um vídeo (MP4, WebM, MOV)'
      })
      return null
    }

    // Verificar tamanho do arquivo (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      toast.error('Arquivo muito grande', {
        description: 'O arquivo deve ter no máximo 10MB'
      })
      return null
    }

    return new Promise((resolve) => {
      const reader = new FileReader()
      
      reader.onloadstart = () => {
        toast.loading('📁 Carregando arquivo...', { 
          id: `upload-toast-${type}`,
          description: `Processando ${file.name}...`
        })
      }
      
      reader.onloadend = () => {
        toast.dismiss(`upload-toast-${type}`)
        
        const result = reader.result
        if (!result) {
          toast.error('❌ Erro ao processar arquivo')
          resolve(null)
          return
        }

        console.log('✅ Upload concluído com sucesso')
        
        const uploadResult = { 
          file, 
          result, 
          type: file.type.startsWith('video') ? 'video' : 'image',
          name: file.name,
          size: file.size
        }

        resolve(uploadResult)
      }
      
      reader.onerror = () => {
        toast.dismiss(`upload-toast-${type}`)
        toast.error('❌ Erro ao carregar arquivo', {
          description: 'Tente novamente com outro arquivo'
        })
        resolve(null)
      }
      
      reader.readAsDataURL(file)
    })
  }

  const triggerFileUpload = async (type) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = type === 'image' ? 'image/*' : type === 'video' ? 'video/*' : 'image/*,video/*'
    
    input.onchange = async (e) => {
      const file = e.target.files?.[0]
      if (!file) return

      try {
        const result = await processFileUpload(file, type === 'post' ? 'image' : type)
        
        if (result) {
          console.log('Upload result:', result)
          
          if (type === 'profile') {
            // Atualizar foto do perfil
            setEditForm(prev => ({ ...prev, profilePhoto: result.result }))
            setProfile(prev => ({ ...prev, profilePhoto: result.result }))
            
            // Salvar automaticamente a foto do perfil
            const updatedProfile = { ...editForm, profilePhoto: result.result }
            await saveProfileData(updatedProfile, user)
            
            toast.success('✅ Foto de perfil atualizada com sucesso!')
          } else {
            // Handle post/story upload
            const newContent = {
              id: `${type}_${Date.now()}`,
              type: result.type,
              url: result.result,
              likes: 0,
              caption: 'Nova publicação',
              timestamp: Date.now(),
              name: result.name,
              size: result.size
            }
            
            if (type === 'story') {
              setProfile(prev => ({
                ...prev,
                stories: [...(prev.stories || []), newContent]
              }))
              toast.success('📸 Story compartilhado!')
            } else {
              setProfile(prev => ({
                ...prev,
                posts: [...(prev.posts || []), newContent]
              }))
              
              // Save to feed
              const feedPost = {
                id: newContent.id,
                type: 'user_post',
                user: {
                  id: user.id,
                  name: profile?.name || user.profile?.name,
                  profilePhoto: profile?.profilePhoto || user.profile?.profilePhoto
                },
                content: newContent,
                timestamp: new Date().toISOString()
              }
              
              const existingPosts = JSON.parse(localStorage.getItem('user_posts') || '[]')
              existingPosts.unshift(feedPost)
              localStorage.setItem('user_posts', JSON.stringify(existingPosts))
              window.dispatchEvent(new CustomEvent('posts-updated'))
              
              toast.success('📱 Post publicado no feed!')
            }
          }
        }
      } catch (error) {
        console.error('Erro no upload:', error)
        toast.error('❌ Erro ao fazer upload do arquivo')
      }
    }
    
    input.click()
  }

  const handleAction = (action, userData = null) => {
    const targetUser = userData || selectedUserData
    
    switch(action) {
      case 'follow':
        toast.success(`✅ Pedido enviado para ${targetUser.name}!`)
        if (userData) {
          setSearchResults(prev => prev.map(u => 
            u.id === targetUser.id ? { ...u, friendshipStatus: 'pending' } : u
          ))
        }
        break
        
      case 'message':
        openChat(targetUser)
        break
        
      case 'validate':
        if (validatedUsers.has(targetUser.id)) {
          toast.warning('Você já validou esta usuária')
          return
        }
        setValidatedUsers(prev => new Set([...prev, targetUser.id]))
        toast.success('✅ Validação enviada!')
        break
        
      case 'report':
        console.log('🚨 Abrindo formulário de denúncia para:', targetUser.name)
        setShowReportDialog(true)
        break
        
      case 'submitReport':
        const reportSubmission = {
          id: `user_report_${Date.now()}`,
          type: 'user_report',
          reportedUser: {
            id: targetUser.id,
            name: targetUser.name,
            city: targetUser.city,
            state: targetUser.state,
            profilePhoto: targetUser.profilePhoto
          },
          reason: reportData.reason,
          description: reportData.description,
          evidence: reportData.evidence,
          timestamp: new Date().toISOString(),
          status: 'pending',
          reporterId: user.id
        }
        
        const existingReports = JSON.parse(localStorage.getItem('user_reports') || '[]')
        existingReports.push(reportSubmission)
        localStorage.setItem('user_reports', JSON.stringify(existingReports))
        window.dispatchEvent(new CustomEvent('reports-updated'))
        
        toast.success('🚨 Denúncia enviada com sucesso', {
          description: 'Nossa equipe analisará o caso em até 24h',
          duration: 4000
        })
        setShowReportDialog(false)
        setReportData({ reason: '', description: '', evidence: [] })
        break
        
      case 'block':
        console.log('🚫 Bloqueando usuária:', targetUser.name)
        const newBlockedUsers = new Set([...blockedUsers, targetUser.id])
        setBlockedUsers(newBlockedUsers)
        saveBlockedUsers(newBlockedUsers)
        
        // Remover dos amigos se estiver na lista
        setFriends(prev => prev.filter(f => f.id !== targetUser.id))
        setFriendRequests(prev => prev.filter(r => r.fromUserId !== targetUser.id))
        
        // Remover dos resultados de busca
        setSearchResults(prev => prev.filter(u => u.id !== targetUser.id))
        
        // Voltar para lista principal se estava vendo o perfil
        if (currentView === 'userProfile' && selectedUserData?.id === targetUser.id) {
          setCurrentView('main')
          setSelectedUserData(null)
        }
        
        toast.success(`🚫 ${targetUser.name} foi bloqueada`, {
          description: 'Vocês não poderão mais interagir na plataforma',
          duration: 3000
        })
        break
        
      case 'toggleFavorite':
        if (favoriteUsers.has(targetUser.id)) {
          setFavoriteUsers(prev => {
            const newSet = new Set(prev)
            newSet.delete(targetUser.id)
            return newSet
          })
          toast.success(`💔 ${targetUser.name} removida dos favoritos`)
        } else {
          setFavoriteUsers(prev => new Set([...prev, targetUser.id]))
          toast.success(`💜 ${targetUser.name} adicionada aos favoritos`)
        }
        break
        
      case 'accept':
        toast.success(`💜 ${targetUser.name} agora é sua amiga!`)
        setFriends(prev => [...prev, { ...targetUser, friendshipStatus: 'accepted' }])
        setFriendRequests(prev => prev.filter(r => r.fromUserId !== targetUser.id))
        break
        
      case 'reject':
        toast.success('Pedido rejeitado')
        setFriendRequests(prev => prev.filter(r => r.fromUserId !== targetUser.id))
        break
        
      case 'showFollowers':
        setShowFollowersDialog(true)
        break

      case 'showFollowing':
        setShowFollowingDialog(true)
        break
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <Shield className="w-16 h-16 text-purple-600 mx-auto mb-4 animate-pulse" />
        <p className="text-purple-600 text-lg">Carregando perfil...</p>
      </div>
    )
  }

  if (currentView === 'userProfile' && selectedUserData) {
    return (
      <>
        <div className="max-w-md mx-auto bg-white min-h-screen">
          <InstagramProfileHeader 
            userProfile={selectedUserData} 
            isOwnProfile={false} 
            onBack={() => {
              setCurrentView('main')
              setSelectedUserData(null)
            }}
            friends={friends}
            validatedUsers={validatedUsers}
            favoriteUsers={favoriteUsers}
            onAction={handleAction}
          />
          <InstagramContentGrid 
            userProfile={selectedUserData} 
            isOwnProfile={false}
            profileTab={profileTab}
            onTabChange={setProfileTab}
          />
        </div>
        
        {/* Chat Privado */}
        <PrivateChatDialog
          isOpen={showPrivateChat}
          onOpenChange={setShowPrivateChat}
          targetUser={privateChatTarget}
          currentUser={user}
        />
      </>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl p-1 mb-8">
          <TabsTrigger value="myProfile" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Meu Perfil</span>
          </TabsTrigger>
          
          <TabsTrigger value="requests" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Pedidos</span>
            {friendRequests.length > 0 && (
              <Badge variant="destructive" className="ml-1 px-1 min-w-[1.2rem] h-5 rounded-full">
                {friendRequests.length}
              </Badge>
            )}
          </TabsTrigger>
          
          <TabsTrigger value="friends" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Amigas</span>
            {friends.length > 0 && (
              <Badge variant="secondary" className="ml-1 px-1 min-w-[1.2rem] h-5 rounded-full">
                {friends.length}
              </Badge>
            )}
          </TabsTrigger>
          
          <TabsTrigger value="search" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Buscar</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="myProfile">
          <div className="space-y-6">
            {isEditing ? (
              <EditProfileForm 
                editForm={editForm}
                setEditForm={setEditForm}
                saveProfile={saveProfile}
                setIsEditing={setIsEditing}
                profile={profile}
                onPhotoUpload={() => triggerFileUpload('profile')}
              />
            ) : (
              <div className="max-w-md mx-auto bg-white min-h-screen rounded-2xl shadow-xl overflow-hidden">
                <InstagramProfileHeader 
                  userProfile={profile} 
                  isOwnProfile={true}
                  friends={friends}
                  onEditClick={() => setIsEditing(true)}
                  onStoryUpload={() => triggerFileUpload('story')}
                  onSettingsClick={() => setShowSettings(true)}
                  onFollowersClick={() => handleAction('showFollowers')}
                  onFollowingClick={() => handleAction('showFollowing')}
                />
                <InstagramContentGrid 
                  userProfile={profile} 
                  isOwnProfile={true}
                  profileTab={profileTab}
                  onTabChange={setProfileTab}
                  onFileUpload={triggerFileUpload}
                  onStartLiveStream={() => toast.info('🔴 Transmissão ao vivo em desenvolvimento')}
                />
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="requests">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl text-purple-800">
                Pedidos de Amizade ({friendRequests.length})
              </h3>
            </div>

            {friendRequests.length === 0 ? (
              <Card className="bg-gradient-to-br from-white to-gray-50/30 shadow-xl border-0">
                <CardContent className="text-center py-12">
                  <UserPlus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg text-gray-600 mb-2">Nenhum pedido pendente</h4>
                  <p className="text-gray-500">Quando alguém quiser ser sua amiga, aparecerá aqui</p>
                </CardContent>
              </Card>
            ) : (
              friendRequests.map((request) => (
                <UserCard 
                  key={request.id} 
                  userProfile={{
                    id: request.fromUserId,
                    ...request.fromProfile,
                    friendshipStatus: 'request'
                  }} 
                  isRequest={true} 
                  onAction={handleAction}
                  onProfileClick={openUserProfile}
                  favoriteUsers={favoriteUsers}
                />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="friends">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl text-purple-800">
                Minhas Amigas ({friends.length})
              </h3>
            </div>

            {friends.length === 0 ? (
              <Card className="bg-gradient-to-br from-white to-gray-50/30 shadow-xl border-0">
                <CardContent className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg text-gray-600 mb-2">Você ainda não tem amigas</h4>
                  <p className="text-gray-500 mb-4">
                    Use a aba "Buscar" para encontrar e adicionar outras usuárias
                  </p>
                  <Button 
                    onClick={() => setActiveTab('search')}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl shadow-lg"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Buscar usuárias
                  </Button>
                </CardContent>
              </Card>
            ) : (
              friends.map((friend) => (
                <UserCard 
                  key={friend.id} 
                  userProfile={{
                    ...friend,
                    friendshipStatus: 'accepted'
                  }} 
                  onAction={handleAction}
                  onProfileClick={openUserProfile}
                  favoriteUsers={favoriteUsers}
                />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="search">
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-white to-purple-50/30 shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-purple-800 flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Buscar Usuárias
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Digite o nome ou cidade da usuária..."
                    className="pl-12 pr-4 py-3 rounded-xl border-purple-200 focus:border-purple-500 text-lg"
                  />
                </div>
                
                {searchLoading && (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    <p className="text-purple-600 mt-2">Buscando...</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {searchQuery.length >= 2 && (
              <div className="space-y-4">
                <h4 className="text-xl text-purple-800">
                  Resultados para "{searchQuery}" ({searchResults.length})
                </h4>
                
                {searchResults.length === 0 && !searchLoading ? (
                  <Card className="bg-gradient-to-br from-white to-gray-50/30 shadow-xl border-0">
                    <CardContent className="text-center py-12">
                      <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-lg text-gray-600 mb-2">Nenhuma usuária encontrada</h4>
                      <p className="text-gray-500">Tente buscar por outro nome ou cidade</p>
                    </CardContent>
                  </Card>
                ) : (
                  searchResults.map((searchUser) => (
                    <UserCard 
                      key={searchUser.id} 
                      userProfile={searchUser} 
                      onAction={handleAction}
                      onProfileClick={openUserProfile}
                      favoriteUsers={favoriteUsers}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Chat Privado */}
      <PrivateChatDialog
        isOpen={showPrivateChat}
        onOpenChange={setShowPrivateChat}
        targetUser={privateChatTarget}
        currentUser={user}
      />

      {/* Dialogs */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Configurações
            </DialogTitle>
            <DialogDescription>
              Gerencie suas configurações de perfil e privacidade.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => {
                setIsEditing(true)
                setShowSettings(false)
              }}
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar Perfil
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => toast.success('🔒 Configurações de Privacidade em desenvolvimento')}
            >
              <Shield className="w-4 h-4 mr-2" />
              Privacidade e Segurança
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => toast.success('🔔 Configurações de Notificação em desenvolvimento')}
            >
              <Bell className="w-4 h-4 mr-2" />
              Notificações
            </Button>

            <div className="border-t pt-4">
              <Button 
                variant="outline" 
                className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => {
                  setShowSettings(false)
                  toast.success('👋 Até logo!')
                }}
              >
                <X className="w-4 h-4 mr-2" />
                Sair da Conta
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Report Dialog - Corrigido */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Flag className="w-5 h-5" />
              Denunciar Usuária
            </DialogTitle>
            <DialogDescription>
              Denuncie comportamentos inadequados. Todas as denúncias são analisadas pela nossa equipe de segurança.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Motivo da denúncia *</label>
              <Select 
                value={reportData.reason} 
                onValueChange={(value) => setReportData(prev => ({ ...prev, reason: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o motivo..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="harassment">Assédio ou intimidação</SelectItem>
                  <SelectItem value="violence">Ameaças de violência</SelectItem>
                  <SelectItem value="fake">Perfil falso</SelectItem>
                  <SelectItem value="spam">Spam ou conteúdo não solicitado</SelectItem>
                  <SelectItem value="inappropriate">Conteúdo inadequado</SelectItem>
                  <SelectItem value="scam">Golpe ou fraude</SelectItem>
                  <SelectItem value="other">Outro motivo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Descrição detalhada *</label>
              <Textarea
                value={reportData.description}
                onChange={(e) => setReportData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descreva o que aconteceu com o máximo de detalhes possível..."
                rows={4}
                className="resize-none"
              />
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-sm text-amber-800 font-medium">Importante:</p>
                  <p className="text-xs text-amber-700 mt-1">
                    Denúncias falsas são levadas a sério e podem resultar em suspensão da conta.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button 
                onClick={() => handleAction('submitReport')}
                disabled={!reportData.reason || !reportData.description.trim()}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                <Flag className="w-4 h-4 mr-2" />
                Enviar Denúncia
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowReportDialog(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Followers/Following Dialogs */}
      <Dialog open={showFollowersDialog} onOpenChange={setShowFollowersDialog}>
        <DialogContent className="max-w-md max-h-[70vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Seguidoras ({friends.length})</DialogTitle>
            <DialogDescription>
              Pessoas que seguem você na rede Ellos.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {friends.length > 0 ? friends.map((friend) => (
              <div key={friend.id} className="flex items-center justify-between">
                <div 
                  className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg flex-1"
                  onClick={() => {
                    setShowFollowersDialog(false)
                    openUserProfile(friend)
                  }}
                >
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={friend.profilePhoto} alt={`Foto de perfil de ${friend.name}`} />
                    <AvatarFallback className="bg-purple-500 text-white">
                      {friend.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{friend.name}</p>
                    <p className="text-sm text-gray-500">{friend.city}, {friend.state}</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => openChat(friend)}
                  className="ml-2"
                >
                  Mensagem
                </Button>
              </div>
            )) : (
              <p className="text-gray-500 text-center py-4">Você ainda não tem seguidoras</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showFollowingDialog} onOpenChange={setShowFollowingDialog}>
        <DialogContent className="max-w-md max-h-[70vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Seguindo ({friends.length})</DialogTitle>
            <DialogDescription>
              Pessoas que você segue na rede Ellos.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {friends.length > 0 ? friends.map((friend) => (
              <div key={friend.id} className="flex items-center justify-between">
                <div 
                  className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg flex-1"
                  onClick={() => {
                    setShowFollowingDialog(false)
                    openUserProfile(friend)
                  }}
                >
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={friend.profilePhoto} alt={`Foto de perfil de ${friend.name}`} />
                    <AvatarFallback className="bg-purple-500 text-white">
                      {friend.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{friend.name}</p>
                    <p className="text-sm text-gray-500">{friend.city}, {friend.state}</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => openChat(friend)}
                  className="ml-2"
                >
                  Mensagem
                </Button>
              </div>
            )) : (
              <p className="text-gray-500 text-center py-4">Você ainda não segue ninguém</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}