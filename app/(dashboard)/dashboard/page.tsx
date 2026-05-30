'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { MonthlySummary, Transaction } from '@/types'
import { SummaryCards } from '@/components/dashboard/summary-cards'
import { CategoryChart } from '@/components/dashboard/category-chart'
import { RecentTransactions } from '@/components/dashboard/recent-transactions'
import { TransactionForm } from '@/components/transactions/transaction-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Loader2 } from 'lucide-react'

function getCurrentMonth() {
  return new Date().toISOString().slice(0, 7)
}

function formatMonthLabel(month: string) {
  const [year, m] = month.split('-')
  return new Date(Number(year), Number(m) - 1).toLocaleString('pt-BR', { month: 'long', year: 'numeric' })
}

export default function DashboardPage() {
  const supabase = createClient()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [month, setMonth] = useState(getCurrentMonth())
  const [showForm, setShowForm] = useState(false)
  const [userName, setUserName] = useState('')

  const summary: MonthlySummary = {
    totalIncome: transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0),
    totalExpenses: transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
    get balance() { return this.totalIncome - this.totalExpenses },
  }

  const fetchTransactions = useCallback(async () => {
    setLoading(true)
    const startDate = `${month}-01`
    const endDate = new Date(Number(month.split('-')[0]), Number(month.split('-')[1]), 0)
      .toISOString().split('T')[0]

    const { data } = await supabase
      .from('transactions')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })

    setTransactions(data ?? [])
    setLoading(false)
  }, [month, supabase])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const name = data.user?.user_metadata?.full_name ?? data.user?.email ?? ''
      setUserName(name.split(' ')[0])
    })
  }, [supabase])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {userName ? `Olá, ${userName}! 👋` : 'Dashboard'}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5 capitalize">{formatMonthLabel(month)}</p>
        </div>
        <div className="flex items-center gap-3">
          <Input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-44"
          />
          <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700 shrink-0">
            <Plus className="w-4 h-4 mr-2" /> Adicionar
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
        </div>
      ) : (
        <>
          <SummaryCards summary={summary} />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-3">
              <CategoryChart transactions={transactions} />
            </div>
            <div className="lg:col-span-2">
              <RecentTransactions transactions={transactions} />
            </div>
          </div>
        </>
      )}

      <TransactionForm
        open={showForm}
        onClose={() => setShowForm(false)}
        onSuccess={fetchTransactions}
      />
    </div>
  )
}
