import { Brain, Scale, Heart, Users, Stethoscope } from 'lucide-react'

export const categories = [
  { id: 'all', label: 'Todas', icon: Users, count: 24 },
  { id: 'psychology', label: 'Psicólogas', icon: Brain, count: 12 },
  { id: 'legal', label: 'Advogadas', icon: Scale, count: 6 },
  { id: 'social', label: 'Assistentes Sociais', icon: Heart, count: 4 },
  { id: 'medical', label: 'Médicas', icon: Stethoscope, count: 2 }
]

export const professionals = [
  {
    id: 1,
    name: 'Dra. Ana Paula Silva',
    category: 'psychology',
    specialization: 'Trauma e Violência Doméstica',
    rating: 4.9,
    reviewCount: 127,
    price: 150,
    discountPrice: 120,
    isOnline: true,
    isEmergency: true,
    responseTime: '5 min',
    credentials: ['CRP 06/12345', 'Especialista em Trauma'],
    bio: 'Psicóloga com 15 anos de experiência em atendimento a mulheres vítimas de violência. Abordagem humanizada e sigilosa.',
    availability: ['Seg-Sex 8h-20h', 'Plantão 24h'],
    services: ['Terapia Individual', 'Acompanhamento de Casos', 'Avaliação Psicológica']
  },
  {
    id: 2,
    name: 'Dra. Maria Fernanda Oliveira',
    category: 'legal',
    specialization: 'Lei Maria da Penha',
    rating: 4.8,
    reviewCount: 89,
    price: 200,
    discountPrice: 160,
    isOnline: true,
    isEmergency: false,
    responseTime: '15 min',
    credentials: ['OAB/SP 123456', 'Especialista em Direito da Mulher'],
    bio: 'Advogada especializada em Lei Maria da Penha e direitos da mulher. Atendimento gratuito para casos urgentes.',
    availability: ['Seg-Sex 9h-18h'],
    services: ['Medida Protetiva', 'Orientação Jurídica', 'Acompanhamento Processual']
  },
  {
    id: 3,
    name: 'Dra. Carla Santos',
    category: 'social',
    specialization: 'Reintegração Social',
    rating: 4.7,
    reviewCount: 64,
    price: 100,
    discountPrice: 80,
    isOnline: false,
    isEmergency: false,
    responseTime: '30 min',
    credentials: ['CRESS 123/SP', 'Assistente Social'],
    bio: 'Assistente Social com foco em reintegração e apoio familiar. Trabalho em rede com outros profissionais.',
    availability: ['Seg-Sex 8h-17h'],
    services: ['Avaliação Social', 'Planejamento Familiar', 'Encaminhamentos']
  },
  {
    id: 4,
    name: 'Dra. Beatriz Costa',
    category: 'psychology',
    specialization: 'Dependência Emocional',
    rating: 4.9,
    reviewCount: 156,
    price: 180,
    discountPrice: 144,
    isOnline: true,
    isEmergency: true,
    responseTime: '3 min',
    credentials: ['CRP 06/67890', 'Mestra em Psicologia Clínica'],
    bio: 'Especialista em dependência emocional e relacionamentos abusivos. Terapia cognitivo-comportamental.',
    availability: ['Todos os dias 7h-22h', 'Plantão 24h'],
    services: ['Terapia Individual', 'Terapia de Casal', 'Grupos de Apoio']
  },
  {
    id: 5,
    name: 'Dra. Juliana Ferreira',
    category: 'medical',
    specialization: 'Ginecologia e Obstetrícia',
    rating: 4.6,
    reviewCount: 45,
    price: 250,
    discountPrice: 200,
    isOnline: false,
    isEmergency: false,
    responseTime: '1h',
    credentials: ['CRM 98765', 'Especialista em Saúde da Mulher'],
    bio: 'Médica ginecologista com foco em saúde integral da mulher e violência sexual.',
    availability: ['Seg-Sex 14h-18h'],
    services: ['Consulta Ginecológica', 'Exame Preventivo', 'Orientação Contraceptiva']
  }
]

export const emergencyProfessionals = professionals.filter(prof => prof.isEmergency)