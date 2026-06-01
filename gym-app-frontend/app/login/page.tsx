'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import ThemeToggle from '@/components/ThemeToggle';
import Icon from '@/components/Icon';

const mono = { fontFamily: "'JetBrains Mono', monospace" } as const;
const display = { fontFamily: "'Space Grotesk', sans-serif" } as const;
const inputCls =
  'w-full bg-(--bg) border border-(--border-strong) rounded-[10px] px-3.5 py-3 text-sm text-(--text) outline-none transition-all focus:border-(--accent) focus:shadow-[0_0_0_4px_var(--accent-softer)] placeholder:text-(--text-mute)';
const labelCls =
  'block text-[10px] font-medium tracking-[0.16em] uppercase text-(--text-dim) mb-2';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.replace('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5 relative">
      {/* Theme toggle */}
      <div className="absolute top-5 right-5">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-[420px] animate-pop">
        {/* Brand mark */}
        <div className="flex items-center gap-3 mb-10">
          <div
            className="w-11 h-11 rounded-xl grid place-items-center shrink-0"
            style={{
              background: 'var(--gradient-brand-mark)',
              boxShadow: '0 0 0 1px rgba(34,232,196,0.22), 0 4px 20px rgba(34,232,196,0.14)',
            }}
          >
            <Icon name="dumbbell" size={20} style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <div
              className="text-xl font-bold tracking-[-0.01em] text-(--text)"
              style={display}
            >
              IRONDESK
            </div>
            <div
              className="text-[10px] tracking-[0.18em] uppercase text-(--text-dim)"
              style={mono}
            >
              GYM MEMBER OPS
            </div>
          </div>
        </div>

        {/* Heading */}
        <h1
          className="text-[2rem] font-bold tracking-[-0.025em] text-(--text) mb-2 leading-tight"
          style={display}
        >
          Sign in to your gym
        </h1>
        <p className="text-(--text-dim) text-sm mb-8 leading-relaxed">
          Welcome back. Track members, fees, and renewals in one place.
        </p>

        {/* Form card */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 p-6 rounded-2xl border border-(--border-strong)"
          style={{ background: 'var(--gradient-modal)' }}
        >
          {error && (
            <div
              className="px-3.5 py-3 rounded-xl text-sm text-(--danger) border"
              style={{
                background: 'var(--danger-soft)',
                borderColor: 'rgba(255,107,107,0.25)',
              }}
            >
              {error}
            </div>
          )}

          <div>
            <label className={labelCls} style={mono}>
              Email Address
            </label>
            <input
              type="email"
              autoComplete="email"
              className={inputCls}
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoFocus
            />
          </div>

          <div>
            <label className={labelCls} style={mono}>
              Password
            </label>
            <input
              type="password"
              autoComplete="current-password"
              className={inputCls}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-[10px] font-semibold tracking-[0.14em] uppercase text-sm transition-all hover:brightness-95 disabled:opacity-60 disabled:cursor-not-allowed mt-1"
            style={{
              ...mono,
              background: 'var(--accent)',
              color: 'var(--accent-text-on)',
              boxShadow:
                '0 0 0 1px rgba(34,232,196,0.5), 0 8px 24px rgba(34,232,196,0.2)',
            }}
          >
            {loading ? 'SIGNING IN…' : 'SIGN IN →'}
          </button>
        </form>

        <p className="text-center text-sm text-(--text-dim) mt-6">
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="text-(--accent) font-medium hover:underline"
          >
            Create one →
          </Link>
        </p>
      </div>
    </div>
  );
}
