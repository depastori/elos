export const VOLUNTEER_SPECIALIZATIONS = [
  { value: 'Amiga/Voluntária', label: 'Amiga/Voluntária' },
  { value: 'Psicóloga', label: 'Psicóloga' },
  { value: 'Assistente Social', label: 'Assistente Social' },
  { value: 'Advogada', label: 'Advogada' },
  { value: 'Enfermeira', label: 'Enfermeira' },
  { value: 'Médica', label: 'Médica' },
  { value: 'Educadora', label: 'Educadora' },
  { value: 'Terapeuta', label: 'Terapeuta' }
]

export const VOLUNTEER_CAPABILITIES = {
  criseImediata: {
    key: 'criseImediata',
    label: 'Crise Imediata',
    description: 'Atendimento de urgência em situações de risco',
    icon: 'Zap',
    color: 'red',
    defaultLimit: 1,
    maxLimit: 5
  },
  apoioEmocional: {
    key: 'apoioEmocional',
    label: 'Apoio Emocional',
    description: 'Conversa e suporte psicológico',
    icon: 'HeartHandshake',
    color: 'green',
    defaultLimit: 2,
    maxLimit: 10
  },
  orientacaoLegal: {
    key: 'orientacaoLegal',
    label: 'Orientação Legal',
    description: 'Orientação sobre direitos e procedimentos',
    icon: 'Scale',
    color: 'orange',
    defaultLimit: 1,
    maxLimit: 5
  },
  acolhimento: {
    key: 'acolhimento',
    label: 'Acolhimento',
    description: 'Oferecer lugar seguro temporário',
    icon: 'Home',
    color: 'purple',
    defaultLimit: 1,
    maxLimit: 10
  },
  carona: {
    key: 'carona',
    label: 'Carona',
    description: 'Transporte para locais seguros',
    icon: 'Car',
    color: 'blue',
    defaultLimit: 2,
    maxLimit: 5
  },
  cuidadoInfantil: {
    key: 'cuidadoInfantil',
    label: 'Cuidado Infantil',
    description: 'Cuidar de crianças temporariamente',
    icon: 'Baby',
    color: 'pink',
    defaultLimit: 3,
    maxLimit: 10
  }
}

export const MOCK_VOLUNTEERS = [
  {
    id: 'vol_1',
    name: 'Ana Carvalho',
    specialization: 'Amiga/Voluntária',
    description: 'Sempre disponível para conversar e dar apoio emocional imediato.',
    city: 'São Paulo',
    state: 'SP',
    distance: '0.8 km',
    rating: 4.9,
    responseTime: '2 min',
    isOnline: true,
    photo: 'https://images.unsplash.com/photo-1494790108755-2616c88c5e15?w=150&h=150&fit=crop&crop=face',
    capabilities: {
      acolhimento: { enabled: true, limit: 2 },
      carona: { enabled: false, limit: 0 },
      cuidadoInfantil: { enabled: true, limit: 1 },
      criseImediata: { enabled: true, limit: 1 },
      apoioEmocional: { enabled: true, limit: 3 },
      orientacaoLegal: { enabled: false, limit: 0 }
    },
    lastSeen: 'Online agora'
  },
  {
    id: 'vol_2',
    name: 'Maria Santos',
    specialization: 'Enfermeira',
    description: 'Enfermeira especializada em atendimento de crise e primeiros socorros.',
    city: 'São Paulo',
    state: 'SP',
    distance: '1.2 km',
    rating: 4.8,
    responseTime: '5 min',
    isOnline: true,
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
    capabilities: {
      acolhimento: { enabled: true, limit: 1 },
      carona: { enabled: true, limit: 3 },
      cuidadoInfantil: { enabled: false, limit: 0 },
      criseImediata: { enabled: true, limit: 2 },
      apoioEmocional: { enabled: true, limit: 2 },
      orientacaoLegal: { enabled: false, limit: 0 }
    },
    lastSeen: 'Online agora'
  },
  {
    id: 'vol_3',
    name: 'Dra. Lucia Ferreira',
    specialization: 'Assistente Social',
    description: 'Trabalho com apoio psicossocial, orientação de direitos e crise imediata.',
    city: 'São Paulo',
    state: 'SP',
    distance: '2.1 km',
    rating: 4.7,
    responseTime: '8 min',
    isOnline: true,
    photo: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
    capabilities: {
      acolhimento: { enabled: true, limit: 3 },
      carona: { enabled: false, limit: 0 },
      cuidadoInfantil: { enabled: true, limit: 2 },
      criseImediata: { enabled: true, limit: 1 },
      apoioEmocional: { enabled: true, limit: 4 },
      orientacaoLegal: { enabled: true, limit: 2 }
    },
    lastSeen: 'Online agora'
  },
  {
    id: 'vol_4',
    name: 'Camila Rodriguez',
    specialization: 'Amiga/Voluntária',
    description: 'Mãe de família especializada em apoio emocional e cuidado infantil.',
    city: 'São Paulo',
    state: 'SP',
    distance: '0.5 km',
    rating: 4.6,
    responseTime: '3 min',
    isOnline: true,
    photo: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=150&h=150&fit=crop&crop=face',
    capabilities: {
      acolhimento: { enabled: true, limit: 1 },
      carona: { enabled: true, limit: 2 },
      cuidadoInfantil: { enabled: true, limit: 4 },
      criseImediata: { enabled: false, limit: 0 },
      apoioEmocional: { enabled: true, limit: 3 },
      orientacaoLegal: { enabled: false, limit: 0 }
    },
    lastSeen: 'Online agora'
  },
  {
    id: 'vol_5',
    name: 'Dra. Patricia Lima',
    specialization: 'Psicóloga',
    description: 'Psicóloga clínica especializada em traumas, violência e crise emocional.',
    city: 'São Paulo',
    state: 'SP',
    distance: '3.2 km',
    rating: 4.9,
    responseTime: '10 min',
    isOnline: true,
    photo: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=150&h=150&fit=crop&crop=face',
    capabilities: {
      acolhimento: { enabled: true, limit: 2 },
      carona: { enabled: false, limit: 0 },
      cuidadoInfantil: { enabled: false, limit: 0 },
      criseImediata: { enabled: true, limit: 2 },
      apoioEmocional: { enabled: true, limit: 5 },
      orientacaoLegal: { enabled: false, limit: 0 }
    },
    lastSeen: 'Online agora'
  },
  {
    id: 'vol_6',
    name: 'Dra. Beatriz Oliveira',
    specialization: 'Advogada',
    description: 'Advogada especializada em direito da mulher e orientação legal.',
    city: 'São Paulo',
    state: 'SP',
    distance: '1.8 km',
    rating: 4.8,
    responseTime: '12 min',
    isOnline: true,
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    capabilities: {
      acolhimento: { enabled: false, limit: 0 },
      carona: { enabled: false, limit: 0 },
      cuidadoInfantil: { enabled: false, limit: 0 },
      criseImediata: { enabled: false, limit: 0 },
      apoioEmocional: { enabled: true, limit: 2 },
      orientacaoLegal: { enabled: true, limit: 3 }
    },
    lastSeen: 'Online agora'
  }
]

export const MOCK_SUPPORT_REQUESTS = [
  {
    id: 'req_1',
    from: {
      name: 'Beatriz Silva',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face'
    },
    type: 'criseImediata',
    message: 'Preciso de ajuda imediata, estou em situação de risco.',
    timestamp: '2024-01-15T14:30:00Z',
    status: 'pending',
    priority: 'urgent'
  },
  {
    id: 'req_2',
    from: {
      name: 'Roberta Martins',
      photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face'
    },
    type: 'apoioEmocional',
    message: 'Preciso conversar com alguém, estou muito abalada.',
    timestamp: '2024-01-15T13:15:00Z',
    status: 'pending',
    priority: 'high'
  },
  {
    id: 'req_3',
    from: {
      name: 'Carolina Dias',
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
    },
    type: 'orientacaoLegal',
    message: 'Preciso de orientação sobre meus direitos.',
    timestamp: '2024-01-15T12:45:00Z',
    status: 'pending',
    priority: 'medium'
  }
]

export const DEFAULT_VOLUNTEER_PROFILE = {
  specialization: '',
  description: '',
  location: '',
  capabilities: {
    acolhimento: { enabled: false, limit: 1 },
    carona: { enabled: false, limit: 2 },
    cuidadoInfantil: { enabled: false, limit: 3 },
    criseImediata: { enabled: false, limit: 1 },
    apoioEmocional: { enabled: false, limit: 2 },
    orientacaoLegal: { enabled: false, limit: 1 }
  },
  phone: '',
  availability: 'immediate'
}