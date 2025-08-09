import { useCallback, useState } from 'react'
import { toast } from 'sonner@2.0.3'

export function useProfileActions() {
  const [privateChatTarget, setPrivateChatTarget] = useState(null)
  const [showPrivateChat, setShowPrivateChat] = useState(false)

  const openChat = useCallback((targetUser) => {
    console.log('💬 Abrindo chat privado com:', targetUser.name)
    
    setPrivateChatTarget(targetUser)
    setShowPrivateChat(true)
    
    toast.success(`💬 Chat privado aberto com ${targetUser.name}`, {
      description: 'Conversa segura e criptografada',
      duration: 2000
    })
  }, [])

  const closeChat = useCallback(() => {
    setShowPrivateChat(false)
    setPrivateChatTarget(null)
  }, [])

  const handleFileUpload = useCallback((event, type) => {
    const file = event.target.files?.[0]
    if (!file) return null

    console.log('🖼️ Iniciando upload:', { type, fileName: file.name, fileSize: file.size })

    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
    
    if (type === 'image' && !validImageTypes.includes(file.type)) {
      toast.error('Tipo de arquivo não suportado', {
        description: 'Selecione uma imagem (JPG, PNG, GIF, WebP)'
      })
      return null
    }
    
    if (type === 'video' && !validVideoTypes.includes(file.type)) {
      toast.error('Tipo de arquivo não suportado', {
        description: 'Selecione um vídeo (MP4, WebM, MOV)'
      })
      return null
    }

    // Verificar tamanho do arquivo (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      toast.error('Arquivo muito grande', {
        description: 'O arquivo deve ter no máximo 10MB'
      })
      return null
    }

    return new Promise((resolve) => {
      const reader = new FileReader()
      
      reader.onloadstart = () => {
        toast.loading('📁 Carregando arquivo...', { 
          id: `upload-toast-${type}`,
          description: `Processando ${file.name}...`
        })
      }
      
      reader.onloadend = () => {
        toast.dismiss(`upload-toast-${type}`)
        
        const result = reader.result
        if (!result) {
          toast.error('❌ Erro ao processar arquivo')
          resolve(null)
          return
        }

        console.log('✅ Upload concluído com sucesso')
        
        const uploadResult = { 
          file, 
          result, 
          type: file.type.startsWith('video') ? 'video' : 'image',
          name: file.name,
          size: file.size
        }

        // Toast de sucesso baseado no tipo
        if (type === 'profile') {
          toast.success('✅ Foto de perfil carregada!', {
            description: 'Sua nova foto foi processada com sucesso'
          })
        } else if (type === 'story') {
          toast.success('📸 Story carregado!', {
            description: 'Seu story está pronto para ser compartilhado'
          })
        } else {
          toast.success('📱 Foto carregada!', {
            description: 'Sua publicação está pronta'
          })
        }

        resolve(uploadResult)
      }
      
      reader.onerror = () => {
        toast.dismiss(`upload-toast-${type}`)
        toast.error('❌ Erro ao carregar arquivo', {
          description: 'Tente novamente com outro arquivo'
        })
        resolve(null)
      }
      
      reader.readAsDataURL(file)
    })
  }, [])

  return {
    openChat,
    closeChat,
    handleFileUpload,
    privateChatTarget,
    showPrivateChat,
    setShowPrivateChat
  }
}