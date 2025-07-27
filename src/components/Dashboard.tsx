import React from 'react';
import { Heart, Users, Shield, Phone, BookOpen, AlertTriangle, TrendingUp, MessageCircle } from 'lucide-react';
import { logger } from '../utils/logger';
import { errorHandler } from '../utils/errorHandler';

interface User {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
}

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  React.useEffect(() => {
    logger.info('Dashboard carregado', {
      component: 'Dashboard',
      action: 'mount',
      userId: user.id,
      userVerified: user.isVerified
    });
  }, [user.id, user.isVerified]);

  const stats = [
    { label: 'Mulheres Conectadas', value: '2,847', icon: Users, color: 'purple' },
    { label: 'Denúncias Processadas', value: '156', icon: Shield, color: 'blue' },
    { label: 'Casos Resolvidos', value: '89', icon: TrendingUp, color: 'green' },
    { label: 'Mensagens de Apoio', value: '1,234', icon: MessageCircle, color: 'pink' },
  ];

  const quickActions = [
    {
      title: 'Buscar Apoio',
      description: 'Compartilhe sua experiência e receba suporte da comunidade',
      icon: Heart,
      color: 'bg-pink-500',
      action: 'feed'
    },
    {
      title: 'Fazer Denúncia',
      description: 'Reporte casos de violência de forma segura e anônima',
      icon: AlertTriangle,
      color: 'bg-orange-500',
      action: 'report'
    },
    {
      title: 'Consultar Base',
      description: 'Verifique informações sobre agressores conhecidos',
      icon: Shield,
      color: 'bg-blue-500',
      action: 'database'
    },
    {
      title: 'Emergência',
      description: 'Acesso rápido a contatos de emergência e recursos',
      icon: Phone,
      color: 'bg-red-500',
      action: 'emergency'
    },
  ];

  const recentPosts = [
    {
      id: 1,
      author: 'Ana M.',
      time: '2h atrás',
      content: 'Obrigada a todas pelo apoio. Consegui sair da situação e estou segura agora. 💜',
      supportCount: 23,
      type: 'success'
    },
    {
      id: 2,
      author: 'Carla S.',
      time: '4h atrás',
      content: 'Alguém conhece advogadas especializadas em violência doméstica na região central?',
      supportCount: 12,
      type: 'help'
    },
    {
      id: 3,
      author: 'Júlia R.',
      time: '6h atrás',
      content: 'Grupo de apoio presencial toda quinta às 19h no Centro Comunitário. Todas são bem-vindas.',
      supportCount: 34,
      type: 'info'
    },
  ];

  const handleQuickAction = (action: string) => {
    try {
      logger.userAction('dashboard_quick_action', {
        component: 'Dashboard',
        action: 'handleQuickAction',
        quickAction: action,
        userId: user.id
      });
      
      // Aqui seria implementada a navegação ou ação específica
      console.log(`Ação rápida: ${action}`);
    } catch (error) {
      errorHandler.handleError(error as Error, {
        component: 'Dashboard',
        action: 'handleQuickAction',
        quickAction: action
      });
    }
  };

  const handlePostInteraction = (postId: number, interactionType: 'support' | 'reply') => {
    try {
      logger.userAction('dashboard_post_interaction', {
        component: 'Dashboard',
        action: 'handlePostInteraction',
        postId,
        interactionType,
        userId: user.id
      });
      
      // Aqui seria implementada a lógica de interação
      console.log(`Interação ${interactionType} no post ${postId}`);
    } catch (error) {
      errorHandler.handleError(error as Error, {
        component: 'Dashboard',
        action: 'handlePostInteraction',
        postId,
        interactionType
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              Bem-vinda, {user.name.split(' ')[0]}! 👋
            </h2>
            <p className="text-purple-100 mb-4">
              Você faz parte de uma comunidade forte de mulheres que se apoiam mutuamente.
            </p>
            {user.isVerified && (
              <div className="inline-flex items-center space-x-2 bg-white/20 rounded-full px-3 py-1 text-sm">
                <Shield className="h-4 w-4" />
                <span>Conta Verificada</span>
              </div>
            )}
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
              <Heart className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            purple: 'bg-purple-500',
            blue: 'bg-blue-500',
            green: 'bg-green-500',
            pink: 'bg-pink-500',
          };
          
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${colorClasses[stat.color as keyof typeof colorClasses]} rounded-lg flex items-center justify-center`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Ações Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 text-left group hover:scale-[1.02]"
              >
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{action.title}</h4>
                <p className="text-sm text-gray-600">{action.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Posts */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Atividade Recente</h3>
          <div className="space-y-4">
            {recentPosts.map((post) => {
              const typeColors = {
                success: 'border-l-green-400 bg-green-50',
                help: 'border-l-blue-400 bg-blue-50',
                info: 'border-l-purple-400 bg-purple-50',
              };
              
              return (
                <div
                  key={post.id}
                  onClick={() => handleQuickAction(action.action)}
                  className={`bg-white border-l-4 ${typeColors[post.type as keyof typeof typeColors]} rounded-r-xl p-4 shadow-sm`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-white">
                          {post.author.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">{post.author}</span>
                        <span className="text-sm text-gray-500 ml-2">{post.time}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3">{post.content}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <button className="flex items-center space-x-1 hover:text-purple-600 transition-colors">
                      onClick={() => handlePostInteraction(post.id, 'support')}
                      <Heart className="h-4 w-4" />
                      <span>{post.supportCount}</span>
                    </button>
                    <button 
                      onClick={() => handlePostInteraction(post.id, 'reply')}
                      className="hover:text-purple-600 transition-colors"
                    >
                      Responder
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Safety Tips */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Dicas de Segurança</h3>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-green-600">1</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Mantenha evidências</h4>
                  <p className="text-sm text-gray-600">Documente todas as ocorrências com fotos, mensagens e registros.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">2</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Rede de apoio</h4>
                  <p className="text-sm text-gray-600">Mantenha contato com pessoas de confiança e informe sobre sua situação.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-purple-600">3</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Busque ajuda profissional</h4>
                  <p className="text-sm text-gray-600">Entre em contato com órgãos especializados e advogados.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100">
              <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200">
                Ver Mais Recursos
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;