'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface RegisterPayload {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState<RegisterPayload>({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleChange<K extends keyof RegisterPayload>(
    field: K,
    value: RegisterPayload[K]
  ) {
    setForm(prev => ({ ...prev, [field]: value }));
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
          body: JSON.stringify(form)
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      // on success, redirect to login
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
        {(['username','firstName','lastName','email'] as const).map(field => (
          <div key={field} style={{ marginBottom: '1rem' }}>
            <label htmlFor={field}>
              {field[0].toUpperCase() + field.slice(1)}
            </label>
            <input
              id={field}
              type={field === 'email' ? 'email' : 'text'}
              required
              value={form[field]}
              onChange={e => handleChange(field, e.target.value)}
              style={{ display: 'block', width: '100%' }}
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
            onChange={e => handleChange('password', e.target.value)}
            style={{ display: 'block', width: '100%' }}
          />
        </div>

        {error && (
          <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>
        )}

        <button type="submit" disabled={loading} style={{ padding: '0.5rem 1rem' }}>
          {loading ? 'Registering…' : 'Register'}
        </button>
      </form>
      <p style={{ marginTop: '1rem' }}>
        Already have an account? <a href="/login">Log in</a>
      </p>
    </main>
  );
}
