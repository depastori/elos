import { VOLUNTEER_CAPABILITIES } from './constants'

export const getSupportTypeName = (type) => {
  switch(type) {
    case 'acolhimento': return 'acolhimento'
    case 'carona': return 'carona'
    case 'cuidadoInfantil': return 'cuidado infantil'
    case 'criseImediata': return 'ajuda em crise'
    case 'apoioEmocional': return 'apoio emocional'
    case 'orientacaoLegal': return 'orientação legal'
    default: return 'apoio'
  }
}

export const getSupportTypeLabel = (type) => {
  switch(type) {
    case 'criseImediata': return 'Crise Imediata'
    case 'apoioEmocional': return 'Apoio Emocional'
    case 'orientacaoLegal': return 'Orientação Legal'
    case 'acolhimento': return 'Acolhimento'
    case 'carona': return 'Carona'
    case 'cuidadoInfantil': return 'Cuidado Infantil'
    default: return 'Apoio'
  }
}

export const getSupportTypeColor = (type) => {
  const capability = VOLUNTEER_CAPABILITIES[type]
  if (!capability) return 'border-gray-300 text-gray-700'
  
  switch(capability.color) {
    case 'red': return 'border-red-300 text-red-700'
    case 'green': return 'border-green-300 text-green-700'
    case 'orange': return 'border-orange-300 text-orange-700'
    case 'purple': return 'border-purple-300 text-purple-700'
    case 'blue': return 'border-blue-300 text-blue-700'
    case 'pink': return 'border-pink-300 text-pink-700'
    default: return 'border-gray-300 text-gray-700'
  }
}

export const validateVolunteerProfile = (profile) => {
  const errors = []
  
  if (!profile.specialization?.trim()) {
    errors.push('Especialização é obrigatória')
  }
  
  if (!profile.description?.trim()) {
    errors.push('Descrição é obrigatória')
  }
  
  const hasCapability = Object.values(profile.capabilities || {}).some(cap => cap.enabled)
  if (!hasCapability) {
    errors.push('Selecione pelo menos uma forma de apoio')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export const saveVolunteerProfile = (profile) => {
  try {
    localStorage.setItem('volunteer_profile', JSON.stringify(profile))
    return { success: true }
  } catch (error) {
    console.error('Erro ao salvar perfil de voluntária:', error)
    return { success: false, error: error.message }
  }
}

export const loadVolunteerProfile = () => {
  try {
    const saved = localStorage.getItem('volunteer_profile')
    return saved ? JSON.parse(saved) : null
  } catch (error) {
    console.error('Erro ao carregar perfil de voluntária:', error)
    return null
  }
}

export const saveVolunteerOnlineStatus = (userId, isOnline, profile) => {
  try {
    const status = {
      userId,
      isOnline,
      timestamp: Date.now(),
      profile
    }
    localStorage.setItem('volunteer_online_status', JSON.stringify(status))
    return { success: true }
  } catch (error) {
    console.error('Erro ao salvar status online:', error)
    return { success: false, error: error.message }
  }
}

export const loadVolunteerOnlineStatus = (userId) => {
  try {
    const saved = localStorage.getItem('volunteer_online_status')
    if (!saved) return null
    
    const status = JSON.parse(saved)
    return status.userId === userId ? status : null
  } catch (error) {
    console.error('Erro ao carregar status online:', error)
    return null
  }
}