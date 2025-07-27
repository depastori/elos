import React, { useState } from 'react';
import { Camera, Edit, Shield, Heart, Users, MapPin, Calendar, Settings, Eye, EyeOff, Save, X } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
}

interface UserProfileProps {
  user: User;
}

type PrivacyLevel = 'public' | 'friends' | 'authorized' | 'trusted' | 'private';

type UserProfileData = {
  displayName: string;
  bio: string;
  location: string;
  age?: number;
  profilePhoto?: string;
  coverPhoto?: string;
  interests: string[];
  supportOffered: string[];
  supportNeeded: string[];
  joinDate: string;
  isVolunteer: boolean;
  volunteerServices: string[];
  privacySettings: {
    profilePhoto: PrivacyLevel;
    personalInfo: PrivacyLevel;
    location: PrivacyLevel;
    volunteerInfo: PrivacyLevel;
  };
  stats: {
    helpProvided: number;
    helpReceived: number;
    groupsJoined: number;
    postsShared: number;
  };
};

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'privacy' | 'stats'>('profile');
  
  const [profileData, setProfileData] = useState<UserProfileData>({
    displayName: user.name,
    bio: 'Mulher forte, em busca de apoio e crescimento. Juntas somos mais fortes! 💜',
    location: 'São Paulo, SP',
    age: 28,
    profilePhoto: undefined,
    coverPhoto: undefined,
    interests: ['Psicologia', 'Direitos da Mulher', 'Autoajuda', 'Meditação'],
    supportOffered: ['Apoio Emocional', 'Orientação Profissional'],
    supportNeeded: ['Terapia', 'Grupo de Apoio'],
    joinDate: '2024-01-15',
    isVolunteer: true,
    volunteerServices: ['Apoio Emocional', 'Acompanhamento'],
    privacySettings: {
      profilePhoto: 'friends',
      personalInfo: 'authorized',
      location: 'trusted',
      volunteerInfo: 'public',
    },
    stats: {
      helpProvided: 23,
      helpReceived: 8,
      groupsJoined: 5,
      postsShared: 47,
    }
  });

  const privacyLevels = [
    { id: 'public', label: 'Público', description: 'Visível para todas as usuárias', icon: '🌍' },
    { id: 'friends', label: 'Amigas', description: 'Apenas suas conexões', icon: '👥' },
    { id: 'authorized', label: 'Autorizadas', description: 'Pessoas que você autorizou', icon: '✅' },
    { id: 'trusted', label: 'Confiança', description: 'Círculo de confiança', icon: '💜' },
    { id: 'private', label: 'Privado', description: 'Apenas você', icon: '🔒' },
  ];

  const supportTypes = [
    'Apoio Emocional', 'Orientação Legal', 'Acompanhamento', 'Transporte',
    'Abrigo Temporário', 'Orientação Profissional', 'Cuidado com Crianças',
    'Apoio Financeiro', 'Terapia', 'Grupo de Apoio', 'Mentoria'
  ];

  const interestOptions = [
    'Psicologia', 'Direitos da Mulher', 'Autoajuda', 'Meditação', 'Yoga',
    'Leitura', 'Arte Terapia', 'Música', 'Esportes', 'Culinária',
    'Empreendedorismo', 'Tecnologia', 'Educação', 'Saúde Mental'
  ];

  const handleSave = () => {
    // Aqui salvaria no backend
    setIsEditing(false);
  };

  const handlePhotoUpload = (type: 'profile' | 'cover') => {
    // Simulação de upload de foto
    console.log(`Uploading ${type} photo`);
  };

  const getPrivacyIcon = (level: PrivacyLevel) => {
    const levelData = privacyLevels.find(l => l.id === level);
    return levelData?.icon || '🔒';
  };

  return (
    <div className="space-y-6">
      {/* Cover Photo */}
      <div className="relative h-48 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 rounded-2xl overflow-hidden">
        {profileData.coverPhoto ? (
          <img src={profileData.coverPhoto} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-white">
              <Heart className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium opacity-75">Sua jornada de força e coragem</p>
            </div>
          </div>
        )}
        
        {isEditing && (
          <button
            onClick={() => handlePhotoUpload('cover')}
            className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all duration-200"
          >
            <Camera className="h-5 w-5" />
          </button>
        )}

        {/* Profile Photo */}
        <div className="absolute -bottom-16 left-8">
          <div className="relative">
            <div className="w-32 h-32 bg-white rounded-full p-2 shadow-lg">
              {profileData.profilePhoto ? (
                <img src={profileData.profilePhoto} alt="Profile" className="w-full h-full rounded-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">
                    {profileData.displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            
            {isEditing && (
              <button
                onClick={() => handlePhotoUpload('profile')}
                className="absolute bottom-2 right-2 bg-purple-500 text-white p-2 rounded-full hover:bg-purple-600 transition-all duration-200"
              >
                <Camera className="h-4 w-4" />
              </button>
            )}
            
            <div className="absolute -bottom-1 -right-1 flex items-center space-x-1">
              {user.isVerified && (
                <div className="bg-green-500 text-white p-1 rounded-full">
                  <Shield className="h-4 w-4" />
                </div>
              )}
              <div className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
                {getPrivacyIcon(profileData.privacySettings.profilePhoto)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 pt-20 pb-6 px-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {isEditing ? (
              <input
                type="text"
                value={profileData.displayName}
                onChange={(e) => setProfileData(prev => ({ ...prev, displayName: e.target.value }))}
                className="text-2xl font-bold text-gray-900 bg-transparent border-b-2 border-purple-300 focus:outline-none focus:border-purple-500 mb-2"
              />
            ) : (
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{profileData.displayName}</h1>
            )}
            
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
              <span className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {profileData.location}
              </span>
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Membro desde {new Date(profileData.joinDate).toLocaleDateString('pt-BR')}
              </span>
              {profileData.isVolunteer && (
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                  Voluntária
                </span>
              )}
            </div>

            {isEditing ? (
              <textarea
                value={profileData.bio}
                onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                rows={3}
                placeholder="Conte um pouco sobre você..."
              />
            ) : (
              <p className="text-gray-700 max-w-2xl">{profileData.bio}</p>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                  <X className="h-4 w-4" />
                  <span>Cancelar</span>
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-all duration-200"
                >
                  <Save className="h-4 w-4" />
                  <span>Salvar</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-all duration-200"
              >
                <Edit className="h-4 w-4" />
                <span>Editar Perfil</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Ajuda Oferecida', value: profileData.stats.helpProvided, color: 'bg-green-500', icon: Heart },
          { label: 'Apoio Recebido', value: profileData.stats.helpReceived, color: 'bg-blue-500', icon: Shield },
          { label: 'Grupos Participando', value: profileData.stats.groupsJoined, color: 'bg-purple-500', icon: Users },
          { label: 'Posts Compartilhados', value: profileData.stats.postsShared, color: 'bg-pink-500', icon: Heart },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex border-b border-gray-200">
          {[
            { id: 'profile', label: 'Perfil', icon: Users },
            { id: 'privacy', label: 'Privacidade', icon: Shield },
            { id: 'stats', label: 'Estatísticas', icon: Heart },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                  activeTab === tab.id
                    ? 'text-purple-700 border-b-2 border-purple-500 bg-purple-50'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Interests */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Interesses</h3>
                {isEditing ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {interestOptions.map(interest => (
                      <label key={interest} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={profileData.interests.includes(interest)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setProfileData(prev => ({
                                ...prev,
                                interests: [...prev.interests, interest]
                              }));
                            } else {
                              setProfileData(prev => ({
                                ...prev,
                                interests: prev.interests.filter(i => i !== interest)
                              }));
                            }
                          }}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">{interest}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profileData.interests.map(interest => (
                      <span key={interest} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                        {interest}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Support Offered */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Apoio que Ofereço</h3>
                {isEditing ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {supportTypes.map(support => (
                      <label key={support} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={profileData.supportOffered.includes(support)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setProfileData(prev => ({
                                ...prev,
                                supportOffered: [...prev.supportOffered, support]
                              }));
                            } else {
                              setProfileData(prev => ({
                                ...prev,
                                supportOffered: prev.supportOffered.filter(s => s !== support)
                              }));
                            }
                          }}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">{support}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profileData.supportOffered.map(support => (
                      <span key={support} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                        {support}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Support Needed */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Apoio que Busco</h3>
                {isEditing ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {supportTypes.map(support => (
                      <label key={support} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={profileData.supportNeeded.includes(support)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setProfileData(prev => ({
                                ...prev,
                                supportNeeded: [...prev.supportNeeded, support]
                              }));
                            } else {
                              setProfileData(prev => ({
                                ...prev,
                                supportNeeded: prev.supportNeeded.filter(s => s !== support)
                              }));
                            }
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">{support}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profileData.supportNeeded.map(support => (
                      <span key={support} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                        {support}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações de Privacidade</h3>
                <p className="text-gray-600 mb-6">
                  Controle quem pode ver suas informações pessoais. Sua segurança é nossa prioridade.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { key: 'profilePhoto', label: 'Foto do Perfil', description: 'Quem pode ver sua foto de perfil' },
                  { key: 'personalInfo', label: 'Informações Pessoais', description: 'Idade, localização e biografia' },
                  { key: 'location', label: 'Localização Detalhada', description: 'Sua localização específica' },
                  { key: 'volunteerInfo', label: 'Informações de Voluntária', description: 'Serviços que você oferece' },
                ].map(setting => (
                  <div key={setting.key} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{setting.label}</h4>
                        <p className="text-sm text-gray-600">{setting.description}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">
                          {getPrivacyIcon(profileData.privacySettings[setting.key as keyof typeof profileData.privacySettings])}
                        </span>
                      </div>
                    </div>
                    
                    <select
                      value={profileData.privacySettings[setting.key as keyof typeof profileData.privacySettings]}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        privacySettings: {
                          ...prev.privacySettings,
                          [setting.key]: e.target.value as PrivacyLevel
                        }
                      }))}
                      className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {privacyLevels.map(level => (
                        <option key={level.id} value={level.id}>
                          {level.icon} {level.label} - {level.description}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats Tab */}
          {activeTab === 'stats' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Suas Estatísticas</h3>
                <p className="text-gray-600 mb-6">
                  Acompanhe seu impacto positivo na comunidade e o apoio que você recebeu.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h4 className="font-semibold text-green-800 mb-4">Apoio Oferecido</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-green-700">Mensagens de apoio enviadas</span>
                      <span className="font-medium text-green-800">156</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Pessoas ajudadas diretamente</span>
                      <span className="font-medium text-green-800">{profileData.stats.helpProvided}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Horas de voluntariado</span>
                      <span className="font-medium text-green-800">47h</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="font-semibold text-blue-800 mb-4">Apoio Recebido</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-blue-700">Mensagens de apoio recebidas</span>
                      <span className="font-medium text-blue-800">89</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Pessoas que te ajudaram</span>
                      <span className="font-medium text-blue-800">{profileData.stats.helpReceived}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Grupos de apoio participando</span>
                      <span className="font-medium text-blue-800">{profileData.stats.groupsJoined}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h4 className="font-semibold text-purple-800 mb-4">Impacto na Comunidade</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-1">4.9</div>
                    <div className="text-sm text-purple-700">Avaliação Média</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-1">92%</div>
                    <div className="text-sm text-purple-700">Taxa de Resposta</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-1">15</div>
                    <div className="text-sm text-purple-700">Recomendações</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;