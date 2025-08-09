import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Badge } from './ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { GroupCatalog } from './chat/GroupCatalog'
import { CHAT_CATEGORIES, INITIAL_GROUPS } from './chat/constants'
import { 
  loadGroupsFromStorage, 
  saveGroupToStorage, 
  joinUserToGroup, 
  filterGroupsByCategory, 
  searchGroups,
  generateGroupId,
  getCategoryName,
  formatLastActivity
} from './chat/helpers'
import { 
  MessageCircle, Search, Plus, Users, Filter, 
  Heart, Shield, AlertTriangle, Clock, Send, Smile,
  Phone, Video, MoreHorizontal, ArrowLeft, Paperclip
} from 'lucide-react'
import { toast } from 'sonner@2.0.3'

export function ChatScreen({ user }) {
  const [activeTab, setActiveTab] = useState('groups')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [groups, setGroups] = useState([])
  const [myGroups, setMyGroups] = useState([])
  const [currentChat, setCurrentChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [messageInput, setMessageInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [newGroupForm, setNewGroupForm] = useState({
    name: '',
    description: '',
    category: 'general',
    isPrivate: false
  })

  useEffect(() => {
    loadGroups()
    loadMyGroups()
  }, [])

  const loadGroups = async () => {
    try {
      const savedGroups = loadGroupsFromStorage()
      const allGroups = [...INITIAL_GROUPS, ...savedGroups]
      
      // Remover duplicatas baseado no ID
      const uniqueGroups = allGroups.filter((group, index, self) => 
        index === self.findIndex((g) => g.id === group.id)
      )
      
      console.log('💬 Grupos carregados:', uniqueGroups.length)
      setGroups(uniqueGroups)
    } catch (error) {
      console.error('Erro ao carregar grupos:', error)
      setGroups(INITIAL_GROUPS)
    } finally {
      setLoading(false)
    }
  }

  const loadMyGroups = () => {
    const userGroups = JSON.parse(localStorage.getItem('user_groups') || '[]')
    setMyGroups(userGroups)
  }

  const handleCreateGroup = () => {
    if (!newGroupForm.name.trim() || !newGroupForm.description.trim()) {
      toast.error('Preencha nome e descrição do grupo')
      return
    }

    const newGroup = {
      ...newGroupForm,
      id: generateGroupId(),
      createdBy: user.id,
      createdAt: new Date().toISOString(),
      memberCount: 1,
      members: [user.id],
      lastActivity: new Date().toISOString(),
      isVerified: false
    }

    console.log('🆕 Criando novo grupo:', newGroup)

    // Salvar no localStorage
    if (saveGroupToStorage(newGroup)) {
      // Adicionar aos meus grupos
      const userGroups = JSON.parse(localStorage.getItem('user_groups') || '[]')
      userGroups.push(newGroup)
      localStorage.setItem('user_groups', JSON.stringify(userGroups))

      // Atualizar estados
      setGroups(prev => [...prev, newGroup])
      setMyGroups(prev => [...prev, newGroup])

      toast.success('✅ Grupo criado com sucesso!', {
        description: `"${newGroup.name}" agora está disponível para outras usuárias`,
        duration: 3000
      })

      // Resetar formulário
      setNewGroupForm({
        name: '',
        description: '',
        category: 'general',
        isPrivate: false
      })
      setShowCreateGroup(false)
    }
  }

  const handleJoinGroup = (group) => {
    if (joinUserToGroup(group.id, user.id)) {
      setMyGroups(prev => [...prev, group])
      setGroups(prev => prev.map(g => 
        g.id === group.id 
          ? { ...g, memberCount: (g.memberCount || 0) + 1 }
          : g
      ))
    }
  }

  const openChat = (group) => {
    setCurrentChat(group)
    setMessages([
      {
        id: 'msg_1',
        userId: 'user_demo_1',
        userName: 'Ana Clara',
        userPhoto: 'https://images.unsplash.com/photo-1494790108755-2616c88c5e15?w=150&h=150&fit=crop&crop=face',
        message: `Bem-vindas ao grupo ${group.name}! 💜`,
        timestamp: new Date().toISOString()
      }
    ])
  }

  const sendMessage = () => {
    if (!messageInput.trim() || !currentChat) return

    const newMessage = {
      id: `msg_${Date.now()}`,
      userId: user.id,
      userName: user.profile?.name || 'Você',
      userPhoto: user.profile?.profilePhoto || '',
      message: messageInput.trim(),
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, newMessage])
    setMessageInput('')
    
    toast.success('Mensagem enviada!')
  }

  // Filtrar grupos
  const filteredGroups = searchGroups(
    filterGroupsByCategory(groups, selectedCategory),
    searchQuery
  )

  if (loading) {
    return (
      <div className="text-center py-12">
        <MessageCircle className="w-16 h-16 text-purple-600 mx-auto mb-4 animate-pulse" />
        <p className="text-purple-600 text-lg">Carregando chat...</p>
      </div>
    )
  }

  // Chat individual aberto
  if (currentChat) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header do chat */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={() => setCurrentChat(null)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h3 className="font-medium text-gray-900">{currentChat.name}</h3>
              <p className="text-sm text-gray-500">
                {currentChat.memberCount} membros • {getCategoryName(currentChat.category)}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm">
              <Phone className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm">
              <Video className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mensagens */}
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.userId === user.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex space-x-2 max-w-xs ${message.userId === user.id ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <Avatar className="w-8 h-8">
                  <AvatarImage src={message.userPhoto} />
                  <AvatarFallback className="bg-purple-500 text-white text-xs">
                    {message.userName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className={`rounded-lg p-3 ${
                  message.userId === user.id 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm">{message.message}</p>
                  <p className={`text-xs mt-1 ${
                    message.userId === user.id ? 'text-purple-200' : 'text-gray-500'
                  }`}>
                    {formatLastActivity(message.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input de mensagem */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm">
              <Paperclip className="w-5 h-5" />
            </Button>
            <Input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <Button variant="ghost" size="sm">
              <Smile className="w-5 h-5" />
            </Button>
            <Button 
              onClick={sendMessage}
              disabled={!messageInput.trim()}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl p-1 mb-8">
          <TabsTrigger value="groups" className="flex items-center gap-2 rounded-xl">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Explorar Grupos</span>
          </TabsTrigger>
          
          <TabsTrigger value="myGroups" className="flex items-center gap-2 rounded-xl">
            <MessageCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Meus Grupos</span>
            {myGroups.length > 0 && (
              <Badge variant="secondary" className="ml-1 px-1 min-w-[1.2rem] h-5 rounded-full">
                {myGroups.length}
              </Badge>
            )}
          </TabsTrigger>
          
          <TabsTrigger value="create" className="flex items-center gap-2 rounded-xl">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Criar Grupo</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="groups" className="space-y-6">
          {/* Filtros */}
          <Card className="bg-gradient-to-br from-white to-purple-50/30 shadow-xl border-0">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                {/* Busca */}
                <div className="relative flex-1 md:mr-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar grupos..."
                    className="pl-10 rounded-xl border-purple-200 focus:border-purple-500"
                  />
                </div>

                {/* Filtro de categoria */}
                <div className="flex flex-wrap gap-2">
                  {CHAT_CATEGORIES.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                      className="rounded-xl"
                    >
                      <span className="mr-1">{category.icon}</span>
                      {category.name}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Catálogo de grupos */}
          <GroupCatalog 
            groups={filteredGroups}
            onJoinGroup={handleJoinGroup}
            searchQuery={searchQuery}
          />
        </TabsContent>

        <TabsContent value="myGroups" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl text-purple-800">
              Meus Grupos ({myGroups.length})
            </h3>
          </div>

          {myGroups.length === 0 ? (
            <Card className="bg-gradient-to-br from-white to-gray-50/30 shadow-xl border-0">
              <CardContent className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg text-gray-600 mb-2">Você ainda não está em nenhum grupo</h4>
                <p className="text-gray-500 mb-4">
                  Explore os grupos disponíveis e conecte-se com outras mulheres
                </p>
                <Button 
                  onClick={() => setActiveTab('groups')}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl shadow-lg"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Explorar Grupos
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {myGroups.map((group) => (
                <Card key={group.id} className="hover:shadow-lg transition-shadow bg-white cursor-pointer" onClick={() => openChat(group)}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">{group.name}</h3>
                        <Badge className="bg-purple-100 text-purple-700">
                          {getCategoryName(group.category)}
                        </Badge>
                      </div>
                      {group.isVerified && (
                        <Shield className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {group.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{group.memberCount || 0}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatLastActivity(group.lastActivity)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <Card className="bg-gradient-to-br from-white to-purple-50/30 shadow-xl border-0">
            <CardHeader>
              <CardTitle className="text-purple-800 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Criar Novo Grupo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm text-purple-700 mb-2">Nome do Grupo *</label>
                <Input
                  value={newGroupForm.name}
                  onChange={(e) => setNewGroupForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Apoio Emocional SP"
                  className="rounded-xl border-purple-200 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm text-purple-700 mb-2">Descrição *</label>
                <textarea
                  value={newGroupForm.description}
                  onChange={(e) => setNewGroupForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva o propósito do grupo..."
                  rows={4}
                  className="w-full rounded-xl border border-purple-200 focus:border-purple-500 p-3 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm text-purple-700 mb-2">Categoria</label>
                <select
                  value={newGroupForm.category}
                  onChange={(e) => setNewGroupForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full rounded-xl border border-purple-200 focus:border-purple-500 p-3"
                >
                  <option value="general">Geral</option>
                  <option value="support">Apoio Emocional</option>
                  <option value="emergency">Emergência</option>
                  <option value="professional">Profissional</option>
                  <option value="education">Educação</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPrivate"
                  checked={newGroupForm.isPrivate}
                  onChange={(e) => setNewGroupForm(prev => ({ ...prev, isPrivate: e.target.checked }))}
                  className="rounded border-purple-300"
                />
                <label htmlFor="isPrivate" className="text-sm text-purple-700">
                  Grupo privado (requer aprovação para entrar)
                </label>
              </div>

              <Button 
                onClick={handleCreateGroup}
                disabled={!newGroupForm.name.trim() || !newGroupForm.description.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Grupo
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}