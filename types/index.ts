export type TransactionType = 'income' | 'expense'

export type Category = {
  value: string
  label: string
  type: TransactionType | 'both'
  color: string
}

export const CATEGORIES: Category[] = [
  // Receitas
  { value: 'salario', label: 'Salário', type: 'income', color: '#22c55e' },
  { value: 'freelance', label: 'Freelance', type: 'income', color: '#16a34a' },
  { value: 'investimentos', label: 'Investimentos', type: 'income', color: '#15803d' },
  { value: 'outros_receita', label: 'Outras Receitas', type: 'income', color: '#4ade80' },
  // Despesas
  { value: 'alimentacao', label: 'Alimentação', type: 'expense', color: '#f97316' },
  { value: 'moradia', label: 'Moradia', type: 'expense', color: '#3b82f6' },
  { value: 'transporte', label: 'Transporte', type: 'expense', color: '#8b5cf6' },
  { value: 'saude', label: 'Saúde', type: 'expense', color: '#ec4899' },
  { value: 'educacao', label: 'Educação', type: 'expense', color: '#06b6d4' },
  { value: 'lazer', label: 'Lazer', type: 'expense', color: '#f59e0b' },
  { value: 'vestuario', label: 'Vestuário', type: 'expense', color: '#6366f1' },
  { value: 'saude_beleza', label: 'Saúde & Beleza', type: 'expense', color: '#db2777' },
  { value: 'outros_despesa', label: 'Outras Despesas', type: 'expense', color: '#94a3b8' },
]

export type Transaction = {
  id: string
  user_id: string
  type: TransactionType
  amount: number
  description: string
  category: string
  date: string
  created_at: string
}

export type TransactionInsert = Omit<Transaction, 'id' | 'user_id' | 'created_at'>

export type MonthlySummary = {
  totalIncome: number
  totalExpenses: number
  balance: number
}
