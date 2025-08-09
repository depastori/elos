import { toast } from 'sonner@2.0.3'
import { projectId, publicAnonKey } from '../../utils/supabase/info'

export const getTrustLevel = (validations) => {
  if (validations?.total === 0) return { level: 'Nova', color: 'bg-gray-100 text-gray-600', score: 0 }
  const score = validations?.trustScore || 0
  if (score >= 90) return { level: 'Muito Confiável', color: 'bg-emerald-100 text-emerald-700', score }
  if (score >= 75) return { level: 'Confiável', color: 'bg-green-100 text-green-700', score }
  if (score >= 60) return { level: 'Moderadamente Confiável', color: 'bg-blue-100 text-blue-700', score }
  if (score >= 40) return { level: 'Cuidado', color: 'bg-yellow-100 text-yellow-700', score }
  return { level: 'Não Confiável', color: 'bg-red-100 text-red-700', score }
}

export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export const formatTimeAgo = (timestamp) => {
  const now = new Date()
  const postTime = new Date(timestamp)
  const diffInMinutes = Math.floor((now - postTime) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'agora'
  if (diffInMinutes < 60) return `${diffInMinutes}m`
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`
  return `${Math.floor(diffInMinutes / 1440)}d`
}

export const openChat = (targetUser) => {
  console.log('🔄 Abrindo chat com:', targetUser.name)
  
  toast.success(`💬 Abrindo chat com ${targetUser.name}`, {
    description: 'Conectando ao sistema de mensagens...',
    duration: 2000,
    action: {
      label: 'Ir para Chat',
      onClick: () => {
        window.dispatchEvent(new CustomEvent('navigate-to-chat', { 
          detail: { userId: targetUser.id, userName: targetUser.name } 
        }))
      }
    }
  })
  
  setTimeout(() => {
    toast.success(`✅ Chat com ${targetUser.name} aberto`, {
      description: 'Você pode começar a conversar agora',
      duration: 2000
    })
  }, 1000)
}

export const handleFileUpload = (event, type, callback) => {
  const file = event.target.files?.[0]
  if (!file) return

  console.log('Iniciando upload:', { type, fileName: file.name, fileSize: file.size })

  const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
  
  if (type === 'image' && !validImageTypes.includes(file.type)) {
    toast.error('Tipo de arquivo não suportado', {
      description: 'Por favor, selecione uma imagem (JPG, PNG, GIF, WebP)'
    })
    return
  }
  
  if (type === 'video' && !validVideoTypes.includes(file.type)) {
    toast.error('Tipo de arquivo não suportado', {
      description: 'Por favor, selecione um vídeo (MP4, WebM, MOV)'
    })
    return
  }

  const reader = new FileReader()
  
  reader.onloadstart = () => {
    toast.loading('Carregando arquivo...', { id: 'upload-toast' })
  }
  
  reader.onloadend = () => {
    toast.dismiss('upload-toast')
    
    const result = reader.result
    if (!result) {
      toast.error('Erro ao processar arquivo')
      return
    }

    console.log('Upload concluído:', { 
      type, 
      resultLength: result.length, 
      resultType: typeof result 
    })

    const fileType = file.type.startsWith('video') ? 'video' : 'image'
    callback(file, result, fileType)
  }
  
  reader.onerror = () => {
    toast.dismiss('upload-toast')
    toast.error('Erro ao carregar arquivo', {
      description: 'Tente novamente com outro arquivo'
    })
  }
  
  reader.readAsDataURL(file)
}

export const saveProfileData = async (editForm, user) => {
  try {
    const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-47a9aa23/user/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.access_token || publicAnonKey}`
      },
      body: JSON.stringify(editForm)
    })

    if (response.ok) {
      const { profile } = await response.json()
      return { success: true, profile }
    } else {
      return { success: false, error: 'Erro na resposta do servidor' }
    }
  } catch (error) {
    console.log('Erro ao salvar perfil:', error)
    return { success: false, error: error.message }
  }
}

export const searchUsers = async (query, simulatedUsers) => {
  if (query.length < 2) return []

  console.log(`🔍 Iniciando busca por: "${query}"`)
  
  const filteredUsers = simulatedUsers.filter(u => 
    u.name.toLowerCase().includes(query.toLowerCase()) ||
    u.city.toLowerCase().includes(query.toLowerCase()) ||
    u.state.toLowerCase().includes(query.toLowerCase()) ||
    u.description.toLowerCase().includes(query.toLowerCase())
  )
  
  console.log(`✅ Busca concluída por "${query}": ${filteredUsers.length} resultados encontrados`)
  return filteredUsers
}