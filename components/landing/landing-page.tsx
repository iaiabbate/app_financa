'use client'

import { useState } from 'react'
import { AuthPanel } from './auth-panel'
import { TrendingUp, TrendingDown, ArrowUpRight, BarChart3, Shield, Zap } from 'lucide-react'

const features = [
  {
    icon: BarChart3,
    title: 'Dashboard visual',
    desc: 'Gráficos de despesas por categoria em tempo real',
  },
  {
    icon: Shield,
    title: 'Dados seguros',
    desc: 'Cada usuário acessa somente suas próprias finanças',
  },
  {
    icon: Zap,
    title: 'Registro rápido',
    desc: 'Cadastre receitas e despesas em segundos',
  },
]

export function LandingPage() {
  const [tab, setTab] = useState<'login' | 'signup'>('login')

  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden">

      {/* ── LEFT: Dark hero panel ── */}
      <div className="relative lg:w-[58%] bg-[#070E1D] flex flex-col justify-between overflow-hidden min-h-[340px] lg:min-h-screen">

        {/* Background layers */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-blue-600 blur-[120px] opacity-20 animate-pulse-glow" />
        <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full bg-emerald-500 blur-[100px] opacity-15 animate-pulse-glow delay-300" />

        {/* Content */}
        <div className="relative z-10 flex flex-col flex-1 px-8 py-10 lg:px-14 lg:py-14">

          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-12 opacity-0 animate-fade-in">
            <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <TrendingUp className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">FinançaApp</span>
          </div>

          {/* Headline */}
          <div className="mb-10">
            <h1
              className="font-display text-4xl lg:text-5xl xl:text-6xl text-white leading-[1.1] tracking-tight mb-5 opacity-0 animate-slide-up delay-100"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Suas finanças,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                sob controle.
              </span>
            </h1>
            <p className="text-slate-400 text-base lg:text-lg leading-relaxed max-w-md opacity-0 animate-slide-up delay-200">
              Registre receitas e despesas, visualize seu saldo e tome decisões financeiras mais inteligentes — tudo em um só lugar.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4 mb-12 opacity-0 animate-slide-up delay-300">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{title}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Floating mock card */}
          <div className="hidden lg:block opacity-0 animate-slide-up delay-400">
            <MockBalanceCard />
          </div>
        </div>
      </div>

      {/* ── RIGHT: Auth panel ── */}
      <div className="lg:w-[42%] bg-slate-50 flex items-center justify-center px-6 py-10 lg:px-12">
        <div className="w-full max-w-sm opacity-0 animate-slide-up delay-200">

          {/* Tab switcher */}
          <div className="flex bg-white rounded-xl p-1 mb-8 shadow-sm border border-slate-100">
            <button
              onClick={() => setTab('login')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                tab === 'login'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => setTab('signup')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                tab === 'signup'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Criar conta
            </button>
          </div>

          <AuthPanel tab={tab} onTabChange={setTab} />

        </div>
      </div>
    </div>
  )
}

function MockBalanceCard() {
  return (
    <div className="animate-float-slow">
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 max-w-[320px]">
        <div className="flex items-center justify-between mb-4">
          <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Saldo — Maio 2026</span>
          <ArrowUpRight className="w-4 h-4 text-emerald-400" />
        </div>
        <p className="text-white text-3xl font-bold mb-5 font-display" style={{ fontFamily: 'var(--font-display)' }}>
          R$ 3.240,00
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-emerald-500/10 rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400 text-xs">Receitas</span>
            </div>
            <p className="text-white text-sm font-semibold">R$ 5.800</p>
          </div>
          <div className="bg-red-500/10 rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingDown className="w-3 h-3 text-red-400" />
              <span className="text-red-400 text-xs">Despesas</span>
            </div>
            <p className="text-white text-sm font-semibold">R$ 2.560</p>
          </div>
        </div>
      </div>
    </div>
  )
}
