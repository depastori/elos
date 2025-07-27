import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Flag, Send, Image, Lock } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
}

interface SupportFeedProps {
  user: User;
}

type Post = {
  id: number;
  author: string;
  time: string;
  content: string;
  isAnonymous: boolean;
  supportCount: number;
  commentCount: number;
  category: 'support' | 'advice' | 'success' | 'warning';
  hasSupported: boolean;
};

const SupportFeed: React.FC<SupportFeedProps> = ({ user }) => {
  const [newPost, setNewPost] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Post['category']>('support');
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      author: 'Maria L.',
      time: '1h atrás',
      content: 'Consegui sair de um relacionamento abusivo há 6 meses. Para quem está passando por isso, saibam que vocês não estão sozinhas. Busquem ajuda, conversem com pessoas de confiança. A vida pode ser muito melhor! 💜',
      isAnonymous: false,
      supportCount: 89,
      commentCount: 23,
      category: 'success',
      hasSupported: false,
    },
    {
      id: 2,
      author: 'Usuária Anônima',
      time: '3h atrás',
      content: 'Estou com medo de denunciar. Ele disse que se eu falar alguma coisa, vai piorar para mim. Alguém já passou por isso? Como vocês conseguiram força?',
      isAnonymous: true,
      supportCount: 156,
      commentCount: 45,
      category: 'support',
      hasSupported: true,
    },
    {
      id: 3,
      author: 'Dra. Ana Santos',
      time: '5h atrás',
      content: 'ATENÇÃO: Cuidado com perfis falsos que se passam por profissionais. Sempre verifiquem credenciais antes de compartilhar informações pessoais. Em caso de dúvida, entrem em contato com a moderação.',
      isAnonymous: false,
      supportCount: 67,
      commentCount: 12,
      category: 'warning',
      hasSupported: false,
    },
    {
      id: 4,
      author: 'Carla M.',
      time: '8h atrás',
      content: 'Indicação de advogada especializada em violência doméstica: Dra. Fernanda Oliveira (OAB/SP 123456). Atendimento humanizado e experiência na área. Podem procurar sem receio.',
      isAnonymous: false,
      supportCount: 234,
      commentCount: 78,
      category: 'advice',
      hasSupported: false,
    },
  ]);

  const categories = [
    { id: 'support', label: 'Buscar Apoio', color: 'bg-pink-500' },
    { id: 'advice', label: 'Dar Conselho', color: 'bg-blue-500' },
    { id: 'success', label: 'História de Superação', color: 'bg-green-500' },
    { id: 'warning', label: 'Alerta', color: 'bg-orange-500' },
  ];

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    const post: Post = {
      id: Date.now(),
      author: isAnonymous ? 'Usuária Anônima' : user.name.split(' ')[0] + ' ' + user.name.split(' ')[1]?.charAt(0) + '.',
      time: 'agora',
      content: newPost,
      isAnonymous,
      supportCount: 0,
      commentCount: 0,
      category: selectedCategory,
      hasSupported: false,
    };

    setPosts([post, ...posts]);
    setNewPost('');
  };

  const handleSupport = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            supportCount: post.hasSupported ? post.supportCount - 1 : post.supportCount + 1,
            hasSupported: !post.hasSupported 
          }
        : post
    ));
  };

  const getCategoryStyles = (category: Post['category']) => {
    const styles = {
      support: 'border-l-pink-400 bg-pink-50',
      advice: 'border-l-blue-400 bg-blue-50',
      success: 'border-l-green-400 bg-green-50',
      warning: 'border-l-orange-400 bg-orange-50',
    };
    return styles[category];
  };

  const getCategoryLabel = (category: Post['category']) => {
    const labels = {
      support: 'Apoio',
      advice: 'Conselho',
      success: 'Sucesso',
      warning: 'Alerta',
    };
    return labels[category];
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* New Post Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Compartilhar na Rede de Apoio</h2>
        
        <form onSubmit={handleSubmitPost} className="space-y-4">
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedCategory(category.id as Post['category'])}
                  className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
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

          {/* Text Area */}
          <div>
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Compartilhe sua experiência, busque apoio ou ofereça ajuda..."
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={4}
            />
          </div>

          {/* Options */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <Lock className="h-4 w-4" />
                <span>Postar anonimamente</span>
              </label>
            </div>
            
            <button
              type="submit"
              disabled={!newPost.trim()}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span>Publicar</span>
            </button>
          </div>
        </form>
      </div>

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className={`bg-white border-l-4 ${getCategoryStyles(post.category)} rounded-r-2xl shadow-sm p-6`}
          >
            {/* Post Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                  {post.isAnonymous ? (
                    <Lock className="h-5 w-5 text-white" />
                  ) : (
                    <span className="text-sm font-medium text-white">
                      {post.author.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">{post.author}</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryStyles(post.category).split(' ')[1]} text-gray-700`}>
                      {getCategoryLabel(post.category)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">{post.time}</span>
                </div>
              </div>
              
              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                <Flag className="h-4 w-4" />
              </button>
            </div>

            {/* Post Content */}
            <p className="text-gray-700 mb-4 leading-relaxed">{post.content}</p>

            {/* Post Actions */}
            <div className="flex items-center space-x-6 pt-4 border-t border-gray-100">
              <button
                onClick={() => handleSupport(post.id)}
                className={`flex items-center space-x-2 transition-colors ${
                  post.hasSupported 
                    ? 'text-pink-600' 
                    : 'text-gray-500 hover:text-pink-600'
                }`}
              >
                <Heart className={`h-5 w-5 ${post.hasSupported ? 'fill-current' : ''}`} />
                <span className="text-sm font-medium">{post.supportCount}</span>
              </button>
              
              <button className="flex items-center space-x-2 text-gray-500 hover:text-purple-600 transition-colors">
                <MessageCircle className="h-5 w-5" />
                <span className="text-sm font-medium">{post.commentCount}</span>
              </button>
              
              <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition-colors">
                <Share2 className="h-5 w-5" />
                <span className="text-sm font-medium">Compartilhar</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <button className="bg-white text-purple-600 border border-purple-200 px-6 py-3 rounded-lg font-medium hover:bg-purple-50 transition-all duration-200">
          Carregar mais posts
        </button>
      </div>
    </div>
  );
};

export default SupportFeed;