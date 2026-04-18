'use client';

import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Settings as SettingsIcon, 
  User as UserIcon, 
  LogOut, 
  Plus, 
  Search, 
  TrendingUp, 
  Clock, 
  FileText,
  ChevronRight,
  MoreVertical,
  Bot,
  Zap,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [search, setSearch] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
      } else {
        setUser(user);
      }
      setLoading(false);
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000',
        color: '#fff'
      }}>
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'Overview':
        return <OverviewView user={user} />;
      case 'Analytics':
        return <AnalyticsView />;
      case 'Settings':
        return <SettingsView user={user} />;
      default:
        return <OverviewView user={user} />;
    }
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'transparent'
    }}>
      {/* Sidebar */}
      <aside className="glass" style={{
        width: '280px',
        padding: '2rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        borderRadius: '0 1.5rem 1.5rem 0',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '0.5rem' }}>
          <div style={{ padding: '0.5rem', background: '#3b82f6', borderRadius: '0.5rem' }}>
            <Bot size={24} color="#fff" />
          </div>
          <h2 style={{ fontSize: '1.25rem', margin: 0, letterSpacing: '-0.02em' }}>Nexus AI</h2>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <button 
            onClick={() => setActiveTab('Overview')}
            style={{ all: 'unset', width: '100%', cursor: 'pointer' }}
          >
            <NavItem icon={<LayoutDashboard size={20} />} label="Overview" active={activeTab === 'Overview'} />
          </button>
          
          <Link href="/chat" style={{ textDecoration: 'none' }}>
            <NavItem icon={<MessageSquare size={20} />} label="Conversations" />
          </Link>

          <button 
            onClick={() => setActiveTab('Analytics')}
            style={{ all: 'unset', width: '100%', cursor: 'pointer' }}
          >
            <NavItem icon={<TrendingUp size={20} />} label="Analytics" active={activeTab === 'Analytics'} />
          </button>

          <button 
            onClick={() => setActiveTab('Settings')}
            style={{ all: 'unset', width: '100%', cursor: 'pointer' }}
          >
            <NavItem icon={<SettingsIcon size={20} />} label="Settings" active={activeTab === 'Settings'} />
          </button>
        </nav>

        <div style={{
          padding: '1.25rem',
          background: 'rgba(59, 130, 246, 0.1)',
          borderRadius: '1rem',
          border: '1px solid rgba(59, 130, 246, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Zap size={16} color="#3b82f6" />
            <span style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase' }}>Pro Plan</span>
          </div>
          <p style={{ fontSize: '0.825rem', color: '#a1a1aa' }}>Upgrade for 10x faster responses and priority support.</p>
          <button style={{ 
            width: '100%', 
            padding: '0.625rem', 
            marginTop: '0.75rem', 
            borderRadius: '0.5rem', 
            background: '#3b82f6', 
            color: '#fff', 
            border: 'none', 
            fontSize: '0.875rem', 
            fontWeight: '600',
            cursor: 'pointer'
          }}>Upgrade Now</button>
        </div>

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem', 
          padding: '1rem', 
          background: 'var(--glass-bg)', 
          borderRadius: '0.75rem',
          cursor: 'pointer',
          border: '1px solid var(--glass-border)'
        }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)' }} />
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: '500', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#71717a' }}>{user?.email}</div>
          </div>
          <button 
            onClick={handleLogout}
            style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <LogOut size={16} color="#71717a" />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '3rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        {renderContent()}
      </main>
    </div>
  );
}

function OverviewView({ user }: { user: any }) {
  return (
    <>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0]}</h1>
          <p style={{ color: '#a1a1aa' }}>Track your AI support performance and chat history.</p>
        </div>
        <Link href="/chat" style={{ textDecoration: 'none' }}>
          <button className="glass" style={{
            background: '#fff',
            color: '#000',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.75rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            border: 'none',
            cursor: 'pointer'
          }}>
            <Plus size={18} /> New Conversation
          </button>
        </Link>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        <StatCard icon={<MessageSquare size={20} color="#3b82f6" />} label="Total Chats" value="1,284" change="+12%" />
        <StatCard icon={<Clock size={20} color="#10b981" />} label="Avg Response" value="14.2s" change="-2s" />
        <StatCard icon={<FileText size={20} color="#f59e0b" />} label="FAQs Created" value="48" change="+4" />
        <StatCard icon={<UserIcon size={20} color="#8b5cf6" />} label="Satisfied Users" value="98.2%" change="+0.4%" />
      </div>

      <section className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem' }}>Recent Activity</h3>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#71717a' }} />
            <input 
              type="text" 
              placeholder="Search conversations..." 
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
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <ActivityItem title="Refund status for order #8492" status="Answered" time="25 mins ago" user="Sarah Jenkins" />
          <ActivityItem title="Integration help with Next.js" status="Escalated" time="2 hours ago" user="Mike Ross" escalated />
          <ActivityItem title="Pricing for Enterprise accounts" status="Answered" time="5 hours ago" user="David Miller" />
          <ActivityItem title="Forgot password reset loop" status="Resolved" time="Yesterday" user="Anna Wu" />
        </div>
      </section>
    </>
  );
}

function AnalyticsView() {
  return (
    <div className="fade-in">
      <h1 style={{ fontSize: '2.25rem', marginBottom: '2rem' }}>Analytics</h1>
      <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
        <TrendingUp size={48} color="#3b82f6" style={{ marginBottom: '1.5rem' }} />
        <h3>Data Insights Rendering...</h3>
        <p style={{ color: '#a1a1aa', marginTop: '1rem' }}>Your conversation metrics and performance analytics will appear here once data processing is complete.</p>
      </div>
    </div>
  );
}

function SettingsView({ user }: { user: any }) {
  return (
    <div className="fade-in">
      <h1 style={{ fontSize: '2.25rem', marginBottom: '2rem' }}>Settings</h1>
      <div className="glass-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <h4 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Profile Settings</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.875rem', color: '#a1a1aa' }}>Email Address</label>
                <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem', marginTop: '0.25rem' }}>{user?.email}</div>
              </div>
              <div>
                <label style={{ fontSize: '0.875rem', color: '#a1a1aa' }}>Full Name</label>
                <input 
                  defaultValue={user?.user_metadata?.full_name || ''} 
                  className="glass" 
                  style={{ width: '100%', padding: '0.75rem', marginTop: '0.25rem', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--glass-border)', borderRadius: '0.5rem' }} 
                />
              </div>
            </div>
          </div>
          <div>
            <h4 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Preferences</h4>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="glass" style={{ padding: '0.75rem 1rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}>Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      padding: '0.75rem 1rem',
      borderRadius: '0.75rem',
      background: active ? 'rgba(255,255,255,0.05)' : 'transparent',
      color: active ? '#fff' : '#a1a1aa',
      fontWeight: active ? '600' : '400',
      cursor: 'pointer',
      transition: 'all 0.2s'
    }}>
      {icon}
      <span style={{ fontSize: '0.925rem' }}>{label}</span>
      {active && <ChevronRight size={16} style={{ marginLeft: 'auto' }} />}
    </div>
  );
}

function StatCard({ icon, label, value, change }: { icon: any, label: string, value: string, change: string }) {
  return (
    <div className="glass-card" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem' }}>{icon}</div>
        <span style={{ 
          fontSize: '0.75rem', 
          color: change.startsWith('+') ? '#10b981' : '#f87171',
          fontWeight: '600'
        }}>{change}</span>
      </div>
      <div style={{ fontSize: '0.875rem', color: '#a1a1aa', marginBottom: '0.25rem' }}>{label}</div>
      <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{value}</div>
    </div>
  );
}

function ActivityItem({ title, status, time, user, escalated = false }: any) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '1.5rem',
      padding: '1rem',
      borderRadius: '1rem',
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid var(--glass-border)',
      transition: 'all 0.2s'
    }}>
      <div style={{ 
        width: '40px', 
        height: '40px', 
        borderRadius: '50%', 
        background: 'rgba(255,255,255,0.05)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontWeight: '600',
        fontSize: '0.875rem'
      }}>
        {user.charAt(0)}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '0.25rem' }}>{title}</div>
        <div style={{ fontSize: '0.825rem', color: '#71717a' }}>{user} • {time}</div>
      </div>
      <div style={{ 
        padding: '0.375rem 0.75rem', 
        borderRadius: '2rem', 
        fontSize: '0.75rem', 
        fontWeight: '600',
        background: escalated ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
        color: escalated ? '#f59e0b' : '#10b981',
        border: `1px solid ${escalated ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`
      }}>
        {status}
      </div>
      <MoreVertical size={20} color="#71717a" cursor="pointer" />
    </div>
  );
}
