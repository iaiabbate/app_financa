import { CATEGORIES, Transaction } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { TrendingDown, TrendingUp } from 'lucide-react'
import Link from 'next/link'

type Props = { transactions: Transaction[] }

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split('-')
  return `${day}/${month}/${year}`
}

export function RecentTransactions({ transactions }: Props) {
  const recent = transactions.slice(0, 5)

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base font-semibold">Últimas Transações</CardTitle>
        <Link href="/transactions" className="text-xs text-blue-600 hover:underline">
          Ver todas
        </Link>
      </CardHeader>
      <CardContent>
        {recent.length === 0 ? (
          <p className="text-center text-slate-400 text-sm py-8">Nenhuma transação ainda</p>
        ) : (
          <div className="space-y-3">
            {recent.map((t) => (
              <div key={t.id} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                    t.type === 'income' ? 'bg-green-50' : 'bg-red-50'
                  )}>
                    {t.type === 'income'
                      ? <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                      : <TrendingDown className="w-3.5 h-3.5 text-red-500" />
                    }
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{t.description}</p>
                    <p className="text-xs text-slate-400">
                      {CATEGORIES.find((c) => c.value === t.category)?.label} · {formatDate(t.date)}
                    </p>
                  </div>
                </div>
                <span className={cn('text-sm font-semibold flex-shrink-0', t.type === 'income' ? 'text-green-600' : 'text-red-500')}>
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
