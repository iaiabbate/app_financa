'use client'

import { CATEGORIES, Transaction } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

type ChartEntry = { name: string; value: number; color: string }

type Props = { transactions: Transaction[] }

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

function buildData(transactions: Transaction[], type: 'income' | 'expense'): ChartEntry[] {
  const filtered = transactions.filter((t) => t.type === type)
  const grouped = filtered.reduce<Record<string, number>>((acc, t) => {
    acc[t.category] = (acc[t.category] ?? 0) + t.amount
    return acc
  }, {})

  return Object.entries(grouped)
    .map(([cat, value]) => ({
      name: CATEGORIES.find((c) => c.value === cat)?.label ?? cat,
      value,
      color: CATEGORIES.find((c) => c.value === cat)?.color ?? '#94a3b8',
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8)
}

function DonutCard({
  title,
  data,
  emptyMsg,
  total,
}: {
  title: string
  data: ChartEntry[]
  emptyMsg: string
  total: number
}) {
  if (data.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10 text-slate-400 text-sm">{emptyMsg}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [formatCurrency(Number(value)), 'Total']}
              contentStyle={{
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.15)',
                fontSize: '12px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Legend with values and percentage */}
        <div className="space-y-2">
          {data.map((entry) => {
            const pct = total > 0 ? ((entry.value / total) * 100).toFixed(1) : '0'
            return (
              <div key={entry.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-slate-600 truncate">{entry.name}</span>
                </div>
                <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                  <span className="text-slate-400 text-xs">{pct}%</span>
                  <span className="font-medium text-slate-800">{formatCurrency(entry.value)}</span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export function CategoryChart({ transactions }: Props) {
  const expenseData = buildData(transactions, 'expense')
  const incomeData = buildData(transactions, 'income')

  const totalExpenses = expenseData.reduce((s, e) => s + e.value, 0)
  const totalIncome = incomeData.reduce((s, e) => s + e.value, 0)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <DonutCard
        title="Despesas por Categoria"
        data={expenseData}
        emptyMsg="Nenhuma despesa registrada neste período"
        total={totalExpenses}
      />
      <DonutCard
        title="Receitas por Categoria"
        data={incomeData}
        emptyMsg="Nenhuma receita registrada neste período"
        total={totalIncome}
      />
    </div>
  )
}
