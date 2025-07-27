import React, { useState } from 'react';
import { Search, FileText, AlertTriangle, Shield, Eye, EyeOff, Download, ExternalLink, CheckCircle, XCircle, Clock, MapPin, Calendar, User } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
}

interface LegalVerificationProps {
  user: User;
}

type SearchType = 'name' | 'cpf' | 'process';
type ProcessStatus = 'active' | 'closed' | 'pending' | 'archived';
type ProcessType = 'criminal' | 'civil' | 'protective' | 'restraining';

type LegalRecord = {
  id: string;
  aggressorName: string;
  cpf: string;
  processNumber: string;
  processType: ProcessType;
  status: ProcessStatus;
  court: string;
  date: string;
  location: string;
  charges: string[];
  outcome?: string;
  isPublic: boolean;
  reportedBy: string;
  verificationLevel: 'verified' | 'pending' | 'unverified';
  attachments: string[];
};

type UserReport = {
  id: string;
  aggressorName: string;
  cpf?: string;
  processNumber?: string;
  reportType: 'bo' | 'process' | 'medida_protetiva';
  description: string;
  attachments: File[];
  isAnonymous: boolean;
  status: 'pending' | 'verified' | 'rejected';
  submittedAt: string;
};

const LegalVerification: React.FC<LegalVerificationProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'search' | 'submit' | 'my-reports'>('search');
  const [searchType, setSearchType] = useState<SearchType>('name');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSensitiveInfo, setShowSensitiveInfo] = useState(false);
  const [searchResults, setSearchResults] = useState<LegalRecord[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<LegalRecord | null>(null);

  // Form para submissão de novos relatórios
  const [newReport, setNewReport] = useState<Partial<UserReport>>({
    aggressorName: '',
    cpf: '',
    processNumber: '',
    reportType: 'bo',
    description: '',
    attachments: [],
    isAnonymous: false,
  });

  // Dados simulados de registros legais
  const mockLegalRecords: LegalRecord[] = [
    {
      id: '1',
      aggressorName: 'João Silva Santos',
      cpf: '123.456.789-00',
      processNumber: '0001234-56.2024.8.26.0100',
      processType: 'criminal',
      status: 'active',
      court: '1ª Vara Criminal de São Paulo',
      date: '2024-01-15',
      location: 'São Paulo, SP',
      charges: ['Violência Doméstica', 'Ameaça', 'Lesão Corporal'],
      isPublic: true,
      reportedBy: 'Maria S.',
      verificationLevel: 'verified',
      attachments: ['bo_123456.pdf', 'laudo_medico.pdf'],
    },
    {
      id: '2',
      aggressorName: 'Carlos Mendes Oliveira',
      cpf: '987.654.321-00',
      processNumber: '0007890-12.2024.8.26.0200',
      processType: 'protective',
      status: 'active',
      court: 'Vara de Violência Doméstica',
      date: '2024-01-10',
      location: 'São Paulo, SP',
      charges: ['Medida Protetiva', 'Assédio'],
      outcome: 'Medida protetiva deferida',
      isPublic: true,
      reportedBy: 'Ana L.',
      verificationLevel: 'verified',
      attachments: ['medida_protetiva.pdf'],
    },
    {
      id: '3',
      aggressorName: 'Roberto Oliveira Costa',
      cpf: '456.789.123-00',
      processNumber: '0003456-78.2023.8.26.0300',
      processType: 'criminal',
      status: 'closed',
      court: '2ª Vara Criminal de São Paulo',
      date: '2023-08-20',
      location: 'São Paulo, SP',
      charges: ['Estupro', 'Violência Física', 'Cárcere Privado'],
      outcome: 'Condenado - 8 anos de prisão',
      isPublic: true,
      reportedBy: 'Sistema Judicial',
      verificationLevel: 'verified',
      attachments: ['sentenca.pdf', 'bo_original.pdf'],
    },
  ];

  const handleSearch = async () => {
    setIsSearching(true);
    
    // Simular busca em bases de dados externas
    setTimeout(() => {
      const results = mockLegalRecords.filter(record => {
        switch (searchType) {
          case 'name':
            return record.aggressorName.toLowerCase().includes(searchQuery.toLowerCase());
          case 'cpf':
            return record.cpf.includes(searchQuery.replace(/\D/g, ''));
          case 'process':
            return record.processNumber.includes(searchQuery);
          default:
            return false;
        }
      });
      
      setSearchResults(results);
      setIsSearching(false);
    }, 2000);
  };

  const handleSubmitReport = () => {
    // Aqui seria enviado para verificação
    alert('Relatório enviado para verificação! Nossa equipe analisará em até 48 horas.');
    setNewReport({
      aggressorName: '',
      cpf: '',
      processNumber: '',
      reportType: 'bo',
      description: '',
      attachments: [],
      isAnonymous: false,
    });
  };

  const getStatusColor = (status: ProcessStatus) => {
    const colors = {
      active: 'bg-red-100 text-red-700',
      closed: 'bg-gray-100 text-gray-700',
      pending: 'bg-yellow-100 text-yellow-700',
      archived: 'bg-blue-100 text-blue-700',
    };
    return colors[status];
  };

  const getStatusLabel = (status: ProcessStatus) => {
    const labels = {
      active: 'Ativo',
      closed: 'Encerrado',
      pending: 'Pendente',
      archived: 'Arquivado',
    };
    return labels[status];
  };

  const getProcessTypeLabel = (type: ProcessType) => {
    const labels = {
      criminal: 'Criminal',
      civil: 'Cível',
      protective: 'Medida Protetiva',
      restraining: 'Ordem Restritiva',
    };
    return labels[type];
  };

  const getVerificationIcon = (level: string) => {
    switch (level) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verificação Legal</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Consulte processos judiciais, boletins de ocorrência e medidas protetivas. 
          Contribua com informações verificadas para proteger nossa comunidade.
        </p>
      </div>

      {/* Warning */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-6 w-6 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-medium text-yellow-800">⚠️ Informações Legais Sensíveis</h3>
            <p className="text-yellow-700 mt-1">
              As informações aqui apresentadas são baseadas em registros oficiais e relatos verificados. 
              Use com responsabilidade e sempre confirme dados através de canais oficiais.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex border-b border-gray-200">
          {[
            { id: 'search', label: 'Buscar Processos', icon: Search },
            { id: 'submit', label: 'Enviar Relatório', icon: FileText },
            { id: 'my-reports', label: 'Meus Relatórios', icon: User },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                  activeTab === tab.id
                    ? 'text-purple-700 border-b-2 border-purple-500 bg-purple-50'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {/* Search Tab */}
          {activeTab === 'search' && (
            <div className="space-y-6">
              {/* Search Controls */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Busca</label>
                  <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value as SearchType)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="name">Nome Completo</option>
                    <option value="cpf">CPF</option>
                    <option value="process">Número do Processo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {searchType === 'name' ? 'Nome' : searchType === 'cpf' ? 'CPF' : 'Número do Processo'}
                  </label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      searchType === 'name' ? 'Digite o nome completo' :
                      searchType === 'cpf' ? '000.000.000-00' :
                      '0000000-00.0000.0.00.0000'
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    onClick={handleSearch}
                    disabled={!searchQuery.trim() || isSearching}
                    className="w-full bg-purple-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <Search className="h-4 w-4" />
                    <span>{isSearching ? 'Buscando...' : 'Buscar'}</span>
                  </button>
                </div>
              </div>

              {/* Toggle Sensitive Info */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {searchResults.length} resultado(s) encontrado(s)
                </span>
                <button
                  onClick={() => setShowSensitiveInfo(!showSensitiveInfo)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    showSensitiveInfo
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {showSensitiveInfo ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  <span className="text-sm">
                    {showSensitiveInfo ? 'Ocultar Dados' : 'Mostrar Dados'}
                  </span>
                </button>
              </div>

              {/* Search Results */}
              <div className="space-y-4">
                {searchResults.map(record => (
                  <div key={record.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {showSensitiveInfo ? record.aggressorName : record.aggressorName.charAt(0) + '***'}
                          </h3>
                          {getVerificationIcon(record.verificationLevel)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                            {getStatusLabel(record.status)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <p><strong>CPF:</strong> {showSensitiveInfo ? record.cpf : '***.***.***-**'}</p>
                            <p><strong>Processo:</strong> {record.processNumber}</p>
                            <p><strong>Tipo:</strong> {getProcessTypeLabel(record.processType)}</p>
                          </div>
                          <div>
                            <p><strong>Tribunal:</strong> {record.court}</p>
                            <p><strong>Data:</strong> {new Date(record.date).toLocaleDateString('pt-BR')}</p>
                            <p><strong>Local:</strong> {record.location}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Acusações:</h4>
                      <div className="flex flex-wrap gap-2">
                        {record.charges.map((charge, index) => (
                          <span
                            key={index}
                            className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm"
                          >
                            {charge}
                          </span>
                        ))}
                      </div>
                    </div>

                    {record.outcome && (
                      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-800 mb-1">Resultado:</h4>
                        <p className="text-sm text-blue-700">{record.outcome}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="text-sm text-gray-500">
                        Reportado por: {record.reportedBy} • {record.attachments.length} anexo(s)
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedRecord(record)}
                          className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-600 transition-all duration-200"
                        >
                          Ver Detalhes
                        </button>
                        {record.attachments.length > 0 && (
                          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all duration-200 flex items-center space-x-1">
                            <Download className="h-4 w-4" />
                            <span>Anexos</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {searchResults.length === 0 && searchQuery && !isSearching && (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum registro encontrado</h3>
                    <p className="text-gray-600">
                      Não foram encontrados processos ou boletins para esta busca.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Submit Tab */}
          {activeTab === 'submit' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Enviar Novo Relatório</h3>
                <p className="text-gray-600 mb-6">
                  Contribua com informações verificadas sobre processos, boletins de ocorrência ou medidas protetivas.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Agressor *
                  </label>
                  <input
                    type="text"
                    value={newReport.aggressorName}
                    onChange={(e) => setNewReport(prev => ({ ...prev, aggressorName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Nome completo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CPF (opcional)
                  </label>
                  <input
                    type="text"
                    value={newReport.cpf}
                    onChange={(e) => setNewReport(prev => ({ ...prev, cpf: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="000.000.000-00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Documento *
                  </label>
                  <select
                    value={newReport.reportType}
                    onChange={(e) => setNewReport(prev => ({ ...prev, reportType: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="bo">Boletim de Ocorrência</option>
                    <option value="process">Processo Judicial</option>
                    <option value="medida_protetiva">Medida Protetiva</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número do Documento
                  </label>
                  <input
                    type="text"
                    value={newReport.processNumber}
                    onChange={(e) => setNewReport(prev => ({ ...prev, processNumber: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Número do processo ou B.O."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição *
                </label>
                <textarea
                  value={newReport.description}
                  onChange={(e) => setNewReport(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows={4}
                  placeholder="Descreva os detalhes do caso, acusações, resultado, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Anexos (PDF, imagens)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Clique para selecionar arquivos ou arraste aqui
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Máximo 10MB por arquivo
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={newReport.isAnonymous}
                  onChange={(e) => setNewReport(prev => ({ ...prev, isAnonymous: e.target.checked }))}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="anonymous" className="text-sm text-gray-700">
                  Enviar anonimamente
                </label>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setNewReport({
                    aggressorName: '',
                    cpf: '',
                    processNumber: '',
                    reportType: 'bo',
                    description: '',
                    attachments: [],
                    isAnonymous: false,
                  })}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                  Limpar
                </button>
                <button
                  onClick={handleSubmitReport}
                  disabled={!newReport.aggressorName || !newReport.description}
                  className="flex-1 bg-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Enviar para Verificação
                </button>
              </div>
            </div>
          )}

          {/* My Reports Tab */}
          {activeTab === 'my-reports' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Meus Relatórios</h3>
                <p className="text-gray-600 mb-6">
                  Acompanhe o status dos relatórios que você enviou para verificação.
                </p>
              </div>

              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum relatório enviado</h3>
                <p className="text-gray-600 mb-4">
                  Você ainda não enviou nenhum relatório para verificação.
                </p>
                <button
                  onClick={() => setActiveTab('submit')}
                  className="bg-purple-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-600 transition-all duration-200"
                >
                  Enviar Primeiro Relatório
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Record Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Detalhes do Processo</h3>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Informações do Agressor</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Nome:</strong> {showSensitiveInfo ? selectedRecord.aggressorName : selectedRecord.aggressorName.charAt(0) + '***'}</p>
                    <p><strong>CPF:</strong> {showSensitiveInfo ? selectedRecord.cpf : '***.***.***-**'}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Informações do Processo</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Número:</strong> {selectedRecord.processNumber}</p>
                    <p><strong>Tipo:</strong> {getProcessTypeLabel(selectedRecord.processType)}</p>
                    <p><strong>Status:</strong> {getStatusLabel(selectedRecord.status)}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Tribunal e Localização</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>Tribunal:</strong> {selectedRecord.court}</p>
                  <p><strong>Local:</strong> {selectedRecord.location}</p>
                  <p><strong>Data:</strong> {new Date(selectedRecord.date).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Acusações</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedRecord.charges.map((charge, index) => (
                    <span
                      key={index}
                      className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm"
                    >
                      {charge}
                    </span>
                  ))}
                </div>
              </div>

              {selectedRecord.outcome && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Resultado</h4>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">{selectedRecord.outcome}</p>
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Anexos</h4>
                <div className="space-y-2">
                  {selectedRecord.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">{attachment}</span>
                      <button className="text-purple-600 hover:text-purple-700 text-sm">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-blue-800">Sobre as Informações</h4>
            <p className="text-sm text-blue-700 mt-1">
              Os dados são coletados de fontes oficiais como tribunais, delegacias e órgãos públicos. 
              Todas as informações passam por verificação antes de serem disponibilizadas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalVerification;