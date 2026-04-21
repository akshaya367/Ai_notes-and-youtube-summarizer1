'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // Handle the code exchange for PKCE
    const handleAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (session) {
        router.push('/dashboard');
      } else if (error) {
        console.error('Auth error:', error.message);
        router.push('/auth/login?error=auth_failed');
      }
    };

    handleAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, !!session);
      if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session) {
        router.push('/dashboard');
      } else if (event === 'SIGNED_OUT') {
        router.push('/auth/login');
      }
    });

    // Fallback: search params check
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.get('error')) {
      router.push(`/auth/login?error=${queryParams.get('error_description') || 'Authentication failed'}`);
    }

    const timer = setTimeout(() => {
      handleAuth();
    }, 5000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, [router]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#000',
      color: '#fff'
    }}>
      <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '1rem' }}>Authenticating...</h2>
        <p style={{ color: '#a1a1aa', marginBottom: '1.5rem' }}>Completing your secure sign-in.</p>
        <div className="loading-spinner" style={{
          width: '40px',
          height: '40px',
          border: '3px solid rgba(255,255,255,0.1)',
          borderTopColor: '#3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto'
        }} />
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}} />
      </div>
    </div>
  );
}
