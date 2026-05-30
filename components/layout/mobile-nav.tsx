'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { LayoutDashboard, ArrowLeftRight, LogOut, Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/transactions', label: 'Transações', icon: ArrowLeftRight },
]

export function MobileNav() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const { theme, setTheme } = useTheme()

  async function handleLogout() {
    await supabase.auth.signOut()
    toast.success('Sessão encerrada.')
    router.push('/')
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-around px-2 py-2 z-50">
      {navItems.map(({ href, label, icon: Icon }) => (
        <Link key={href} href={href}>
          <span className={cn(
            'flex flex-col items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-colors',
            pathname === href ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'
          )}>
            <Icon className="w-5 h-5" />
            {label}
          </span>
        </Link>
      ))}
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="flex flex-col items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium text-slate-500 dark:text-slate-400"
      >
        {theme === 'dark'
          ? <Sun className="w-5 h-5" />
          : <Moon className="w-5 h-5" />
        }
        {theme === 'dark' ? 'Claro' : 'Escuro'}
      </button>
      <button
        onClick={handleLogout}
        className="flex flex-col items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium text-slate-500 dark:text-slate-400"
      >
        <LogOut className="w-5 h-5" />
        Sair
      </button>
    </nav>
  )
}
