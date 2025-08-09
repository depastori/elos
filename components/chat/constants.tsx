export const CHAT_CATEGORIES = [
  { id: 'all', name: 'Todos', icon: '🌐' },
  { id: 'support', name: 'Apoio Emocional', icon: '💜' },
  { id: 'emergency', name: 'Emergência', icon: '🚨' },
  { id: 'professional', name: 'Profissional', icon: '💼' },
  { id: 'education', name: 'Educação', icon: '📚' },
  { id: 'general', name: 'Geral', icon: '💬' }
]

export const INITIAL_GROUPS = [
  {
    id: 'group_support_1',
    name: 'Círculo de Apoio SP',
    description: 'Grupo de apoio emocional para mulheres da região de São Paulo. Conversas diárias sobre superação e força.',
    category: 'support',
    memberCount: 127,
    isPrivate: false,
    isVerified: true,
    createdAt: '2024-01-10T10:00:00Z',
    lastActivity: '2024-01-15T14:30:00Z',
    members: []
  },
  {
    id: 'group_emergency_1',
    name: 'Rede de Emergência RJ',
    description: 'Canal de emergência 24h para situações de risco. Voluntárias ativas na região do Rio de Janeiro.',
    category: 'emergency',
    memberCount: 89,
    isPrivate: false,
    isVerified: true,
    createdAt: '2024-01-08T15:00:00Z',
    lastActivity: '2024-01-15T16:45:00Z',
    members: []
  },
  {
    id: 'group_professional_1',
    name: 'Advogadas Especializadas',
    description: 'Grupo exclusivo para profissionais do direito especializadas em violência doméstica e direitos da mulher.',
    category: 'professional',
    memberCount: 45,
    isPrivate: true,
    isVerified: true,
    createdAt: '2024-01-05T09:00:00Z',
    lastActivity: '2024-01-15T11:20:00Z',
    members: []
  },
  {
    id: 'group_education_1',
    name: 'Conhecimento e Prevenção',
    description: 'Espaço para compartilhar conhecimento sobre prevenção, direitos legais e recursos de proteção.',
    category: 'education',
    memberCount: 203,
    isPrivate: false,
    isVerified: true,
    createdAt: '2024-01-12T14:00:00Z',
    lastActivity: '2024-01-15T13:15:00Z',
    members: []
  },
  {
    id: 'group_general_1',
    name: 'Conversa Livre',
    description: 'Espaço aberto para conversas gerais, networking e amizades entre mulheres da rede Ellos.',
    category: 'general',
    memberCount: 156,
    isPrivate: false,
    isVerified: false,
    createdAt: '2024-01-14T16:00:00Z',
    lastActivity: '2024-01-15T15:30:00Z',
    members: []
  }
]

export const EMERGENCY_KEYWORDS = [
  'ajuda', 'socorro', 'emergencia', 'perigo', 'urgente', 'ameaça', 'violencia', 'medo'
]

export const BLOCKED_WORDS = [
  'endereco', 'endereço', 'telefone', 'whatsapp', 'instagram', 'facebook'
]