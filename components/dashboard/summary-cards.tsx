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
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-50 dark:bg-green-950/40',
      valueColor: 'text-green-600 dark:text-green-400',
    },
    {
      label: 'Despesas',
      value: summary.totalExpenses,
      icon: TrendingDown,
      color: 'text-red-500 dark:text-red-400',
      bg: 'bg-red-50 dark:bg-red-950/40',
      valueColor: 'text-red-500 dark:text-red-400',
    },
    {
      label: 'Saldo',
      value: summary.balance,
      icon: Wallet,
      color: summary.balance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-500 dark:text-orange-400',
      bg: summary.balance >= 0 ? 'bg-blue-50 dark:bg-blue-950/40' : 'bg-orange-50 dark:bg-orange-950/40',
      valueColor: summary.balance >= 0 ? 'text-blue-700 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map(({ label, value, icon: Icon, color, bg, valueColor }) => (
        <Card key={label} className="border-0 shadow-sm dark:bg-slate-900 dark:border dark:border-slate-800">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</span>
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
