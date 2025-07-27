import React, { useState } from 'react';
import { ExternalLink, Heart, Share2, MessageCircle, Bookmark, Filter, Search, Instagram, Facebook, Twitter, Play } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
}

interface SocialMediaFeedProps {
  user: User;
}

type Platform = 'instagram' | 'facebook' | 'tiktok' | 'twitter' | 'youtube';
type ContentType = 'post' | 'video' | 'story' | 'reel';
type Category = 'support' | 'education' | 'awareness' | 'legal' | 'inspiration' | 'prevention';

type SocialPost = {
  id: string;
  platform: Platform;
  contentType: ContentType;
  category: Category;
  title: string;
  description: string;
  author: string;
  authorHandle: string;
  thumbnail: string;
  url: string;
  likes: number;
  shares: number;
  comments: number;
  timestamp: string;
  isVerified: boolean;
  tags: string[];
};

const SocialMediaFeed: React.FC<SocialMediaFeedProps> = ({ user }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedPosts, setSavedPosts] = useState<string[]>([]);

  const platforms = [
    { id: 'all', label: 'Todas', icon: Share2, color: 'bg-gray-500' },
    { id: 'instagram', label: 'Instagram', icon: Instagram, color: 'bg-pink-500' },
    { id: 'facebook', label: 'Facebook', icon: Facebook, color: 'bg-blue-600' },
    { id: 'tiktok', label: 'TikTok', icon: Play, color: 'bg-black' },
    { id: 'twitter', label: 'Twitter', icon: Twitter, color: 'bg-blue-400' },
    { id: 'youtube', label: 'YouTube', icon: Play, color: 'bg-red-500' },
  ];

  const categories = [
    { id: 'all', label: 'Todas', color: 'bg-gray-500' },
    { id: 'support', label: 'Apoio', color: 'bg-pink-500' },
    { id: 'education', label: 'Educação', color: 'bg-blue-500' },
    { id: 'awareness', label: 'Conscientização', color: 'bg-purple-500' },
    { id: 'legal', label: 'Direitos', color: 'bg-green-500' },
    { id: 'inspiration', label: 'Inspiração', color: 'bg-yellow-500' },
    { id: 'prevention', label: 'Prevenção', color: 'bg-orange-500' },
  ];

  const socialPosts: SocialPost[] = [
    {
      id: '1',
      platform: 'instagram',
      contentType: 'post',
      category: 'support',
      title: 'Você não está sozinha 💜',
      description: 'Lembre-se: sair de um relacionamento abusivo não é falha sua. É coragem. É força. É amor próprio.',
      author: 'Instituto Maria da Penha',
      authorHandle: '@institutomariadapenha',
      thumbnail: '💜',
      url: 'https://instagram.com/p/example1',
      likes: 15420,
      shares: 2341,
      comments: 892,
      timestamp: '2h atrás',
      isVerified: true,
      tags: ['violenciadomestica', 'apoio', 'mariadapenha']
    },
    {
      id: '2',
      platform: 'tiktok',
      contentType: 'video',
      category: 'education',
      title: 'Red Flags em Relacionamentos',
      description: 'Psicóloga explica os principais sinais de alerta que toda mulher deve conhecer',
      author: 'Dra. Ana Psicóloga',
      authorHandle: '@dra.anapsico',
      thumbnail: '🚩',
      url: 'https://tiktok.com/@example',
      likes: 89234,
      shares: 12456,
      comments: 3421,
      timestamp: '5h atrás',
      isVerified: true,
      tags: ['redflags', 'psicologia', 'relacionamentos']
    },
    {
      id: '3',
      platform: 'facebook',
      contentType: 'post',
      category: 'legal',
      title: 'Seus Direitos na Lei Maria da Penha',
      description: 'Conheça todos os seus direitos previstos na lei. Informação é proteção!',
      author: 'OAB Mulher',
      authorHandle: '@oabmulher',
      thumbnail: '⚖️',
      url: 'https://facebook.com/example',
      likes: 5678,
      shares: 1234,
      comments: 456,
      timestamp: '1 dia atrás',
      isVerified: true,
      tags: ['direitos', 'mariadapenha', 'juridico']
    },
    {
      id: '4',
      platform: 'instagram',
      contentType: 'reel',
      category: 'inspiration',
      title: 'História de Superação',
      description: 'Mulher conta como reconstruiu sua vida após sair de relacionamento abusivo',
      author: 'Mulheres Guerreiras',
      authorHandle: '@mulheresguerreiras',
      thumbnail: '🌟',
      url: 'https://instagram.com/reel/example',
      likes: 23456,
      shares: 4567,
      comments: 1234,
      timestamp: '3h atrás',
      isVerified: false,
      tags: ['superacao', 'inspiracao', 'forca']
    },
    {
      id: '5',
      platform: 'youtube',
      contentType: 'video',
      category: 'prevention',
      title: 'Como Identificar Gaslighting',
      description: 'Vídeo educativo sobre manipulação psicológica e como se proteger',
      author: 'Canal Empoderamento',
      authorHandle: '@canalempoderamento',
      thumbnail: '🧠',
      url: 'https://youtube.com/watch?v=example',
      likes: 12890,
      shares: 2345,
      comments: 789,
      timestamp: '1 dia atrás',
      isVerified: true,
      tags: ['gaslighting', 'manipulacao', 'prevencao']
    },
    {
      id: '6',
      platform: 'twitter',
      contentType: 'post',
      category: 'awareness',
      title: 'Dados sobre Violência contra Mulher',
      description: 'Thread com estatísticas importantes sobre violência doméstica no Brasil',
      author: 'Observatório da Mulher',
      authorHandle: '@observatoriomulher',
      thumbnail: '📊',
      url: 'https://twitter.com/example/status/123',
      likes: 8901,
      shares: 3456,
      comments: 567,
      timestamp: '6h atrás',
      isVerified: true,
      tags: ['estatisticas', 'conscientizacao', 'dados']
    }
  ];

  const handleSavePost = (postId: string) => {
    setSavedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const getPlatformIcon = (platform: Platform) => {
    const platformData = platforms.find(p => p.id === platform);
    return platformData?.icon || Share2;
  };

  const getPlatformColor = (platform: Platform) => {
    const platformData = platforms.find(p => p.id === platform);
    return platformData?.color || 'bg-gray-500';
  };

  const getCategoryColor = (category: Category) => {
    const categoryData = categories.find(c => c.id === category);
    return categoryData?.color || 'bg-gray-500';
  };

  const filteredPosts = socialPosts.filter(post => {
    const matchesPlatform = selectedPlatform === 'all' || post.platform === selectedPlatform;
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesPlatform && matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Share2 className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Conteúdo das Redes Sociais</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Acompanhe posts, vídeos e conteúdos relevantes sobre direitos da mulher, prevenção à violência e empoderamento feminino.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar conteúdo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Platform Filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Plataformas</h3>
            <div className="flex flex-wrap gap-2">
              {platforms.map(platform => {
                const Icon = platform.icon;
                return (
                  <button
                    key={platform.id}
                    onClick={() => setSelectedPlatform(platform.id as any)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedPlatform === platform.id
                        ? `${platform.color} text-white shadow-sm`
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{platform.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Categorias</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id as any)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? `${category.color} text-white shadow-sm`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map(post => {
          const PlatformIcon = getPlatformIcon(post.platform);
          const isSaved = savedPosts.includes(post.id);
          
          return (
            <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200">
              {/* Post Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 ${getPlatformColor(post.platform)} rounded-lg flex items-center justify-center`}>
                      <PlatformIcon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-1">
                        <span className="font-medium text-gray-900 text-sm">{post.author}</span>
                        {post.isVerified && (
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">{post.authorHandle}</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{post.timestamp}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)} text-white`}>
                    {categories.find(c => c.id === post.category)?.label}
                  </span>
                  {post.contentType === 'video' && (
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                      Vídeo
                    </span>
                  )}
                </div>
              </div>

              {/* Post Content */}
              <div className="p-4">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">{post.thumbnail}</div>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2">{post.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{post.description}</p>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {post.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Post Actions */}
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Heart className="h-4 w-4 mr-1" />
                      {post.likes.toLocaleString()}
                    </span>
                    <span className="flex items-center">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {post.comments.toLocaleString()}
                    </span>
                    <span className="flex items-center">
                      <Share2 className="h-4 w-4 mr-1" />
                      {post.shares.toLocaleString()}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => handleSavePost(post.id)}
                    className={`p-1 rounded transition-colors ${
                      isSaved ? 'text-purple-600' : 'text-gray-400 hover:text-purple-600'
                    }`}
                  >
                    <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                  </button>
                </div>
                
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-purple-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-600 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Ver no {platforms.find(p => p.id === post.platform)?.label}</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <Share2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum conteúdo encontrado</h3>
          <p className="text-gray-600">
            Tente ajustar os filtros de busca para encontrar mais conteúdo.
          </p>
        </div>
      )}

      {/* Saved Posts Summary */}
      {savedPosts.length > 0 && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Bookmark className="h-5 w-5 text-purple-600" />
            <span className="font-medium text-purple-800">
              {savedPosts.length} post(s) salvos
            </span>
          </div>
          <p className="text-sm text-purple-700 mt-1">
            Acesse seus posts salvos a qualquer momento na sua biblioteca pessoal.
          </p>
        </div>
      )}

      {/* Content Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Filter className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-blue-800">Sobre o Conteúdo</h4>
            <p className="text-sm text-blue-700 mt-1">
              Todo conteúdo é curado por nossa equipe para garantir informações precisas e úteis. 
              Priorizamos fontes confiáveis e especialistas na área.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaFeed;