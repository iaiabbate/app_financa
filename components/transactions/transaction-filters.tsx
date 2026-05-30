'use client'

import { CATEGORIES } from '@/types'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

type Props = {
  month: string
  category: string
  type: string
  onMonthChange: (v: string) => void
  onCategoryChange: (v: string) => void
  onTypeChange: (v: string) => void
  onReset: () => void
}

export function TransactionFilters({ month, category, type, onMonthChange, onCategoryChange, onTypeChange, onReset }: Props) {
  const hasFilters = category !== 'all' || type !== 'all'

  return (
    <div className="flex flex-wrap gap-3 items-end">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-slate-500">Mês</label>
        <Input
          type="month"
          value={month}
          onChange={(e) => onMonthChange(e.target.value)}
          className="w-40"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-slate-500">Tipo</label>
        <Select value={type} onValueChange={(v) => v && onTypeChange(v)}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="income">Receitas</SelectItem>
            <SelectItem value="expense">Despesas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-slate-500">Categoria</label>
        <Select value={category} onValueChange={(v) => v && onCategoryChange(v)}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={onReset} className="text-slate-400 hover:text-slate-600">
          <X className="w-4 h-4 mr-1" /> Limpar filtros
        </Button>
      )}
    </div>
  )
}
