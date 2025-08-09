import React, { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Badge } from './ui/badge'
import { Shield, Eye, EyeOff, Phone, AlertTriangle, Fingerprint, UserCheck } from 'lucide-react'
import { supabase } from '../utils/supabase/client'
import { projectId, publicAnonKey } from '../utils/supabase/info'

export function AuthScreen({ onLogin, onToggleDisguise }) {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [biometricAvailable, setBiometricAvailable] = useState(false)

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })

  const [signupData, setSignupData] = useState({
    name: '',
    cpf: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    birthDate: ''
  })

  React.useEffect(() => {
    // Verificar se biometria está disponível
    checkBiometricSupport()
  }, [])

  const checkBiometricSupport = async () => {
    // Verificar se há credenciais WebAuthn disponíveis
    if (window.PublicKeyCredential && PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) {
      try {
        const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
        setBiometricAvailable(available)
      } catch (error) {
        console.log('Biometric check error:', error)
      }
    }
  }

  const callEmergency = (number, service) => {
    if (window.confirm(`🆘 EMERGÊNCIA\n\nDeseja ligar para ${service}?\nNúmero: ${number}`)) {
      // Tentar abrir o app de telefone
      window.open(`tel:${number}`)
    }
  }

  const formatCPF = (value) => {
    // Remove tudo que não é dígito
    const cleanValue = value.replace(/\D/g, '')
    
    // Aplica a máscara do CPF
    if (cleanValue.length <= 11) {
      return cleanValue
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    }
    
    return cleanValue.slice(0, 11)
      .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  const validateCPF = (cpf) => {
    const cleanCPF = cpf.replace(/\D/g, '')
    
    if (cleanCPF.length !== 11) return false
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cleanCPF)) return false
    
    // Validação do CPF usando algoritmo oficial
    let sum = 0
    let remainder
    
    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cleanCPF.substring(i-1, i)) * (11 - i)
    }
    
    remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== parseInt(cleanCPF.substring(9, 10))) return false
    
    sum = 0
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cleanCPF.substring(i-1, i)) * (12 - i)
    }
    
    remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== parseInt(cleanCPF.substring(10, 11))) return false
    
    return true
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password
      })

      if (error) {
        alert(`Erro no login: ${error.message}`)
        return
      }

      if (data?.user) {
        // Buscar perfil do usuário
        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-47a9aa23/user/profile`, {
          headers: {
            'Authorization': `Bearer ${data.session.access_token}`
          }
        })
        
        let profile = null
        if (response.ok) {
          const result = await response.json()
          profile = result.profile
        }

        onLogin({
          ...data.user,
          access_token: data.session.access_token,
          profile
        })
      }
    } catch (error) {
      console.log('Login error:', error)
      alert('Erro no login. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()

    // Validações
    if (!validateCPF(signupData.cpf)) {
      alert('CPF inválido. Verifique e tente novamente.')
      return
    }

    if (signupData.password !== signupData.confirmPassword) {
      alert('Senhas não coincidem')
      return
    }

    if (signupData.password.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres')
      return
    }

    setLoading(true)

    try {
      // Primeiro, criar o usuário no backend
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-47a9aa23/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          email: signupData.email,
          password: signupData.password,
          name: signupData.name,
          cpf: signupData.cpf.replace(/\D/g, ''), // Salvar CPF limpo
          phone: signupData.phone,
          birthDate: signupData.birthDate
        })
      })

      if (response.ok) {
        alert('Cadastro realizado com sucesso! Faça login para continuar.')
        // Limpar formulário
        setSignupData({
          name: '',
          cpf: '',
          email: '',
          password: '',
          confirmPassword: '',
          phone: '',
          birthDate: ''
        })
      } else {
        const error = await response.json()
        alert(`Erro no cadastro: ${error.error || 'Tente novamente'}`)
      }
    } catch (error) {
      console.log('Signup error:', error)
      alert('Erro no cadastro. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleBiometricLogin = async () => {
    if (!biometricAvailable) {
      alert('Biometria não disponível neste dispositivo')
      return
    }

    try {
      // Implementação futura da autenticação biométrica
      alert('🔐 Login biométrico será implementado em breve!\n\nEsta funcionalidade permitirá acesso rápido e seguro usando sua impressão digital ou reconhecimento facial.')
    } catch (error) {
      console.log('Biometric auth error:', error)
      alert('Erro na autenticação biométrica')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-purple-100">
      {/* Botões de Emergência - SEMPRE VISÍVEIS NO TOPO */}
      <div className="bg-red-50 border-b-4 border-red-200 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="text-center mb-4">
            <h2 className="text-lg text-red-800 mb-1">🆘 EMERGÊNCIA - ACESSO DIRETO</h2>
            <p className="text-sm text-red-700">
              Em situação de risco? Ligue imediatamente - não é preciso fazer login
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <Button
              onClick={() => callEmergency('190', 'Polícia Militar')}
              className="h-16 bg-blue-600 hover:bg-blue-700 text-white shadow-lg transform transition-all hover:scale-105"
              size="lg"
            >
              <div className="flex items-center gap-3">
                <div className="bg-white bg-opacity-20 p-2 rounded-full">
                  <Phone className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <div className="text-lg">190</div>
                  <div className="text-sm opacity-90">Polícia Militar</div>
                </div>
              </div>
            </Button>
            
            <Button
              onClick={() => callEmergency('180', 'Central de Atendimento à Mulher')}
              className="h-16 bg-purple-600 hover:bg-purple-700 text-white shadow-lg transform transition-all hover:scale-105"
              size="lg"
            >
              <div className="flex items-center gap-3">
                <div className="bg-white bg-opacity-20 p-2 rounded-full">
                  <Phone className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <div className="text-lg">180</div>
                  <div className="text-sm opacity-90">Central da Mulher</div>
                </div>
              </div>
            </Button>
          </div>
          
          <div className="text-center mt-3">
            <p className="text-xs text-red-600">
              ⚠️ Use apenas em emergências reais • Denúncias falsas são crime
            </p>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] p-4">
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Shield className="w-10 h-10 text-purple-600" />
              <CardTitle className="text-2xl text-purple-800">Ellos</CardTitle>
            </div>
            <p className="text-sm text-purple-600">
              Rede de apoio e proteção para mulheres
            </p>
            
            {/* Badges informativos */}
            <div className="flex flex-wrap justify-center gap-2 mt-3">
              <Badge className="bg-purple-100 text-purple-800 border border-purple-200">
                <UserCheck className="w-3 h-3 mr-1" />
                Acesso exclusivo para mulheres
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 border border-blue-200 text-xs">
                Verificação por CPF
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Entrar</TabsTrigger>
                <TabsTrigger value="signup">Cadastrar</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">
                      E-mail
                    </label>
                    <Input
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      placeholder="seu@email.com"
                      required
                      className="bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-gray-700">
                      Senha
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        placeholder="Sua senha"
                        required
                        className="bg-white pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    {loading ? 'Entrando...' : 'Entrar'}
                  </Button>

                  {/* Login Biométrico */}
                  {biometricAvailable && (
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-500">ou</span>
                      </div>
                    </div>
                  )}

                  {biometricAvailable && (
                    <Button
                      type="button"
                      onClick={handleBiometricLogin}
                      variant="outline"
                      className="w-full border-purple-200 hover:bg-purple-50"
                    >
                      <Fingerprint className="w-4 h-4 mr-2" />
                      Login Biométrico
                    </Button>
                  )}
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">
                      Nome Completo *
                    </label>
                    <Input
                      type="text"
                      value={signupData.name}
                      onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                      placeholder="Seu nome completo"
                      required
                      className="bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-gray-700">
                      CPF * <span className="text-xs text-purple-600">(necessário para verificação)</span>
                    </label>
                    <Input
                      type="text"
                      value={signupData.cpf}
                      onChange={(e) => setSignupData({ ...signupData, cpf: formatCPF(e.target.value) })}
                      placeholder="000.000.000-00"
                      maxLength="14"
                      required
                      className="bg-white"
                    />
                    {signupData.cpf && !validateCPF(signupData.cpf) && (
                      <p className="text-xs text-red-600 mt-1">CPF inválido</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-gray-700">
                      Data de Nascimento *
                    </label>
                    <Input
                      type="date"
                      value={signupData.birthDate}
                      onChange={(e) => setSignupData({ ...signupData, birthDate: e.target.value })}
                      required
                      className="bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-gray-700">
                      Telefone
                    </label>
                    <Input
                      type="tel"
                      value={signupData.phone}
                      onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                      placeholder="(11) 99999-9999"
                      className="bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-gray-700">
                      E-mail *
                    </label>
                    <Input
                      type="email"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      placeholder="seu@email.com"
                      required
                      className="bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-gray-700">
                      Senha *
                    </label>
                    <Input
                      type="password"
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      placeholder="Mínimo 6 caracteres"
                      required
                      minLength="6"
                      className="bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-gray-700">
                      Confirmar Senha *
                    </label>
                    <Input
                      type="password"
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                      placeholder="Confirme sua senha"
                      required
                      className="bg-white"
                    />
                    {signupData.confirmPassword && signupData.password !== signupData.confirmPassword && (
                      <p className="text-xs text-red-600 mt-1">Senhas não coincidem</p>
                    )}
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <h4 className="text-sm text-purple-800 mb-2">🔐 Seus dados estão seguros</h4>
                    <ul className="text-xs text-purple-700 space-y-1">
                      <li>• CPF usado apenas para verificação de identidade</li>
                      <li>• Dados protegidos conforme LGPD</li>
                      <li>• Acesso exclusivo para mulheres</li>
                    </ul>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading || !validateCPF(signupData.cpf) || signupData.password !== signupData.confirmPassword}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    {loading ? 'Cadastrando...' : 'Criar Conta'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Modo Disfarce */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleDisguise}
                className="w-full text-gray-600 hover:text-purple-600"
              >
                🔒 Modo Calculadora (Disfarce)
              </Button>
              <p className="text-xs text-gray-500 text-center mt-2">
                Para situações onde você precisa disfarçar o app
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer informativo */}
      <div className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xs text-gray-600 mb-2">
            💜 Rede de apoio mútuo • Dados protegidos • LGPD compliance
          </p>
          <p className="text-xs text-gray-500">
            Em emergências graves, ligue sempre para 190 (Polícia) ou 180 (Central da Mulher)
          </p>
        </div>
      </div>
    </div>
  )
}