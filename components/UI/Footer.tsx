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
            <div style={{ padding: '0.4rem', background: '#3b82f6', borderRadius: '0.5rem' }}>
              <Bot size={24} color="#fff" />
            </div>
            <span style={{ fontWeight: '700', fontSize: '1.5rem', letterSpacing: '-0.02em' }}>Nexus AI</span>
          </div>
          <p style={{ color: '#a1a1aa', maxWidth: '400px', fontSize: '0.925rem', lineHeight: '1.6' }}>
            The next generation of AI-powered customer support. Built for speed, scale, and stunning user experiences.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <SocialLink icon={<Send size={20} />} href="#" />
            <SocialLink icon={<Code size={20} />} href="#" />
            <SocialLink icon={<Globe size={20} />} href="#" />
            <SocialLink icon={<Mail size={20} />} href="#" />
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '2rem',
          textAlign: 'left',
          borderTop: '1px solid var(--glass-border)',
          paddingTop: '3rem'
        }}>
          <div>
            <h4 style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>Product</h4>
            <FooterLink label="Features" href="#" />
            <FooterLink label="Pricing" href="#" />
            <FooterLink label="Integrations" href="#" />
            <FooterLink label="Changelog" href="#" />
          </div>
          <div>
            <h4 style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>Resources</h4>
            <FooterLink label="Documentation" href="/docs" />
            <FooterLink label="API Reference" href="#" />
            <FooterLink label="Community" href="#" />
            <FooterLink label="Status" href="#" />
          </div>
          <div>
            <h4 style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>Company</h4>
            <FooterLink label="About Us" href="#" />
            <FooterLink label="Careers" href="#" />
            <FooterLink label="Privacy" href="#" />
            <FooterLink label="Terms" href="#" />
          </div>
          <div>
            <h4 style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>Support</h4>
            <FooterLink label="Help Center" href="#" />
            <FooterLink label="Contact Us" href="#" />
            <FooterLink label="Knowledge Base" href="/admin" />
            <FooterLink label="Live Chat" href="/chat" />
          </div>
        </div>

        <div style={{ 
          marginTop: '4rem', 
          paddingTop: '2rem', 
          borderTop: '1px solid var(--glass-border)',
          fontSize: '0.825rem',
          color: '#71717a'
        }}>
          © {new Date().getFullYear()} Nexus AI Support Platform. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ icon, href }: { icon: any, href: string }) {
  return (
    <a href={href} style={{ color: '#a1a1aa', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = '#a1a1aa'}>
      {icon}
    </a>
  );
}

function FooterLink({ label, href }: { label: string, href: string }) {
  return (
    <Link href={href} style={{ 
      display: 'block', 
      marginBottom: '0.75rem', 
      color: '#71717a', 
      textDecoration: 'none', 
      fontSize: '0.875rem',
      transition: 'color 0.2s'
    }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = '#71717a'}>
      {label}
    </Link>
  );
}
