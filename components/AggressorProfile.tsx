import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Separator } from './ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Checkbox } from './ui/checkbox'
import { 
  User, MapPin, AlertTriangle, Calendar, Clock, FileText, 
  Edit, Save, X, Plus, Phone, IdCard, Briefcase, Home, Users2, MessageSquare
} from 'lucide-react'
import { toast } from 'sonner@2.0.3'
import { projectId, publicAnonKey } from '../utils/supabase/info'

export function AggressorProfile({ aggressor, onClose, user }) {
  const [activeTab, setActiveTab] = useState('info')
  const [isEditingInfo, setIsEditingInfo] = useState(false)
  const [editForm, setEditForm] = useState({})
  const [communityReports, setCommunityReports] = useState([])
  const [showAddReportDialog, setShowAddReportDialog] = useState(false)
  const [showAddInfoDialog, setShowAddInfoDialog] = useState(false)
  const [newReport, setNewReport] = useState({
    content: '',
    location: '',
    date: '',
    isApproximate: false
  })
  const [newInfo, setNewInfo] = useState({
    field: '',
    value: ''
  })

  useEffect(() => {
    if (aggressor) {
      setEditForm({ ...aggressor })
      loadCommunityReports()
    }
  }, [aggressor])

  const loadCommunityReports = async () => {
    try {
      // Simular carregamento de relatos da comunidade
      // Em um sistema real, isso viria do backend
      const mockReports = [
        {
          id: 1,
          type: 'community_report',
          content: 'Vi este homem assediando mulheres na estação de metrô várias vezes.',
          location: 'Estação Vila Madalena',
          date: '2024-01-15',
          userId: 'anon_user_1',
          verified: true
        },
        {
          id: 2,
          type: 'community_report', 
          content: 'Ele trabalha na empresa X e já tentou me seguir até em casa.',
          location: 'Região central',
          date: '2024-01-20',
          userId: 'anon_user_2',
          verified: false
        }
      ]
      setCommunityReports(mockReports)
    } catch (error) {
      console.log('Erro ao carregar relatos da comunidade:', error)
    }
  }

  const updateAggressorInfo = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-47a9aa23/aggressors/${encodeURIComponent(aggressor.name)}/${encodeURIComponent(aggressor.cpf || 'no_cpf')}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.access_token || publicAnonKey}`
        },
        body: JSON.stringify(editForm)
      })

      if (response.ok) {
        toast.success('Informações atualizadas com sucesso!')
        setIsEditingInfo(false)
        // Atualizar dados localmente
        Object.assign(aggressor, editForm)
      } else {
        toast.error('Erro ao atualizar informações')
      }
    } catch (error) {
      console.log('Erro ao atualizar agressor:', error)
      toast.error('Erro ao atualizar informações')
    }
  }

  const addCommunityReport = async () => {
    if (!newReport.content || !newReport.location) {
      toast.error('Preencha o relato e o local')
      return
    }

    try {
      // Simular adição de relato da comunidade
      const reportId = Date.now()
      const report = {
        id: reportId,
        type: 'community_report',
        content: newReport.content,
        location: newReport.location,
        date: newReport.date || new Date().toISOString().split('T')[0],
        isApproximate: newReport.isApproximate,
        userId: user.id,
        verified: false,
        createdAt: new Date().toISOString()
      }

      setCommunityReports(prev => [report, ...prev])
      setNewReport({ content: '', location: '', date: '', isApproximate: false })
      setShowAddReportDialog(false)
      toast.success('Relato adicionado! Será verificado pela moderação.')
    } catch (error) {
      console.log('Erro ao adicionar relato:', error)
      toast.error('Erro ao adicionar relato')
    }
  }

  const addMissingInfo = async () => {
    if (!newInfo.field || !newInfo.value) {
      toast.error('Selecione o campo e digite a informação')
      return
    }

    try {
      const updatedForm = { ...editForm, [newInfo.field]: newInfo.value }
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-47a9aa23/aggressors/${encodeURIComponent(aggressor.name)}/${encodeURIComponent(aggressor.cpf || 'no_cpf')}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.access_token || publicAnonKey}`
        },
        body: JSON.stringify({ [newInfo.field]: newInfo.value })
      })

      if (response.ok) {
        Object.assign(aggressor, { [newInfo.field]: newInfo.value })
        setEditForm(updatedForm)
        setNewInfo({ field: '', value: '' })
        setShowAddInfoDialog(false)
        toast.success('Informação adicionada com sucesso!')
      } else {
        toast.error('Erro ao adicionar informação')
      }
    } catch (error) {
      console.log('Erro ao adicionar informação:', error)
      toast.error('Erro ao adicionar informação')
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Data não informada'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    } catch {
      return 'Data inválida'
    }
  }

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'alta': return 'bg-red-100 text-red-800 border-red-200'
      case 'media': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'baixa': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  // Helper function to safely render physical description
  const renderPhysicalDescription = (description) => {
    if (!description) return 'Não informado'
    
    if (typeof description === 'string') {
      return description
    }
    
    if (typeof description === 'object') {
      // Convert object to readable string
      const parts = []
      if (description.height) parts.push(`Altura: ${description.height}`)
      if (description.build) parts.push(`Físico: ${description.build}`)
      if (description.hairColor) parts.push(`Cabelo: ${description.hairColor}`)
      if (description.eyeColor) parts.push(`Olhos: ${description.eyeColor}`)
      if (description.skinColor) parts.push(`Pele: ${description.skinColor}`)
      if (description.age) parts.push(`Idade: ${description.age}`)
      if (description.distinctiveMarks) parts.push(`Marcas distintivas: ${description.distinctiveMarks}`)
      
      return parts.length > 0 ? parts.join(', ') : 'Não informado'
    }
    
    return String(description)
  }

  // Helper function to get physical description for editing
  const getPhysicalDescriptionForEdit = (description) => {
    if (!description) return ''
    if (typeof description === 'string') return description
    if (typeof description === 'object') {
      return renderPhysicalDescription(description)
    }
    return String(description)
  }

  const InfoTab = () => (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-white to-red-50/30 shadow-lg border-0">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-red-800 flex items-center gap-2">
            <User className="w-5 h-5" />
            Informações Pessoais
          </CardTitle>
          <div className="flex gap-2">
            <Dialog open={showAddInfoDialog} onOpenChange={setShowAddInfoDialog}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-green-200 hover:bg-green-50"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Completar Info
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Informação Faltante</DialogTitle>
                  <DialogDescription>
                    Ajude a completar o perfil deste agressor com informações que você conhece.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Campo</label>
                    <Select value={newInfo.field} onValueChange={(value) => setNewInfo({ ...newInfo, field: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o campo" />
                      </SelectTrigger>
                      <SelectContent>
                        {!aggressor.cpf && <SelectItem value="cpf">CPF</SelectItem>}
                        {!aggressor.phone && <SelectItem value="phone">Telefone</SelectItem>}
                        {!aggressor.age && <SelectItem value="age">Idade</SelectItem>}
                        {!aggressor.address && <SelectItem value="address">Endereço</SelectItem>}
                        {!aggressor.profession && <SelectItem value="profession">Profissão</SelectItem>}
                        {!aggressor.workplace && <SelectItem value="workplace">Local de Trabalho</SelectItem>}
                        {!aggressor.physicalDescription && <SelectItem value="physicalDescription">Características Físicas</SelectItem>}
                        {!aggressor.socialMedia && <SelectItem value="socialMedia">Redes Sociais</SelectItem>}
                        <SelectItem value="notes">Observações Adicionais</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Informação</label>
                    {newInfo.field === 'physicalDescription' || newInfo.field === 'notes' || newInfo.field === 'socialMedia' ? (
                      <Textarea
                        value={newInfo.value}
                        onChange={(e) => setNewInfo({ ...newInfo, value: e.target.value })}
                        placeholder="Digite a informação..."
                        rows={3}
                      />
                    ) : (
                      <Input
                        value={newInfo.value}
                        onChange={(e) => setNewInfo({ ...newInfo, value: e.target.value })}
                        placeholder="Digite a informação..."
                      />
                    )}
                  </div>
                  
                  <div className="flex space-x-2 pt-4">
                    <Button 
                      onClick={addMissingInfo}
                      className="bg-green-600 hover:bg-green-700 text-white rounded-xl"
                    >
                      Adicionar
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowAddInfoDialog(false)}
                      className="rounded-xl"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditingInfo(!isEditingInfo)}
              className="rounded-xl border-red-200 hover:bg-red-50"
            >
              {isEditingInfo ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditingInfo ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-red-700 mb-1">Nome Completo</label>
                  <Input
                    value={editForm.name || ''}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    placeholder="Nome do agressor"
                    className="rounded-xl border-red-200"
                  />
                </div>
                <div>
                  <label className="block text-sm text-red-700 mb-1">CPF</label>
                  <Input
                    value={editForm.cpf || ''}
                    onChange={(e) => setEditForm({ ...editForm, cpf: e.target.value })}
                    placeholder="000.000.000-00"
                    className="rounded-xl border-red-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-red-700 mb-1">Telefone</label>
                  <Input
                    value={editForm.phone || ''}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    placeholder="(00) 00000-0000"
                    className="rounded-xl border-red-200"
                  />
                </div>
                <div>
                  <label className="block text-sm text-red-700 mb-1">Idade</label>
                  <Input
                    value={editForm.age || ''}
                    onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                    placeholder="Idade"
                    type="number"
                    className="rounded-xl border-red-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-red-700 mb-1">Endereço</label>
                <Input
                  value={editForm.address || ''}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  placeholder="Endereço completo"
                  className="rounded-xl border-red-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-red-700 mb-1">Profissão</label>
                  <Input
                    value={editForm.profession || ''}
                    onChange={(e) => setEditForm({ ...editForm, profession: e.target.value })}
                    placeholder="Profissão conhecida"
                    className="rounded-xl border-red-200"
                  />
                </div>
                <div>
                  <label className="block text-sm text-red-700 mb-1">Local de Trabalho</label>
                  <Input
                    value={editForm.workplace || ''}
                    onChange={(e) => setEditForm({ ...editForm, workplace: e.target.value })}
                    placeholder="Empresa/Local"
                    className="rounded-xl border-red-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-red-700 mb-1">Características Físicas</label>
                <Textarea
                  value={getPhysicalDescriptionForEdit(editForm.physicalDescription)}
                  onChange={(e) => setEditForm({ ...editForm, physicalDescription: e.target.value })}
                  placeholder="Altura, peso, cor dos olhos, cabelo, tatuagens, cicatrizes, etc."
                  rows={3}
                  className="rounded-xl border-red-200"
                />
              </div>

              <div>
                <label className="block text-sm text-red-700 mb-1">Redes Sociais</label>
                <Textarea
                  value={editForm.socialMedia || ''}
                  onChange={(e) => setEditForm({ ...editForm, socialMedia: e.target.value })}
                  placeholder="Instagram, Facebook, TikTok, etc."
                  rows={2}
                  className="rounded-xl border-red-200"
                />
              </div>

              <div>
                <label className="block text-sm text-red-700 mb-1">Observações Gerais</label>
                <Textarea
                  value={editForm.notes || ''}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  placeholder="Informações adicionais relevantes"
                  rows={3}
                  className="rounded-xl border-red-200"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <Button 
                  onClick={updateAggressorInfo}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditingInfo(false)}
                  className="rounded-xl border-red-200"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <IdCard className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-red-600">CPF:</span>
                    <span className="text-gray-700">{aggressor.cpf || 'Não informado'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-red-600">Telefone:</span>
                    <span className="text-gray-700">{aggressor.phone || 'Não informado'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-red-600">Idade:</span>
                    <span className="text-gray-700">{aggressor.age || 'Não informada'}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-red-600">Profissão:</span>
                    <span className="text-gray-700">{aggressor.profession || 'Não informada'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-red-600">Local de Trabalho:</span>
                    <span className="text-gray-700">{aggressor.workplace || 'Não informado'}</span>
                  </div>
                </div>
              </div>

              {aggressor.address && (
                <div className="p-3 bg-red-50 rounded-xl border border-red-100">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-red-600">Endereço:</span>
                  </div>
                  <p className="text-gray-700 text-sm">{aggressor.address}</p>
                </div>
              )}

              {aggressor.physicalDescription && (
                <div className="p-3 bg-red-50 rounded-xl border border-red-100">
                  <h4 className="text-sm text-red-600 mb-1 flex items-center gap-1">
                    <User className="w-4 h-4" />
                    Características Físicas:
                  </h4>
                  <p className="text-gray-700 text-sm">{renderPhysicalDescription(aggressor.physicalDescription)}</p>
                </div>
              )}

              {aggressor.socialMedia && (
                <div className="p-3 bg-red-50 rounded-xl border border-red-100">
                  <h4 className="text-sm text-red-600 mb-1 flex items-center gap-1">
                    <Users2 className="w-4 h-4" />
                    Redes Sociais:
                  </h4>
                  <p className="text-gray-700 text-sm">{aggressor.socialMedia}</p>
                </div>
              )}

              {aggressor.notes && (
                <div className="p-3 bg-red-50 rounded-xl border border-red-100">
                  <h4 className="text-sm text-red-600 mb-1 flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    Observações:
                  </h4>
                  <p className="text-gray-700 text-sm">{aggressor.notes}</p>
                </div>
              )}

              {/* Indicar campos faltantes */}
              <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                <h4 className="text-yellow-800 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Informações em Falta
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {!aggressor.cpf && <span className="text-yellow-700">• CPF</span>}
                  {!aggressor.phone && <span className="text-yellow-700">• Telefone</span>}
                  {!aggressor.age && <span className="text-yellow-700">• Idade</span>}
                  {!aggressor.address && <span className="text-yellow-700">• Endereço</span>}
                  {!aggressor.profession && <span className="text-yellow-700">• Profissão</span>}
                  {!aggressor.workplace && <span className="text-yellow-700">• Local de trabalho</span>}
                  {!aggressor.physicalDescription && <span className="text-yellow-700">• Características físicas</span>}
                  {!aggressor.socialMedia && <span className="text-yellow-700">• Redes sociais</span>}
                </div>
                <p className="text-yellow-700 text-xs mt-2">
                  Use o botão "Completar Info" para adicionar informações que você conhece
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )

  const ReportsTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg text-red-800">
          Denúncias Oficiais ({aggressor.reports?.length || 0})
        </h3>
        <Badge variant="destructive" className="px-3 py-1">
          {aggressor.reports?.length || 0} denúncias
        </Badge>
      </div>

      {aggressor.reports && aggressor.reports.length > 0 ? (
        aggressor.reports.map((report, index) => (
          <Card key={report.id} className="bg-gradient-to-r from-white to-red-50/30 shadow-md border-0">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-red-700 border-red-200">
                    Denúncia #{index + 1}
                  </Badge>
                  <Badge className={getUrgencyColor(report.incidentData?.urgency)}>
                    {report.incidentData?.urgency || 'Não especificado'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  {formatDate(report.incidentData?.date || report.createdAt)}
                  {report.incidentData?.approximate && (
                    <span className="text-yellow-600">(Aproximada)</span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-600">Local:</span>
                  <span className="text-gray-700">{report.incidentData?.location || 'Não informado'}</span>
                </div>

                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
                  <div>
                    <span className="text-sm text-red-600">Tipo de Violência:</span>
                    <p className="text-gray-700">{report.incidentData?.violenceType || 'Não especificado'}</p>
                  </div>
                </div>

                {report.incidentData?.description && (
                  <div className="flex items-start gap-2">
                    <FileText className="w-4 h-4 text-red-600 mt-0.5" />
                    <div>
                      <span className="text-sm text-red-600">Relato:</span>
                      <p className="text-gray-700 text-sm">{report.incidentData.description}</p>
                    </div>
                  </div>
                )}

                {report.evidence && report.evidence.length > 0 && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <h5 className="text-sm text-blue-800 mb-2">Evidências anexadas:</h5>
                    <div className="space-y-1">
                      {report.evidence.map((evidence, idx) => (
                        <div key={idx} className="text-sm text-blue-700">
                          • {evidence.type}: {evidence.description}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card className="bg-gradient-to-br from-white to-gray-50/30 shadow-lg border-0">
          <CardContent className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg text-gray-600 mb-2">Nenhuma denúncia oficial registrada</h4>
            <p className="text-gray-500">Este agressor ainda não possui denúncias formais no sistema</p>
          </CardContent>
        </Card>
      )}
    </div>
  )

  const CommunityReportsTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg text-orange-800 flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Relatos da Comunidade ({communityReports.length})
        </h3>
        <Dialog open={showAddReportDialog} onOpenChange={setShowAddReportDialog}>
          <DialogTrigger asChild>
            <Button className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Relato
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Relato da Comunidade</DialogTitle>
              <DialogDescription>
                Compartilhe informações que podem ajudar outras mulheres. Seu relato será anônimo.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Relato *</label>
                <Textarea
                  value={newReport.content}
                  onChange={(e) => setNewReport({ ...newReport, content: e.target.value })}
                  placeholder="Descreva o que você viu ou vivenciou..."
                  rows={4}
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-600 mb-1">Local *</label>
                <Input
                  value={newReport.location}
                  onChange={(e) => setNewReport({ ...newReport, location: e.target.value })}
                  placeholder="Onde aconteceu?"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-600 mb-1">Data (opcional)</label>
                <Input
                  type="date"
                  value={newReport.date}
                  onChange={(e) => setNewReport({ ...newReport, date: e.target.value })}
                />
                <div className="flex items-center space-x-2 mt-2">
                  <Checkbox
                    id="approximate"
                    checked={newReport.isApproximate}
                    onCheckedChange={(checked) => setNewReport({ ...newReport, isApproximate: checked })}
                  />
                  <label htmlFor="approximate" className="text-sm text-gray-600">
                    Data aproximada
                  </label>
                </div>
              </div>
              
              <div className="flex space-x-2 pt-4">
                <Button 
                  onClick={addCommunityReport}
                  className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl"
                >
                  Adicionar Relato
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddReportDialog(false)}
                  className="rounded-xl"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="p-4 bg-orange-50 rounded-xl border border-orange-200 mb-4">
        <h4 className="text-orange-800 mb-2 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Sobre os Relatos da Comunidade
        </h4>
        <div className="space-y-1 text-orange-700 text-sm">
          <p>• Relatos informais compartilhados por outras usuárias</p>
          <p>• Nem todos foram verificados oficialmente</p>
          <p>• Servem como alerta e informação adicional</p>
          <p>• Contribuem para o mapeamento de comportamentos suspeitos</p>
        </div>
      </div>

      {communityReports.length > 0 ? (
        communityReports.map((report) => (
          <Card key={report.id} className="bg-gradient-to-r from-white to-orange-50/30 shadow-md border-0">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-orange-700 border-orange-200">
                    Relato Comunitário
                  </Badge>
                  {report.verified && (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      Verificado
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  {formatDate(report.date)}
                  {report.isApproximate && (
                    <span className="text-yellow-600">(Aproximada)</span>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-600" />
                  <span className="text-sm text-orange-600">Local:</span>
                  <span className="text-gray-700">{report.location}</span>
                </div>

                <div className="p-3 bg-orange-50 rounded-lg border border-orange-100">
                  <p className="text-gray-700 text-sm italic">"{report.content}"</p>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Relatado por usuária anônima</span>
                  {!report.verified && (
                    <span className="text-yellow-600">⚠️ Aguardando verificação</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card className="bg-gradient-to-br from-white to-gray-50/30 shadow-lg border-0">
          <CardContent className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg text-gray-600 mb-2">Nenhum relato da comunidade</h4>
            <p className="text-gray-500 mb-4">
              Seja a primeira a compartilhar informações sobre este indivíduo
            </p>
            <Button 
              onClick={() => setShowAddReportDialog(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeiro Relato
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )

  const TimelineTab = () => {
    // Combinar denúncias oficiais e relatos da comunidade para a timeline
    const allEvents = []
    
    // Adicionar denúncias oficiais
    if (aggressor.timeline && aggressor.timeline.length > 0) {
      aggressor.timeline.forEach(event => {
        allEvents.push({
          ...event,
          type: 'official',
          source: 'Denúncia Oficial'
        })
      })
    }
    
    // Adicionar relatos da comunidade
    communityReports.forEach(report => {
      allEvents.push({
        date: report.date,
        location: report.location,
        incident: {
          description: report.content,
          urgency: 'media'
        },
        type: 'community',
        source: 'Relato da Comunidade',
        verified: report.verified,
        approximate: report.isApproximate
      })
    })
    
    // Ordenar por data (mais antiga primeiro)
    const sortedTimeline = allEvents.sort((a, b) => new Date(a.date) - new Date(b.date))

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg text-red-800 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Linha do Tempo Automática
          </h3>
          <Badge variant="secondary" className="px-3 py-1">
            {sortedTimeline.length} eventos
          </Badge>
        </div>

        {sortedTimeline.length > 0 ? (
          <div className="relative">
            {/* Linha vertical */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-red-200"></div>
            
            <div className="space-y-6">
              {sortedTimeline.map((event, index) => (
                <div key={index} className="relative flex items-start gap-4">
                  {/* Ponto na timeline */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className={`w-4 h-4 rounded-full border-4 border-white shadow-lg ${
                      event.type === 'official' ? 'bg-red-600' : 'bg-orange-500'
                    }`}></div>
                  </div>
                  
                  {/* Conteúdo do evento */}
                  <Card className={`flex-1 shadow-md border-0 ${
                    event.type === 'official' 
                      ? 'bg-gradient-to-r from-white to-red-50/30' 
                      : 'bg-gradient-to-r from-white to-orange-50/30'
                  }`}>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-red-600" />
                          <span className="text-red-800">
                            {formatDate(event.date)}
                          </span>
                          {event.approximate && (
                            <Badge variant="outline" className="text-yellow-600 border-yellow-200 text-xs">
                              Aproximada
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`text-xs ${
                            event.type === 'official' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-orange-100 text-orange-800'
                          }`}>
                            {event.source}
                          </Badge>
                          {event.verified === false && (
                            <Badge variant="outline" className="text-yellow-600 border-yellow-200 text-xs">
                              Não verificado
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        {event.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-red-600" />
                            <span className="text-sm text-gray-700">{event.location}</span>
                          </div>
                        )}

                        {event.incident?.violenceType && (
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                            <span className="text-sm text-gray-700">{event.incident.violenceType}</span>
                          </div>
                        )}

                        {event.incident?.description && (
                          <div className={`mt-2 p-3 rounded-lg border ${
                            event.type === 'official' 
                              ? 'bg-red-50 border-red-100' 
                              : 'bg-orange-50 border-orange-100'
                          }`}>
                            <p className="text-sm text-gray-700">
                              {event.type === 'community' && <span className="italic">"</span>}
                              {event.incident.description}
                              {event.type === 'community' && <span className="italic">"</span>}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <Card className="bg-gradient-to-br from-white to-gray-50/30 shadow-lg border-0">
            <CardContent className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg text-gray-600 mb-2">Timeline vazia</h4>
              <p className="text-gray-500">Quando denúncias forem registradas com datas, aparecerão aqui automaticamente</p>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  const StatisticsTab = () => {
    const totalReports = aggressor.reports?.length || 0
    const totalCommunityReports = communityReports.length
    const totalEvents = totalReports + totalCommunityReports
    const lastIncident = aggressor.timeline?.[aggressor.timeline.length - 1]
    const urgencyStats = aggressor.reports?.reduce((acc, report) => {
      const urgency = report.incidentData?.urgency || 'não especificada'
      acc[urgency] = (acc[urgency] || 0) + 1
      return acc
    }, {}) || {}

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-600 text-sm">Denúncias Oficiais</p>
                  <p className="text-2xl text-red-800">{totalReports}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm">Relatos Comunidade</p>
                  <p className="text-2xl text-orange-800">{totalCommunityReports}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm">Total de Eventos</p>
                  <p className="text-2xl text-purple-800">{totalEvents}</p>
                </div>
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 text-sm">Último Incidente</p>
                  <p className="text-sm text-yellow-800">
                    {lastIncident ? formatDate(lastIncident.date) : 'Nunca'}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-br from-white to-gray-50/30 shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-red-800">Distribuição por Urgência</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(urgencyStats).map(([urgency, count]) => (
                <div key={urgency} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      urgency === 'alta' ? 'bg-red-500' :
                      urgency === 'media' ? 'bg-yellow-500' :
                      urgency === 'baixa' ? 'bg-green-500' : 'bg-gray-500'
                    }`}></div>
                    <span className="capitalize text-gray-700">{urgency}</span>
                  </div>
                  <Badge variant="outline">{count} denúncias</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800">Informações de Segurança</CardTitle>
          </CardHeader>
          <CardContent className="text-blue-700 text-sm space-y-2">
            <p>• Dados oficiais verificados vs. relatos comunitários</p>
            <p>• Timeline baseada em datas dos incidentes reportados</p>
            <p>• Informações podem ser atualizadas pela comunidade</p>
            <p>• Sistema de verificação para relatos não oficiais</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!aggressor) {
    return (
      <div className="text-center py-8">
        <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Carregando informações do agressor...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16 border-4 border-red-200">
            <AvatarImage src="" />
            <AvatarFallback className="bg-red-100 text-red-800 text-lg">
              {aggressor.name?.charAt(0) || <User className="w-8 h-8" />}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl text-red-800">{aggressor.name}</h1>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{aggressor.city || 'Localização não informada'}</span>
            </div>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          onClick={() => {
            console.log('Fechando perfil do agressor...')
            if (onClose && typeof onClose === 'function') {
              onClose()
            }
          }} 
          className="rounded-xl border-red-200 hover:bg-red-50"
        >
          <X className="w-4 h-4 mr-2" />
          Fechar
        </Button>
      </div>

      {/* Alert de perigo */}
      <Card className="mb-6 bg-gradient-to-r from-red-50 to-red-100 border-red-200">
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <div>
              <h3 className="text-red-800">⚠️ Perfil de Alto Risco</h3>
              <p className="text-red-700 text-sm">
                Este indivíduo possui {aggressor.totalReports || 0} denúncias registradas. 
                Mantenha distância e relate qualquer contato suspeito.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-white shadow-lg rounded-2xl p-1 mb-6">
          <TabsTrigger value="info" className="rounded-xl">Informações</TabsTrigger>
          <TabsTrigger value="reports" className="rounded-xl">Denúncias</TabsTrigger>
          <TabsTrigger value="community" className="rounded-xl">Comunidade</TabsTrigger>
          <TabsTrigger value="timeline" className="rounded-xl">Timeline</TabsTrigger>
          <TabsTrigger value="stats" className="rounded-xl">Estatísticas</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <InfoTab />
        </TabsContent>

        <TabsContent value="reports">
          <ReportsTab />
        </TabsContent>

        <TabsContent value="community">
          <CommunityReportsTab />
        </TabsContent>

        <TabsContent value="timeline">
          <TimelineTab />
        </TabsContent>

        <TabsContent value="stats">
          <StatisticsTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}