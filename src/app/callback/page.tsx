'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// ✅ Prevent static rendering
export const dynamic = 'force-dynamic';

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    const fetchSession = async () => {
      if (token) {
        try {
          const res = await fetch(`/api/session?token=${token}`);
          const data = await res.json();

          if (data.username) {
            localStorage.setItem('lastfm_session_token', token);
            localStorage.setItem('lastfm_username', data.username);
          }
        } catch (error) {
          console.error('Error fetching session:', error);
        }

        router.push('/');
      }
    };

    fetchSession();
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-lg">
      Finishing authentication...
    </div>
  );
}
