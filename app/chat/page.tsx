'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, User as UserIcon, Bot, Paperclip, MoreVertical, Search, Trash2, Download, AlertCircle, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'Welcome to Nexus AI Support! How can I assist you today?', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
      } else {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!loading) scrollToBottom();
  }, [messages, isTyping, loading]);

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h2>Loading Chat...</h2>
        </div>
      </div>
    );
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })) }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          assistantContent += chunk;
          
          setMessages(prev => prev.map(m => 
            m.id === assistantMessage.id ? { ...m, content: assistantContent } : m
          ));
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'I encountered an error. Please check your API configuration.',
        timestamp: new Date()
      }]);
    }
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '1rem',
      gap: '1rem'
    }}>
      {/* Header */}
      <header className="glass" style={{
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link href="/dashboard" style={{ textDecoration: 'none', color: '#a1a1aa', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowLeft size={18} />
            <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Dashboard</span>
          </Link>
          <div style={{ width: '1px', height: '20px', background: 'var(--glass-border)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.5rem', background: 'var(--glass-bg)', borderRadius: '0.5rem' }}>
              <Bot size={20} color="#3b82f6" />
            </div>
            <div>
              <h4 style={{ margin: 0 }}>Nexus AI Assistant</h4>
              <span style={{ fontSize: '0.75rem', color: '#10b981' }}>● Online</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="glass" style={{ padding: '0.5rem', background: 'transparent', border: 'none', cursor: 'pointer' }}><Search size={18} color="#a1a1aa" /></button>
          <button className="glass" style={{ padding: '0.5rem', background: 'transparent', border: 'none', cursor: 'pointer' }}><Download size={18} color="#a1a1aa" /></button>
          <button className="glass" style={{ padding: '0.5rem', background: 'transparent', border: 'none', cursor: 'pointer' }}><Trash2 size={18} color="#f87171" /></button>
        </div>
      </header>

      {/* Chat Windows Container */}
      <div style={{ display: 'flex', gap: '1rem', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar (History) - Desktop only */}
        <aside className="glass" style={{
          width: '280px',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          borderRadius: '1rem'
        }}>
          <h5 style={{ color: '#71717a', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Past Conversations</h5>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto' }}>
            <ConversationItem title="Pricing Query" date="2h ago" active />
            <ConversationItem title="API Setup Help" date="Yesterday" />
            <ConversationItem title="Account Security" date="3 days ago" />
          </div>
          <div style={{ marginTop: 'auto', padding: '1rem', background: 'var(--glass-bg)', borderRadius: '0.75rem', fontSize: '0.825rem', color: '#a1a1aa' }}>
            <AlertCircle size={16} style={{ marginBottom: '0.5rem' }} /> Need human help? <br />
            <button style={{ background: 'none', border: 'none', color: '#fff', fontWeight: '600', padding: 0, marginTop: '0.25rem', cursor: 'pointer' }}>Talk to an agent</button>
          </div>
        </aside>

        {/* Main Chat Area */}
        <div className="glass" style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '1rem',
          overflow: 'hidden'
        }}>
          {/* Scrollable Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            {messages.map((m) => (
              <div key={m.id} style={{
                display: 'flex',
                gap: '1rem',
                flexDirection: m.role === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-start'
              }}>
                <div style={{
                  padding: '0.5rem',
                  background: m.role === 'user' ? '#3b82f6' : 'var(--glass-bg)',
                  borderRadius: '0.5rem',
                  marginTop: '0.25rem'
                }}>
                  {m.role === 'user' ? <User size={16} color="#fff" /> : <Bot size={16} color="#3b82f6" />}
                </div>
                <div style={{
                  maxWidth: '70%',
                  background: m.role === 'user' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                  padding: '1rem',
                  borderRadius: m.role === 'user' ? '1rem 0 1rem 1rem' : '0 1rem 1rem 1rem',
                  border: '1px solid var(--glass-border)',
                  lineHeight: '1.6'
                }}>
                  <div className="markdown-content">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                  <span style={{ fontSize: '0.65rem', color: '#71717a', marginTop: '0.5rem', display: 'block' }}>
                    {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ padding: '0.5rem', background: 'var(--glass-bg)', borderRadius: '0.5rem' }}>
                  <Bot size={16} color="#3b82f6" />
                </div>
                <div className="typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form 
            onSubmit={handleSend}
            style={{
              padding: '1.5rem 2rem',
              background: 'rgba(0,0,0,0.2)',
              borderTop: '1px solid var(--glass-border)',
              display: 'flex',
              gap: '1rem',
              alignItems: 'center'
            }}
          >
            <button type="button" style={{ background: 'none', border: 'none', color: '#71717a' }}><Paperclip size={20} /></button>
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about our product..."
              style={{
                flex: 1,
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                borderRadius: '0.75rem',
                padding: '0.875rem 1rem',
                color: '#fff',
                outline: 'none',
                fontSize: '0.925rem'
              }}
            />
            <button 
              type="submit"
              disabled={!input.trim()}
              style={{
                background: '#3b82f6',
                color: '#fff',
                border: 'none',
                padding: '0.75rem',
                borderRadius: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: input.trim() ? 'pointer' : 'not-allowed',
                opacity: input.trim() ? 1 : 0.5
              }}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>

      <style jsx global>{`
        .typing-indicator {
          display: flex;
          gap: 4px;
          padding: 10px 15px;
          background: var(--glass-bg);
          border-radius: 12px;
        }
        .typing-indicator span {
          width: 6px;
          height: 6px;
          background: #3b82f6;
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out both;
        }
        .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
        .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1.0); }
        }
        .markdown-content p { margin-bottom: 0.5rem; }
        .markdown-content code { background: rgba(0,0,0,0.2); padding: 0.2rem 0.4rem; border-radius: 4px; font-family: monospace; }
      `}</style>
    </div>
  );
}

function ConversationItem({ title, date, active = false }: { title: string, date: string, active?: boolean }) {
  return (
    <div style={{
      padding: '0.875rem',
      borderRadius: '0.75rem',
      background: active ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
      border: active ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid transparent',
      cursor: 'pointer',
      transition: 'all 0.2s'
    }}>
      <div style={{ fontWeight: active ? '600' : '500', fontSize: '0.925rem', color: active ? '#fff' : '#a1a1aa', marginBottom: '0.25rem' }}>{title}</div>
      <div style={{ fontSize: '0.75rem', color: '#71717a' }}>{date}</div>
    </div>
  );
}
