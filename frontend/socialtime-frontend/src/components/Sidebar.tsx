'use client';

import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import styles from './Sidebar.module.css';
import Link from 'next/link';

export default function Sidebar() {
  const { user, logout } = useContext(AuthContext)!;
  const DEFAULT = '/default-avatar.jpg';

  const [src, setSrc] = useState(user?.avatarUrl ?? DEFAULT);

  useEffect(() => {
    setSrc(user?.avatarUrl ?? DEFAULT);
  }, [user]);

  function handleError(e: React.SyntheticEvent<HTMLImageElement>) {
    if (!e.currentTarget.src.endsWith(DEFAULT)) {
      setSrc(DEFAULT);
    }
  }

  return (
    <aside className={styles.sidebar}>
      {user ? (
        <div className={styles.profile}>
          <img
            src={src}
            alt={`${user.name} avatar`}
            className={styles.avatar}
            onError={handleError}
          />
          <h2 className={styles.name}>{user.name}</h2>
          <p className={styles.email}>{user.email}</p>

          <Link href="/posts/create" className={styles.createPostButton}>
            Créer un post
          </Link>

          <button className={styles.logout} onClick={logout}>
            Se déconnecter
          </button>
        </div>
      ) : (
        <div className={styles.cta}>
          <h2>Rejoignez-nous !</h2>
          <Link href="/signup" className={styles.signupButton}>
            Créer un compte
          </Link>
          <Link href="/login" className={styles.loginLink}>
            Vous avez déjà un compte ? Connexion
          </Link>
        </div>
      )}
    </aside>
  );
}
