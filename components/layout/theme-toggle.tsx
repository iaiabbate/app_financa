'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className={cn(
        'relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all',
        'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
        'hover:bg-slate-200 dark:hover:bg-slate-700',
        className
      )}
      aria-label="Alternar tema"
    >
      <Sun className="w-3.5 h-3.5 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0 absolute" />
      <Moon className="w-3.5 h-3.5 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100 absolute" />
      <span className="ml-5">{theme === 'dark' ? 'Claro' : 'Escuro'}</span>
    </button>
  )
}
