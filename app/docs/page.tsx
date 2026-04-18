'use client';

import { BookOpen, Search, ArrowLeft, ChevronRight, MessageSquare, Zap, Shield, Rocket } from 'lucide-react';
import Link from 'next/link';

export default function DocsPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'transparent'
    }}>
      {/* Navigation */}
      <nav style={{
        padding: '1.5rem 2rem',
        borderBottom: '1px solid var(--glass-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link href="/" style={{ textDecoration: 'none', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Rocket size={24} color="#3b82f6" />
            <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>Nexus Docs</span>
          </Link>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#71717a' }} />
            <input 
              type="text" 
              placeholder="Search documentation..." 
              className="glass"
              style={{
                width: '100%',
                padding: '0.5rem 1rem 0.5rem 2.5rem',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                background: 'rgba(255,255,255,0.05)',
                color: '#fff',
                border: '1px solid var(--glass-border)'
              }}
            />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link href="/auth/login" style={{ textDecoration: 'none', color: '#a1a1aa', fontSize: '0.925rem' }}>Login</Link>
          <Link href="/auth/signup" style={{ textDecoration: 'none' }}>
            <button className="glass" style={{ background: '#fff', color: '#000', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: '600', border: 'none' }}>Get Started</button>
          </Link>
        </div>
      </nav>

      <div style={{ display: 'flex', flex: 1, maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        {/* Sidebar */}
        <aside style={{
          width: '280px',
          padding: '2rem',
          borderRight: '1px solid var(--glass-border)',
          overflowY: 'auto',
          height: 'calc(100vh - 80px)',
          position: 'sticky',
          top: '80px'
        }}>
          <DocSection title="Getting Started">
            <DocLink active>Introduction</DocLink>
            <DocLink>Quick Start Guide</DocLink>
            <DocLink>Installation</DocLink>
            <DocLink>Core Concepts</DocLink>
          </DocSection>
          <DocSection title="Authentication">
            <DocLink>Google Login</DocLink>
            <DocLink>GitHub Integration</DocLink>
            <DocLink>Session Management</DocLink>
          </DocSection>
          <DocSection title="AI Integration">
            <DocLink>Knowledge Base Setup</DocLink>
            <DocLink>Context Fine-tuning</DocLink>
            <DocLink>API Reference</DocLink>
          </DocSection>
          <DocSection title="Dashboard">
            <DocLink>Analytics Overview</DocLink>
            <DocLink>User Management</DocLink>
            <DocLink>Platform Settings</DocLink>
          </DocSection>
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, padding: '4rem 6rem', maxWidth: '900px' }}>
          <div className="fade-in">
            <div style={{ fontSize: '0.875rem', color: '#3b82f6', fontWeight: '600', marginBottom: '1rem' }}>Getting Started</div>
            <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>Introduction to Nexus AI</h1>
            <p style={{ fontSize: '1.25rem', color: '#a1a1aa', lineHeight: '1.8', marginBottom: '3rem' }}>
              Nexus AI is the ultimate support platform for modern SaaS companies. We leverage advanced LLMs and secure cloud infrastructure to help you deliver precise, instant answers to your customers.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '4rem' }}>
              <GuideCard 
                icon={<Zap size={20} color="#3b82f6" />}
                title="Quick Setup"
                description="Get your first AI agent running in under 5 minutes."
              />
              <GuideCard 
                icon={<Shield size={20} color="#10b981" />}
                title="Security First"
                description="Learn about our enterprise-grade data protection."
              />
            </div>

            <section style={{ marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>Core Platform Features</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <FeatureItem 
                  title="Contextual Intelligence"
                  description="Unlike generic bots, Nexus learns your specific documentation, API endpoints, and FAQ history to provide context-aware support."
                />
                <FeatureItem 
                  title="Deep Integration"
                  description="Connect seamlessly with Supabase for user data, Next.js for your frontend, and any modern LLM provider via our API."
                />
              </div>
            </section>

            <div style={{ 
              padding: '2rem', 
              background: 'rgba(59, 130, 246, 0.1)', 
              borderRadius: '1rem', 
              border: '1px solid rgba(59, 130, 246, 0.2)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h4 style={{ marginBottom: '0.5rem' }}>Ready to build?</h4>
                <p style={{ color: '#a1a1aa', fontSize: '0.925rem' }}>Check out our Quick Start guide to launch your platform.</p>
              </div>
              <Link href="/auth/signup" style={{ textDecoration: 'none' }}>
                <button className="glass" style={{ background: '#3b82f6', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: '600', border: 'none' }}>Start Now</button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function DocSection({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <h5 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#71717a', letterSpacing: '0.05em', marginBottom: '1rem' }}>{title}</h5>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>{children}</div>
    </div>
  );
}

function DocLink({ children, active = false }: { children: React.ReactNode, active?: boolean }) {
  return (
    <div style={{
      padding: '0.5rem 0.75rem',
      borderRadius: '0.5rem',
      fontSize: '0.925rem',
      color: active ? '#3b82f6' : '#a1a1aa',
      background: active ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
      fontWeight: active ? '600' : '400',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      {children}
      {active && <ChevronRight size={14} />}
    </div>
  );
}

function GuideCard({ icon, title, description }: any) {
  return (
    <div className="glass-card" style={{ padding: '1.5rem' }}>
      <div style={{ marginBottom: '1rem' }}>{icon}</div>
      <h4 style={{ marginBottom: '0.5rem' }}>{title}</h4>
      <p style={{ color: '#a1a1aa', fontSize: '0.875rem' }}>{description}</p>
    </div>
  );
}

function FeatureItem({ title, description }: any) {
  return (
    <div>
      <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }} />
        {title}
      </h3>
      <p style={{ color: '#a1a1aa', lineHeight: '1.6' }}>{description}</p>
    </div>
  );
}
