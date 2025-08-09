import React, { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Shield, Phone, AlertTriangle, Lock, ArrowRight, Users, Heart, MapPin } from 'lucide-react'

export function EmergencyLandingScreen({ onContinue, onToggleDisguise }) {
  const [showDetails, setShowDetails] = useState(false)

  const callEmergency = (number, service) => {
    if (window.confirm(`🆘 EMERGÊNCIA\n\nDeseja ligar para ${service}?\nNúmero: ${number}\n\n⚠️ Use apenas em emergências reais`)) {
      window.open(`tel:${number}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 via-purple-100 to-pink-100">
      {/* Header de emergência sempre visível */}
      <div className="bg-red-600 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <AlertTriangle className="w-10 h-10 animate-pulse" />
            <h1 className="text-3xl">🆘 EMERGÊNCIA</h1>
            <AlertTriangle className="w-10 h-10 animate-pulse" />
          </div>
          
          <h2 className="text-xl mb-2">ACESSO DIRETO - NÃO PRECISA ENTRAR NO APP</h2>
          <p className="text-red-100 mb-6">
            Em situação de risco? Toque nos botões abaixo para ligar imediatamente
          </p>

          {/* Botões de emergência grandes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Button
              onClick={() => callEmergency('190', 'Polícia Militar - Emergências Gerais')}
              className="h-20 bg-blue-700 hover:bg-blue-800 text-white shadow-2xl transform transition-all hover:scale-105 border-4 border-blue-300"
              size="lg"
            >
              <div className="flex items-center gap-4">
                <div className="bg-white bg-opacity-30 p-3 rounded-full">
                  <Phone className="w-8 h-8" />
                </div>
                <div className="text-left">
                  <div className="text-3xl">190</div>
                  <div className="text-sm opacity-90">Polícia Militar</div>
                  <div className="text-xs opacity-75">Emergências Gerais</div>
                </div>
              </div>
            </Button>
            
            <Button
              onClick={() => callEmergency('180', 'Central de Atendimento à Mulher em Situação de Violência')}
              className="h-20 bg-purple-700 hover:bg-purple-800 text-white shadow-2xl transform transition-all hover:scale-105 border-4 border-purple-300"
              size="lg"
            >
              <div className="flex items-center gap-4">
                <div className="bg-white bg-opacity-30 p-3 rounded-full">
                  <Phone className="w-8 h-8" />
                </div>
                <div className="text-left">
                  <div className="text-3xl">180</div>
                  <div className="text-sm opacity-90">Central da Mulher</div>
                  <div className="text-xs opacity-75">24h • Gratuito • Sigiloso</div>
                </div>
              </div>
            </Button>
          </div>

          {/* Outros números importantes */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 max-w-3xl mx-auto">
            <Button
              onClick={() => callEmergency('192', 'SAMU - Emergências Médicas')}
              className="h-12 bg-green-600 hover:bg-green-700 text-white text-xs"
            >
              <div className="text-center">
                <div className="text-base">192</div>
                <div className="text-xs">SAMU</div>
              </div>
            </Button>
            
            <Button
              onClick={() => callEmergency('193', 'Corpo de Bombeiros')}
              className="h-12 bg-red-700 hover:bg-red-800 text-white text-xs"
            >
              <div className="text-center">
                <div className="text-base">193</div>
                <div className="text-xs">Bombeiros</div>
              </div>
            </Button>
            
            <Button
              onClick={() => callEmergency('197', 'Polícia Civil')}
              className="h-12 bg-gray-600 hover:bg-gray-700 text-white text-xs"
            >
              <div className="text-center">
                <div className="text-base">197</div>
                <div className="text-xs">Polícia Civil</div>
              </div>
            </Button>
            
            <Button
              onClick={() => callEmergency('100', 'Disque Direitos Humanos')}
              className="h-12 bg-orange-600 hover:bg-orange-700 text-white text-xs"
            >
              <div className="text-center">
                <div className="text-base">100</div>
                <div className="text-xs">Dir. Humanos</div>
              </div>
            </Button>
          </div>

          <div className="text-center mt-4">
            <p className="text-xs text-red-200">
              ⚠️ Use apenas em emergências reais • Denúncias falsas são crime
            </p>
          </div>
        </div>
      </div>

      {/* Seção do aplicativo */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-12 h-12 text-purple-600" />
            <h2 className="text-3xl text-purple-800">Ellos</h2>
          </div>
          
          <h3 className="text-xl text-purple-700 mb-3">
            Rede de Apoio e Proteção para Mulheres
          </h3>
          
          <p className="text-purple-600 mb-6 max-w-2xl mx-auto leading-relaxed">
            Além dos números de emergência, oferecemos uma rede completa de apoio mútuo, 
            sistema de voluntárias próximas, botão de pânico inteligente e base colaborativa 
            contra agressores.
          </p>

          {/* Features principais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-purple-200 bg-purple-50">
              <CardContent className="p-6 text-center">
                <AlertTriangle className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <h4 className="text-purple-800 mb-2">Botão de Pânico</h4>
                <p className="text-sm text-purple-700">
                  Conecta você com voluntárias próximas em menos de 5 minutos
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50">
              <CardContent className="p-6 text-center">
                <MapPin className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <h4 className="text-purple-800 mb-2">Rede de Voluntárias</h4>
                <p className="text-sm text-purple-700">
                  Mulheres disponíveis para ajudar com abrigo, transporte e apoio
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50">
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <h4 className="text-purple-800 mb-2">Base de Agressores</h4>
                <p className="text-sm text-purple-700">
                  Consulte informações sobre agressores conhecidos na comunidade
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Botões de ação */}
          <div className="space-y-4 max-w-md mx-auto">
            <Button
              onClick={onContinue}
              className="w-full h-14 bg-purple-600 hover:bg-purple-700 text-white text-lg shadow-lg"
              size="lg"
            >
              <Shield className="w-5 h-5 mr-2" />
              Entrar no Ellos
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            <Button
              onClick={onToggleDisguise}
              variant="outline"
              className="w-full h-12 border-purple-300 text-purple-700 hover:bg-purple-50"
            >
              <Lock className="w-4 h-4 mr-2" />
              Modo Calculadora (Disfarce)
            </Button>

            <Button
              onClick={() => setShowDetails(!showDetails)}
              variant="ghost"
              className="w-full text-purple-600 hover:text-purple-700"
              size="sm"
            >
              {showDetails ? 'Ocultar' : 'Mais'} informações sobre o app
            </Button>
          </div>

          {/* Detalhes expandidos */}
          {showDetails && (
            <Card className="mt-6 border-purple-200 bg-purple-50 max-w-2xl mx-auto">
              <CardContent className="p-6 text-left">
                <h4 className="text-purple-800 mb-3">🔒 Segurança e Privacidade</h4>
                <ul className="text-sm text-purple-700 space-y-2 mb-4">
                  <li>• Cadastro exclusivo para mulheres com validação por CPF</li>
                  <li>• Chat privado com criptografia ponta a ponta</li>
                  <li>• Modo disfarce como calculadora para proteção</li>
                  <li>• Conformidade total com LGPD</li>
                  <li>• Denúncias anônimas protegidas</li>
                </ul>

                <h4 className="text-purple-800 mb-3">🤝 Recursos Principais</h4>
                <ul className="text-sm text-purple-700 space-y-2">
                  <li>• Feed de apoio mútuo entre usuárias</li>
                  <li>• Sistema de busca de agressores por nome/CPF/telefone</li>
                  <li>• Mapa colaborativo de alertas e locais perigosos</li>
                  <li>• Marketplace de profissionais especializadas 24h</li>
                  <li>• Grupos de apoio temáticos</li>
                  <li>• Upload seguro de evidências e fotos</li>
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-600 mb-2">
            💜 Plataforma feita por mulheres, para mulheres • Dados protegidos • LGPD compliance
          </p>
          <p className="text-xs text-gray-500">
            Em emergências graves, sempre priorize ligar para 190 (Polícia) ou 180 (Central da Mulher)
          </p>
        </div>
      </div>
    </div>
  )
}