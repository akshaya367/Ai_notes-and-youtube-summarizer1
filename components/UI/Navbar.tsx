'use client';

import Link from 'next/link';
import { Bot } from 'lucide-react';

export default function Navbar() {
  return (
    <nav style={{
      position: 'fixed',
      top: '1.5rem',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '90%',
      maxWidth: '1200px',
      padding: '0.75rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      zIndex: 100,
      background: 'rgba(255, 255, 255, 0.03)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '1.5rem'
    }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: '#fff' }}>
        <div style={{ padding: '0.4rem', background: '#3b82f6', borderRadius: '0.5rem' }}>
          <Bot size={20} color="#fff" />
        </div>
        <span style={{ fontWeight: '700', fontSize: '1.25rem', letterSpacing: '-0.02em' }}>Nexus</span>
      </Link>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <Link href="/dashboard" style={{ textDecoration: 'none', color: '#a1a1aa', fontSize: '0.9rem', fontWeight: '500' }}>Dashboard</Link>
        <Link href="/chat" style={{ textDecoration: 'none', color: '#a1a1aa', fontSize: '0.9rem', fontWeight: '500' }}>AI Chat</Link>
        <Link href="/admin" style={{ textDecoration: 'none', color: '#a1a1aa', fontSize: '0.9rem', fontWeight: '500' }}>Admin</Link>
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Link href="/auth/login" style={{ textDecoration: 'none', color: '#fff', fontSize: '0.9rem', fontWeight: '500' }}>Login</Link>
        <Link href="/auth/signup" style={{ textDecoration: 'none' }}>
          <button style={{
            background: '#fff',
            color: '#000',
            border: 'none',
            padding: '0.5rem 1.25rem',
            borderRadius: '0.75rem',
            fontWeight: '600',
            fontSize: '0.875rem'
          }}>Get Started</button>
        </Link>
      </div>
    </nav>
  );
}
