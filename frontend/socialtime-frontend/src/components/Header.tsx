// src/components/Header.tsx
'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="header">
      <h1 className="header__title">
        <Link href="/">SocialTime</Link>
      </h1>
      <nav className="header__nav">
        <Link href="/" className="header__link">Home</Link>
        <Link href="/login" className="header__link">Login</Link>
      </nav>
    </header>
  );
}
