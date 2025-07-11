// app/create-post/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreatePostPage() {
  const router = useRouter();
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!description.trim()) {
      setError('La description est requise.');
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      // 1) Create post
      const createRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ description: description.trim() }),
        }
      );

      if (!createRes.ok) {
        const body = await createRes.json();
        throw new Error(body.error || `Erreur HTTP ${createRes.status}`);
      }

      const created = await createRes.json();
      const postId = created.id;

      // 2) Upload image if one was selected
      if (file) {
        const formData = new FormData();
        formData.append('image', file, file.name);

        const uploadRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/${postId}/image`,
          {
            method: 'POST',
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: formData,
          }
        );

        if (!uploadRes.ok) {
          const body = await uploadRes.json().catch(() => ({}));
          throw new Error(body.error || `Upload failed (${uploadRes.status})`);
        }
      }

      // 3) Done!
      router.push('/');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Échec de la création du post.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-container">
      <main className="app-main">
        <h1 className="header__title">Créer un nouveau post</h1>
        <form onSubmit={handleSubmit} className="form">
          {/* Description */}
          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              className="form-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Image Upload */}
          <div className="form-group">
            <label htmlFor="image" className="form-label">
              Image (optionnelle)
            </label>
            <input
              id="image"
              type="file"
              accept="image/*"
              className="form-input"
              onChange={(e) => {
                if (e.target.files?.[0]) setFile(e.target.files[0]);
                else setFile(null);
              }}
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="btn" disabled={isSubmitting}>
            {isSubmitting ? 'Envoi…' : 'Publier'}
          </button>
        </form>
      </main>
    </div>
  );
}
