export const demoVolunteers = [
  {
    userId: 'demo_volunteer_1',
    name: 'Maria Silva',
    services: ['shelter', 'emotional', 'transport'],
    radius: 10,
    location: { latitude: -23.5505, longitude: -46.6333 },
    capacity: { shelter: '2', emotional: '5', transport: '3' },
    rating: 4.9,
    helpCount: 23,
    responseTime: 8,
    isOnline: true,
    phone: '(11) 99999-1111'
  },
  {
    userId: 'demo_volunteer_2',
    name: 'Ana Costa',
    services: ['childcare', 'transport', 'emotional'],
    radius: 5,
    location: { latitude: -23.5515, longitude: -46.6343 },
    capacity: { childcare: '3', transport: '2', emotional: '3' },
    rating: 4.8,
    helpCount: 18,
    responseTime: 12,
    isOnline: true,
    phone: '(11) 99999-2222'
  },
  {
    userId: 'demo_volunteer_3',
    name: 'Dra. Julia Santos',
    services: ['legal', 'emotional', 'general'],
    radius: 15,
    location: { latitude: -23.5495, longitude: -46.6323 },
    capacity: { legal: '5', emotional: '8', general: 'sempre' },
    rating: 5.0,
    helpCount: 45,
    responseTime: 5,
    isOnline: true,
    phone: '(11) 99999-3333'
  },
  {
    userId: 'demo_volunteer_4',
    name: 'Carolina Ferreira',
    services: ['shelter', 'childcare'],
    radius: 8,
    location: { latitude: -23.5525, longitude: -46.6353 },
    capacity: { shelter: '1', childcare: '2' },
    rating: 4.7,
    helpCount: 12,
    responseTime: 15,
    isOnline: false,
    phone: '(11) 99999-4444'
  }
]

export const simulateVolunteerResponse = (panicId, volunteerId, delay = 2000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const volunteer = demoVolunteers.find(v => v.userId === volunteerId)
      resolve({
        panicId,
        volunteerId,
        volunteerName: volunteer?.name,
        response: 'accepted',
        estimatedTime: volunteer?.responseTime || 10,
        phone: volunteer?.phone
      })
    }, delay)
  })
}