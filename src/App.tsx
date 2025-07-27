import React, { useState } from 'react';
import { Heart, Shield, Users, MessageCircle, AlertTriangle, Phone, BookOpen, Settings, Menu, X, Map, UserPlus, User } from 'lucide-react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { logger } from './utils/logger';
import { errorHandler } from './utils/errorHandler';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import SupportFeed from './components/SupportFeed';
import ReportSystem from './components/ReportSystem';
import EmergencyResources from './components/EmergencyResources';
import AggressorDatabase from './components/AggressorDatabase';
import EducationalResources from './components/EducationalResources';
import AggressorMap from './components/AggressorMap';
import MutualAidNetwork from './components/MutualAidNetwork';
import PanicButton from './components/PanicButton';
import DisguisedMode from './components/DisguisedMode';
import LegalVerification from './components/LegalVerification';
import PrivateMessages from './components/PrivateMessages';
import GroupChats from './components/GroupChats';
import PersonalityProfiles from './components/PersonalityProfiles';
import SocialMediaFeed from './components/SocialMediaFeed';
import UserProfile from './components/UserProfile';
import ProfessionalMarketplace from './components/ProfessionalMarketplace';
import DonationCenter from './components/DonationCenter';

// Inicializar logging da aplicação
logger.info('Aplicação iniciada', {
  component: 'App',
  action: 'init',
  timestamp: new Date().toISOString(),
  userAgent: navigator.userAgent
});

type User = {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  location?: { lat: number; lng: number; address: string };
  isVolunteer?: boolean;
  volunteerServices?: string[];
  maxDistance?: number;
};

type ActiveSection = 'dashboard' | 'feed' | 'report' | 'emergency' | 'database' | 'education' | 'map' | 'mutual-aid' | 'legal' | 'messages' | 'groups' | 'profiles' | 'social' | 'user-profile' | 'professionals' | 'donations';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDisguisedMode, setIsDisguisedMode] = useState(false);
  const [showPanicButton, setShowPanicButton] = useState(false);

  const handleLogin = (userData: User) => {
    try {
      logger.userAction('login', {
        component: 'App',
        userId: userData.id,
        userEmail: userData.email
      });
      
      setUser(userData);
      
      // Salvar dados do usuário para logging
      localStorage.setItem('currentUser', JSON.stringify(userData));
    } catch (error) {
      const appError = errorHandler.handleError(error as Error, {
        component: 'App',
        action: 'handleLogin'
      });
      console.error('Erro no login:', appError);
    }
  };

  const handleLogout = () => {
    try {
      logger.userAction('logout', {
        component: 'App',
        userId: user?.id
      });
      
      setUser(null);
      setActiveSection('dashboard');
      setIsDisguisedMode(false);
      
      // Limpar dados do usuário
      localStorage.removeItem('currentUser');
    } catch (error) {
      const appError = errorHandler.handleError(error as Error, {
        component: 'App',
        action: 'handleLogout'
      });
      console.error('Erro no logout:', appError);
    }
  };

  const menuItems = [
    { id: 'dashboard' as const, label: 'Início', icon: Heart },
    { id: 'feed' as const, label: 'Rede de Apoio', icon: Users },
    { id: 'report' as const, label: 'Denunciar', icon: AlertTriangle },
    { id: 'database' as const, label: 'Base de Dados', icon: Shield },
    { id: 'map' as const, label: 'Mapa de Alertas', icon: Map },
    { id: 'mutual-aid' as const, label: 'Ajuda Mútua', icon: UserPlus },
    { id: 'legal' as const, label: 'Verificação Legal', icon: Shield },
    { id: 'emergency' as const, label: 'Emergência', icon: Phone },
    { id: 'messages' as const, label: 'Mensagens', icon: MessageCircle },
    { id: 'groups' as const, label: 'Grupos', icon: Users },
    { id: 'profiles' as const, label: 'Perfis Agressores', icon: AlertTriangle },
    { id: 'social' as const, label: 'Redes Sociais', icon: Heart },
    { id: 'education' as const, label: 'Recursos', icon: BookOpen },
    { id: 'professionals' as const, label: 'Profissionais', icon: Users },
    { id: 'donations' as const, label: 'Doações', icon: Heart },
    { id: 'user-profile' as const, label: 'Meu Perfil', icon: User },
  ];

  // Handler para mudança de seção com logging
  const handleSectionChange = (section: ActiveSection) => {
    try {
      logger.userAction('section_change', {
        component: 'App',
        action: 'handleSectionChange',
        fromSection: activeSection,
        toSection: section,
        userId: user?.id
      });
      
      setActiveSection(section);
    } catch (error) {
      errorHandler.handleError(error as Error, {
        component: 'App',
        action: 'handleSectionChange'
      });
    }
  };

  if (isDisguisedMode) {
    return <DisguisedMode onExitDisguise={() => setIsDisguisedMode(false)} />;
  }

  if (!user) {
    return (
      <ErrorBoundary>
        <LoginForm onLogin={handleLogin} onEnterDisguise={() => setIsDisguisedMode(true)} />
      </ErrorBoundary>
    );
  }

  const renderActiveSection = () => {
    try {
      logger.debug('Renderizando seção', {
        component: 'App',
        action: 'renderActiveSection',
        section: activeSection,
        userId: user?.id
      });
      
      switch (activeSection) {
        case 'dashboard':
          return <Dashboard user={user} />;
        case 'feed':
          return <SupportFeed user={user} />;
        case 'report':
          return <ReportSystem user={user} />;
        case 'emergency':
          return <EmergencyResources />;
        case 'database':
          return <AggressorDatabase user={user} />;
        case 'map':
          return <AggressorMap user={user} />;
        case 'mutual-aid':
          return <MutualAidNetwork user={user} />;
        case 'legal':
          return <LegalVerification user={user} />;
        case 'education':
          return <EducationalResources />;
        case 'messages':
          return <PrivateMessages user={user} />;
        case 'groups':
          return <GroupChats user={user} />;
        case 'profiles':
          return <PersonalityProfiles user={user} />;
        case 'social':
          return <SocialMediaFeed user={user} />;
        case 'user-profile':
          return <UserProfile user={user} />;
        case 'professionals':
          return <ProfessionalMarketplace user={user} />;
        case 'donations':
          return <DonationCenter user={user} />;
        default:
          return <Dashboard user={user} />;
      }
    } catch (error) {
      const appError = errorHandler.handleError(error as Error, {
        component: 'App',
        action: 'renderActiveSection',
        section: activeSection
      });
      
      // Fallback para dashboard em caso de erro
      logger.warn('Erro ao renderizar seção, voltando para dashboard', {
        component: 'App',
        error: appError
      });
      
      return <Dashboard user={user} />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      {/* Panic Button Component */}
      {showPanicButton && (
        <PanicButton 
          user={user} 
          onClose={() => setShowPanicButton(false)} 
        />
      )}

      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Rede Violeta
              </h1>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSectionChange(item.id)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                      activeSection === item.id
                        ? 'bg-purple-100 text-purple-700 shadow-sm'
                        : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsDisguisedMode(true)}
                className="text-sm text-gray-600 hover:text-purple-600 transition-colors"
                title="Modo Disfarce"
              >
                🔒
              </button>
              <div className="hidden md:flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700">{user.name}</span>
                {user.isVerified && (
                  <Shield className="h-4 w-4 text-green-500" title="Usuária Verificada" />
                )}
              </div>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-purple-600 transition-colors"
              >
                Sair
              </button>
              
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-600 hover:text-purple-600 hover:bg-purple-50"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-purple-100">
            <div className="px-4 py-2 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      handleSectionChange(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-3 ${
                      activeSection === item.id
                        ? 'bg-purple-100 text-purple-700'
                        : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorBoundary>
          {renderActiveSection()}
        </ErrorBoundary>
      </main>

      {/* Emergency Floating Button */}
      <button
        onClick={() => {
          logger.userAction('panic_button_click', {
            component: 'App',
            userId: user?.id
          });
          setShowPanicButton(true);
        }}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-50 animate-pulse"
        title="Botão de Pânico - Ajuda Imediata"
      >
        <AlertTriangle className="h-8 w-8" />
      </button>

      {/* Quick Emergency Access */}
      <button
        onClick={() => {
          logger.userAction('emergency_access_click', {
            component: 'App',
            userId: user?.id
          });
          handleSectionChange('emergency');
        }}
        className="fixed bottom-6 right-24 w-12 h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-50"
        title="Recursos de Emergência"
      >
        <Phone className="h-5 w-5" />
      </button>
    </div>
    </ErrorBoundary>
  );
}

export default App;