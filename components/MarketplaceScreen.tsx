import React, { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Search, Filter, Briefcase, Star, TrendingUp, CreditCard, Smartphone, Copy, Clock } from 'lucide-react'
import { ProfessionalCard } from './marketplace/ProfessionalCard'
import { EmergencySupport } from './marketplace/EmergencySupport'
import { categories, professionals } from './marketplace/data'
import { projectId, publicAnonKey } from '../utils/supabase/info'

export function MarketplaceScreen({ user }) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedProfessional, setSelectedProfessional] = useState(null)
  const [selectedTime, setSelectedTime] = useState('')
  const [paymentData, setPaymentData] = useState(null)
  const [paymentStatus, setPaymentStatus] = useState('pending')

  const filteredProfessionals = professionals.filter(prof => {
    const matchesCategory = selectedCategory === 'all' || prof.category === selectedCategory
    const matchesSearch = prof.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prof.specialization.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleSchedule = (professional) => {
    setSelectedProfessional(professional)
    setShowScheduleModal(true)
  }

  const handlePayment = async () => {
    if (!selectedTime) {
      alert('Selecione um horário para continuar')
      return
    }

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-47a9aa23/payments/create-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.access_token}`
        },
        body: JSON.stringify({
          professionalId: selectedProfessional.id,
          serviceType: 'consultation',
          amount: selectedProfessional.discountPrice
        })
      })

      if (response.ok) {
        const payment = await response.json()
        setPaymentData(payment)
        setShowScheduleModal(false)
        setShowPaymentModal(true)
      } else {
        const error = await response.json()
        alert(`Erro ao criar pagamento: ${error.error}`)
      }
    } catch (error) {
      console.log('Payment error:', error)
      alert('Erro ao processar pagamento. Tente novamente.')
    }
  }

  const copyPixCode = () => {
    navigator.clipboard.writeText(paymentData.pixCode)
    alert('✅ Código PIX copiado!')
  }

  const checkPaymentStatus = () => {
    // Simular verificação de pagamento
    setTimeout(() => {
      setPaymentStatus('confirmed')
      alert('✅ Pagamento confirmado! Sua consulta foi agendada.')
      setShowPaymentModal(false)
      resetModals()
    }, 2000)
  }

  const resetModals = () => {
    setShowScheduleModal(false)
    setShowPaymentModal(false)
    setSelectedProfessional(null)
    setSelectedTime('')
    setPaymentData(null)
    setPaymentStatus('pending')
  }

  const handleContact = (professional) => {
    alert(`Iniciando chat com ${professional.name}`)
  }

  const handleEmergencyCall = () => {
    alert('Conectando com profissional de plantão...')
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="professionals" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="professionals">Profissionais</TabsTrigger>
          <TabsTrigger value="emergency">Plantão 24h</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
        </TabsList>

        <TabsContent value="professionals" className="space-y-6">
          {/* Header com busca */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-purple-600" />
                Profissionais Especializadas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Buscar por nome ou especialização..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-1" />
                  Filtros
                </Button>
              </div>

              {/* Categorias */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                  const Icon = category.icon
                  return (
                    <Button
                      key={category.id}
                      size="sm"
                      variant={selectedCategory === category.id ? 'default' : 'outline'}
                      onClick={() => setSelectedCategory(category.id)}
                      className={selectedCategory === category.id ? 'bg-purple-600' : ''}
                    >
                      <Icon className="w-3 h-3 mr-1" />
                      {category.label} ({category.count})
                    </Button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Lista de profissionais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProfessionals.map((professional) => (
              <ProfessionalCard
                key={professional.id}
                professional={professional}
                onSchedule={handleSchedule}
                onContact={handleContact}
              />
            ))}
          </div>

          {filteredProfessionals.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg text-gray-600 mb-2">Nenhuma profissional encontrada</h3>
                <p className="text-gray-500">
                  Tente ajustar os filtros ou busca para encontrar profissionais
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="emergency" className="space-y-6">
          <EmergencySupport onEmergencyCall={handleEmergencyCall} />
          
          <Card>
            <CardHeader>
              <CardTitle>Como Funciona o Plantão 24h</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                    1
                  </div>
                  <h4 className="font-medium text-purple-800 mb-2">Solicitação</h4>
                  <p className="text-sm text-gray-600">
                    Clique no botão de emergência e descreva sua situação
                  </p>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                    2
                  </div>
                  <h4 className="font-medium text-purple-800 mb-2">Conexão</h4>
                  <p className="text-sm text-gray-600">
                    Conectamos você com uma profissional em até 5 minutos
                  </p>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                    3
                  </div>
                  <h4 className="font-medium text-purple-800 mb-2">Atendimento</h4>
                  <p className="text-sm text-gray-600">
                    Receba apoio especializado por chat, áudio ou vídeo
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketplace" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                Marketplace da Comunidade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg text-purple-800 mb-2">Em Breve</h3>
                <p className="text-gray-600 mb-4">
                  Marketplace para usuárias divulgarem seus trabalhos e fortalecerem a rede profissional
                </p>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Cadastrar Interesse
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog de agendamento */}
      <Dialog open={showScheduleModal} onOpenChange={setShowScheduleModal}>
        <DialogContent className="max-w-md" aria-describedby="schedule-dialog-description">
          <DialogHeader>
            <DialogTitle>Agendar Consulta</DialogTitle>
            <DialogDescription id="schedule-dialog-description">
              Agende sua consulta com {selectedProfessional?.name} e efetue o pagamento com desconto exclusivo Ellos.
            </DialogDescription>
          </DialogHeader>
          
          {selectedProfessional && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-800">{selectedProfessional.name}</h3>
                <p className="text-sm text-gray-600">{selectedProfessional.specialization}</p>
              </div>
              
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Valor da consulta:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-medium text-green-600">
                      R$ {selectedProfessional.discountPrice}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      R$ {selectedProfessional.price}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-green-600 mt-1">
                  Desconto exclusivo Ellos aplicado
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Horários disponíveis:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['14:00', '15:00', '16:00', '17:00'].map((time) => (
                    <Button 
                      key={time} 
                      variant={selectedTime === time ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setSelectedTime(time)}
                      className={selectedTime === time ? "bg-purple-600" : ""}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowScheduleModal(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handlePayment}
                  disabled={!selectedTime}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pagar e Confirmar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de Pagamento PIX */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="max-w-md" aria-describedby="payment-dialog-description">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-purple-600" />
              Pagamento PIX
            </DialogTitle>
            <DialogDescription id="payment-dialog-description">
              Complete o pagamento via PIX para confirmar sua consulta com {selectedProfessional?.name}.
            </DialogDescription>
          </DialogHeader>
          
          {paymentData && selectedProfessional && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="font-medium text-gray-800">{selectedProfessional.name}</h3>
                <p className="text-sm text-gray-600">Consulta - {selectedTime}</p>
                <div className="text-2xl text-green-600 mt-2">
                  R$ {paymentData.amount}
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg text-center">
                <h4 className="text-blue-800 mb-2">📱 Pague com PIX</h4>
                <p className="text-sm text-blue-700 mb-3">
                  Escaneie o QR Code ou copie o código abaixo
                </p>
                
                {/* QR Code simulado */}
                <div className="w-32 h-32 bg-white border-2 border-blue-200 mx-auto mb-3 flex items-center justify-center">
                  <div className="w-24 h-24 bg-blue-600 opacity-20"></div>
                </div>
                
                <div className="text-xs text-gray-600 bg-white p-2 rounded border break-all">
                  {paymentData.pixCode.substring(0, 50)}...
                </div>
                
                <Button 
                  onClick={copyPixCode} 
                  variant="outline" 
                  size="sm" 
                  className="mt-2 w-full"
                >
                  <Copy className="w-3 h-3 mr-2" />
                  Copiar Código PIX
                </Button>
              </div>

              <div className="p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-800">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">
                    Pagamento expira em {new Date(paymentData.expiresAt).toLocaleTimeString('pt-BR')}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Button 
                  onClick={checkPaymentStatus}
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={paymentStatus === 'confirmed'}
                >
                  {paymentStatus === 'confirmed' ? '✅ Pagamento Confirmado' : 'Verificar Pagamento'}
                </Button>
                
                <Button 
                  onClick={resetModals}
                  variant="outline" 
                  className="w-full"
                >
                  Cancelar
                </Button>
              </div>

              <div className="text-xs text-gray-500 text-center">
                <p>🔒 Pagamento 100% seguro</p>
                <p>Processado pela plataforma Ellos</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}