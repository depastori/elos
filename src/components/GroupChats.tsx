import React, { useState } from 'react';
import { Plus, Users, Search, Send, Settings, UserPlus, Crown, Shield, Heart, MessageCircle } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
}

interface GroupChatsProps {
  user: User;
}

type GroupCategory = 'support' | 'recovery' | 'friendship' | 'professional' | 'therapy' | 'legal';

type Group = {
  id: string;
  name: string;
  description: string;
  category: GroupCategory;
  memberCount: number;
  isPrivate: boolean;
  lastActivity: string;
  unreadCount: number;
  isJoined: boolean;
  moderators: string[];
  avatar: string;
};

type GroupMessage = {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  isSupport?: boolean;
};

const GroupChats: React.FC<GroupChatsProps> = ({ user }) => {
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<GroupCategory | 'all'>('all');
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  const categories = [
    { id: 'all', label: 'Todos', icon: Users, color: 'bg-gray-500' },
    { id: 'support', label: 'Apoio Emocional', icon: Heart, color: 'bg-pink-500' },
    { id: 'recovery', label: 'Recuperação', icon: Shield, color: 'bg-green-500' },
    { id: 'therapy', label: 'Terapia em Grupo', icon: Users, color: 'bg-purple-500' },
    { id: 'friendship', label: 'Amizades', icon: Heart, color: 'bg-blue-500' },
    { id: 'professional', label: 'Profissional', icon: Users, color: 'bg-indigo-500' },
    { id: 'legal', label: 'Orientação Legal', icon: Shield, color: 'bg-orange-500' },
  ];

  const groups: Group[] = [
    {
      id: '1',
      name: 'Superando Dependência Emocional',
      description: 'Grupo de apoio para mulheres que estão se libertando de relacionamentos tóxicos',
      category: 'therapy',
      memberCount: 127,
      isPrivate: true,
      lastActivity: '5 min atrás',
      unreadCount: 3,
      isJoined: true,
      moderators: ['mod1', 'mod2'],
      avatar: 'S',
    },
    {
      id: '2',
      name: 'Reintegração Social e Trabalho',
      description: 'Apoio para mulheres que precisam se reintegrar na sociedade e mercado de trabalho',
      category: 'professional',
      memberCount: 89,
      isPrivate: false,
      lastActivity: '15 min atrás',
      unreadCount: 0,
      isJoined: true,
      moderators: ['mod3'],
      avatar: 'R',
    },
    {
      id: '3',
      name: 'Mães Guerreiras',
      description: 'Rede de apoio para mães que enfrentam violência doméstica',
      category: 'support',
      memberCount: 234,
      isPrivate: true,
      lastActivity: '1h atrás',
      unreadCount: 7,
      isJoined: true,
      moderators: ['mod4', 'mod5'],
      avatar: 'M',
    },
    {
      id: '4',
      name: 'Novas Amizades SP',
      description: 'Grupo para formar amizades saudáveis em São Paulo',
      category: 'friendship',
      memberCount: 156,
      isPrivate: false,
      lastActivity: '2h atrás',
      unreadCount: 0,
      isJoined: false,
      moderators: ['mod6'],
      avatar: 'N',
    },
    {
      id: '5',
      name: 'Orientação Jurídica',
      description: 'Advogadas voluntárias oferecem orientação legal gratuita',
      category: 'legal',
      memberCount: 67,
      isPrivate: true,
      lastActivity: '30 min atrás',
      unreadCount: 1,
      isJoined: true,
      moderators: ['mod7'],
      avatar: 'O',
    },
  ];

  const groupMessages: GroupMessage[] = [
    {
      id: '1',
      senderId: 'user1',
      senderName: 'Ana M.',
      content: 'Meninas, hoje consegui dar o primeiro passo e procurei um psicólogo. Obrigada pelo apoio de vocês! 💜',
      timestamp: '14:30',
      isSupport: true,
    },
    {
      id: '2',
      senderId: 'user2',
      senderName: 'Carla S.',
      content: 'Que orgulho de você, Ana! Você é muito corajosa. Estamos todas torcendo por você! 🌟',
      timestamp: '14:32',
      isSupport: true,
    },
    {
      id: '3',
      senderId: user.id,
      senderName: user.name,
      content: 'Ana, isso é maravilhoso! Lembre-se que você merece todo o cuidado e amor do mundo.',
      timestamp: '14:35',
    },
  ];

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedGroup) return;
    
    console.log('Sending group message:', newMessage);
    setNewMessage('');
  };

  const handleJoinGroup = (groupId: string) => {
    console.log('Joining group:', groupId);
  };

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || group.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: GroupCategory) => {
    const categoryData = categories.find(c => c.id === category);
    return categoryData?.color || 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Grupos de Apoio</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Participe de grupos temáticos para receber apoio, fazer amizades e compartilhar experiências com outras mulheres.
        </p>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Categorias</h3>
          <button
            onClick={() => setShowCreateGroup(true)}
            className="bg-purple-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-600 transition-all duration-200 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Criar Grupo</span>
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {categories.map(category => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id as any)}
                className={`p-3 rounded-lg text-center transition-all duration-200 ${
                  selectedCategory === category.id
                    ? `${category.color} text-white shadow-sm`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="h-5 w-5 mx-auto mb-2" />
                <div className="text-xs font-medium">{category.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar grupos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredGroups.map(group => (
          <div key={group.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start space-x-4 mb-4">
              <div className={`w-12 h-12 ${getCategoryColor(group.category)} rounded-lg flex items-center justify-center`}>
                <span className="text-white font-medium">{group.avatar}</span>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-semibold text-gray-900">{group.name}</h3>
                  {group.isPrivate && (
                    <Shield className="h-4 w-4 text-gray-500" title="Grupo Privado" />
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">{group.description}</p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    {group.memberCount} membros
                  </span>
                  <span>{group.lastActivity}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(group.category)} text-white`}>
                  {categories.find(c => c.id === group.category)?.label}
                </span>
                {group.unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {group.unreadCount} novas
                  </span>
                )}
              </div>
              
              {group.isJoined ? (
                <button
                  onClick={() => setSelectedGroup(group)}
                  className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-600 transition-all duration-200"
                >
                  Abrir Chat
                </button>
              ) : (
                <button
                  onClick={() => handleJoinGroup(group.id)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-all duration-200 flex items-center space-x-1"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Participar</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Group Chat Modal */}
      {selectedGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${getCategoryColor(selectedGroup.category)} rounded-lg flex items-center justify-center`}>
                  <span className="text-white font-medium">{selectedGroup.avatar}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedGroup.name}</h3>
                  <span className="text-sm text-gray-500">{selectedGroup.memberCount} membros</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                  <Settings className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setSelectedGroup(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {groupMessages.map(message => (
                <div key={message.id} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-white font-medium">
                      {message.senderName.charAt(0)}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-900 text-sm">{message.senderName}</span>
                      <span className="text-xs text-gray-500">{message.timestamp}</span>
                      {message.isSupport && (
                        <Heart className="h-3 w-3 text-pink-500" />
                      )}
                    </div>
                    <p className="text-gray-700 text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Digite sua mensagem de apoio..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Group Modal */}
      {showCreateGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Criar Novo Grupo</h3>
            <p className="text-gray-600 mb-6">
              Antes de criar um novo grupo, verifique se já não existe um similar. 
              Grupos duplicados podem ser mesclados pela moderação.
            </p>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nome do grupo"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <textarea
                placeholder="Descrição do grupo"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                rows={3}
              />
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <option value="">Selecione uma categoria</option>
                {categories.slice(1).map(category => (
                  <option key={category.id} value={category.id}>{category.label}</option>
                ))}
              </select>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowCreateGroup(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => setShowCreateGroup(false)}
                className="flex-1 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
              >
                Criar Grupo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupChats;