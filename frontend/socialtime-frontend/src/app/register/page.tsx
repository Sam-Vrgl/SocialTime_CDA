// src/app/register/page.tsx
'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface RegisterForm {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<RegisterForm>({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleChange<K extends keyof RegisterForm>(
    field: K,
    value: RegisterForm[K]
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      // Success → go to login
      router.push('/login');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        {(
          [
            { name: 'username', label: 'Username', type: 'text' },
            { name: 'firstName', label: 'First Name', type: 'text' },
            { name: 'lastName', label: 'Last Name', type: 'text' },
            { name: 'email', label: 'Email', type: 'email' },
          ] as const
        ).map(({ name, label, type }) => (
          <div key={name} style={{ marginBottom: '1rem' }}>
            <label htmlFor={name}>{label}</label>
            <input
              id={name}
              type={type}
              required
              value={form[name]}
              onChange={(e) => handleChange(name, e.target.value)}
              style={{ display: 'block', width: '100%', marginTop: '0.25rem' }}
            />
          </div>
        ))}

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            required
            value={form.password}
            onChange={(e) => handleChange('password', e.target.value)}
            style={{ display: 'block', width: '100%', marginTop: '0.25rem' }}
          />
        </div>

        {error && (
          <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{ padding: '0.5rem 1rem' }}
        >
          {loading ? 'Registering…' : 'Register'}
        </button>
      </form>

      <p style={{ marginTop: '1rem' }}>
        Already have an account?{' '}
        <a href="/login" style={{ color: '#0070f3' }}>
          Log in
        </a>
      </p>
    </main>
  );
}
