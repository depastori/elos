import React, { useState } from 'react';
import { Search, AlertTriangle, Shield, Eye, EyeOff, MapPin, Calendar, Flag, FileText, User, Scale, Users, Plus, X, Camera, Upload, Phone } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
}

interface AggressorDatabaseProps {
  user: User;
}

type PhoneVerification = {
  phone: string;
  aggressorId?: string;
  isVerified: boolean;
  reportCount: number;
};

type AggressorReport = {
  id: number;
  name: string;
  alias?: string;
  age?: number;
  location: string;
  phone?: string;
  description: string;
  reportCount: number;
  lastReported: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  verified: boolean;
  violenceTypes: string[];
  consolidatedProfile?: ConsolidatedProfile;
};

type ConsolidatedProfile = {
  aggressorId: string;
  fullName: string;
  aliases: string[];
  physicalDescription: PhysicalDescription;
  communityReports: CommunityReport[];
  officialRecords: OfficialRecord[];
  behaviorPatterns: BehaviorPattern[];
  locations: LocationReport[];
  riskAssessment: RiskAssessment;
  timeline: TimelineEvent[];
};

type PhysicalDescription = {
  height?: string;
  build?: string;
  hairColor?: string;
  eyeColor?: string;
  skinTone?: string;
  distinctiveMarks?: string[];
  clothing?: string;
  vehicle?: string;
};

type CommunityReport = {
  id: string;
  reporterId: string;
  reporterName: string;
  date: string;
  violenceType: string;
  description: string;
  location: string;
  verified: boolean;
  evidence?: string[];
};

type OfficialRecord = {
  id: string;
  type: 'criminal' | 'civil' | 'protective' | 'restraining';
  processNumber: string;
  court: string;
  date: string;
  charges: string[];
  status: 'active' | 'closed' | 'pending';
  outcome?: string;
  documents: string[];
};

type BehaviorPattern = {
  category: string;
  description: string;
  frequency: 'rare' | 'occasional' | 'frequent' | 'constant';
  examples: string[];
};

type LocationReport = {
  address: string;
  type: 'residence' | 'workplace' | 'frequent' | 'incident';
  reportCount: number;
  lastSeen: string;
  verified: boolean;
};

type RiskAssessment = {
  level: 'low' | 'medium' | 'high' | 'critical';
  factors: string[];
  escalationPattern: boolean;
  weaponAccess: boolean;
  violationHistory: boolean;
  score: number;
};

type TimelineEvent = {
  date: string;
  type: 'report' | 'legal' | 'incident' | 'violation';
  description: string;
  source: 'community' | 'official';
};

const AggressorDatabase: React.FC<AggressorDatabaseProps> = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [phoneQuery, setPhoneQuery] = useState('');
  const [phoneVerificationResult, setPhoneVerificationResult] = useState<AggressorReport | null>(null);
  const [showSensitiveContent, setShowSensitiveContent] = useState(false);
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<ConsolidatedProfile | null>(null);
  const [activeProfileTab, setActiveProfileTab] = useState<'overview' | 'reports' | 'legal' | 'timeline'>('overview');
  const [photoUpload, setPhotoUpload] = useState<File | null>(null);

  const aggressorReports: AggressorReport[] = [
    {
      id: 1,
      name: 'João Silva Santos',
      alias: 'João do Bar',
      age: 35,
      location: 'Centro, São Paulo',
      phone: '11999887766',
      description: 'Altura média, cabelos escuros, tatuagem no braço direito. Frequenta bares na região central.',
      reportCount: 12,
      lastReported: '2024-01-15',
      riskLevel: 'high',
      verified: true,
      violenceTypes: ['Física', 'Psicológica'],
      consolidatedProfile: {
        aggressorId: '1',
        fullName: 'João Silva Santos',
        aliases: ['João do Bar', 'João da Esquina'],
        physicalDescription: {
          height: '1,75m aproximadamente',
          build: 'Médio, forte',
          hairColor: 'Castanho escuro',
          eyeColor: 'Castanhos',
          skinTone: 'Parda',
          distinctiveMarks: ['Tatuagem de âncora no braço direito', 'Cicatriz na testa'],
          clothing: 'Sempre de boné, camiseta e tênis',
          vehicle: 'Moto Honda CG preta, placa parcial ABC-'
        },
        communityReports: [
          {
            id: 'cr1',
            reporterId: 'user1',
            reporterName: 'Maria S.',
            date: '2024-01-15',
            violenceType: 'Física',
            description: 'Agrediu ex-namorada em via pública após discussão',
            location: 'Rua Augusta, próximo ao metrô',
            verified: true,
            evidence: ['foto_lesoes.jpg', 'video_agressao.mp4']
          },
          {
            id: 'cr2',
            reporterId: 'user2',
            reporterName: 'Ana L.',
            date: '2024-01-10',
            violenceType: 'Psicológica',
            description: 'Perseguição e ameaças constantes via WhatsApp',
            location: 'Centro, São Paulo',
            verified: true,
            evidence: ['prints_whatsapp.pdf']
          }
        ],
        officialRecords: [
          {
            id: 'or1',
            type: 'criminal',
            processNumber: '0001234-56.2024.8.26.0100',
            court: '1ª Vara Criminal de São Paulo',
            date: '2024-01-20',
            charges: ['Lesão corporal', 'Ameaça', 'Violência doméstica'],
            status: 'active',
            documents: ['bo_123456.pdf', 'laudo_medico.pdf']
          }
        ],
        behaviorPatterns: [
          {
            category: 'Escalação de Violência',
            description: 'Inicia com controle psicológico e evolui para agressão física',
            frequency: 'frequent',
            examples: ['Ciúmes excessivos', 'Controle de redes sociais', 'Isolamento social']
          },
          {
            category: 'Padrão de Abordagem',
            description: 'Usa charme inicial seguido de possessividade',
            frequency: 'constant',
            examples: ['Love bombing', 'Presentes caros no início', 'Atenção excessiva']
          }
        ],
        locations: [
          {
            address: 'Rua da Consolação, 1234 - Centro',
            type: 'residence',
            reportCount: 5,
            lastSeen: '2024-01-15',
            verified: true
          },
          {
            address: 'Bar do Zé - Rua Augusta, 567',
            type: 'frequent',
            reportCount: 8,
            lastSeen: '2024-01-12',
            verified: true
          }
        ],
        riskAssessment: {
          level: 'high',
          factors: [
            'Histórico de violência física',
            'Escalação de comportamento',
            'Violação de medidas protetivas',
            'Uso de álcool'
          ],
          escalationPattern: true,
          weaponAccess: false,
          violationHistory: true,
          score: 78
        },
        timeline: [
          {
            date: '2024-01-20',
            type: 'legal',
            description: 'Processo criminal iniciado',
            source: 'official'
          },
          {
            date: '2024-01-15',
            type: 'incident',
            description: 'Agressão física reportada',
            source: 'community'
          },
          {
            date: '2024-01-10',
            type: 'report',
            description: 'Denúncia de perseguição',
            source: 'community'
          }
        ]
      }
    },
    {
      id: 2,
      name: 'Carlos Mendes',
      age: 28,
      location: 'Vila Madalena, São Paulo',
      phone: '11988776655',
      description: 'Alto, magro, cicatriz no rosto. Trabalha como motorista de aplicativo.',
      reportCount: 8,
      lastReported: '2024-01-10',
      riskLevel: 'medium',
      verified: false,
      violenceTypes: ['Assédio', 'Perseguição'],
    },
    {
      id: 3,
      name: 'Roberto Oliveira',
      age: 42,
      location: 'Jardins, São Paulo',
      phone: '11977665544',
      description: 'Empresário, sempre bem vestido. Frequenta eventos sociais da região.',
      reportCount: 15,
      lastReported: '2024-01-20',
      riskLevel: 'critical',
      verified: true,
      violenceTypes: ['Física', 'Sexual', 'Psicológica'],
    },
    {
      id: 4,
      name: 'Anderson Costa',
      age: 31,
      location: 'Mooca, São Paulo',
      phone: '11966554433',
      description: 'Médio, moreno, barba sempre feita. Trabalha em escritório.',
      reportCount: 5,
      lastReported: '2024-01-08',
      riskLevel: 'low',
      verified: false,
      violenceTypes: ['Psicológica'],
    },
  ];

  const aggressorTypes = [
    { id: 'domestic', label: 'Violência Doméstica', color: 'bg-red-500', icon: '🏠' },
    { id: 'stalking', label: 'Perseguição/Stalking', color: 'bg-gray-500', icon: '👁️' },
    { id: 'defamation', label: 'Difamação/Calúnia', color: 'bg-yellow-500', icon: '🗣️' },
    { id: 'workplace', label: 'Assédio no Trabalho', color: 'bg-orange-500', icon: '🏢' },
    { id: 'public', label: 'Espaço Público', color: 'bg-yellow-500', icon: '🌍' },
    { id: 'digital', label: 'Violência Digital', color: 'bg-blue-500', icon: '📱' },
    { id: 'sexual', label: 'Violência Sexual', color: 'bg-purple-500', icon: '⚠️' },
  ];

  const riskLevels = [
    { id: 'all', label: 'Todos', color: 'bg-gray-500' },
    { id: 'low', label: 'Baixo', color: 'bg-green-500' },
    { id: 'medium', label: 'Médio', color: 'bg-yellow-500' },
    { id: 'high', label: 'Alto', color: 'bg-orange-500' },
    { id: 'critical', label: 'Crítico', color: 'bg-red-500' },
  ];

  const getRiskColor = (level: string) => {
    const colors = {
      low: 'bg-green-500',
      medium: 'bg-yellow-500',
      high: 'bg-orange-500',
      critical: 'bg-red-500',
    };
    return colors[level as keyof typeof colors];
  };

  const handlePhoneVerification = () => {
    if (!phoneQuery.trim()) return;
    
    // Simular busca por telefone na base de dados
    const foundAggressor = aggressorReports.find(report => 
      report.phone && report.phone.replace(/\D/g, '').includes(phoneQuery.replace(/\D/g, ''))
    );
    
    setPhoneVerificationResult(foundAggressor || null);
  };

  const filteredReports = aggressorReports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (report.alias && report.alias.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         report.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRiskLevel = selectedRiskLevel === 'all' || report.riskLevel === selectedRiskLevel;
    
    return matchesSearch && matchesRiskLevel;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Base de Dados de Agressores</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Consulte informações sobre agressores reportados pela comunidade. 
          Ajude a proteger outras mulheres compartilhando informações verificadas.
        </p>
      </div>

      {/* Warning */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-6 w-6 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-medium text-yellow-800">⚠️ Uso Responsável</h3>
            <p className="text-yellow-700 mt-1">
              As informações nesta base são fornecidas pela comunidade. Use com responsabilidade e sempre 
              verifique informações antes de tomar qualquer ação. Em caso de perigo imediato, contate as autoridades.
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {/* Phone Verification Section */}
        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <h3 className="text-lg font-semibold text-orange-800 mb-4">🔍 Verificação por Telefone</h3>
          <p className="text-sm text-orange-700 mb-4">
            Digite um número de telefone para verificar se já existe na nossa base de dados. 
            Esta informação é confidencial e não será exibida publicamente.
          </p>
          <div className="flex space-x-3">
            <input
              type="tel"
              placeholder="(11) 99999-9999"
              value={phoneQuery}
              onChange={(e) => setPhoneQuery(e.target.value)}
              className="flex-1 px-3 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <button
              onClick={handlePhoneVerification}
              disabled={!phoneQuery.trim()}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Verificar
            </button>
          </div>
          
          {phoneVerificationResult && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-6 w-6 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-red-800">⚠️ Número Encontrado na Base de Dados</h4>
                  <p className="text-red-700 mt-1">
                    Este número está associado a <strong>{phoneVerificationResult.name}</strong> com {phoneVerificationResult.reportCount} relato(s).
                  </p>
                  <button
                    onClick={() => setSelectedProfile(phoneVerificationResult.consolidatedProfile!)}
                    className="mt-2 bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-all duration-200"
                  >
                    Ver Ficha Completa
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {phoneQuery && !phoneVerificationResult && phoneQuery.length >= 10 && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <Shield className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-green-800">✅ Número Não Encontrado</h4>
                  <p className="text-green-700 mt-1">
                    Este número não consta em nossa base de dados de agressores.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome ou localização..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Risk Level Filter */}
          <div>
            <select
              value={selectedRiskLevel}
              onChange={(e) => setSelectedRiskLevel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {riskLevels.map(level => (
                <option key={level.id} value={level.id}>
                  Nível de Risco: {level.label}
                </option>
              ))}
            </select>
          </div>

          {/* Show Sensitive Content Toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSensitiveContent(!showSensitiveContent)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                showSensitiveContent
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {showSensitiveContent ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              <span className="text-sm">
                {showSensitiveContent ? 'Ocultar Detalhes' : 'Mostrar Detalhes'}
              </span>
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            {filteredReports.length} registro(s) encontrado(s)
          </p>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
          >
            Adicionar Relato
          </button>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Adicionar Relato de Agressor</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nome completo *"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Apelido ou como é conhecido"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <input
              type="number"
              placeholder="Idade aproximada"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Localização (bairro, cidade) *"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <input
              type="tel"
              placeholder="Telefone (opcional)"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <textarea
            placeholder="Descrição física e outras características relevantes *"
            className="w-full mt-4 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            rows={3}
          />
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Foto do agressor (opcional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                Clique para selecionar uma foto ou arraste aqui
              </p>
              <p className="text-xs text-gray-500">
                Apenas fotos claras do rosto. Máximo 5MB.
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhotoUpload(e.target.files?.[0] || null)}
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="mt-2 inline-block bg-gray-100 text-gray-700 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-200 transition-all duration-200"
              >
                Selecionar Foto
              </label>
            </div>
            {photoUpload && (
              <div className="mt-2 text-sm text-green-600">
                ✓ Foto selecionada: {photoUpload.name}
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
            >
              Cancelar
            </button>
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200">
              Enviar Relato
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="space-y-6">
        {filteredReports.map((report) => (
          <div key={report.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                <div className={`w-4 h-4 ${getRiskColor(report.riskLevel)} rounded-full mt-2`}></div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-gray-900">
                      {showSensitiveContent ? report.name : report.name.charAt(0) + '***'}
                    </h3>
                    {report.verified && (
                      <Shield className="h-4 w-4 text-green-500" title="Relato Verificado" />
                    )}
                  </div>
                  {report.alias && (
                    <p className="text-sm text-gray-600">
                      Conhecido como: {showSensitiveContent ? report.alias : '***'}
                    </p>
                  )}
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                    {report.age && (
                      <span>{report.age} anos</span>
                    )}
                    <span className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {report.location}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      Último relato: {new Date(report.lastReported).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-gray-600 mb-1">
                  {report.reportCount} relato(s)
                </div>
                <div className="flex flex-wrap gap-1">
                  {report.violenceTypes.map((type, index) => (
                    <span
                      key={index}
                      className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs"
                    >
                      {type}
                    </span>
                  ))}
                </div>
                <div className="flex space-x-2">
                  {report.consolidatedProfile && (
                    <button
                      onClick={() => setSelectedProfile(report.consolidatedProfile!)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-all duration-200 flex items-center space-x-1"
                    >
                      <FileText className="h-4 w-4" />
                      <span>Ver Ficha Completa</span>
                    </button>
                  )}
                  <button className="flex items-center space-x-2 text-gray-500 hover:text-red-600 transition-colors">
                    <Flag className="h-4 w-4" />
                    <span className="text-sm">Reportar</span>
                  </button>
                </div>
              </div>
            </div>

            {showSensitiveContent && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Características Físicas:</h4>
                <p className="text-sm text-gray-700">{report.description}</p>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 ${getRiskColor(report.riskLevel)} rounded-full`}></div>
                <span className="text-sm font-medium text-gray-700">
                  Nível de Risco: {riskLevels.find(l => l.id === report.riskLevel)?.label}
                </span>
              </div>
              
              <button className="flex items-center space-x-2 text-gray-500 hover:text-red-600 transition-colors">
                <Flag className="h-4 w-4" />
                <span className="text-sm">Reportar</span>
              </button>
            </div>
          </div>
        ))}

        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum resultado encontrado</h3>
            <p className="text-gray-600">
              Tente ajustar os filtros de busca ou adicione um novo relato.
            </p>
          </div>
        )}
      </div>

      {/* Consolidated Profile Modal */}
      {selectedProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col">
            {/* Profile Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {showSensitiveContent ? selectedProfile.fullName : selectedProfile.fullName.charAt(0) + '***'}
                  </h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{selectedProfile.communityReports.length} relatos da comunidade</span>
                    <span>{selectedProfile.officialRecords.length} registros oficiais</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedProfile.riskAssessment.level === 'critical' ? 'bg-red-100 text-red-700' :
                      selectedProfile.riskAssessment.level === 'high' ? 'bg-orange-100 text-orange-700' :
                      selectedProfile.riskAssessment.level === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      Risco {selectedProfile.riskAssessment.level === 'critical' ? 'Crítico' :
                             selectedProfile.riskAssessment.level === 'high' ? 'Alto' :
                             selectedProfile.riskAssessment.level === 'medium' ? 'Médio' : 'Baixo'}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedProfile(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Profile Tabs */}
            <div className="flex border-b border-gray-200">
              {[
                { id: 'overview', label: 'Visão Geral', icon: User },
                { id: 'reports', label: 'Relatos da Comunidade', icon: Users },
                { id: 'legal', label: 'Registros Oficiais', icon: Scale },
                { id: 'timeline', label: 'Linha do Tempo', icon: Calendar }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveProfileTab(tab.id as any)}
                    className={`flex-1 px-6 py-4 text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                      activeProfileTab === tab.id
                        ? 'text-blue-700 border-b-2 border-blue-500 bg-blue-50'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Profile Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Overview Tab */}
              {activeProfileTab === 'overview' && (
                <div className="space-y-6">
                  {/* Physical Description */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Descrição Física</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Características Gerais</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          {selectedProfile.physicalDescription.height && (
                            <p><strong>Altura:</strong> {selectedProfile.physicalDescription.height}</p>
                          )}
                          {selectedProfile.physicalDescription.build && (
                            <p><strong>Porte:</strong> {selectedProfile.physicalDescription.build}</p>
                          )}
                          {selectedProfile.physicalDescription.hairColor && (
                            <p><strong>Cabelo:</strong> {selectedProfile.physicalDescription.hairColor}</p>
                          )}
                          {selectedProfile.physicalDescription.eyeColor && (
                            <p><strong>Olhos:</strong> {selectedProfile.physicalDescription.eyeColor}</p>
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Marcas Distintivas</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          {selectedProfile.physicalDescription.distinctiveMarks?.map((mark, index) => (
                            <p key={index}>• {mark}</p>
                          ))}
                          {selectedProfile.physicalDescription.vehicle && (
                            <p><strong>Veículo:</strong> {selectedProfile.physicalDescription.vehicle}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Behavior Patterns */}
                  <div className="bg-red-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Padrões de Comportamento</h3>
                    <div className="space-y-4">
                      {selectedProfile.behaviorPatterns.map((pattern, index) => (
                        <div key={index} className="border border-red-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-red-800">{pattern.category}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              pattern.frequency === 'constant' ? 'bg-red-100 text-red-700' :
                              pattern.frequency === 'frequent' ? 'bg-orange-100 text-orange-700' :
                              pattern.frequency === 'occasional' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {pattern.frequency === 'constant' ? 'Constante' :
                               pattern.frequency === 'frequent' ? 'Frequente' :
                               pattern.frequency === 'occasional' ? 'Ocasional' : 'Raro'}
                            </span>
                          </div>
                          <p className="text-sm text-red-700 mb-2">{pattern.description}</p>
                          <div className="space-y-1">
                            {pattern.examples.map((example, exIndex) => (
                              <p key={exIndex} className="text-xs text-red-600">• {example}</p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Risk Assessment */}
                  <div className="bg-orange-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Avaliação de Risco</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="text-center mb-4">
                          <div className="text-3xl font-bold text-orange-600 mb-2">
                            {selectedProfile.riskAssessment.score}/100
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className="bg-orange-500 h-3 rounded-full"
                              style={{ width: `${selectedProfile.riskAssessment.score}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Fatores de Risco</h4>
                        <div className="space-y-1">
                          {selectedProfile.riskAssessment.factors.map((factor, index) => (
                            <p key={index} className="text-sm text-orange-700">• {factor}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Locations */}
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Localizações Conhecidas</h3>
                    <div className="space-y-3">
                      {selectedProfile.locations.map((location, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
                          <div>
                            <p className="font-medium text-gray-900">
                              {showSensitiveContent ? location.address : location.address.split(',')[0] + ', ***'}
                            </p>
                            <p className="text-sm text-gray-600">
                              {location.type === 'residence' ? 'Residência' :
                               location.type === 'workplace' ? 'Trabalho' :
                               location.type === 'frequent' ? 'Local Frequente' : 'Local de Incidente'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-blue-600">{location.reportCount} relatos</p>
                            <p className="text-xs text-gray-500">Último: {location.lastSeen}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Community Reports Tab */}
              {activeProfileTab === 'reports' && (
                <div className="space-y-4">
                  {selectedProfile.communityReports.map((report, index) => (
                    <div key={report.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold text-gray-900">{report.violenceType}</h4>
                            {report.verified && (
                              <Shield className="h-4 w-4 text-green-500" title="Relato Verificado" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            Por: {report.reporterName} • {new Date(report.date).toLocaleDateString('pt-BR')}
                          </p>
                          <p className="text-sm text-gray-600">Local: {report.location}</p>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-4">{report.description}</p>
                      {report.evidence && report.evidence.length > 0 && (
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Evidências:</h5>
                          <div className="flex flex-wrap gap-2">
                            {report.evidence.map((evidence, evIndex) => (
                              <span key={evIndex} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm">
                                {evidence}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Legal Records Tab */}
              {activeProfileTab === 'legal' && (
                <div className="space-y-4">
                  {selectedProfile.officialRecords.map((record, index) => (
                    <div key={record.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">
                            {record.type === 'criminal' ? 'Processo Criminal' :
                             record.type === 'civil' ? 'Processo Cível' :
                             record.type === 'protective' ? 'Medida Protetiva' : 'Ordem Restritiva'}
                          </h4>
                          <p className="text-sm text-gray-600">Processo: {record.processNumber}</p>
                          <p className="text-sm text-gray-600">Tribunal: {record.court}</p>
                          <p className="text-sm text-gray-600">Data: {new Date(record.date).toLocaleDateString('pt-BR')}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          record.status === 'active' ? 'bg-red-100 text-red-700' :
                          record.status === 'closed' ? 'bg-gray-100 text-gray-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {record.status === 'active' ? 'Ativo' :
                           record.status === 'closed' ? 'Encerrado' : 'Pendente'}
                        </span>
                      </div>
                      
                      <div className="mb-4">
                        <h5 className="font-medium text-gray-900 mb-2">Acusações:</h5>
                        <div className="flex flex-wrap gap-2">
                          {record.charges.map((charge, chIndex) => (
                            <span key={chIndex} className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm">
                              {charge}
                            </span>
                          ))}
                        </div>
                      </div>

                      {record.outcome && (
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                          <h5 className="font-medium text-blue-800 mb-1">Resultado:</h5>
                          <p className="text-sm text-blue-700">{record.outcome}</p>
                        </div>
                      )}

                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">Documentos:</h5>
                        <div className="flex flex-wrap gap-2">
                          {record.documents.map((doc, docIndex) => (
                            <span key={docIndex} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                              {doc}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Timeline Tab */}
              {activeProfileTab === 'timeline' && (
                <div className="space-y-4">
                  {selectedProfile.timeline.map((event, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className={`w-4 h-4 rounded-full mt-2 ${
                        event.type === 'legal' ? 'bg-blue-500' :
                        event.type === 'incident' ? 'bg-red-500' :
                        event.type === 'report' ? 'bg-orange-500' :
                        'bg-yellow-500'
                      }`}></div>
                      <div className="flex-1 border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">
                            {new Date(event.date).toLocaleDateString('pt-BR')}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            event.source === 'official' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                          }`}>
                            {event.source === 'official' ? 'Oficial' : 'Comunidade'}
                          </span>
                        </div>
                        <p className="text-gray-700">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-blue-800">Sobre a Verificação</h4>
            <p className="text-sm text-blue-700 mt-1">
              Relatos verificados passaram por checagem de nossa equipe. 
              Todos os dados são tratados com confidencialidade e usados apenas para proteger a comunidade.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AggressorDatabase;