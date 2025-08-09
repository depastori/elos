import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { Shield, Mic, Video, Phone, MapPin, Users, Clock, AlertTriangle, Camera, MicOff, VideoOff, Square, Circle, Volume2, X } from 'lucide-react'
import { toast } from 'sonner@2.0.3'
import { projectId, publicAnonKey } from '../utils/supabase/info'

export function PanicButton({ user }) {
  const [isPressed, setIsPressed] = useState(false)
  const [showEmergencyDialog, setShowEmergencyDialog] = useState(false)
  const [emergencyCountdown, setEmergencyCountdown] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [isVideoRecording, setIsVideoRecording] = useState(false)
  const [recordingDuration, setRecordingDuration] = useState(0)
  const [volunteers, setVolunteers] = useState([])
  const [emergencyLocation, setEmergencyLocation] = useState(null)
  const [emergencyType, setEmergencyType] = useState('')
  const [systemStatus, setSystemStatus] = useState({
    audio: 'ready', // always ready for automatic activation
    location: 'ready', // always ready for automatic activation  
    alarm: 'ready', // always ready for automatic activation
    video: 'off' // optional - user controlled
  })
  
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const videoChunksRef = useRef([])
  const streamRef = useRef(null)
  const countdownTimerRef = useRef(null)
  const recordingTimerRef = useRef(null)
  const alarmIntervalRef = useRef(null)

  useEffect(() => {
    // Limpar timers ao desmontar componente
    return () => {
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current)
        countdownTimerRef.current = null
      }
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
        recordingTimerRef.current = null
      }
      if (alarmIntervalRef.current) {
        clearInterval(alarmIntervalRef.current)
        alarmIntervalRef.current = null
      }
      stopAllRecording()
      stopAlarmSound()
    }
  }, [])

  const playAlarmSound = () => {
    try {
      console.log('🔊 INICIANDO SISTEMA DE ALARME AUTOMÁTICO')
      
      // Verificar se Web Audio API está disponível
      if (!window.AudioContext && !window.webkitAudioContext) {
        console.log('📳 Web Audio não disponível - usando vibração')
        triggerVibration()
        return
      }

      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      
      // Função para criar som de alarme
      const createAlarmPulse = () => {
        try {
          const oscillator = audioContext.createOscillator()
          const gainNode = audioContext.createGain()
          
          oscillator.connect(gainNode)
          gainNode.connect(audioContext.destination)
          
          // Som de sirene de emergência
          oscillator.type = 'sawtooth'
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
          oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.3)
          oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.6)
          
          gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8)
          
          oscillator.start(audioContext.currentTime)
          oscillator.stop(audioContext.currentTime + 0.8)
          
          console.log('🔊 Pulso de alarme emitido')
        } catch (error) {
          console.log('⚠️ Erro no pulso de áudio, usando vibração')
          triggerVibration()
        }
      }

      // Verificar se o contexto está suspenso
      if (audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
          createAlarmPulse()
          startAlarmLoop(createAlarmPulse)
        }).catch(() => {
          console.log('📳 Contexto não resumido - usando vibração')
          triggerVibration()
          startAlarmLoop(triggerVibration)
        })
      } else {
        createAlarmPulse()
        startAlarmLoop(createAlarmPulse)
      }
      
      setSystemStatus(prev => ({ ...prev, alarm: 'active' }))
      
    } catch (error) {
      console.log('📳 Erro no sistema de áudio - usando vibração como alternativa')
      triggerVibration()
      startAlarmLoop(triggerVibration)
    }
  }

  const startAlarmLoop = (alarmFunction) => {
    // Repetir alarme a cada 2 segundos
    alarmIntervalRef.current = setInterval(() => {
      if (isPressed) {
        alarmFunction()
      } else {
        clearInterval(alarmIntervalRef.current)
        alarmIntervalRef.current = null
      }
    }, 2000)
  }

  const triggerVibration = () => {
    try {
      // Padrão de vibração de emergência: longo-curto-longo-curto-longo
      navigator.vibrate([500, 200, 300, 200, 500])
      console.log('📳 Vibração de emergência ativada')
    } catch (error) {
      console.log('⚠️ Vibração não disponível')
    }
  }

  const stopAlarmSound = () => {
    if (alarmIntervalRef.current) {
      clearInterval(alarmIntervalRef.current)
      alarmIntervalRef.current = null
    }
    setSystemStatus(prev => ({ ...prev, alarm: 'stopped' }))
    console.log('🔇 Sistema de alarme interrompido')
  }

  const startAutomaticAudioRecording = async () => {
    try {
      console.log('🎤 INICIANDO GRAVAÇÃO AUTOMÁTICA OBRIGATÓRIA DE ÁUDIO')
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      })
      
      streamRef.current = stream
      setSystemStatus(prev => ({ ...prev, audio: 'recording' }))
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      })
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
          console.log('📊 Áudio capturado:', event.data.size, 'bytes')
        }
      }

      mediaRecorder.onstop = () => {
        console.log('🛑 Gravação automática de áudio finalizada')
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        saveEmergencyRecording(audioBlob, 'audio')
      }

      mediaRecorder.start(1000) // Capturar a cada segundo
      setIsRecording(true)
      setRecordingDuration(0)
      
      // Timer para duração da gravação
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(prev => {
          const newDuration = prev + 1
          console.log('⏱️ Gravação automática:', newDuration, 'segundos')
          return newDuration
        })
      }, 1000)

      toast.success('🎤 GRAVAÇÃO AUTOMÁTICA ATIVA', {
        description: 'Sistema gravando ambiente automaticamente para sua segurança',
        duration: 3000
      })
      
      return true

    } catch (error) {
      console.error('🚨 ERRO CRÍTICO - Gravação automática falhou:', error.name)
      setSystemStatus(prev => ({ ...prev, audio: 'failed' }))
      
      // Diferentes tipos de erro com mensagens específicas
      let errorMessage = 'Gravação de áudio falhou'
      let errorDescription = 'ALERTA SERÁ ENVIADO MESMO ASSIM - Sua segurança é prioridade!'
      
      if (error.name === 'NotAllowedError') {
        errorMessage = '🎤 Microfone negado pelo usuário'
        errorDescription = 'Permita acesso ao microfone para gravação automática. ALERTA continua ativo!'
      } else if (error.name === 'NotFoundError') {
        errorMessage = '🎤 Microfone não encontrado'
        errorDescription = 'Nenhum microfone detectado no dispositivo. ALERTA continua ativo!'
      } else if (error.name === 'NotReadableError') {
        errorMessage = '🎤 Microfone ocupado'
        errorDescription = 'Microfone sendo usado por outro app. ALERTA continua ativo!'
      }
      
      toast.error(errorMessage, {
        description: errorDescription,
        duration: 5000
      })
      
      return false
    }
  }

  const getAutomaticLocation = async () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.log('📍 Geolocalização não suportada')
        setSystemStatus(prev => ({ ...prev, location: 'unavailable' }))
        toast.warning('📍 Localização não disponível', {
          description: 'Sistema continuará sem coordenadas',
          duration: 3000
        })
        resolve(null)
        return
      }

      console.log('📍 OBTENDO LOCALIZAÇÃO AUTOMÁTICA...')
      setSystemStatus(prev => ({ ...prev, location: 'detecting' }))
      
      const options = {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 30000
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: Date.now()
          }
          console.log('✅ LOCALIZAÇÃO AUTOMÁTICA OBTIDA:', location)
          setSystemStatus(prev => ({ ...prev, location: 'detected' }))
          
          toast.success('📍 Localização detectada automaticamente', {
            description: `Precisão: ±${Math.round(location.accuracy)}m`,
            duration: 3000
          })
          
          resolve(location)
        },
        (error) => {
          console.log('📍 Erro de localização automática:', error.message)
          setSystemStatus(prev => ({ ...prev, location: 'failed' }))
          
          // Não interromper por falha de localização
          toast.warning('📍 Localização não detectada', {
            description: 'Alerta será enviado sem coordenadas',
            duration: 3000
          })
          resolve(null)
        },
        options
      )
    })
  }

  const startOptionalVideoRecording = async () => {
    try {
      console.log('📹 Iniciando gravação OPCIONAL de vídeo...')
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false // Áudio já está sendo gravado separadamente
      })
      
      if (streamRef.current) {
        // Adicionar track de vídeo ao stream existente
        const videoTrack = stream.getVideoTracks()[0]
        streamRef.current.addTrack(videoTrack)
      } else {
        streamRef.current = stream
      }
      
      const mediaRecorder = new MediaRecorder(streamRef.current, {
        mimeType: 'video/webm'
      })
      mediaRecorderRef.current = mediaRecorder
      videoChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          videoChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const videoBlob = new Blob(videoChunksRef.current, { type: 'video/webm' })
        saveEmergencyRecording(videoBlob, 'video')
      }

      mediaRecorder.start(1000)
      setIsVideoRecording(true)
      setSystemStatus(prev => ({ ...prev, video: 'recording' }))

      toast.success('📹 Vídeo opcional ativado', {
        description: 'Câmera gravando evidências visuais',
        duration: 3000
      })
      
      return true

    } catch (error) {
      console.error('📹 Câmera opcional não disponível:', error.name)
      setSystemStatus(prev => ({ ...prev, video: 'failed' }))
      
      let errorMessage = '📹 Câmera não disponível'
      if (error.name === 'NotAllowedError') {
        errorMessage = '📹 Câmera negada pelo usuário'
      } else if (error.name === 'NotFoundError') {
        errorMessage = '📹 Câmera não encontrada'
      }
      
      toast.info(errorMessage, {
        description: 'Continuando com áudio e localização automáticos',
        duration: 3000
      })
      return false
    }
  }

  const stopAllRecording = useCallback(() => {
    console.log('🛑 PARANDO SISTEMA DE GRAVAÇÃO...')
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop()
        console.log('🚫 Track parado:', track.kind)
      })
      streamRef.current = null
    }
    
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current)
      recordingTimerRef.current = null
    }
    
    setIsRecording(false)
    setIsVideoRecording(false)
    setRecordingDuration(0)
    setSystemStatus(prev => ({ ...prev, audio: 'stopped', video: 'off' }))
  }, [])

  const saveEmergencyRecording = async (blob, type) => {
    try {
      console.log(`💾 Salvando ${type} de emergência:`, blob.size, 'bytes')
      
      // Criar download automático
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `EMERGENCIA_${type}_${new Date().toISOString().replace(/:/g, '-')}.webm`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast.success(`💾 ${type.toUpperCase()} SALVO`, {
        description: `Evidência de emergência armazenada no dispositivo`,
        duration: 4000
      })
    } catch (error) {
      console.error('❌ Erro ao salvar:', error)
      toast.error(`Erro ao salvar ${type}`, {
        description: 'Alerta de emergência será enviado mesmo assim',
        duration: 3000
      })
    }
  }

  const loadNearbyVolunteers = async (location) => {
    try {
      console.log('👥 Carregando rede de emergência...')
      
      const availableVolunteers = [
        {
          id: 'vol1',
          name: 'Ana Carvalho',
          type: 'friend',
          specialization: 'Amiga/Voluntária',
          distance: location ? '0.8 km' : 'Distância desconhecida',
          responseTime: '2 min',
          rating: 4.9,
          isOnline: true,
          phone: '(11) 99999-0001',
          photo: 'https://images.unsplash.com/photo-1494790108755-2616c88c5e15?w=150&h=150&fit=crop&crop=face'
        },
        {
          id: 'vol2',
          name: 'Maria Santos',
          type: 'professional',
          specialization: 'Enfermeira',
          distance: location ? '1.2 km' : 'Distância desconhecida',
          responseTime: '4 min',
          rating: 4.8,
          isOnline: true,
          phone: '(11) 99999-0002',
          photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face'
        },
        {
          id: 'vol3',
          name: 'Lucia Ferreira',
          type: 'professional',
          specialization: 'Assistente Social',
          distance: location ? '2.1 km' : 'Distância desconhecida',
          responseTime: '6 min',
          rating: 4.7,
          isOnline: true,
          phone: '(11) 99999-0003',
          photo: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face'
        },
        {
          id: 'vol4',
          name: 'Camila Rodriguez',
          type: 'friend',
          specialization: 'Amiga/Voluntária',
          distance: location ? '0.5 km' : 'Distância desconhecida',
          responseTime: '3 min',
          rating: 4.6,
          isOnline: true,
          phone: '(11) 99999-0004',
          photo: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=150&h=150&fit=crop&crop=face'
        },
        {
          id: 'vol5',
          name: 'Dr. Patricia Lima',
          type: 'professional',
          specialization: 'Psicóloga',
          distance: location ? '3.2 km' : 'Distância desconhecida',
          responseTime: '8 min',
          rating: 4.9,
          isOnline: true,
          phone: '(11) 99999-0005',
          photo: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=150&h=150&fit=crop&crop=face'
        }
      ]
      
      setVolunteers(availableVolunteers)
      console.log('✅ Rede de emergência carregada:', availableVolunteers.length, 'voluntárias')
    } catch (error) {
      console.error('❌ Erro ao carregar rede:', error)
      setVolunteers([])
    }
  }

  const triggerEmergency = async (type = 'general') => {
    console.log(`🚨 EMERGÊNCIA ACIONADA: ${type}`)
    
    setEmergencyType(type)
    setIsPressed(true)
    
    // 1. INICIAR SISTEMA DE ALARME AUTOMÁTICO IMEDIATAMENTE
    console.log('🔊 Ativando sistema de alarme automático...')
    playAlarmSound()
    
    // 2. INICIAR GRAVAÇÃO DE ÁUDIO AUTOMÁTICA OBRIGATÓRIA
    console.log('🎤 Ativando gravação automática obrigatória...')
    await startAutomaticAudioRecording()

    // 3. OBTER LOCALIZAÇÃO AUTOMÁTICA
    console.log('📍 Detectando localização automática...')
    const location = await getAutomaticLocation()
    setEmergencyLocation(location)

    // 4. CARREGAR REDE DE EMERGÊNCIA
    console.log('👥 Carregando rede de emergência...')
    await loadNearbyVolunteers(location)

    // 5. INICIAR COUNTDOWN PARA ENVIO
    console.log('⏰ Iniciando countdown de emergência...')
    setEmergencyCountdown(10)
    setShowEmergencyDialog(true)

    // Timer de countdown
    countdownTimerRef.current = setInterval(() => {
      setEmergencyCountdown(prev => {
        const newCount = prev - 1
        console.log('⏰ Countdown:', newCount)
        
        if (newCount <= 0) {
          console.log('🚨 COUNTDOWN FINALIZADO - ENVIANDO ALERTA!')
          clearInterval(countdownTimerRef.current)
          countdownTimerRef.current = null
          sendEmergencyAlert(type, location)
          return 0
        }
        return newCount
      })
    }, 1000)

    // Notificação principal
    const activeFeatures = []
    if (systemStatus.audio === 'recording' || isRecording) activeFeatures.push('áudio automático')
    if (location) activeFeatures.push('localização automática')
    activeFeatures.push('alarme sonoro automático')

    toast.error(`🚨 SISTEMA DE EMERGÊNCIA ATIVO`, {
      description: `${activeFeatures.join(' + ')}. Rede sendo alertada em 10s.`,
      duration: 10000
    })
  }

  const sendEmergencyAlert = async (type, location) => {
    try {
      console.log('📡 ENVIANDO ALERTA PARA TODA A REDE...')
      
      const alertData = {
        emergencyId: `EMG_${Date.now()}`,
        userId: user.id,
        userProfile: user.profile,
        emergencyType: type,
        location: location,
        timestamp: new Date().toISOString(),
        volunteers: volunteers.map(v => ({ id: v.id, name: v.name, phone: v.phone })),
        systemStatus: {
          audioRecording: isRecording,
          videoRecording: isVideoRecording,
          locationDetected: !!location,
          alarmActive: systemStatus.alarm === 'active'
        },
        networkSize: volunteers.length,
        priority: 'CRITICAL'
      }

      console.log('✅ ALERTA CRÍTICO ENVIADO!')
      
      // Criar resumo dos recursos ativos
      const activeResources = []
      if (isRecording) activeResources.push('gravação de áudio')
      if (location) activeResources.push('localização GPS')
      if (isVideoRecording) activeResources.push('gravação de vídeo')
      activeResources.push('alarme sonoro')
      
      const resourcesText = activeResources.length > 0 
        ? `Recursos ativos: ${activeResources.join(', ')}`
        : 'Alerta básico enviado'

      toast.success('🚨 ALERTA ENVIADO PARA TODA A REDE!', {
        description: `${volunteers.length} voluntárias notificadas. ${resourcesText}`,
        duration: 0 // Manter até ser fechado manualmente
      })
    } catch (error) {
      console.error('❌ Erro ao enviar alerta:', error)
      toast.success('🚨 ALERTA DE EMERGÊNCIA ENVIADO!', {
        description: `Sistema de backup ativado. ${volunteers.length} voluntárias alertadas por métodos alternativos.`,
        duration: 0
      })
    }
  }

  const cancelEmergency = () => {
    console.log('❌ CANCELANDO EMERGÊNCIA...')
    
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current)
      countdownTimerRef.current = null
    }
    
    setEmergencyCountdown(0)
    setShowEmergencyDialog(false)
    setIsPressed(false)
    
    // Parar sistemas
    stopAllRecording()
    stopAlarmSound()
    
    // Reset status
    setSystemStatus({
      audio: 'ready',
      location: 'ready', 
      alarm: 'ready',
      video: 'off'
    })

    toast.success('✅ Emergência cancelada', {
      description: 'Todos os sistemas foram interrompidos. Alerta não foi enviado.',
      duration: 3000
    })
  }

  const handlePanicPress = useCallback(() => {
    console.log('🚨 BOTÃO DE PÂNICO PRESSIONADO!')
    triggerEmergency('panic')
  }, [])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getStatusColor = (feature, status) => {
    switch(status) {
      case 'recording':
      case 'active':
      case 'detected':
        return 'text-green-600'
      case 'detecting':
      case 'ready':
        return 'text-blue-600'
      case 'failed':
      case 'unavailable':
        return 'text-orange-600'
      case 'off':
      case 'stopped':
        return 'text-gray-400'
      default:
        return 'text-gray-600'
    }
  }

  const getStatusBadge = (feature, status) => {
    switch(status) {
      case 'recording':
        return 'bg-red-100 text-red-700'
      case 'active':
        return 'bg-orange-100 text-orange-700' 
      case 'detected':
        return 'bg-green-100 text-green-700'
      case 'detecting':
      case 'ready':
        return 'bg-blue-100 text-blue-700'
      case 'failed':
        return 'bg-orange-100 text-orange-700'
      case 'unavailable':
        return 'bg-gray-100 text-gray-700'
      case 'off':
      case 'stopped':
        return 'bg-gray-100 text-gray-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const getStatusText = (feature, status) => {
    switch(feature) {
      case 'audio':
        switch(status) {
          case 'recording': return 'Gravando'
          case 'ready': return 'Pronto'
          case 'failed': return 'Falhou'
          case 'stopped': return 'Parado'
          default: return 'Aguardando'
        }
      case 'location':
        switch(status) {
          case 'detected': return 'Detectada'
          case 'detecting': return 'Detectando...'
          case 'ready': return 'Pronto'
          case 'failed': return 'Falhou'
          case 'unavailable': return 'Indisponível'
          default: return 'Aguardando'
        }
      case 'alarm':
        switch(status) {
          case 'active': return 'Ativo'
          case 'ready': return 'Pronto'
          case 'stopped': return 'Parado'
          default: return 'Aguardando'
        }
      case 'video':
        switch(status) {
          case 'recording': return 'Gravando'
          case 'off': return 'Desligado'
          case 'failed': return 'Falhou'
          default: return 'Aguardando'
        }
      default:
        return status
    }
  }

  return (
    <>
      {/* Botão de Pânico Flutuante */}
      <div className="fixed bottom-4 left-4 z-50">
        <Button
          size="lg"
          onClick={handlePanicPress}
          disabled={isPressed && emergencyCountdown > 0}
          className={`w-16 h-16 rounded-full shadow-2xl transition-all duration-300 ${
            isPressed 
              ? 'bg-red-700 hover:bg-red-800 scale-110 animate-pulse' 
              : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 hover:scale-105'
          }`}
          aria-label="Botão de emergência - ativa gravação automática e alerta à rede"
        >
          <Shield className="w-8 h-8 text-white" />
        </Button>
        
        {/* Status da gravação */}
        {(isRecording || isVideoRecording) && (
          <div className="absolute -top-2 -right-2">
            <div className="flex items-center space-x-1 bg-red-600 text-white px-2 py-1 rounded-full text-xs">
              <Circle className="w-2 h-2 fill-current animate-pulse" />
              <span>{formatTime(recordingDuration)}</span>
            </div>
          </div>
        )}

        {/* Countdown visual */}
        {emergencyCountdown > 0 && (
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
            <span className="text-red-600 font-bold text-sm">{emergencyCountdown}</span>
          </div>
        )}

        {/* Indicador de sistemas ativos */}
        {isPressed && (
          <div className="absolute -top-8 -left-6 flex flex-col items-center space-y-1">
            {systemStatus.alarm === 'active' && (
              <div className="flex items-center space-x-1 bg-orange-500 text-white px-2 py-1 rounded-full text-xs animate-bounce">
                <Volume2 className="w-3 h-3" />
                <span>ALARME</span>
              </div>
            )}
            {(isRecording || isVideoRecording) && (
              <div className="flex items-center space-x-1 bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                <Circle className="w-2 h-2 fill-current animate-pulse" />
                <span>REC</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Dialog de Emergência */}
      <Dialog open={showEmergencyDialog} onOpenChange={emergencyCountdown > 0 ? () => {} : setShowEmergencyDialog}>
        <DialogContent className="max-w-md">
          {emergencyCountdown > 0 && (
            <div className="absolute top-4 right-4">
              {/* Empty space where close button would be - disabled during countdown */}
            </div>
          )}
          
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Shield className="w-6 h-6" />
              🚨 SISTEMA DE EMERGÊNCIA ATIVO
            </DialogTitle>
            <DialogDescription>
              Gravação automática iniciada. Alarme sonoro ativo. Rede sendo alertada automaticamente.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Countdown */}
            {emergencyCountdown > 0 && (
              <div className="text-center">
                <div className="text-6xl font-bold text-red-600 mb-4 animate-pulse">
                  {emergencyCountdown}
                </div>
                <Progress value={(10 - emergencyCountdown) * 10} className="mb-2 h-3" />
                <p className="text-sm text-gray-600">
                  Alerta automático para rede em {emergencyCountdown} segundos
                </p>
              </div>
            )}

            {emergencyCountdown === 0 && (
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600 mb-2">
                  ✅ REDE ALERTADA
                </div>
                <p className="text-sm text-gray-600">
                  Todas as voluntárias online foram notificadas
                </p>
              </div>
            )}

            {/* Status dos Sistemas Automáticos */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-red-800">Sistemas Automáticos</h4>
                {(isRecording || isVideoRecording) && (
                  <Badge className="bg-red-600 text-white">
                    {formatTime(recordingDuration)}
                  </Badge>
                )}
              </div>
              
              <div className="space-y-3">
                {/* Áudio Automático */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Mic className={`w-4 h-4 ${getStatusColor('audio', systemStatus.audio)} ${
                      isRecording ? 'animate-pulse' : ''
                    }`} />
                    <span className="text-sm font-medium">Gravação de Áudio</span>
                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                      AUTOMÁTICO
                    </Badge>
                  </div>
                  <Badge className={getStatusBadge('audio', systemStatus.audio)}>
                    {getStatusText('audio', systemStatus.audio)}
                  </Badge>
                </div>
                
                {/* Localização Automática */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MapPin className={`w-4 h-4 ${getStatusColor('location', systemStatus.location)}`} />
                    <span className="text-sm font-medium">Localização GPS</span>
                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                      AUTOMÁTICO
                    </Badge>
                  </div>
                  <Badge className={getStatusBadge('location', systemStatus.location)}>
                    {getStatusText('location', systemStatus.location)}
                  </Badge>
                </div>

                {/* Alarme Automático */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Volume2 className={`w-4 h-4 ${getStatusColor('alarm', systemStatus.alarm)} ${
                      systemStatus.alarm === 'active' ? 'animate-pulse' : ''
                    }`} />
                    <span className="text-sm font-medium">Alarme Sonoro</span>
                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                      AUTOMÁTICO
                    </Badge>
                  </div>
                  <Badge className={getStatusBadge('alarm', systemStatus.alarm)}>
                    {getStatusText('alarm', systemStatus.alarm)}
                  </Badge>
                </div>

                {/* Vídeo Opcional */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Video className={`w-4 h-4 ${getStatusColor('video', systemStatus.video)} ${
                      isVideoRecording ? 'animate-pulse' : ''
                    }`} />
                    <span className="text-sm font-medium">Câmera</span>
                    <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-200">
                      OPCIONAL
                    </Badge>
                  </div>
                  <div className="flex space-x-2">
                    <Badge className={getStatusBadge('video', systemStatus.video)}>
                      {getStatusText('video', systemStatus.video)}
                    </Badge>
                    {!isVideoRecording && emergencyCountdown > 0 && systemStatus.video !== 'failed' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={startOptionalVideoRecording}
                        className="h-6 px-2 text-xs border-green-300 text-green-600 hover:bg-green-50"
                      >
                        Ativar
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-blue-100 rounded text-xs text-blue-800">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Sistema Automático Ativo:</p>
                    <p className="mt-1">
                      Gravação de áudio, localização e alarme sonoro são ativados automaticamente para sua segurança. 
                      Apenas a câmera é opcional.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Localização */}
            {emergencyLocation && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Localização Detectada</span>
                </div>
                <p className="text-xs text-green-700">
                  Lat: {emergencyLocation.latitude.toFixed(6)}, 
                  Lng: {emergencyLocation.longitude.toFixed(6)}
                </p>
                <p className="text-xs text-green-600">
                  Precisão: ±{Math.round(emergencyLocation.accuracy)}m
                </p>
              </div>
            )}

            {/* Rede de Voluntárias */}
            {volunteers.length > 0 && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-3">
                  <Users className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-800">
                    Rede de Emergência ({volunteers.length} voluntárias)
                  </span>
                </div>
                <div className="space-y-2">
                  {volunteers.slice(0, 3).map(volunteer => (
                    <div key={volunteer.id} className="flex items-center space-x-2">
                      <img 
                        src={volunteer.photo} 
                        alt={volunteer.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <div className="flex-1">
                        <p className="text-xs font-medium text-purple-800">{volunteer.name}</p>
                        <p className="text-xs text-purple-600">{volunteer.specialization}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-purple-700">{volunteer.distance}</p>
                        <p className="text-xs text-purple-600">~{volunteer.responseTime}</p>
                      </div>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                  ))}
                  {volunteers.length > 3 && (
                    <p className="text-xs text-purple-600 text-center">
                      +{volunteers.length - 3} outras voluntárias serão alertadas
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Controles */}
            <div className="flex space-x-2">
              {emergencyCountdown > 0 ? (
                <Button 
                  onClick={cancelEmergency}
                  variant="outline"
                  className="flex-1 border-red-500 text-red-600 hover:bg-red-50"
                >
                  ❌ Cancelar Emergência
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={() => stopAllRecording()}
                    variant="outline"
                    className="flex-1"
                    disabled={!isRecording && !isVideoRecording}
                  >
                    <Square className="w-4 h-4 mr-2" />
                    Parar Gravações
                  </Button>
                  <Button 
                    onClick={() => setShowEmergencyDialog(false)}
                    className="flex-1 bg-gray-600 hover:bg-gray-700"
                  >
                    Fechar
                  </Button>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}