'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Transaction } from '@/types'
import { TransactionForm } from '@/components/transactions/transaction-form'
import { TransactionList } from '@/components/transactions/transaction-list'
import { TransactionFilters } from '@/components/transactions/transaction-filters'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Loader2 } from 'lucide-react'

function getCurrentMonth() {
  return new Date().toISOString().slice(0, 7)
}

export default function TransactionsPage() {
  const supabase = createClient()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  const [month, setMonth] = useState(getCurrentMonth())
  const [type, setType] = useState('all')
  const [category, setCategory] = useState('all')

  const fetchTransactions = useCallback(async () => {
    setLoading(true)
    const startDate = `${month}-01`
    const endDate = new Date(Number(month.split('-')[0]), Number(month.split('-')[1]), 0)
      .toISOString().split('T')[0]

    let query = supabase
      .from('transactions')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })

    if (type !== 'all') query = query.eq('type', type)
    if (category !== 'all') query = query.eq('category', category)

    const { data } = await query
    setTransactions(data ?? [])
    setLoading(false)
  }, [month, type, category, supabase])

  useEffect(() => { fetchTransactions() }, [fetchTransactions])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Transações</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Gerencie suas receitas e despesas</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" /> Nova transação
        </Button>
      </div>

      <TransactionFilters
        month={month}
        category={category}
        type={type}
        onMonthChange={setMonth}
        onCategoryChange={setCategory}
        onTypeChange={setType}
        onReset={() => { setCategory('all'); setType('all') }}
      />

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            {loading ? 'Carregando...' : `${transactions.length} transaç${transactions.length === 1 ? 'ão' : 'ões'}`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
            </div>
          ) : (
            <TransactionList transactions={transactions} onRefresh={fetchTransactions} />
          )}
        </CardContent>
      </Card>

      <TransactionForm
        open={showForm}
        onClose={() => setShowForm(false)}
        onSuccess={fetchTransactions}
      />
    </div>
  )
}
