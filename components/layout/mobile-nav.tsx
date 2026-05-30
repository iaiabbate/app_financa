'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { LayoutDashboard, ArrowLeftRight, LogOut } from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/transactions', label: 'Transações', icon: ArrowLeftRight },
]

export function MobileNav() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    toast.success('Sessão encerrada.')
    router.push('/login')
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex items-center justify-around px-4 py-2 z-50">
      {navItems.map(({ href, label, icon: Icon }) => (
        <Link key={href} href={href}>
          <span
            className={cn(
              'flex flex-col items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-colors',
              pathname === href ? 'text-blue-600' : 'text-slate-500'
            )}
          >
            <Icon className="w-5 h-5" />
            {label}
          </span>
        </Link>
      ))}
      <button
        onClick={handleLogout}
        className="flex flex-col items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium text-slate-500"
      >
        <LogOut className="w-5 h-5" />
        Sair
      </button>
    </nav>
  )
}
