import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Edit, Save, X, User, Upload } from 'lucide-react'

export function EditProfileForm({ 
  editForm, 
  setEditForm, 
  saveProfile, 
  setIsEditing, 
  profile,
  onPhotoUpload
}) {
  const handleNameChange = (e) => {
    setEditForm(prev => ({ ...prev, name: e.target.value }))
  }

  const handleCityChange = (e) => {
    setEditForm(prev => ({ ...prev, city: e.target.value }))
  }

  const handleStateChange = (e) => {
    setEditForm(prev => ({ ...prev, state: e.target.value }))
  }

  const handleDescriptionChange = (e) => {
    setEditForm(prev => ({ ...prev, description: e.target.value }))
  }

  const handlePhotoUrlChange = (e) => {
    setEditForm(prev => ({ ...prev, profilePhoto: e.target.value }))
  }

  return (
    <Card className="mb-6 bg-gradient-to-br from-white to-purple-50/30 shadow-xl border-0">
      <CardHeader>
        <CardTitle className="text-purple-800 flex items-center gap-2">
          <Edit className="w-5 h-5" />
          Editar Perfil
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label htmlFor="edit-name" className="block text-sm text-purple-700 mb-2">Nome completo *</label>
          <Input
            id="edit-name"
            type="text"
            value={editForm.name}
            onChange={handleNameChange}
            placeholder="Digite seu nome completo"
            className="rounded-xl border-purple-200 focus:border-purple-500"
            autoComplete="name"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="edit-city" className="block text-sm text-purple-700 mb-2">Cidade</label>
            <Input
              id="edit-city"
              type="text"
              value={editForm.city}
              onChange={handleCityChange}
              placeholder="Sua cidade"
              className="rounded-xl border-purple-200 focus:border-purple-500"
              autoComplete="address-level2"
            />
          </div>
          <div>
            <label htmlFor="edit-state" className="block text-sm text-purple-700 mb-2">Estado</label>
            <Input
              id="edit-state"
              type="text"
              value={editForm.state}
              onChange={handleStateChange}
              placeholder="UF (ex: SP)"
              maxLength={2}
              className="rounded-xl border-purple-200 focus:border-purple-500 uppercase"
              autoComplete="address-level1"
            />
          </div>
        </div>

        <div>
          <label htmlFor="edit-description" className="block text-sm text-purple-700 mb-2">Sobre você</label>
          <Textarea
            id="edit-description"
            value={editForm.description}
            onChange={handleDescriptionChange}
            placeholder="Conte um pouco sobre você, sua profissão, interesses..."
            rows={4}
            maxLength={500}
            className="rounded-xl border-purple-200 focus:border-purple-500 resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            {editForm.description.length}/500 caracteres
          </p>
        </div>

        <div>
          <label className="block text-sm text-purple-700 mb-2">Foto de Perfil</label>
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20 shadow-md">
              <AvatarImage src={editForm.profilePhoto} />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xl">
                {editForm.name?.charAt(0) || <User className="w-8 h-8" />}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <Input
                id="edit-photo-url"
                type="url"
                value={editForm.profilePhoto}
                onChange={handlePhotoUrlChange}
                placeholder="Cole o URL da sua foto aqui"
                className="rounded-xl border-purple-200 focus:border-purple-500"
              />
              <div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full rounded-xl border-purple-200 hover:bg-purple-50"
                  onClick={onPhotoUpload}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Fazer Upload de Foto
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-3 pt-4">
          <Button 
            onClick={saveProfile} 
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl shadow-lg flex-1"
            disabled={!editForm.name?.trim()}
          >
            <Save className="w-4 h-4 mr-2" />
            Salvar Alterações
          </Button>
          <Button 
            variant="outline" 
            onClick={() => {
              setIsEditing(false)
              setEditForm({
                name: profile?.name || '',
                city: profile?.city || '',
                state: profile?.state || '',
                description: profile?.description || '',
                profilePhoto: profile?.profilePhoto || ''
              })
            }}
            className="rounded-xl border-purple-200 hover:bg-purple-50"
          >
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}