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

interface FormState {
  name: string;
  gymName: string;
  email: string;
  phone: string;
  password: string;
}

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    name: '',
    gymName: '',
    email: '',
    phone: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set =
    (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      router.replace('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
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

      <div className="w-full max-w-[480px] animate-pop">
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
          Set up your gym
        </h1>
        <p className="text-(--text-dim) text-sm mb-8 leading-relaxed">
          Create your account to manage members, fees, and renewals.
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

          {/* Name + Gym Name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls} style={mono}>
                Your Name *
              </label>
              <input
                type="text"
                autoComplete="name"
                className={inputCls}
                value={form.name}
                onChange={set('name')}
                placeholder="Vikram Singh"
                required
                autoFocus
              />
            </div>
            <div>
              <label className={labelCls} style={mono}>
                Gym Name *
              </label>
              <input
                type="text"
                className={inputCls}
                value={form.gymName}
                onChange={set('gymName')}
                placeholder="IRON ARENA"
                required
              />
            </div>
          </div>

          {/* Email + Phone */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls} style={mono}>
                Email *
              </label>
              <input
                type="email"
                autoComplete="email"
                className={inputCls}
                value={form.email}
                onChange={set('email')}
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className={labelCls} style={mono}>
                Phone *
              </label>
              <input
                type="tel"
                autoComplete="tel"
                className={inputCls}
                style={mono}
                value={form.phone}
                onChange={set('phone')}
                placeholder="+91 98XXX XXXXX"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className={labelCls} style={mono}>
              Password *
            </label>
            <input
              type="password"
              autoComplete="new-password"
              className={inputCls}
              value={form.password}
              onChange={set('password')}
              placeholder="Min 6 characters"
              minLength={6}
              required
            />
          </div>

          {/* Divider hint */}
          <p className="text-[11px] text-(--text-mute) leading-relaxed -mt-1">
            By creating an account you accept that data is stored on your own server.
          </p>

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
            {loading ? 'CREATING ACCOUNT…' : 'CREATE ACCOUNT →'}
          </button>
        </form>

        <p className="text-center text-sm text-(--text-dim) mt-6">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-(--accent) font-medium hover:underline"
          >
            Sign in →
          </Link>
        </p>
      </div>
    </div>
  );
}
