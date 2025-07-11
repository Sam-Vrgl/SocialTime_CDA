'use client';

import { useEffect, useState } from 'react';

interface Author {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
}

interface Post {
  id: string;
  description: string;
  created_at: string;
  author: Author;
  imageUrl: string;
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/posts`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: Post[]) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Échec du chargement des posts.');
        setLoading(false);
      });
  }, []);

  // sort newest → oldest
  const sortedPosts = [...posts].sort(
    (a, b) =>
      new Date(b.created_at).getTime() -
      new Date(a.created_at).getTime()
  );

  return (
    <>
      <main>
        {loading && (
          <p style={{ padding: '2rem', textAlign: 'center' }}>
            Chargement…
          </p>
        )}
        {error && (
          <p
            style={{
              padding: '2rem',
              textAlign: 'center',
              color: 'var(--color-primary)',
            }}
          >
            {error}
          </p>
        )}
        {!loading && !error && (
          <div className="posts">
            {sortedPosts.map((post) => {
              const apiOrigin = process.env.NEXT_PUBLIC_API_BASE_URL;
              const src = `${apiOrigin}${post.imageUrl}`;
              const date = new Date(post.created_at).toLocaleDateString(
                'fr-FR',
                {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                }
              );

              return (
                <div key={post.id} className="post-card">
                  <div className="post-date">{date}</div>
                  <div className="post-author">
                    Par {post.author.firstName}{' '}
                    {post.author.lastName}
                  </div>
                  <img
                    src={src}
                    alt="Image du post"
                    className="post-image"
                  />
                  <p className="post-description">
                    {post.description}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
