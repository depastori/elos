import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Badge } from './ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { 
  Heart, MessageCircle, Share2, MoreHorizontal, TrendingUp, Shield, 
  AlertTriangle, CheckCircle2, Clock, MapPin, Phone, Eye, EyeOff,
  ThumbsUp, ThumbsDown, Bookmark, Flag, Ban, Search, Filter, 
  Calendar, BarChart3, PieChart, Activity, Bell, Star, Award,
  Users, UserCheck, Zap, Target, Plus, ArrowUp, ArrowDown,
  FileText, Image, Video, Mic, Camera, Send, Download, Upload,
  Lock, Unlock, Globe, Mail, MessageSquare, UserPlus, Settings,
  Trash2, Edit, Copy, ExternalLink, RefreshCw, PlayCircle,
  PauseCircle, VolumeX, Volume2, Maximize, Minimize, RotateCcw,
  Save, Share, Print, Link, Hash, AtSign, Smile, Paperclip,
  X, Check, ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  Info, HelpCircle, AlertCircle, XCircle, CheckCircle, MinusCircle
} from 'lucide-react'
import { toast } from 'sonner@2.0.3'
import { projectId, publicAnonKey } from '../utils/supabase/info'

export function FeedScreen({ user }) {
  const [activeTab, setActiveTab] = useState('support')
  const [posts, setPosts] = useState([])
  const [userPosts, setUserPosts] = useState([])
  const [userReports, setUserReports] = useState([])
  const [statistics, setStatistics] = useState({
    totalReports: 156,
    verifiedReports: 89,
    aggressorsIdentified: 73,
    usersProtected: 1248,
    activeVolunteers: 45,
    emergencyResponses: 12
  })
  const [loading, setLoading] = useState(true)
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [newPost, setNewPost] = useState({
    type: 'support',
    content: '',
    isAnonymous: false
  })

  useEffect(() => {
    loadFeedData()
    loadUserPosts()
    loadUserReports()
    
    // Listen for new posts
    const handlePostsUpdate = () => {
      loadUserPosts()
    }
    
    // Listen for new reports
    const handleReportsUpdate = () => {
      loadUserReports()
    }
    
    window.addEventListener('posts-updated', handlePostsUpdate)
    window.addEventListener('reports-updated', handleReportsUpdate)
    
    return () => {
      window.removeEventListener('posts-updated', handlePostsUpdate)
      window.removeEventListener('reports-updated', handleReportsUpdate)
    }
  }, [])

  const loadFeedData = async () => {
    try {
      // Simular posts de suporte da comunidade
      const communityPosts = [
        {
          id: 'post_1',
          type: 'support',
          user: {
            id: 'user_1',
            name: 'Ana Silva',
            profilePhoto: 'https://images.unsplash.com/photo-1494790108755-2616c88c5e15?w=150&h=150&fit=crop&crop=face'
          },
          content: 'Hoje consegui sair de uma situação difícil. Obrigada a todas que me apoiaram! 💜',
          timestamp: '2024-01-15T14:30:00Z',
          likes: 24,
          comments: 8,
          isAnonymous: false,
          isLiked: false,
          isSaved: false
        },
        {
          id: 'post_2',
          type: 'alert',
          user: {
            id: 'user_2',
            name: 'Usuária Anônima',
            profilePhoto: null
          },
          content: 'ALERTA: Homem suspeito abordando mulheres na região da Vila Madalena. Cuidado!',
          location: 'Vila Madalena, São Paulo',
          timestamp: '2024-01-15T13:45:00Z',
          likes: 89,
          comments: 23,
          isAnonymous: true,
          isLiked: true,
          isSaved: true,
          priority: 'high'
        },
        {
          id: 'post_3',
          type: 'victory',
          user: {
            id: 'user_3',
            name: 'Mariana Costa',
            profilePhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face'
          },
          content: 'Consegui uma medida protetiva! Para quem está passando por isso, não desistam. A justiça existe! 🎉',
          timestamp: '2024-01-15T12:15:00Z',
          likes: 156,
          comments: 34,
          isAnonymous: false,
          isLiked: true,
          isSaved: false
        },
        {
          id: 'post_4',
          type: 'educational',
          user: {
            id: 'user_4',
            name: 'Dra. Patricia Oliveira',
            profilePhoto: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face'
          },
          content: 'Dica importante: Lei Maria da Penha protege também violência psicológica. Você não precisa de marcas físicas para denunciar.',
          timestamp: '2024-01-15T11:00:00Z',
          likes: 78,
          comments: 12,
          isAnonymous: false,
          isLiked: false,
          isSaved: true,
          isEducational: true
        }
      ]
      
      setPosts(communityPosts)
    } catch (error) {
      console.error('Erro ao carregar feed:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadUserPosts = async () => {
    try {
      const savedPosts = JSON.parse(localStorage.getItem('user_posts') || '[]')
      setUserPosts(savedPosts)
    } catch (error) {
      console.error('Erro ao carregar posts do usuário:', error)
    }
  }

  const loadUserReports = async () => {
    try {
      const savedReports = JSON.parse(localStorage.getItem('user_reports') || '[]')
      setUserReports(savedReports)
    } catch (error) {
      console.error('Erro ao carregar denúncias do usuário:', error)
    }
  }

  const handleLike = (postId) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ))
    
    setUserPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: (post.likes || 0) + (post.isLiked ? -1 : 1)
          }
        : post
    ))
  }

  const handleSave = (postId) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isSaved: !post.isSaved }
        : post
    ))
    
    setUserPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isSaved: !post.isSaved }
        : post
    ))
    
    const post = [...posts, ...userPosts].find(p => p.id === postId)
    toast.success(post?.isSaved ? 'Post removido dos salvos' : 'Post salvo!')
  }

  const handleComment = (postId) => {
    toast.info('Sistema de comentários em desenvolvimento')
  }

  const handleShare = (postId) => {
    navigator.clipboard.writeText(`https://ellos.app/post/${postId}`)
    toast.success('Link copiado para área de transferência!')
  }

  const createPost = async () => {
    if (!newPost.content.trim()) {
      toast.error('Digite o conteúdo do post')
      return
    }

    const post = {
      id: `user_post_${Date.now()}`,
      type: newPost.type,
      user: {
        id: user.id,
        name: newPost.isAnonymous ? 'Usuária Anônima' : (user.profile?.name || 'Usuária'),
        profilePhoto: newPost.isAnonymous ? null : user.profile?.profilePhoto
      },
      content: newPost.content,
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: 0,
      isAnonymous: newPost.isAnonymous,
      isLiked: false,
      isSaved: false
    }

    // Salvar no localStorage
    const existingPosts = JSON.parse(localStorage.getItem('user_posts') || '[]')
    existingPosts.unshift(post)
    localStorage.setItem('user_posts', JSON.stringify(existingPosts))

    // Atualizar estado
    setUserPosts(existingPosts)
    
    // Resetar formulário
    setNewPost({ type: 'support', content: '', isAnonymous: false })
    setShowCreatePost(false)
    
    toast.success('Post compartilhado com sucesso!')
    
    // Disparar evento para outros componentes
    window.dispatchEvent(new CustomEvent('posts-updated'))
  }

  const formatTimeAgo = (timestamp) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now - time) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Agora'
    if (diffInMinutes < 60) return `${diffInMinutes}m`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`
    return `${Math.floor(diffInMinutes / 1440)}d`
  }

  const getPostTypeIcon = (type, priority = null) => {
    switch(type) {
      case 'support':
        return <Heart className="w-4 h-4 text-pink-600" />
      case 'alert':
        return priority === 'high' 
          ? <AlertTriangle className="w-4 h-4 text-red-600" />
          : <Shield className="w-4 h-4 text-orange-600" />
      case 'victory':
        return <Award className="w-4 h-4 text-green-600" />
      case 'educational':
        return <Star className="w-4 h-4 text-blue-600" />
      default:
        return <MessageCircle className="w-4 h-4 text-gray-600" />
    }
  }

  const getPostTypeColor = (type, priority = null) => {
    switch(type) {
      case 'support':
        return 'from-pink-50 to-purple-50 border-pink-200'
      case 'alert':
        return priority === 'high' 
          ? 'from-red-50 to-orange-50 border-red-200'
          : 'from-orange-50 to-yellow-50 border-orange-200'
      case 'victory':
        return 'from-green-50 to-emerald-50 border-green-200'
      case 'educational':
        return 'from-blue-50 to-indigo-50 border-blue-200'
      default:
        return 'from-gray-50 to-slate-50 border-gray-200'
    }
  }

  const PostCard = ({ post, showActions = true }) => {
    // Check if post.content is an object and extract text content if needed
    const getPostContent = (content) => {
      if (typeof content === 'object' && content !== null) {
        // If content is an object, try to extract meaningful text
        return content.caption || content.text || content.description || JSON.stringify(content)
      }
      return content || ''
    }

    return (
      <Card className={`mb-6 bg-gradient-to-br ${getPostTypeColor(post.type, post.priority)} shadow-lg border-0 hover:shadow-xl transition-shadow`}>
        <CardContent className="pt-6">
          <div className="flex items-start space-x-4">
            <Avatar className="w-12 h-12 shadow-md ring-2 ring-white">
              {post.isAnonymous ? (
                <AvatarFallback className="bg-gradient-to-br from-gray-500 to-gray-600 text-white">
                  <EyeOff className="w-6 h-6" />
                </AvatarFallback>
              ) : (
                <>
                  <AvatarImage src={post.user.profilePhoto} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                    {post.user.name.charAt(0)}
                  </AvatarFallback>
                </>
              )}
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div>
                    <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                      <span>{post.user.name}</span>
                      {post.isEducational && (
                        <Badge className="bg-blue-100 text-blue-700 text-xs">
                          <Star className="w-3 h-3 mr-1" />
                          Educativo
                        </Badge>
                      )}
                    </h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      {getPostTypeIcon(post.type, post.priority)}
                      <span>{formatTimeAgo(post.timestamp)}</span>
                      {post.location && (
                        <>
                          <span>•</span>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>{post.location}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                {showActions && (
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              <p className="text-gray-800 mb-4 leading-relaxed">{getPostContent(post.content)}</p>
              
              {showActions && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <button 
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center space-x-2 transition-colors ${
                        post.isLiked ? 'text-red-600' : 'text-gray-500 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                      <span className="text-sm">{post.likes}</span>
                    </button>
                    
                    <button 
                      onClick={() => handleComment(post.id)}
                      className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm">{post.comments}</span>
                    </button>
                    
                    <button 
                      onClick={() => handleShare(post.id)}
                      className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => handleSave(post.id)}
                    className={`transition-colors ${
                      post.isSaved ? 'text-yellow-600' : 'text-gray-400 hover:text-yellow-500'
                    }`}
                  >
                    <Bookmark className={`w-5 h-5 ${post.isSaved ? 'fill-current' : ''}`} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const StatCard = ({ icon, value, label, trend, color = 'purple' }) => (
    <Card className={`bg-gradient-to-br from-${color}-50 to-${color}-100 border-0 shadow-lg hover:shadow-xl transition-shadow`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl text-gray-900 mb-1">{value}</p>
            <p className={`text-sm text-${color}-700`}>{label}</p>
            {trend && (
              <div className="flex items-center space-x-1 mt-2">
                <TrendingUp className={`w-3 h-3 text-${color}-600`} />
                <span className={`text-xs text-${color}-600`}>{trend}</span>
              </div>
            )}
          </div>
          <div className={`p-3 bg-${color}-200 rounded-xl`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="text-center py-12">
        <Activity className="w-16 h-16 text-purple-600 mx-auto mb-4 animate-pulse" />
        <p className="text-purple-600 text-lg">Carregando feed...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl p-1 mb-8">
          <TabsTrigger value="support" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
            <Heart className="w-4 h-4" />
            <span className="hidden sm:inline">Apoio</span>
          </TabsTrigger>
          
          <TabsTrigger value="dashboard" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </TabsTrigger>
          
          <TabsTrigger value="my-posts" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Meus Posts</span>
            {userPosts.length > 0 && (
              <Badge variant="secondary" className="ml-1 px-1 min-w-[1.2rem] h-5 rounded-full">
                {userPosts.length}
              </Badge>
            )}
          </TabsTrigger>
          
          <TabsTrigger value="my-reports" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
            <Flag className="w-4 h-4" />
            <span className="hidden sm:inline">Minhas Denúncias</span>
            {userReports.length > 0 && (
              <Badge variant="destructive" className="ml-1 px-1 min-w-[1.2rem] h-5 rounded-full">
                {userReports.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="support" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl text-purple-800">
              Feed de Apoio Mútuo
            </h3>
            <Button 
              onClick={() => setShowCreatePost(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Post
            </Button>
          </div>

          {/* User Posts */}
          {userPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}

          {/* Community Posts */}
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}

          {posts.length === 0 && userPosts.length === 0 && (
            <Card className="bg-gradient-to-br from-white to-gray-50/30 shadow-xl border-0">
              <CardContent className="text-center py-12">
                <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg text-gray-600 mb-2">Feed vazio</h4>
                <p className="text-gray-500 mb-4">Seja a primeira a compartilhar apoio na comunidade</p>
                <Button 
                  onClick={() => setShowCreatePost(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar primeiro post
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl text-purple-800">
              Dashboard da Rede
            </h3>
            <Badge className="bg-green-100 text-green-700">
              <Activity className="w-3 h-3 mr-1" />
              Sistema Ativo
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard 
              icon={<Flag className="w-6 h-6 text-red-600" />}
              value={statistics.totalReports}
              label="Denúncias Recebidas"
              trend="+12 esta semana"
              color="red"
            />
            
            <StatCard 
              icon={<CheckCircle2 className="w-6 h-6 text-green-600" />}
              value={statistics.verifiedReports}
              label="Denúncias Verificadas"
              trend="+8 esta semana"
              color="green"
            />
            
            <StatCard 
              icon={<Shield className="w-6 h-6 text-orange-600" />}
              value={statistics.aggressorsIdentified}
              label="Agressores Identificados"
              trend="+3 esta semana"
              color="orange"
            />
            
            <StatCard 
              icon={<Users className="w-6 h-6 text-purple-600" />}
              value={statistics.usersProtected}
              label="Usuárias Protegidas"
              trend="+45 esta semana"
              color="purple"
            />
            
            <StatCard 
              icon={<Heart className="w-6 h-6 text-pink-600" />}
              value={statistics.activeVolunteers}
              label="Voluntárias Ativas"
              trend="24h online"
              color="pink"
            />
            
            <StatCard 
              icon={<Zap className="w-6 h-6 text-blue-600" />}
              value={statistics.emergencyResponses}
              label="Emergências Hoje"
              trend="Tempo médio: 3min"
              color="blue"
            />
          </div>

          <Card className="bg-gradient-to-br from-white to-purple-50/30 shadow-xl border-0">
            <CardHeader>
              <CardTitle className="text-purple-800 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Impacto da Rede Ellos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Taxa de Resposta de Emergência</span>
                  <span className="text-sm font-medium">94%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{width: '94%'}}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Usuárias que se Sentem Mais Seguras</span>
                  <span className="text-sm font-medium">89%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{width: '89%'}}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Agressores Identificados e Evitados</span>
                  <span className="text-sm font-medium">76%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full" style={{width: '76%'}}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="my-posts" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl text-purple-800">
              Meus Posts ({userPosts.length})
            </h3>
            <Button 
              onClick={() => setShowCreatePost(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Post
            </Button>
          </div>

          {userPosts.length === 0 ? (
            <Card className="bg-gradient-to-br from-white to-gray-50/30 shadow-xl border-0">
              <CardContent className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg text-gray-600 mb-2">Nenhum post ainda</h4>
                <p className="text-gray-500 mb-4">Compartilhe sua experiência ou ofereça apoio para outras usuárias</p>
                <Button 
                  onClick={() => setShowCreatePost(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar primeiro post
                </Button>
              </CardContent>
            </Card>
          ) : (
            userPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))
          )}
        </TabsContent>

        <TabsContent value="my-reports" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl text-purple-800">
              Minhas Denúncias ({userReports.length})
            </h3>
            <Badge className="bg-orange-100 text-orange-700">
              <Shield className="w-3 h-3 mr-1" />
              Anônimas e Seguras
            </Badge>
          </div>

          {userReports.length === 0 ? (
            <Card className="bg-gradient-to-br from-white to-gray-50/30 shadow-xl border-0">
              <CardContent className="text-center py-12">
                <Flag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg text-gray-600 mb-2">Nenhuma denúncia ainda</h4>
                <p className="text-gray-500">Suas denúncias aparecerão aqui de forma anônima</p>
              </CardContent>
            </Card>
          ) : (
            userReports.map(report => (
              <Card key={report.id} className="mb-4 bg-gradient-to-r from-white to-orange-50/30 shadow-lg border-0">
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Flag className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">
                          {report.type === 'aggressor_report' ? 'Denúncia de Agressor' : 'Denúncia de Usuária'}
                        </h4>
                        <Badge className={
                          report.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          report.status === 'verified' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-700'
                        }>
                          {report.status === 'pending' ? 'Em Análise' :
                           report.status === 'verified' ? 'Verificada' :
                           'Processada'}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">
                        {report.type === 'aggressor_report' 
                          ? `Agressor: ${report.reportedPerson?.name || 'Nome não informado'}`
                          : `Usuária: ${report.reportedUser?.name || 'Nome não informado'}`
                        }
                      </p>
                      
                      <p className="text-sm text-gray-700 mb-3">{report.description}</p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{formatTimeAgo(report.timestamp)}</span>
                        <span>ID: {report.id.slice(-8)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Dialog para criar novo post */}
      <Dialog open={showCreatePost} onOpenChange={setShowCreatePost}>
        <DialogContent className="max-w-md" aria-describedby="create-post-description">
          <DialogHeader>
            <DialogTitle className="text-purple-800">Criar Novo Post</DialogTitle>
            <DialogDescription id="create-post-description">
              Compartilhe apoio, alertas ou experiências com a comunidade.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Tipo de Post</label>
              <select 
                value={newPost.type} 
                onChange={(e) => setNewPost(prev => ({ ...prev, type: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="support">💜 Apoio Mútuo</option>
                <option value="alert">⚠️ Alerta de Segurança</option>
                <option value="victory">🎉 Vitória/Conquista</option>
                <option value="educational">📚 Educativo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Conteúdo</label>
              <Textarea
                value={newPost.content}
                onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Digite sua mensagem..."
                rows={4}
                className="resize-none"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="anonymous"
                checked={newPost.isAnonymous}
                onChange={(e) => setNewPost(prev => ({ ...prev, isAnonymous: e.target.checked }))}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="anonymous" className="text-sm text-gray-700">
                Publicar anonimamente
              </label>
            </div>

            <div className="flex space-x-2">
              <Button 
                onClick={createPost}
                disabled={!newPost.content.trim()}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Send className="w-4 h-4 mr-2" />
                Publicar
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowCreatePost(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}