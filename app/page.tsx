'use client';

import { ArrowRight, Bot, Shield, Zap, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="container" style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 2rem',
      paddingTop: '8rem',
      textAlign: 'center'
    }}>
      <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          background: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
          borderRadius: '2rem',
          fontSize: '0.875rem',
          marginBottom: '2rem',
          backdropFilter: 'blur(8px)'
        }}>
          <Sparkles size={16} color="#3b82f6" />
          <span style={{ color: '#a1a1aa' }}>Introducing Nexus AI v1.0</span>
        </div>
        
        <h1 className="gradient-text" style={{
          fontSize: '4.5rem',
          lineHeight: '1.1',
          marginBottom: '1.5rem',
          fontWeight: '800'
        }}>
          Intelligent Support <br /> For Modern SaaS
        </h1>
        
        <p style={{
          fontSize: '1.25rem',
          color: '#a1a1aa',
          marginBottom: '3rem',
          maxWidth: '600px',
          margin: '0 auto 3rem'
        }}>
          Deliver world-class customer service with AI that understands your product as well as you do. Secure, scalable, and stunning.
        </p>

        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center'
        }}>
          <Link href="/auth/signup" style={{ textDecoration: 'none' }}>
            <button className="glass" style={{
              background: '#fff',
              color: '#000',
              padding: '0.875rem 2rem',
              borderRadius: '0.75rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              border: 'none',
              fontSize: '1rem'
            }}>
              Get Started Free <ArrowRight size={18} />
            </button>
          </Link>
          <Link href="/docs" style={{ textDecoration: 'none' }}>
            <button className="glass" style={{
              background: 'transparent',
              color: '#fff',
              padding: '0.875rem 2rem',
              borderRadius: '0.75rem',
              fontWeight: '600',
              border: '1px solid var(--glass-border)',
              fontSize: '1rem'
            }}>
              View Documentation
            </button>
          </Link>
        </div>
      </div>

      <div style={{
        marginTop: '8rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '2rem',
        textAlign: 'left'
      }}>
        <FeatureCard 
          icon={<Bot size={24} color="#3b82f6" />}
          title="Context-Aware AI"
          description="Powered by GPT-4 and your custom knowledge base for precise answers."
        />
        <FeatureCard 
          icon={<Shield size={24} color="#10b981" />}
          title="Enterprise Security"
          description="Role-based access, JWT auth, and Supabase RLS policies for maximum data safety."
        />
        <FeatureCard 
          icon={<Zap size={24} color="#f59e0b" />}
          title="Real-time Analytics"
          description="Track response times and user satisfaction in a beautiful admin dashboard."
        />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="glass-card" style={{ transition: 'transform 0.2s' }}>
      <div style={{ marginBottom: '1rem' }}>{icon}</div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>{title}</h3>
      <p style={{ color: '#a1a1aa', fontSize: '0.925rem' }}>{description}</p>
    </div>
  );
}
