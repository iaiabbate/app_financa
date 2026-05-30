'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CATEGORIES, Transaction, TransactionType } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  transaction?: Transaction
}

export function TransactionForm({ open, onClose, onSuccess, transaction }: Props) {
  const isEditing = !!transaction
  const supabase = createClient()

  const [type, setType] = useState<TransactionType>(transaction?.type ?? 'expense')
  const [amount, setAmount] = useState(transaction ? String(transaction.amount) : '')
  const [description, setDescription] = useState(transaction?.description ?? '')
  const [category, setCategory] = useState(transaction?.category ?? '')
  const [date, setDate] = useState(transaction?.date ?? new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)

  const filteredCategories = CATEGORIES.filter(
    (c) => c.type === type || c.type === 'both'
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!category) { toast.error('Selecione uma categoria.'); return }

    const parsedAmount = parseFloat(amount.replace(',', '.'))
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error('Valor inválido.')
      return
    }

    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast.error('Sessão expirada. Faça login novamente.')
      setLoading(false)
      return
    }

    const basePayload = { type, amount: parsedAmount, description, category, date }

    if (isEditing) {
      const { error } = await supabase
        .from('transactions')
        .update(basePayload)
        .eq('id', transaction.id)

      if (error) {
        toast.error('Erro ao atualizar transação: ' + error.message)
        setLoading(false)
        return
      }
      toast.success('Transação atualizada!')
    } else {
      const { error } = await supabase
        .from('transactions')
        .insert({ ...basePayload, user_id: user.id })

      if (error) {
        toast.error('Erro ao salvar transação: ' + error.message)
        setLoading(false)
        return
      }
      toast.success('Transação adicionada!')
    }

    setLoading(false)
    onSuccess()
    onClose()
  }

  function handleClose() {
    if (!loading) onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar transação' : 'Nova transação'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Type toggle */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => { setType('expense'); setCategory('') }}
              className={cn(
                'py-2 rounded-lg text-sm font-medium border transition-colors',
                type === 'expense'
                  ? 'bg-red-50 border-red-200 text-red-700'
                  : 'border-slate-200 text-slate-500 hover:bg-slate-50'
              )}
            >
              Despesa
            </button>
            <button
              type="button"
              onClick={() => { setType('income'); setCategory('') }}
              className={cn(
                'py-2 rounded-lg text-sm font-medium border transition-colors',
                type === 'income'
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : 'border-slate-200 text-slate-500 hover:bg-slate-50'
              )}
            >
              Receita
            </button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Valor (R$)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              type="text"
              placeholder="Ex: Supermercado, Salário..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select value={category} onValueChange={(v) => v && setCategory(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {filteredCategories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={handleClose} disabled={loading}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className={cn('flex-1', type === 'income' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700')}
              disabled={loading}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {isEditing ? 'Salvar' : 'Adicionar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
