import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Checkbox } from './ui/checkbox'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'
import { 
  AlertTriangle, User, MapPin, Calendar, Clock, Phone, 
  FileText, Camera, Upload, X, CheckCircle2, Plus
} from 'lucide-react'
import { toast } from 'sonner@2.0.3'
import { projectId, publicAnonKey } from '../utils/supabase/info'

export function ReportAggressor({ onClose, user }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Dados do agressor
    aggressorData: {
      name: '',
      cpf: '',
      phone: '',
      age: '',
      physicalDescription: '',
      address: '',
      profession: '',
      workplace: '',
      socialMedia: ''
    },
    // Dados do incidente
    incidentData: {
      date: '',
      isApproximateDate: false,
      time: '',
      isApproximateTime: false,
      location: '',
      violenceType: '',
      description: '',
      urgency: 'media',
      witnesses: '',
      context: ''
    },
    // Evidências
    evidence: []
  })

  const [newEvidence, setNewEvidence] = useState({
    type: '',
    description: '',
    url: ''
  })

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const addEvidence = () => {
    if (newEvidence.type && newEvidence.description) {
      setFormData(prev => ({
        ...prev,
        evidence: [...prev.evidence, { ...newEvidence, id: Date.now() }]
      }))
      setNewEvidence({ type: '', description: '', url: '' })
    }
  }

  const removeEvidence = (id) => {
    setFormData(prev => ({
      ...prev,
      evidence: prev.evidence.filter(e => e.id !== id)
    }))
  }

  const submitReport = async () => {
    try {
      // Validações básicas
      if (!formData.aggressorData.name) {
        toast.error('Nome do agressor é obrigatório')
        return
      }

      if (!formData.incidentData.description) {
        toast.error('Descrição do incidente é obrigatória')
        return
      }

      const reportData = {
        type: 'aggressor_report',
        aggressorData: formData.aggressorData,
        incidentData: {
          ...formData.incidentData,
          // Combinar data e hora se fornecidas
          date: formData.incidentData.date ? 
            new Date(`${formData.incidentData.date}T${formData.incidentData.time || '12:00'}`).toISOString() :
            new Date().toISOString()
        },
        evidence: formData.evidence,
        incidentDate: formData.incidentData.date,
        incidentLocation: formData.incidentData.location,
        isApproximateDate: formData.incidentData.isApproximateDate
      }

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-47a9aa23/reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.access_token || publicAnonKey}`
        },
        body: JSON.stringify(reportData)
      })

      if (response.ok) {
        toast.success('Denúncia registrada com sucesso!')
        onClose()
      } else {
        toast.error('Erro ao registrar denúncia')
      }
    } catch (error) {
      console.log('Erro ao enviar denúncia:', error)
      toast.error('Erro ao registrar denúncia')
    }
  }

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step <= currentStep 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-200 text-gray-500'
            }`}>
              {step < currentStep ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                step
              )}
            </div>
            {step < 3 && (
              <div className={`w-12 h-0.5 mx-2 ${
                step < currentStep ? 'bg-red-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  )

  const Step1 = () => (
    <Card className="bg-gradient-to-br from-white to-red-50/30 shadow-xl border-0">
      <CardHeader>
        <CardTitle className="text-red-800 flex items-center gap-2">
          <User className="w-5 h-5" />
          Dados do Agressor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm text-red-700 mb-1">Nome Completo *</label>
          <Input
            value={formData.aggressorData.name}
            onChange={(e) => handleInputChange('aggressorData', 'name', e.target.value)}
            placeholder="Nome completo do agressor"
            className="rounded-xl border-red-200"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-red-700 mb-1">CPF</label>
            <Input
              value={formData.aggressorData.cpf}
              onChange={(e) => handleInputChange('aggressorData', 'cpf', e.target.value)}
              placeholder="000.000.000-00"
              className="rounded-xl border-red-200"
            />
          </div>
          <div>
            <label className="block text-sm text-red-700 mb-1">Telefone</label>
            <Input
              value={formData.aggressorData.phone}
              onChange={(e) => handleInputChange('aggressorData', 'phone', e.target.value)}
              placeholder="(00) 00000-0000"
              className="rounded-xl border-red-200"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-red-700 mb-1">Idade (aproximada)</label>
          <Input
            type="number"
            value={formData.aggressorData.age}
            onChange={(e) => handleInputChange('aggressorData', 'age', e.target.value)}
            placeholder="Idade aproximada"
            className="rounded-xl border-red-200"
          />
        </div>

        <div>
          <label className="block text-sm text-red-700 mb-1">Características Físicas</label>
          <Textarea
            value={formData.aggressorData.physicalDescription}
            onChange={(e) => handleInputChange('aggressorData', 'physicalDescription', e.target.value)}
            placeholder="Altura, peso, cor dos olhos, cabelo, tatuagens, cicatrizes, etc."
            rows={3}
            className="rounded-xl border-red-200"
          />
        </div>

        <div>
          <label className="block text-sm text-red-700 mb-1">Endereço (se conhecido)</label>
          <Input
            value={formData.aggressorData.address}
            onChange={(e) => handleInputChange('aggressorData', 'address', e.target.value)}
            placeholder="Endereço completo"
            className="rounded-xl border-red-200"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-red-700 mb-1">Profissão</label>
            <Input
              value={formData.aggressorData.profession}
              onChange={(e) => handleInputChange('aggressorData', 'profession', e.target.value)}
              placeholder="Profissão conhecida"
              className="rounded-xl border-red-200"
            />
          </div>
          <div>
            <label className="block text-sm text-red-700 mb-1">Local de Trabalho</label>
            <Input
              value={formData.aggressorData.workplace}
              onChange={(e) => handleInputChange('aggressorData', 'workplace', e.target.value)}
              placeholder="Empresa/Local"
              className="rounded-xl border-red-200"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-red-700 mb-1">Redes Sociais</label>
          <Textarea
            value={formData.aggressorData.socialMedia}
            onChange={(e) => handleInputChange('aggressorData', 'socialMedia', e.target.value)}
            placeholder="Instagram, Facebook, TikTok, etc."
            rows={2}
            className="rounded-xl border-red-200"
          />
        </div>
      </CardContent>
    </Card>
  )

  const Step2 = () => (
    <Card className="bg-gradient-to-br from-white to-red-50/30 shadow-xl border-0">
      <CardHeader>
        <CardTitle className="text-red-800 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Dados do Incidente
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-red-700 mb-1">Data do Ocorrido</label>
            <Input
              type="date"
              value={formData.incidentData.date}
              onChange={(e) => handleInputChange('incidentData', 'date', e.target.value)}
              className="rounded-xl border-red-200"
            />
            <div className="flex items-center space-x-2 mt-2">
              <Checkbox
                id="approximateDate"
                checked={formData.incidentData.isApproximateDate}
                onCheckedChange={(checked) => handleInputChange('incidentData', 'isApproximateDate', checked)}
              />
              <label htmlFor="approximateDate" className="text-sm text-gray-600">
                Data aproximada
              </label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-red-700 mb-1">Horário (se lembrar)</label>
            <Input
              type="time"
              value={formData.incidentData.time}
              onChange={(e) => handleInputChange('incidentData', 'time', e.target.value)}
              className="rounded-xl border-red-200"
            />
            <div className="flex items-center space-x-2 mt-2">
              <Checkbox
                id="approximateTime"
                checked={formData.incidentData.isApproximateTime}
                onCheckedChange={(checked) => handleInputChange('incidentData', 'isApproximateTime', checked)}
              />
              <label htmlFor="approximateTime" className="text-sm text-gray-600">
                Horário aproximado
              </label>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm text-red-700 mb-1">Local do Ocorrido *</label>
          <Input
            value={formData.incidentData.location}
            onChange={(e) => handleInputChange('incidentData', 'location', e.target.value)}
            placeholder="Endereço, bairro ou ponto de referência"
            className="rounded-xl border-red-200"
          />
        </div>

        <div>
          <label className="block text-sm text-red-700 mb-1">Tipo de Violência *</label>
          <Select
            value={formData.incidentData.violenceType}
            onValueChange={(value) => handleInputChange('incidentData', 'violenceType', value)}
          >
            <SelectTrigger className="rounded-xl border-red-200">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fisica">Violência Física</SelectItem>
              <SelectItem value="psicologica">Violência Psicológica</SelectItem>
              <SelectItem value="sexual">Violência Sexual</SelectItem>
              <SelectItem value="moral">Violência Moral</SelectItem>
              <SelectItem value="patrimonial">Violência Patrimonial</SelectItem>
              <SelectItem value="assedio">Assédio</SelectItem>
              <SelectItem value="perseguicao">Perseguição/Stalking</SelectItem>
              <SelectItem value="ameaca">Ameaça</SelectItem>
              <SelectItem value="outro">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm text-red-700 mb-1">Nível de Urgência</label>
          <Select
            value={formData.incidentData.urgency}
            onValueChange={(value) => handleInputChange('incidentData', 'urgency', value)}
          >
            <SelectTrigger className="rounded-xl border-red-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="baixa">Baixa - Sem risco imediato</SelectItem>
              <SelectItem value="media">Média - Risco moderado</SelectItem>
              <SelectItem value="alta">Alta - Risco elevado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm text-red-700 mb-1">Descrição do Ocorrido *</label>
          <Textarea
            value={formData.incidentData.description}
            onChange={(e) => handleInputChange('incidentData', 'description', e.target.value)}
            placeholder="Descreva detalhadamente o que aconteceu..."
            rows={4}
            className="rounded-xl border-red-200"
          />
        </div>

        <div>
          <label className="block text-sm text-red-700 mb-1">Testemunhas</label>
          <Textarea
            value={formData.incidentData.witnesses}
            onChange={(e) => handleInputChange('incidentData', 'witnesses', e.target.value)}
            placeholder="Nome de pessoas que presenciaram ou podem confirmar"
            rows={2}
            className="rounded-xl border-red-200"
          />
        </div>

        <div>
          <label className="block text-sm text-red-700 mb-1">Contexto/Relação</label>
          <Textarea
            value={formData.incidentData.context}
            onChange={(e) => handleInputChange('incidentData', 'context', e.target.value)}
            placeholder="Qual sua relação com o agressor? Como se conheceram?"
            rows={2}
            className="rounded-xl border-red-200"
          />
        </div>
      </CardContent>
    </Card>
  )

  const Step3 = () => (
    <Card className="bg-gradient-to-br from-white to-red-50/30 shadow-xl border-0">
      <CardHeader>
        <CardTitle className="text-red-800 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Evidências (Opcional)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
          <h4 className="text-blue-800 mb-2">ℹ️ Tipos de Evidências</h4>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Screenshots de conversas</li>
            <li>• Fotos de lesões ou danos</li>
            <li>• Vídeos ou áudios</li>
            <li>• Documentos (B.O., laudos médicos)</li>
            <li>• Mensagens de texto ou redes sociais</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="text-red-700">Adicionar Evidência</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-red-700 mb-1">Tipo</label>
              <Select
                value={newEvidence.type}
                onValueChange={(value) => setNewEvidence({ ...newEvidence, type: value })}
              >
                <SelectTrigger className="rounded-xl border-red-200">
                  <SelectValue placeholder="Tipo de evidência" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="screenshot">Screenshot/Captura</SelectItem>
                  <SelectItem value="foto">Foto</SelectItem>
                  <SelectItem value="video">Vídeo</SelectItem>
                  <SelectItem value="audio">Áudio</SelectItem>
                  <SelectItem value="documento">Documento</SelectItem>
                  <SelectItem value="mensagem">Mensagem de texto</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm text-red-700 mb-1">URL/Link (opcional)</label>
              <Input
                value={newEvidence.url}
                onChange={(e) => setNewEvidence({ ...newEvidence, url: e.target.value })}
                placeholder="Link da evidência"
                className="rounded-xl border-red-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-red-700 mb-1">Descrição</label>
            <Textarea
              value={newEvidence.description}
              onChange={(e) => setNewEvidence({ ...newEvidence, description: e.target.value })}
              placeholder="Descreva a evidência e sua relevância"
              rows={2}
              className="rounded-xl border-red-200"
            />
          </div>

          <Button
            onClick={addEvidence}
            disabled={!newEvidence.type || !newEvidence.description}
            className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Evidência
          </Button>
        </div>

        {formData.evidence.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-red-700">Evidências Adicionadas ({formData.evidence.length})</h4>
            {formData.evidence.map((evidence) => (
              <div key={evidence.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                <div>
                  <Badge variant="outline" className="mr-2">{evidence.type}</Badge>
                  <span className="text-sm text-gray-700">{evidence.description}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeEvidence(evidence.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
          <h4 className="text-yellow-800 mb-2">⚠️ Importante</h4>
          <p className="text-yellow-700 text-sm">
            • Não compartilhe evidências que possam comprometer sua segurança
            • Mantenha cópias seguras de todas as evidências
            • Procure sempre o auxílio de profissionais especializadas
          </p>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl text-red-800">Denunciar Agressor</h1>
          <p className="text-gray-600">Todas as informações são confidenciais e anônimas</p>
        </div>
        <Button variant="outline" onClick={onClose} className="rounded-xl">
          <X className="w-4 h-4 mr-2" />
          Cancelar
        </Button>
      </div>

      <StepIndicator />

      {/* Content */}
      <div className="mb-8">
        {currentStep === 1 && <Step1 />}
        {currentStep === 2 && <Step2 />}
        {currentStep === 3 && <Step3 />}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          className="rounded-xl"
        >
          Anterior
        </Button>

        <div className="flex space-x-3">
          {currentStep < 3 ? (
            <Button
              onClick={() => setCurrentStep(Math.min(3, currentStep + 1))}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
            >
              Próximo
            </Button>
          ) : (
            <Button
              onClick={submitReport}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Finalizar Denúncia
            </Button>
          )}
        </div>
      </div>

      {/* Safety notice */}
      <div className="mt-8 p-4 bg-purple-50 rounded-xl border border-purple-200">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-purple-600" />
          <div>
            <h4 className="text-purple-800">Em Situação de Perigo Imediato</h4>
            <p className="text-purple-700 text-sm">
              Ligue 190 (Polícia Militar) ou 180 (Central de Atendimento à Mulher).
              Use o botão de pânico do app para alertar voluntárias próximas.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}