import React, { useState, useEffect, useRef } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { 
  ArrowLeft, Send, Phone, Video, Info, Smile, 
  Image, Camera, Mic, MoreHorizontal, Shield
} from 'lucide-react'
import { toast } from 'sonner@2.0.3'

export function PrivateChatDialog({ 
  isOpen, 
  onOpenChange, 
  targetUser, 
  currentUser 
}) {
  const [message, setMessage] = useState('')
  const [chatHistory, setChatHistory] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  // Simular mensagens existentes baseadas no usuário
  useEffect(() => {
    if (targetUser && isOpen) {
      loadChatHistory()
    }
  }, [targetUser, isOpen])

  // Auto scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatHistory])

  const loadChatHistory = () => {
    const chatKey = `chat_${Math.min(currentUser.id, targetUser.id)}_${Math.max(currentUser.id, targetUser.id)}`
    const savedHistory = localStorage.getItem(chatKey)
    
    if (savedHistory) {
      setChatHistory(JSON.parse(savedHistory))
    } else {
      // Criar conversa inicial simulada
      const initialMessages = [
        {
          id: 'msg_1',
          senderId: targetUser.id,
          senderName: targetUser.name,
          text: `Oi! Obrigada por me adicionar na Ellos 💜`,
          timestamp: Date.now() - 86400000, // 1 dia atrás
          read: true
        },
        {
          id: 'msg_2',
          senderId: currentUser.id,
          senderName: currentUser.profile?.name || 'Você',
          text: 'Oi! Que bom te conhecer aqui! 😊',
          timestamp: Date.now() - 86000000, // Um pouco depois
          read: true
        }
      ]
      setChatHistory(initialMessages)
      localStorage.setItem(chatKey, JSON.stringify(initialMessages))
    }
  }

  const sendMessage = () => {
    if (!message.trim()) return

    const newMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.profile?.name || 'Você',
      text: message.trim(),
      timestamp: Date.now(),
      read: false
    }

    const updatedHistory = [...chatHistory, newMessage]
    setChatHistory(updatedHistory)

    // Salvar no localStorage
    const chatKey = `chat_${Math.min(currentUser.id, targetUser.id)}_${Math.max(currentUser.id, targetUser.id)}`
    localStorage.setItem(chatKey, JSON.stringify(updatedHistory))

    setMessage('')

    // Simular resposta automática após alguns segundos
    setTimeout(() => {
      simulateResponse(updatedHistory)
    }, 2000 + Math.random() * 3000)

    toast.success('Mensagem enviada', {
      description: 'Sua mensagem foi entregue com segurança',
      duration: 2000
    })
  }

  const simulateResponse = (currentHistory) => {
    const responses = [
      'Obrigada por compartilhar isso comigo! 💜',
      'Estou aqui se precisar conversar',
      'Que bom saber! Como você está?',
      'Entendo completamente. Força! 💪',
      'Podemos nos falar mais tarde?',
      'Muito obrigada pelo apoio! 🙏',
      'Isso é muito importante mesmo',
      'Cuidado sempre, ok? 💜'
    ]

    const randomResponse = responses[Math.floor(Math.random() * responses.length)]
    
    const responseMessage = {
      id: `msg_${Date.now()}_response`,
      senderId: targetUser.id,
      senderName: targetUser.name,
      text: randomResponse,
      timestamp: Date.now(),
      read: false
    }

    const newHistory = [...currentHistory, responseMessage]
    setChatHistory(newHistory)

    // Salvar resposta no localStorage
    const chatKey = `chat_${Math.min(currentUser.id, targetUser.id)}_${Math.max(currentUser.id, targetUser.id)}`
    localStorage.setItem(chatKey, JSON.stringify(newHistory))
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) {
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    } else if (diffDays === 1) {
      return 'Ontem'
    } else if (diffDays < 7) {
      return date.toLocaleDateString('pt-BR', { weekday: 'short' })
    } else {
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (!targetUser) return null

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md h-[80vh] p-0 gap-0" aria-describedby="private-chat-description">
        {/* Header do Chat */}
        <DialogHeader className="px-4 py-3 border-b bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onOpenChange(false)}
                className="p-1 h-8 w-8"
                aria-label="Fechar chat"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              
              <Avatar className="w-10 h-10">
                <AvatarImage src={targetUser.profilePhoto} alt={`Foto de ${targetUser.name}`} />
                <AvatarFallback className="bg-purple-500 text-white">
                  {targetUser.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <DialogTitle className="text-base">{targetUser.name}</DialogTitle>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-600">Online agora</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="p-2 h-8 w-8" aria-label="Fazer chamada de voz">
                <Phone className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2 h-8 w-8" aria-label="Fazer videochamada">
                <Video className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2 h-8 w-8" aria-label="Informações do contato">
                <Info className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <DialogDescription id="private-chat-description" className="sr-only">
            Conversa privada com {targetUser.name}. Chat seguro com criptografia ponta a ponta ativa.
          </DialogDescription>
        </DialogHeader>

        {/* Aviso de Segurança */}
        <div className="px-4 py-2 bg-blue-50 border-b">
          <div className="flex items-center space-x-2 text-xs text-blue-700">
            <Shield className="w-3 h-3" />
            <span>Conversa protegida • Criptografia ponta a ponta ativa</span>
          </div>
        </div>

        {/* Mensagens */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {chatHistory.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${
                msg.senderId === currentUser.id 
                  ? 'bg-purple-500 text-white rounded-2xl rounded-br-md' 
                  : 'bg-gray-100 text-gray-900 rounded-2xl rounded-bl-md'
              } px-4 py-2`}>
                <p className="text-sm">{msg.text}</p>
                <div className="flex items-center justify-end space-x-1 mt-1">
                  <span className={`text-xs ${
                    msg.senderId === currentUser.id ? 'text-purple-200' : 'text-gray-500'
                  }`}>
                    {formatTime(msg.timestamp)}
                  </span>
                  {msg.senderId === currentUser.id && (
                    <div className="text-purple-200">
                      {msg.read ? '✓✓' : '✓'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input de Mensagem */}
        <div className="px-4 py-3 border-t bg-white">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="p-2 h-8 w-8" aria-label="Enviar foto">
              <Camera className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2 h-8 w-8" aria-label="Enviar imagem">
              <Image className="w-4 h-4" />
            </Button>
            
            <div className="flex-1 relative">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite uma mensagem..."
                className="rounded-full border-gray-300 focus:border-purple-400 pr-12"
                aria-label="Digite sua mensagem"
              />
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute right-1 top-1 p-1 h-6 w-6"
                aria-label="Escolher emoji"
              >
                <Smile className="w-4 h-4" />
              </Button>
            </div>
            
            <Button 
              onClick={sendMessage}
              disabled={!message.trim()}
              className={`p-2 h-8 w-8 rounded-full ${
                message.trim() 
                  ? 'bg-purple-500 hover:bg-purple-600 text-white' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              aria-label={message.trim() ? "Enviar mensagem" : "Gravar áudio"}
            >
              {message.trim() ? <Send className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}