'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CATEGORIES, Transaction } from '@/types'
import { TransactionForm } from './transaction-form'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from 'sonner'
import { MoreHorizontal, Pencil, Trash2, TrendingDown, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  transactions: Transaction[]
  onRefresh: () => void
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split('-')
  return `${day}/${month}/${year}`
}

function getCategoryLabel(value: string) {
  return CATEGORIES.find((c) => c.value === value)?.label ?? value
}

export function TransactionList({ transactions, onRefresh }: Props) {
  const supabase = createClient()
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)

  async function handleDelete(id: string) {
    const { error } = await supabase.from('transactions').delete().eq('id', id)
    if (error) { toast.error('Erro ao excluir.'); return }
    toast.success('Transação excluída.')
    onRefresh()
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <TrendingDown className="w-7 h-7 text-slate-300" />
        </div>
        <p className="font-medium text-slate-500">Nenhuma transação encontrada</p>
        <p className="text-sm mt-1">Adicione sua primeira transação clicando no botão acima.</p>
      </div>
    )
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="text-slate-500 text-sm">{formatDate(t.date)}</TableCell>
                <TableCell className="font-medium">{t.description}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">{getCategoryLabel(t.category)}</Badge>
                </TableCell>
                <TableCell>
                  {t.type === 'income' ? (
                    <span className="flex items-center gap-1 text-green-600 text-xs font-medium">
                      <TrendingUp className="w-3 h-3" /> Receita
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-500 text-xs font-medium">
                      <TrendingDown className="w-3 h-3" /> Despesa
                    </span>
                  )}
                </TableCell>
                <TableCell className={cn('text-right font-semibold', t.type === 'income' ? 'text-green-600' : 'text-red-500')}>
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md h-7 w-7 text-slate-500 hover:bg-slate-100 transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingTransaction(t)}>
                        <Pencil className="w-3.5 h-3.5 mr-2" /> Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600"
                        onClick={() => handleDelete(t.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-2" /> Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {transactions.map((t) => (
          <div key={t.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className={cn(
                'w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0',
                t.type === 'income' ? 'bg-green-50' : 'bg-red-50'
              )}>
                {t.type === 'income'
                  ? <TrendingUp className="w-4 h-4 text-green-600" />
                  : <TrendingDown className="w-4 h-4 text-red-500" />
                }
              </div>
              <div className="min-w-0">
                <p className="font-medium text-sm text-slate-800 truncate">{t.description}</p>
                <p className="text-xs text-slate-400">{getCategoryLabel(t.category)} · {formatDate(t.date)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className={cn('font-semibold text-sm', t.type === 'income' ? 'text-green-600' : 'text-red-500')}>
                {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md h-7 w-7 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setEditingTransaction(t)}>
                    <Pencil className="w-3.5 h-3.5 mr-2" /> Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600"
                    onClick={() => handleDelete(t.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-2" /> Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>

      {editingTransaction && (
        <TransactionForm
          open={!!editingTransaction}
          onClose={() => setEditingTransaction(null)}
          onSuccess={onRefresh}
          transaction={editingTransaction}
        />
      )}
    </>
  )
}
