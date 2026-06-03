'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Loader2, CheckCircle2, MailCheck } from 'lucide-react'

type Tab = 'login' | 'signup'

type Props = {
  tab: Tab
  onTabChange: (t: Tab) => void
}

export function AuthPanel({ tab, onTabChange }: Props) {
  const [forgotView, setForgotView] = useState(false)

  function handleTabChange(t: Tab) {
    setForgotView(false)
    onTabChange(t)
  }

  if (tab === 'login' && forgotView) {
    return <ForgotPasswordForm onBack={() => setForgotView(false)} />
  }

  return (
    <div>
      {tab === 'login' ? (
        <LoginForm
          onSignupClick={() => handleTabChange('signup')}
          onForgotClick={() => setForgotView(true)}
        />
      ) : (
        <SignupForm onLoginClick={() => handleTabChange('login')} />
      )}
    </div>
  )
}

function LoginForm({ onSignupClick, onForgotClick }: { onSignupClick: () => void; onForgotClick: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      toast.error(
        error.message === 'Invalid login credentials'
          ? 'E-mail ou senha incorretos.'
          : error.message
      )
      setLoading(false)
      return
    }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800" style={{ fontFamily: 'var(--font-display)' }}>
          Bem-vindo de volta
        </h2>
        <p className="text-slate-500 text-sm mt-1">Entre com seus dados para acessar o painel</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="login-email" className="text-slate-700 text-sm font-medium">E-mail</Label>
          <Input
            id="login-email"
            type="email"
            placeholder="voce@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="h-11 bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
          />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="login-password" className="text-slate-700 text-sm font-medium">Senha</Label>
            <button
              type="button"
              onClick={onForgotClick}
              className="text-xs text-blue-600 hover:underline font-medium"
            >
              Esqueceu a senha?
            </button>
          </div>
          <Input
            id="login-password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="h-11 bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
          />
        </div>

        <Button
          type="submit"
          className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium mt-2"
          disabled={loading}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          Entrar na conta
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-slate-500">
          Não tem conta?{' '}
          <button
            onClick={onSignupClick}
            className="text-blue-600 font-medium hover:underline"
          >
            Criar gratuitamente
          </button>
        </p>
      </div>
    </div>
  )
}

function ForgotPasswordForm({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }
    setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="text-center py-6">
        <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <MailCheck className="w-7 h-7 text-blue-500" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">E-mail enviado!</h3>
        <p className="text-slate-500 text-sm mb-6">
          Enviamos o link de recuperação para <strong className="text-slate-700">{email}</strong>. Verifique sua caixa de entrada e spam.
        </p>
        <button onClick={onBack} className="text-blue-600 text-sm font-medium hover:underline">
          Voltar para o login
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800" style={{ fontFamily: 'var(--font-display)' }}>
          Recuperar senha
        </h2>
        <p className="text-slate-500 text-sm mt-1">Enviaremos um link para criar uma nova senha</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="forgot-email" className="text-slate-700 text-sm font-medium">E-mail cadastrado</Label>
          <Input
            id="forgot-email"
            type="email"
            placeholder="voce@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="h-11 bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
          />
        </div>

        <Button
          type="submit"
          className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium mt-2"
          disabled={loading}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          Enviar link de recuperação
        </Button>
      </form>

      <div className="mt-6 text-center">
        <button onClick={onBack} className="text-sm text-blue-600 font-medium hover:underline">
          Voltar para o login
        </button>
      </div>
    </div>
  )
}

function SignupForm({ onLoginClick }: { onLoginClick: () => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 6) { toast.error('A senha deve ter pelo menos 6 caracteres.'); return }
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    })
    if (error) { toast.error(error.message); setLoading(false); return }
    setDone(true)
  }

  if (done) {
    return (
      <div className="text-center py-6">
        <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-7 h-7 text-green-500" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">Verifique seu e-mail</h3>
        <p className="text-slate-500 text-sm mb-6">
          Enviamos um link de confirmação para <strong className="text-slate-700">{email}</strong>
        </p>
        <button onClick={onLoginClick} className="text-blue-600 text-sm font-medium hover:underline">
          Voltar para o login
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800" style={{ fontFamily: 'var(--font-display)' }}>
          Crie sua conta
        </h2>
        <p className="text-slate-500 text-sm mt-1">Grátis, sem cartão de crédito</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="signup-name" className="text-slate-700 text-sm font-medium">Nome</Label>
          <Input
            id="signup-name"
            type="text"
            placeholder="Seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="h-11 bg-white border-slate-200 focus:border-blue-400"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="signup-email" className="text-slate-700 text-sm font-medium">E-mail</Label>
          <Input
            id="signup-email"
            type="email"
            placeholder="voce@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="h-11 bg-white border-slate-200 focus:border-blue-400"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="signup-password" className="text-slate-700 text-sm font-medium">Senha</Label>
          <Input
            id="signup-password"
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            className="h-11 bg-white border-slate-200 focus:border-blue-400"
          />
        </div>

        <Button
          type="submit"
          className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium mt-2"
          disabled={loading}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          Criar conta grátis
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-slate-500">
          Já tem conta?{' '}
          <button
            onClick={onLoginClick}
            className="text-blue-600 font-medium hover:underline"
          >
            Entrar
          </button>
        </p>
      </div>
    </div>
  )
}
