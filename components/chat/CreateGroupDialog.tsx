import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { groupCategories } from './constants'
import { getCategoryInfo } from './helpers'

interface CreateGroupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  newGroup: {
    name: string
    description: string
    isPrivate: boolean
    category: string
  }
  onGroupChange: (group: any) => void
  onCreateGroup: () => void
}

export function CreateGroupDialog({ 
  open, 
  onOpenChange, 
  newGroup, 
  onGroupChange, 
  onCreateGroup 
}: CreateGroupDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Criar Novo Grupo</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="block text-sm mb-2 text-gray-700">Nome do Grupo *</label>
            <Input
              value={newGroup.name}
              onChange={(e) => onGroupChange({ ...newGroup, name: e.target.value })}
              placeholder="Ex: Mães Solteiras da Zona Sul"
              maxLength={50}
              className="rounded-xl"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-gray-700">Categoria *</label>
            <select
              value={newGroup.category}
              onChange={(e) => onGroupChange({ ...newGroup, category: e.target.value })}
              className="w-full p-2 border rounded-xl border-gray-300 focus:border-purple-500"
            >
              <option value="">Selecione uma categoria</option>
              {groupCategories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
            {newGroup.category && (
              <p className="text-xs text-gray-500 mt-1">
                Ex: {getCategoryInfo(newGroup.category).example}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-2 text-gray-700">Descrição *</label>
            <Textarea
              value={newGroup.description}
              onChange={(e) => onGroupChange({ ...newGroup, description: e.target.value })}
              placeholder="Descreva o propósito e as regras do grupo..."
              rows={3}
              maxLength={200}
              className="rounded-xl resize-none"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isPrivate"
              checked={newGroup.isPrivate}
              onChange={(e) => onGroupChange({ ...newGroup, isPrivate: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="isPrivate" className="text-sm text-gray-700">
              Grupo privado (apenas por convite)
            </label>
          </div>

          <Button 
            onClick={onCreateGroup} 
            className="w-full bg-purple-600 hover:bg-purple-700 rounded-xl"
            disabled={!newGroup.name.trim() || !newGroup.description.trim() || !newGroup.category}
          >
            Criar Grupo
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}