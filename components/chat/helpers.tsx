import { toast } from 'sonner@2.0.3'
import { EMERGENCY_KEYWORDS, BLOCKED_WORDS } from './constants'

export const formatLastActivity = (timestamp) => {
  if (!timestamp) return 'Novo'
  
  const now = new Date()
  const activityTime = new Date(timestamp)
  const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'agora'
  if (diffInMinutes < 60) return `${diffInMinutes}m`
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`
  return `${Math.floor(diffInMinutes / 1440)}d`
}

export const getCategoryName = (category) => {
  const categoryNames = {
    support: 'Apoio Emocional',
    emergency: 'Emergência',
    professional: 'Profissional',
    education: 'Educação',
    general: 'Geral'
  }
  return categoryNames[category] || 'Categoria'
}

export const validateMessage = (message) => {
  const lowerMessage = message.toLowerCase()
  
  // Verificar palavras bloqueadas
  const hasBlockedWords = BLOCKED_WORDS.some(word => 
    lowerMessage.includes(word.toLowerCase())
  )
  
  if (hasBlockedWords) {
    return {
      isValid: false,
      error: 'Não é permitido compartilhar informações pessoais como endereço ou telefone para sua segurança.'
    }
  }
  
  // Verificar palavras de emergência
  const hasEmergencyWords = EMERGENCY_KEYWORDS.some(word => 
    lowerMessage.includes(word.toLowerCase())
  )
  
  if (hasEmergencyWords) {
    return {
      isValid: true,
      isEmergency: true,
      warning: 'Mensagem com conteúdo de emergência detectada. Voluntárias serão notificadas.'
    }
  }
  
  return { isValid: true }
}

export const generateGroupId = () => {
  return `group_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export const saveGroupToStorage = (group) => {
  try {
    const existingGroups = JSON.parse(localStorage.getItem('chat_groups') || '[]')
    existingGroups.push(group)
    localStorage.setItem('chat_groups', JSON.stringify(existingGroups))
    
    console.log('💾 Grupo salvo no localStorage:', group.name)
    return true
  } catch (error) {
    console.error('❌ Erro ao salvar grupo:', error)
    return false
  }
}

export const loadGroupsFromStorage = () => {
  try {
    const savedGroups = JSON.parse(localStorage.getItem('chat_groups') || '[]')
    console.log('📱 Grupos carregados do localStorage:', savedGroups.length)
    return savedGroups
  } catch (error) {
    console.error('❌ Erro ao carregar grupos:', error)
    return []
  }
}

export const joinUserToGroup = (groupId, userId) => {
  try {
    const userGroups = JSON.parse(localStorage.getItem('user_groups') || '[]')
    const allGroups = JSON.parse(localStorage.getItem('chat_groups') || '[]')
    
    // Encontrar o grupo
    const group = allGroups.find(g => g.id === groupId)
    if (!group) {
      toast.error('Grupo não encontrado')
      return false
    }
    
    // Verificar se já está no grupo
    const isAlreadyMember = userGroups.some(g => g.id === groupId)
    if (isAlreadyMember) {
      toast.warning('Você já está neste grupo')
      return false
    }
    
    // Adicionar usuário ao grupo
    userGroups.push(group)
    localStorage.setItem('user_groups', JSON.stringify(userGroups))
    
    // Incrementar contador de membros
    group.memberCount = (group.memberCount || 0) + 1
    group.members = group.members || []
    if (!group.members.includes(userId)) {
      group.members.push(userId)
    }
    
    // Salvar grupo atualizado
    const updatedGroups = allGroups.map(g => g.id === groupId ? group : g)
    localStorage.setItem('chat_groups', JSON.stringify(updatedGroups))
    
    console.log('✅ Usuário adicionado ao grupo:', group.name)
    return true
  } catch (error) {
    console.error('❌ Erro ao entrar no grupo:', error)
    return false
  }
}

export const filterGroupsByCategory = (groups, category) => {
  if (category === 'all') return groups
  return groups.filter(group => group.category === category)
}

export const searchGroups = (groups, query) => {
  if (!query.trim()) return groups
  
  const lowerQuery = query.toLowerCase()
  return groups.filter(group => 
    group.name.toLowerCase().includes(lowerQuery) ||
    group.description.toLowerCase().includes(lowerQuery) ||
    group.category.toLowerCase().includes(lowerQuery)
  )
}