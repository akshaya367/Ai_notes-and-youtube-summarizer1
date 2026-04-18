'use client';

import { Bot, Mail, Globe, Send, Code } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{
      marginTop: '8rem',
      padding: '4rem 2rem',
      background: 'rgba(255, 255, 255, 0.02)',
      borderTop: '1px solid var(--glass-border)',
      textAlign: 'center'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.4rem', background: 'var(--accent-gradient)', borderRadius: '0.5rem' }}>
              <Bot size={24} color="#fff" />
            </div>
            <span style={{ fontWeight: '700', fontSize: '1.5rem', letterSpacing: '-0.02em' }}>Nexus<span style={{ color: '#3b82f6' }}>AI</span></span>
          </div>
          <p style={{ color: '#a1a1aa', maxWidth: '400px', fontSize: '0.925rem', lineHeight: '1.6' }}>
            AI-powered career platform — find jobs, analyze resumes, and get mentorship from cutting-edge AI.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <SocialLink icon={<Send size={20} />} href="#" />
            <SocialLink icon={<Code size={20} />} href="https://github.com/akshaya367" />
            <SocialLink icon={<Globe size={20} />} href="#" />
            <SocialLink icon={<Mail size={20} />} href="#" />
          </div>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', textAlign: 'left',
          borderTop: '1px solid var(--glass-border)', paddingTop: '3rem'
        }}>
          <div>
            <h4 style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>Platform</h4>
            <FooterLink label="AI Job Search" href="/jobs" />
            <FooterLink label="Resume Analyzer" href="/analyzer" />
            <FooterLink label="AI Chat Mentor" href="/chat" />
            <FooterLink label="Dashboard" href="/dashboard" />
          </div>
          <div>
            <h4 style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>Resources</h4>
            <FooterLink label="Documentation" href="/docs" />
            <FooterLink label="API Reference" href="/docs" />
            <FooterLink label="Getting Started" href="/auth/signup" />
            <FooterLink label="Changelog" href="/docs" />
          </div>
          <div>
            <h4 style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>Company</h4>
            <FooterLink label="About Us" href="/docs" />
            <FooterLink label="Careers" href="/jobs" />
            <FooterLink label="Privacy" href="/docs" />
            <FooterLink label="Terms" href="/docs" />
          </div>
          <div>
            <h4 style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>Support</h4>
            <FooterLink label="Help Center" href="/chat" />
            <FooterLink label="Contact Us" href="/chat" />
            <FooterLink label="Admin Panel" href="/admin" />
            <FooterLink label="Live Chat" href="/chat" />
          </div>
        </div>

        <div style={{
          marginTop: '4rem', paddingTop: '2rem',
          borderTop: '1px solid var(--glass-border)',
          fontSize: '0.825rem', color: '#71717a'
        }}>
          © {new Date().getFullYear()} NexusAI Career Platform. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ icon, href }: { icon: any, href: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: '#a1a1aa', transition: 'color 0.2s' }}
      onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
      onMouseLeave={(e) => e.currentTarget.style.color = '#a1a1aa'}>
      {icon}
    </a>
  );
}

function FooterLink({ label, href }: { label: string, href: string }) {
  return (
    <Link href={href} style={{
      display: 'block', marginBottom: '0.75rem', color: '#71717a',
      textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s'
    }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = '#71717a'}>
      {label}
    </Link>
  );
}
