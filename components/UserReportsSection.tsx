import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { FileText, Calendar, MapPin, Eye, EyeOff, Shield, AlertTriangle, User } from 'lucide-react'
import { projectId } from '../utils/supabase/info'

export function UserReportsSection({ user }) {
  const [userReports, setUserReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [showReports, setShowReports] = useState(false)

  useEffect(() => {
    loadUserReports()
  }, [])

  const loadUserReports = async () => {
    try {
      // Simular carregamento das denúncias da usuária
      // Em produção, faria chamada para API com autenticação
      setTimeout(() => {
        const simulatedUserReports = [
          {
            id: 'ur1',
            aggressorName: 'Bruno Henrique Santos',
            aggressorId: '7',
            violenceType: 'fisica',
            description: 'Agrediu ex-namorada na saída do trabalho. Ela trabalha na Vila Olímpia como advogada. Ele chegou no local por volta das 18h e começou a gritar na frente de todos.',
            location: 'Vila Olímpia - Faria Lima',
            createdAt: '2024-01-14T18:30:00Z',
            hasEvidence: true,
            status: 'verified', // verified, pending, rejected
            isAnonymousPublicly: true, // Sempre anônimo para o público
            reportType: 'official' // official, community
          },
          {
            id: 'ur2',
            aggressorName: 'João Silva Santos',
            aggressorId: '1',
            violenceType: 'psicologica',
            description: 'Ameaças constantes através de mensagens. Criava perfis falsos para me assediar.',
            location: 'Centro da cidade',
            createdAt: '2024-01-10T15:20:00Z',
            hasEvidence: false,
            status: 'pending',
            isAnonymousPublicly: true,
            reportType: 'community'
          }
        ]
        setUserReports(simulatedUserReports)
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.log('Error loading user reports:', error)
      setLoading(false)
    }
  }

  const getViolenceTypeLabel = (type) => {
    const types = {
      'fisica': 'Violência Física',
      'psicologica': 'Violência Psicológica',
      'sexual': 'Violência Sexual',
      'moral': 'Violência Moral',
      'patrimonial': 'Violência Patrimonial'
    }
    return types[type] || type
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800 border-green-300'
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'rejected': return 'bg-red-100 text-red-800 border-red-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'verified': return 'Verificada'
      case 'pending': return 'Pendente'
      case 'rejected': return 'Rejeitada'
      default: return 'Desconhecido'
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Carregando suas denúncias...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-800">
          <User className="w-5 h-5" />
          Minhas Denúncias Privadas
          <Badge variant="outline" className="text-purple-600">
            {userReports.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Banner de Privacidade */}
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-purple-600 mt-0.5" />
            <div>
              <h4 className="text-purple-800 mb-1">🔒 Área Privada e Segura</h4>
              <p className="text-sm text-purple-700">
                Aqui você pode ver <strong>todas as suas denúncias</strong>. Esta seção é 
                <strong> completamente privada</strong> - somente você tem acesso. No catálogo público, 
                sua identidade permanece <strong>100% anônima</strong> para sua proteção.
              </p>
            </div>
          </div>
        </div>

        {/* Botão para mostrar/ocultar denúncias */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Você fez {userReports.length} denúncia(s) que ajudam a proteger outras mulheres
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowReports(!showReports)}
            className="flex items-center gap-2"
          >
            {showReports ? (
              <>
                <EyeOff className="w-4 h-4" />
                Ocultar
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                Ver Minhas Denúncias
              </>
            )}
          </Button>
        </div>

        {/* Lista de denúncias da usuária */}
        {showReports && (
          <div className="space-y-4">
            {userReports.map((report) => (
              <Card key={report.id} className="border-l-4 border-purple-300">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-purple-800">
                          Denúncia contra: <strong>{report.aggressorName}</strong>
                        </h4>
                        <Badge className={getStatusColor(report.status)}>
                          {getStatusLabel(report.status)}
                        </Badge>
                        {report.reportType === 'official' && (
                          <Badge variant="outline" className="text-blue-600 border-blue-300">
                            Oficial
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          <span>{getViolenceTypeLabel(report.violenceType)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{report.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(report.createdAt).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-800 mb-3 p-3 bg-gray-50 rounded">
                        {report.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Shield className="w-3 h-3 text-green-600" />
                            Anônimo no catálogo público
                          </span>
                          {report.hasEvidence && (
                            <span className="flex items-center gap-1 text-blue-600">
                              <FileText className="w-3 h-3" />
                              Com evidências
                            </span>
                          )}
                        </div>

                        {report.status === 'pending' && (
                          <div className="flex items-center gap-1 text-xs text-yellow-600">
                            <AlertTriangle className="w-3 h-3" />
                            Aguardando verificação
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {userReports.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm">Você ainda não fez nenhuma denúncia</p>
                <p className="text-xs mt-1">
                  Use a aba "Buscar" para reportar agressores e proteger outras mulheres
                </p>
              </div>
            )}
          </div>
        )}

        {/* Estatísticas pessoais */}
        {userReports.length > 0 && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-green-600" />
              <h4 className="text-sm text-green-800">Seu Impacto na Comunidade</h4>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl text-green-600 mb-1">{userReports.length}</div>
                <div className="text-xs text-green-700">Denúncias feitas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl text-green-600 mb-1">
                  {userReports.filter(r => r.status === 'verified').length}
                </div>
                <div className="text-xs text-green-700">Verificadas</div>
              </div>
            </div>
            <p className="text-xs text-green-700 mt-2 text-center">
              Obrigada por ajudar a proteger outras mulheres! 💜
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}