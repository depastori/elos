import React, { useState } from 'react';
import { Map, Filter, AlertTriangle, MapPin, Eye, EyeOff, Search, Navigation } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  location?: { lat: number; lng: number; address: string };
}

interface AggressorMapProps {
  user: User;
}

type AggressorType = 'domestic' | 'workplace' | 'public' | 'digital' | 'sexual';
type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

type AggressorLocation = {
  id: number;
  name: string;
  type: AggressorType;
  riskLevel: RiskLevel;
  location: { lat: number; lng: number; address: string };
  reportCount: number;
  lastSeen: string;
  description: string;
  verified: boolean;
};

const AggressorMap: React.FC<AggressorMapProps> = ({ user }) => {
  const [selectedTypes, setSelectedTypes] = useState<AggressorType[]>(['domestic', 'workplace', 'public', 'digital', 'sexual']);
  const [selectedRiskLevels, setSelectedRiskLevels] = useState<RiskLevel[]>(['low', 'medium', 'high', 'critical']);
  const [showSensitiveInfo, setShowSensitiveInfo] = useState(false);
  const [searchRadius, setSearchRadius] = useState(5); // km
  const [selectedAggressor, setSelectedAggressor] = useState<AggressorLocation | null>(null);

  const aggressorTypes = [
    { id: 'domestic', label: 'Violência Doméstica', color: 'bg-red-500', icon: '🏠' },
    { id: 'workplace', label: 'Assédio no Trabalho', color: 'bg-orange-500', icon: '🏢' },
    { id: 'public', label: 'Espaço Público', color: 'bg-yellow-500', icon: '🌍' },
    { id: 'digital', label: 'Violência Digital', color: 'bg-blue-500', icon: '📱' },
    { id: 'sexual', label: 'Violência Sexual', color: 'bg-purple-500', icon: '⚠️' },
  ];

  const riskLevels = [
    { id: 'low', label: 'Baixo', color: 'bg-green-500' },
    { id: 'medium', label: 'Médio', color: 'bg-yellow-500' },
    { id: 'high', label: 'Alto', color: 'bg-orange-500' },
    { id: 'critical', label: 'Crítico', color: 'bg-red-500' },
  ];

  // Dados simulados de agressores mapeados
  const aggressorLocations: AggressorLocation[] = [
    {
      id: 1,
      name: 'João S.',
      type: 'domestic',
      riskLevel: 'high',
      location: { lat: -23.5505, lng: -46.6333, address: 'Centro, São Paulo' },
      reportCount: 12,
      lastSeen: '2024-01-15',
      description: 'Altura média, cabelos escuros, frequenta bares da região',
      verified: true,
    },
    {
      id: 2,
      name: 'Carlos M.',
      type: 'workplace',
      riskLevel: 'medium',
      location: { lat: -23.5489, lng: -46.6388, address: 'Vila Madalena, São Paulo' },
      reportCount: 8,
      lastSeen: '2024-01-10',
      description: 'Gerente de empresa, sempre bem vestido',
      verified: false,
    },
    {
      id: 3,
      name: 'Roberto O.',
      type: 'public',
      riskLevel: 'critical',
      location: { lat: -23.5629, lng: -46.6544, address: 'Jardins, São Paulo' },
      reportCount: 15,
      lastSeen: '2024-01-20',
      description: 'Aborda mulheres em transporte público',
      verified: true,
    },
    {
      id: 4,
      name: 'Anderson C.',
      type: 'digital',
      riskLevel: 'low',
      location: { lat: -23.5505, lng: -46.6050, address: 'Mooca, São Paulo' },
      reportCount: 5,
      lastSeen: '2024-01-08',
      description: 'Perfis falsos em redes sociais',
      verified: false,
    },
  ];

  const filteredAggressors = aggressorLocations.filter(aggressor => 
    selectedTypes.includes(aggressor.type) && 
    selectedRiskLevels.includes(aggressor.riskLevel)
  );

  const toggleType = (type: AggressorType) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const toggleRiskLevel = (level: RiskLevel) => {
    setSelectedRiskLevels(prev => 
      prev.includes(level) 
        ? prev.filter(l => l !== level)
        : [...prev, level]
    );
  };

  const getRiskColor = (level: RiskLevel) => {
    const colors = {
      low: 'bg-green-500',
      medium: 'bg-yellow-500',
      high: 'bg-orange-500',
      critical: 'bg-red-500',
    };
    return colors[level];
  };

  const getTypeColor = (type: AggressorType) => {
    const typeData = aggressorTypes.find(t => t.id === type);
    return typeData?.color || 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Map className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Mapa de Alertas</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Visualize a localização de agressores reportados na sua região. Use essas informações para se manter segura.
        </p>
      </div>

      {/* Warning */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-6 w-6 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-medium text-yellow-800">⚠️ Uso Responsável</h3>
            <p className="text-yellow-700 mt-1">
              Este mapa é baseado em relatos da comunidade. Use as informações com responsabilidade e sempre priorize sua segurança.
              Em caso de perigo imediato, contate as autoridades.
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Type Filters */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Tipos de Agressão</h3>
            <div className="space-y-2">
              {aggressorTypes.map(type => (
                <label key={type.id} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type.id as AggressorType)}
                    onChange={() => toggleType(type.id as AggressorType)}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <span className="text-lg">{type.icon}</span>
                  <span className="text-sm text-gray-700">{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Risk Level Filters */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Nível de Risco</h3>
            <div className="space-y-2">
              {riskLevels.map(level => (
                <label key={level.id} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedRiskLevels.includes(level.id as RiskLevel)}
                    onChange={() => toggleRiskLevel(level.id as RiskLevel)}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <div className={`w-4 h-4 ${level.color} rounded-full`}></div>
                  <span className="text-sm text-gray-700">{level.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Configurações</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Raio de busca: {searchRadius}km
                </label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={searchRadius}
                  onChange={(e) => setSearchRadius(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
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
                  {showSensitiveInfo ? 'Ocultar Detalhes' : 'Mostrar Detalhes'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-96 bg-gradient-to-br from-blue-100 to-green-100 relative flex items-center justify-center">
          <div className="text-center">
            <Map className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">Mapa Interativo</h3>
            <p className="text-sm text-gray-500">
              Aqui seria exibido um mapa real com as localizações dos agressores reportados
            </p>
          </div>
          
          {/* Simulated Map Markers */}
          {filteredAggressors.map((aggressor, index) => (
            <button
              key={aggressor.id}
              onClick={() => setSelectedAggressor(aggressor)}
              className={`absolute w-6 h-6 ${getRiskColor(aggressor.riskLevel)} rounded-full border-2 border-white shadow-lg hover:scale-110 transition-transform duration-200`}
              style={{
                left: `${20 + index * 15}%`,
                top: `${30 + index * 10}%`,
              }}
              title={`${aggressor.name} - ${aggressor.type}`}
            >
              <span className="text-xs text-white font-bold">!</span>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Aggressor Details */}
      {selectedAggressor && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Detalhes do Alerta</h3>
            <button
              onClick={() => setSelectedAggressor(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <div className={`w-4 h-4 ${getRiskColor(selectedAggressor.riskLevel)} rounded-full`}></div>
                <span className="font-medium">
                  {showSensitiveInfo ? selectedAggressor.name : selectedAggressor.name.charAt(0) + '***'}
                </span>
                {selectedAggressor.verified && (
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                    Verificado
                  </span>
                )}
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <MapPin className="inline h-4 w-4 mr-1" />
                  {selectedAggressor.location.address}
                </p>
                <p>Tipo: {aggressorTypes.find(t => t.id === selectedAggressor.type)?.label}</p>
                <p>Relatórios: {selectedAggressor.reportCount}</p>
                <p>Último avistamento: {new Date(selectedAggressor.lastSeen).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
            
            {showSensitiveInfo && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Descrição:</h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {selectedAggressor.description}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
          <div className="text-2xl font-bold text-red-600 mb-2">{filteredAggressors.length}</div>
          <div className="text-sm text-gray-600">Alertas na Região</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
          <div className="text-2xl font-bold text-orange-600 mb-2">
            {filteredAggressors.filter(a => a.riskLevel === 'high' || a.riskLevel === 'critical').length}
          </div>
          <div className="text-sm text-gray-600">Alto Risco</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
          <div className="text-2xl font-bold text-green-600 mb-2">
            {filteredAggressors.filter(a => a.verified).length}
          </div>
          <div className="text-sm text-gray-600">Verificados</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
          <div className="text-2xl font-bold text-purple-600 mb-2">{searchRadius}</div>
          <div className="text-sm text-gray-600">Raio (km)</div>
        </div>
      </div>

      {/* Safety Tips */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 text-white">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold mb-2">Dicas de Segurança com Base no Mapa</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-semibold">🗺️ Usando o Mapa:</h4>
            <ul className="space-y-1 text-sm text-purple-100">
              <li>• Verifique a área antes de sair de casa</li>
              <li>• Evite locais com muitos alertas</li>
              <li>• Compartilhe sua localização com pessoas de confiança</li>
              <li>• Prefira rotas com boa iluminação e movimento</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold">⚠️ Em Caso de Avistamento:</h4>
            <ul className="space-y-1 text-sm text-purple-100">
              <li>• Mantenha distância segura</li>
              <li>• Procure um local público e seguro</li>
              <li>• Contate as autoridades se necessário</li>
              <li>• Reporte a localização atualizada</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AggressorMap;