import { MonthlySummary } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'
import { cn } from '@/lib/utils'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

type Props = { summary: MonthlySummary }

export function SummaryCards({ summary }: Props) {
  const cards = [
    {
      label: 'Receitas',
      value: summary.totalIncome,
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-100',
      valueColor: 'text-green-600',
    },
    {
      label: 'Despesas',
      value: summary.totalExpenses,
      icon: TrendingDown,
      color: 'text-red-500',
      bg: 'bg-red-50',
      border: 'border-red-100',
      valueColor: 'text-red-500',
    },
    {
      label: 'Saldo',
      value: summary.balance,
      icon: Wallet,
      color: summary.balance >= 0 ? 'text-blue-600' : 'text-orange-500',
      bg: summary.balance >= 0 ? 'bg-blue-50' : 'bg-orange-50',
      border: summary.balance >= 0 ? 'border-blue-100' : 'border-orange-100',
      valueColor: summary.balance >= 0 ? 'text-blue-700' : 'text-orange-600',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map(({ label, value, icon: Icon, color, bg, border, valueColor }) => (
        <Card key={label} className={cn('border-0 shadow-sm', border)}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-500">{label}</span>
              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', bg)}>
                <Icon className={cn('w-4 h-4', color)} />
              </div>
            </div>
            <p className={cn('text-2xl font-bold', valueColor)}>{formatCurrency(value)}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
