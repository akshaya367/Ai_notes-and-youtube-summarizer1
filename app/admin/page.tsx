'use client';

import { useState } from 'react';
import { 
  Shield, 
  BarChart3, 
  BookOpen, 
  Users, 
  Settings2, 
  MessageSquare, 
  Plus, 
  Search, 
  Filter, 
  Save, 
  RefreshCw,
  Sliders
} from 'lucide-react';

export default function AdminPanel() {
  const [tone, setTone] = useState('professional');

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '2rem',
      gap: '2rem'
    }}>
      {/* Sidebar Navigation */}
      <aside className="glass" style={{
        width: '240px',
        height: 'fit-content',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        borderRadius: '1.5rem',
        position: 'sticky',
        top: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <Shield size={24} color="#ef4444" />
          <h3 style={{ margin: 0 }}>Admin Core</h3>
        </div>
        <AdminNavItem icon={<BarChart3 size={20} />} label="Overview" active />
        <AdminNavItem icon={<Users size={20} />} label="User Management" />
        <AdminNavItem icon={<MessageSquare size={20} />} label="Total Chats" />
        <AdminNavItem icon={<BookOpen size={20} />} label="Knowledge Base" />
        <AdminNavItem icon={<Sliders size={20} />} label="AI Configuration" />
        <AdminNavItem icon={<Settings2 size={20} />} label="System Status" />
      </aside>

      {/* Main Panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <header className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Global Overview</h1>
            <p style={{ color: '#a1a1aa', fontSize: '0.875rem' }}>Monitor real-time AI performance and user traffic.</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
             <button className="glass" style={{ padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', fontSize: '0.875rem' }}>
               <RefreshCw size={16} /> Sync Database
             </button>
             <button className="glass" style={{ background: '#fff', color: '#000', border: 'none', padding: '0.75rem 1.25rem', fontWeight: '600', fontSize: '0.875rem' }}>
               Export Report
             </button>
          </div>
        </header>

        {/* AI Behavior Config */}
        <section className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>AI Behavior & Tone</h3>
              <p style={{ color: '#a1a1aa', fontSize: '0.875rem' }}>Adjust how the AI communicates with your customers.</p>
            </div>
            <button className="glass" style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '0.625rem 1rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
              <Save size={16} /> Save Changes
            </button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            <ToneCard 
              title="Helpful & Friendly" 
              description="Best for standard customer support and SaaS onboarding."
              active={tone === 'friendly'}
              onClick={() => setTone('friendly')}
            />
            <ToneCard 
              title="Professional / Sales" 
              description="Direct and authoritative. Great for high-stakes business queries."
              active={tone === 'professional'}
              onClick={() => setTone('professional')}
            />
            <ToneCard 
              title="Concise & Fast" 
              description="Minimalistic responses for power users and common FAQs."
              active={tone === 'concise'}
              onClick={() => setTone('concise')}
            />
          </div>
        </section>

        {/* Knowledge Base Manager */}
        <section className="glass-card">
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem' }}>Knowledge Base (FAQ)</h3>
            <button className="glass" style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '0.625rem 1rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
              <Plus size={16} /> Add New Query
            </button>
          </div>
          
          <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#71717a' }} />
            <input 
              type="text" 
              placeholder="Filter knowledge entries..." 
              className="glass"
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.75rem',
                borderRadius: '0.75rem',
                background: 'rgba(255,255,255,0.03)',
                color: '#fff',
                border: '1px solid var(--glass-border)',
                fontSize: '0.875rem'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
             <FAQItem question="How do I reset my password?" tags={['Account', 'Security']} />
             <FAQItem question="What is your refund policy?" tags={['Billing']} />
             <FAQItem question="Can I invite multiple team members?" tags={['Team', 'Setup']} />
          </div>
        </section>
      </div>
    </div>
  );
}

function AdminNavItem({ icon, label, active = false }: any) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      padding: '0.75rem 1rem',
      borderRadius: '0.75rem',
      background: active ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
      color: active ? '#fff' : '#a1a1aa',
      fontWeight: active ? '600' : '400',
      cursor: 'pointer',
      transition: 'all 0.2s',
      fontSize: '0.925rem'
    }}>
      {icon}
      {label}
    </div>
  );
}

function ToneCard({ title, description, active, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      style={{
        padding: '1.5rem',
        borderRadius: '1rem',
        background: active ? 'rgba(59, 130, 246, 0.05)' : 'rgba(255, 255, 255, 0.02)',
        border: `1px solid ${active ? '#3b82f6' : 'var(--glass-border)'}`,
        cursor: 'pointer',
        transition: 'all 0.2s'
      }}
    >
      <div style={{ fontWeight: '600', marginBottom: '0.5rem', color: active ? '#fff' : '#fafafa' }}>{title}</div>
      <p style={{ fontSize: '0.825rem', color: '#71717a', lineHeight: '1.5' }}>{description}</p>
    </div>
  );
}

function FAQItem({ question, tags }: any) {
  return (
    <div style={{
      padding: '1rem',
      borderRadius: '0.75rem',
      background: 'rgba(255, 255, 255, 0.02)',
      border: '1px solid var(--glass-border)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div>
        <div style={{ fontSize: '0.925rem', fontWeight: '500', marginBottom: '0.5rem' }}>{question}</div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {tags.map((t: string) => (
            <span key={t} style={{ fontSize: '0.65rem', background: 'rgba(0,0,0,0.2)', padding: '0.2rem 0.5rem', borderRadius: '4px', color: '#71717a' }}>{t}</span>
          ))}
        </div>
      </div>
      <button style={{ background: 'none', border: 'none', color: '#3b82f6', fontWeight: '600', fontSize: '0.825rem', cursor: 'pointer' }}>Edit Entry</button>
    </div>
  );
}
