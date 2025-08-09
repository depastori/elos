export const SIMULATED_FRIEND_REQUESTS = [
  {
    id: 'req_1',
    fromUserId: 'user_demo_1',
    fromProfile: {
      name: 'Beatriz Santos',
      city: 'Fortaleza',
      state: 'CE',
      profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
      followers: 234,
      following: 180,
      posts: [
        { id: 'bp1', type: 'image', url: 'https://images.unsplash.com/photo-1494790108755-2616c88c5e15?w=300&h=300&fit=crop&crop=center', likes: 67 }
      ],
      validations: {
        positive: 5,
        total: 6,
        trustScore: 87
      }
    }
  },
  {
    id: 'req_2',
    fromUserId: 'user_demo_2', 
    fromProfile: {
      name: 'Roberta Silva',
      city: 'Recife',
      state: 'PE',
      profilePhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face',
      followers: 456,
      following: 234,
      posts: [
        { id: 'rp1', type: 'image', url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=center', likes: 89 }
      ],
      validations: {
        positive: 12,
        total: 14,
        trustScore: 91
      }
    }
  }
]

export const SIMULATED_FRIENDS = [
  {
    id: 'friend_1',
    name: 'Camila Rodriguez',
    city: 'Porto Alegre',
    state: 'RS',
    profilePhoto: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=150&h=150&fit=crop&crop=face',
    followers: 567,
    following: 234,
    posts: [
      { id: 'cp1', type: 'image', url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=300&h=300&fit=crop&crop=center', likes: 123 },
      { id: 'cp2', type: 'image', url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&h=300&fit=crop&crop=center', likes: 78 }
    ],
    validations: {
      positive: 18,
      total: 20,
      trustScore: 94
    },
    friendshipStatus: 'accepted'
  },
  {
    id: 'friend_2',
    name: 'Letícia Martins',
    city: 'Florianópolis',
    state: 'SC', 
    profilePhoto: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face',
    followers: 789,
    following: 345,
    posts: [
      { id: 'lp1', type: 'image', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=center', likes: 156 }
    ],
    validations: {
      positive: 10,
      total: 12,
      trustScore: 89
    },
    friendshipStatus: 'accepted'
  },
  {
    id: 'friend_3',
    name: 'Daniela Ferreira',
    city: 'Goiânia',
    state: 'GO',
    profilePhoto: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&h=150&fit=crop&crop=face',
    followers: 234,
    following: 123,
    posts: [
      { id: 'dp1', type: 'image', url: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=300&h=300&fit=crop&crop=center', likes: 90 }
    ],
    validations: {
      positive: 7,
      total: 9,
      trustScore: 81
    },
    friendshipStatus: 'accepted'
  }
]

export const SIMULATED_SEARCH_USERS = [
  {
    id: 'user_1',
    name: 'Ana Silva Santos',
    city: 'São Paulo',
    state: 'SP',
    profilePhoto: 'https://images.unsplash.com/photo-1494790108755-2616c88c5e15?w=150&h=150&fit=crop&crop=face',
    description: 'Advogada especializada em direitos da mulher. Aqui para ajudar outras mulheres.',
    friendshipStatus: 'none',
    followers: 1240,
    following: 890,
    validations: {
      positive: 8,
      total: 10,
      trustScore: 85
    },
    posts: [
      { id: 'ap1', type: 'image', url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300&h=300&fit=crop&crop=center', likes: 45 },
      { id: 'ap2', type: 'image', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=center', likes: 67 },
      { id: 'ap3', type: 'image', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=300&fit=crop&crop=center', likes: 23 }
    ],
    stories: [
      { id: 'as1', type: 'image', url: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=300&h=400&fit=crop&crop=center', timestamp: Date.now() - 3600000 }
    ],
    reels: [
      { id: 'ar1', type: 'video', thumbnail: 'https://images.unsplash.com/photo-1521577352947-9bb58764b69a?w=300&h=400&fit=crop&crop=center', views: 1200 }
    ]
  },
  {
    id: 'user_2', 
    name: 'Maria Oliveira',
    city: 'Rio de Janeiro',
    state: 'RJ',
    profilePhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    description: 'Psicóloga clínica. Trabalho com traumas e violência doméstica.',
    friendshipStatus: 'none',
    followers: 2340,
    following: 456,
    validations: {
      positive: 15,
      total: 18,
      trustScore: 92
    },
    posts: [
      { id: 'mp1', type: 'image', url: 'https://images.unsplash.com/photo-1521577352947-9bb58764b69a?w=300&h=300&fit=crop&crop=center', likes: 89 },
      { id: 'mp2', type: 'image', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=center', likes: 134 }
    ],
    stories: [],
    reels: []
  }
]

export const DEFAULT_PROFILE = {
  posts: [
    { id: 'p1', type: 'image', url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300&h=300&fit=crop&crop=center', likes: 23, caption: 'Momento especial 💜' },
    { id: 'p2', type: 'image', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=center', likes: 45, caption: 'Força e união 🌸' },
    { id: 'p3', type: 'video', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=300&fit=crop&crop=center', likes: 67, views: 234, caption: 'Juntas somos mais fortes!' }
  ],
  stories: [
    { id: 's1', type: 'image', url: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=300&h=400&fit=crop&crop=center', timestamp: Date.now() - 3600000 }
  ],
  reels: [
    { id: 'r1', type: 'video', thumbnail: 'https://images.unsplash.com/photo-1521577352947-9bb58764b69a?w=300&h=400&fit=crop&crop=center', views: 1200 }
  ],
  followers: 147,
  following: 89,
  descriptionVisibility: 'friends',
  photosVisibility: 'friends',
  validations: { positive: 12, total: 15, trustScore: 89 }
}