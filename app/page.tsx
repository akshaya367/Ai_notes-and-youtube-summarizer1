'use client';

import { ArrowRight, Bot, Shield, Zap, Sparkles, Briefcase, FileText, MessageSquare, Phone } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', paddingTop: '8rem', textAlign: 'center' }}>
      {/* Hero */}
      <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.5rem 1rem', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
          borderRadius: '2rem', fontSize: '0.875rem', marginBottom: '2rem', backdropFilter: 'blur(8px)'
        }}>
          <Sparkles size={16} color="#3b82f6" />
          <span style={{ color: '#a1a1aa' }}>AI-Powered Customer Success Platform</span>
        </div>

        <h1 className="gradient-text" style={{ fontSize: '4.5rem', lineHeight: '1.1', marginBottom: '1.5rem', fontWeight: '800' }}>
          Your AI Support <br />Mission Control
        </h1>

        <p style={{ fontSize: '1.25rem', color: '#a1a1aa', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
          Automate tickets, build knowledge bases, chat with AI agents, and provide instant multi-channel support — all powered by advanced AI.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/auth/signup" style={{ textDecoration: 'none' }}>
            <button className="premium-btn" style={{
              padding: '0.875rem 2rem', borderRadius: '0.75rem', fontWeight: '600',
              display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem'
            }}>
              Start Scaling Support <ArrowRight size={18} />
            </button>
          </Link>
          <Link href="/dashboard" style={{ textDecoration: 'none' }}>
            <button className="glass" style={{
              background: 'transparent', color: '#fff', padding: '0.875rem 2rem',
              borderRadius: '0.75rem', fontWeight: '600', border: '1px solid var(--glass-border)', fontSize: '1rem',
              cursor: 'pointer'
            }}>
              View Platform
            </button>
          </Link>
        </div>
      </div>

      {/* Feature Cards */}
      <div style={{ marginTop: '8rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', textAlign: 'left' }}>
        <FeatureCard
          icon={<Bot size={24} color="#3b82f6" />}
          title="AI Ticket Intelligence"
          description="Automatically categorize, prioritize, and route tickets based on customer sentiment and urgency."
          href="/jobs"
          accent="#3b82f6"
        />
        <FeatureCard
          icon={<FileText size={24} color="#8b5cf6" />}
          title="Knowledge Base AI"
          description="Upload your docs and let AI answer customer queries instantly with 99% accuracy."
          href="/analyzer"
          accent="#8b5cf6"
        />
        <FeatureCard
          icon={<MessageSquare size={24} color="#10b981" />}
          title="AI Support Agent"
          description="Deploy an AI agent that speaks your brand voice and resolves common issues without human help."
          href="/chat"
          accent="#10b981"
        />
        <FeatureCard
          icon={<Shield size={24} color="#f59e0b" />}
          title="Success Dashboard"
          description="Track CSAT, response times, and sentiment trends in real-time with beautiful analytics."
          href="/dashboard"
          accent="#f59e0b"
        />
      </div>

      {/* Stats Bar */}
      <div style={{
        marginTop: '6rem', marginBottom: '6rem', display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem'
      }}>
        <StatItem value="500K+" label="Issues Resolved" />
        <StatItem value="85%" label="Deflection Rate" />
        <StatItem value="4.9/5" label="Average CSAT" />
        <StatItem value="<10s" label="Response Time" />
      </div>
    </div>

  );
}

function FeatureCard({ icon, title, description, href, accent }: {
  icon: any; title: string; description: string; href: string; accent: string;
}) {
  return (
    <Link href={href} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="glass-card" style={{ cursor: 'pointer', height: '100%' }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '0.75rem',
          background: `${accent}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '1.25rem', border: `1px solid ${accent}30`
        }}>
          {icon}
        </div>
        <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>{title}</h3>
        <p style={{ color: '#a1a1aa', fontSize: '0.925rem', lineHeight: '1.6' }}>{description}</p>
        <div style={{
          marginTop: '1.25rem', fontSize: '0.85rem', color: accent, fontWeight: '600',
          display: 'flex', alignItems: 'center', gap: '0.4rem'
        }}>
          Try it now <ArrowRight size={14} />
        </div>
      </div>
    </Link>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '2.25rem', fontWeight: '800', background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{value}</div>
      <div style={{ fontSize: '0.85rem', color: '#71717a', marginTop: '0.25rem' }}>{label}</div>
    </div>
  );
}
