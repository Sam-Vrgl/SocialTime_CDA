'use client';

import { useState, useContext, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';

export default function LoginPage() {
  const { login } = useContext(AuthContext)!;
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  }

  return (
    <main style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ display: 'block', width: '100%', marginBottom: '1rem' }}
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ display: 'block', width: '100%', marginBottom: '1rem' }}
        />

        {error && (
          <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>
        )}

        <button type="submit" style={{ padding: '0.5rem 1rem' }}>
          Log In
        </button>
      </form>
      <p style={{ marginTop: '1rem' }}>
        Don’t have an account? <a href="/register">Register here</a>
      </p>
    </main>
  );
}
