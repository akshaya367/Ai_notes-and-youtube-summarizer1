'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Bot, Menu, X, LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user || null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = '/';
  };

  const navLinks = [
    { href: '/jobs', label: 'Helpdesk' },
    { href: '/analyzer', label: 'Knowledge AI' },
    { href: '/chat', label: 'Support AI' },
    { href: '/dashboard', label: 'Platform' },
  ];

  return (
    <nav style={{
      position: 'fixed', top: '1.5rem', left: '50%', transform: 'translateX(-50%)',
      width: '90%', maxWidth: '1200px', padding: '0.75rem 2rem',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      zIndex: 100, background: 'rgba(255, 255, 255, 0.03)',
      backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '1.5rem'
    }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: '#fff' }}>
        <div style={{ padding: '0.4rem', background: 'var(--accent-gradient)', borderRadius: '0.5rem' }}>
          <Bot size={20} color="#fff" />
        </div>
        <span style={{ fontWeight: '700', fontSize: '1.25rem', letterSpacing: '-0.02em' }}>NexusAI<span style={{ color: '#3b82f6' }}>-Support</span></span>
      </Link>

      {/* Desktop Links */}
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }} className="desktop-nav">
        {navLinks.map(link => (
          <Link key={link.href} href={link.href} style={{ textDecoration: 'none', color: '#a1a1aa', fontSize: '0.9rem', fontWeight: '500', transition: 'color 0.2s' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#a1a1aa')}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }} className="desktop-nav">
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.75rem', fontWeight: '700', color: '#fff'
            }}>
              {(user.user_metadata?.full_name || user.email || 'U').charAt(0).toUpperCase()}
            </div>
            <span style={{ fontSize: '0.85rem', color: '#d4d4d8', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.user_metadata?.full_name || user.email?.split('@')[0]}
            </span>
            <button onClick={handleLogout} title="Logout" style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: '0.4rem',
              borderRadius: '0.5rem', display: 'flex', alignItems: 'center'
            }}>
              <LogOut size={16} color="#f87171" />
            </button>
          </div>
        ) : (
          <>
            <Link href="/auth/login" style={{ textDecoration: 'none', color: '#fff', fontSize: '0.9rem', fontWeight: '500' }}>Login</Link>
            <Link href="/auth/signup" style={{ textDecoration: 'none' }}>
              <button style={{
                background: '#fff', color: '#000', border: 'none',
                padding: '0.5rem 1.25rem', borderRadius: '0.75rem',
                fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer'
              }}>Get Started</button>
            </Link>
          </>
        )}
      </div>

      {/* Mobile Hamburger */}
      <button className="mobile-nav-btn" onClick={() => setMobileOpen(!mobileOpen)} style={{
        display: 'none', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '0.25rem'
      }}>
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '0.75rem',
          background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(20px)',
          border: '1px solid var(--glass-border)', borderRadius: '1rem',
          padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem'
        }}>
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
              style={{ textDecoration: 'none', color: '#d4d4d8', fontSize: '1rem', fontWeight: '500', padding: '0.5rem 0' }}>
              {link.label}
            </Link>
          ))}
          {user ? (
            <button onClick={handleLogout} style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
              color: '#f87171', padding: '0.75rem', borderRadius: '0.75rem', cursor: 'pointer', fontWeight: '600'
            }}>Sign Out</button>
          ) : (
            <Link href="/auth/login" onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none' }}>
              <button style={{
                width: '100%', background: '#3b82f6', color: '#fff', border: 'none',
                padding: '0.75rem', borderRadius: '0.75rem', fontWeight: '600', cursor: 'pointer'
              }}>Sign In</button>
            </Link>
          )}
        </div>
      )}

      <style jsx global>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-nav-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
