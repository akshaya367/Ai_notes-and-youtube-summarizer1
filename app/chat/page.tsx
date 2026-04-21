'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, User as UserIcon, Bot, Paperclip, MoreVertical, Search, Trash2, Download, AlertCircle, ArrowLeft, TrendingUp, Phone, PhoneOff, Mic, MicOff, Volume2 } from 'lucide-react';
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
  const [isCalling, setIsCalling] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/auth/login');
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/auth/login');
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    let interval: any;
    if (isCalling) {
      interval = setInterval(() => setCallDuration(prev => prev + 1), 1000);
    } else {
      setCallDuration(0);
      if (synthRef.current) synthRef.current.cancel();
    }
    return () => clearInterval(interval);
  }, [isCalling]);

  const speak = (text: string) => {
    if (!synthRef.current || !isCalling || !text) return;
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    synthRef.current.speak(utterance);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!loading) scrollToBottom();
  }, [messages, isTyping, loading]);

  const handleSend = async (e?: React.FormEvent, voiceInput?: string) => {
    if (e) e.preventDefault();
    const messageText = voiceInput || input;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    if (!voiceInput) setInput('');
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
        id: 'assistant-' + Date.now().toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          setIsTyping(false);
          const chunk = decoder.decode(value);
          assistantContent += chunk;
          
          setMessages(prev => prev.map(m => 
            m.id === assistantMessage.id ? { ...m, content: assistantContent } : m
          ));
        }
        // Speak the completed message if in a call
        if (isCalling) speak(assistantContent);
      }
      setIsTyping(false);

      // Check for phone number to start call
      const phoneRegex = /\+?(\d{1,4}[-.\s]?)?\(?\d{3,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{4,9}/;
      if (phoneRegex.test(messageText) || (messageText.length >= 10 && !isNaN(Number(messageText.replace(/[-.\s]/g, ''))))) {
        const detectedPhone = messageText.match(phoneRegex)?.[0] || messageText.replace(/[-.\s]/g, '');
        
        setTimeout(async () => {
          initializeAudio(); // Unlock audio context
          const welcomeMsg = "📞 Connecting you now... You should receive an incoming call from our lead agent in a few seconds.";
          setMessages(prev => [...prev, {
            id: 'system-' + Date.now().toString(),
            role: 'assistant',
            content: welcomeMsg,
            timestamp: new Date()
          }]);
          
          const greeting = "Hello, I am your Nexus Support Agent. Thank you for providing your number. How can I help you today?";
          speak(greeting);

          // Attempt real Twilio call
          try {
            await fetch('/api/support/call', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ phoneNumber: detectedPhone, message: greeting })
            });
          } catch (err) {
            console.warn('Real call failed (likely missing Twilio keys), falling back to browser simulator');
          }
        }, 1500);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'I encountered an error. Please check your AI configuration.',
        timestamp: new Date()
      }]);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRequestCallback = () => {
    const msg = "I'd be happy to connect you with a live agent. Please **type your phone number below** so our team can call you immediately.";
    setMessages(prev => [...prev, {
      id: 'callback-req-' + Date.now().toString(),
      role: 'assistant',
      content: msg,
      timestamp: new Date()
    }]);
    if (isCalling) speak(msg);
  };

  const initializeAudio = () => {
    if (!synthRef.current) return;
    const utterance = new SpeechSynthesisUtterance("Vocal systems active.");
    utterance.volume = 0; // Silent first speak to unlock audio
    synthRef.current.speak(utterance);
    setIsCalling(true);
  };

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h2>Connecting to Support Network...</h2>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '1rem',
      gap: '1rem',
      position: 'relative'
    }}>
      {/* Live Voice Call Simulator */}
      {isCalling && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '340px', background: 'rgba(15, 15, 15, 0.98)', backdropFilter: 'blur(50px)',
          padding: '3rem', borderRadius: '3rem', border: '1px solid rgba(59, 130, 246, 0.5)',
          boxShadow: '0 0 100px rgba(0, 0, 0, 0.9), 0 0 40px rgba(59, 130, 246, 0.2)', 
          zIndex: 1000, textAlign: 'center', animation: 'scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 2rem' }}>
            {isSpeaking && (
              <div className="voice-rings">
                <span></span><span></span><span></span>
              </div>
            )}
            <div style={{ 
              width: '100%', height: '100%', background: 'rgba(59, 130, 246, 0.2)', 
              borderRadius: '50%', display: 'flex', 
              alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(59, 130, 246, 0.4)',
              position: 'relative', zIndex: 2
            }}>
              <Bot size={50} color="#3b82f6" />
            </div>
          </div>
          
          <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.02em' }}>Nexus Live Agent</h3>
          <p style={{ color: isSpeaking ? '#3b82f6' : '#10b981', fontWeight: '700', fontSize: '1.2rem', marginBottom: '3rem', transition: 'color 0.3s' }}>
            {isSpeaking ? 'Agent Speaking...' : formatTime(callDuration)}
          </p>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', alignItems: 'center' }}>
            <button onClick={() => setIsMicOn(!isMicOn)} style={{ width: '60px', height: '60px', borderRadius: '50%', background: isMicOn ? 'rgba(59, 130, 246, 0.1)' : 'rgba(239, 68, 68, 0.1)', border: `1px solid ${isMicOn ? 'rgba(59, 130, 246, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
              {isMicOn ? <Mic size={24} color="#3b82f6" /> : <MicOff size={24} color="#ef4444" />}
            </button>
            <button onClick={() => setIsCalling(false)} style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#ef4444', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(239, 68, 68, 0.4)', transition: 'transform 0.2s' }}>
              <PhoneOff size={32} color="#fff" />
            </button>
            <button style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Volume2 size={24} color="#a1a1aa" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="glass" style={{
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: '1.25rem',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link href="/dashboard" style={{ textDecoration: 'none', color: '#a1a1aa', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ArrowLeft size={18} />
            <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Nexus Dashboard</span>
          </Link>
          <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ padding: '0.6rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.85rem' }}>
              <Bot size={22} color="#3b82f6" />
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '700' }}>Live Agent Hub</h4>
              <span style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span className="pulse-dot"></span> Online and Ready
              </span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.85rem' }}>
          <button onClick={handleRequestCallback} className="premium-btn" style={{ 
            padding: '0.6rem 1.4rem', borderRadius: '0.85rem', fontSize: '0.85rem', fontWeight: '700',
            display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer'
          }}>
            <Phone size={16} /> Request Live Callback
          </button>
          <button className="glass" style={{ padding: '0.6rem', background: 'transparent', border: 'none', cursor: 'pointer' }}><Search size={19} color="#a1a1aa" /></button>
          <button className="glass" style={{ padding: '0.6rem', background: 'transparent', border: 'none', cursor: 'pointer' }}><Download size={19} color="#a1a1aa" /></button>
        </div>
      </header>

      <div style={{ display: 'flex', gap: '1rem', flex: 1, overflow: 'hidden' }}>
        {/* Queue Sidebar */}
        <aside className="glass" style={{ width: '300px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', borderRadius: '1.25rem' }}>
          <h5 style={{ color: '#71717a', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em', fontWeight: '800' }}>Active Support Queue</h5>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', overflowY: 'auto' }}>
            <ConversationItem title="Ticket #4029 - Login Meta" date="Priority: High" active />
            <ConversationItem title="Ticket #3912 - AWS Usage" date="Priority: Medium" />
            <ConversationItem title="Ticket #3881 - Refund" date="Priority: Low" />
          </div>
          <div style={{ marginTop: 'auto', padding: '1.25rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '1rem', border: '1px solid rgba(16, 185, 129, 0.1)', fontSize: '0.85rem', color: '#a1a1aa' }}>
            Available Agents: <strong style={{ color: '#fff' }}>12</strong> <br />
            Avg Wait Time: <strong style={{ color: '#fff' }}>{"<"} 1 min</strong>
            <button onClick={handleRequestCallback} style={{ width: '100%', background: 'rgba(59, 130, 246, 0.2)', border: '1px solid rgba(59, 130, 246, 0.4)', color: '#fff', fontWeight: '700', padding: '0.6rem', borderRadius: '0.6rem', marginTop: '1rem', cursor: 'pointer' }}>Call Specialist</button>
          </div>
        </aside>

        {/* Chat / Call Interface */}
        <div className="glass" style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRadius: '1.25rem', overflow: 'hidden' }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {messages.map((m) => (
              <div key={m.id} style={{ display: 'flex', gap: '1.25rem', flexDirection: m.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-start' }}>
                <div style={{ padding: '0.6rem', background: m.role === 'user' ? '#3b82f6' : 'rgba(255,255,255,0.05)', borderRadius: '0.75rem' }}>
                  {m.role === 'user' ? <UserIcon size={18} color="#fff" /> : <Bot size={18} color="#3b82f6" />}
                </div>
                <div style={{ maxWidth: '75%', background: m.role === 'user' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.03)', padding: '1.25rem', borderRadius: '1.25rem', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="markdown-content"><ReactMarkdown>{m.content}</ReactMarkdown></div>
                  <span style={{ fontSize: '0.7rem', color: '#71717a', marginTop: '0.75rem', display: 'block' }}>{m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            ))}
            {isTyping && <div className="typing-indicator"><span></span><span></span><span></span></div>}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} style={{ padding: '1.75rem 2.5rem', background: 'rgba(0,0,0,0.3)', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            <button type="button" style={{ background: 'none', border: 'none', color: '#71717a' }}><Paperclip size={22} /></button>
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type or speak your request..." style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', padding: '1rem 1.25rem', color: '#fff', outline: 'none' }} />
            <button type="submit" disabled={!input.trim()} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '0.9rem', borderRadius: '1rem', cursor: 'pointer', opacity: input.trim() ? 1 : 0.5 }}>
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>

      <style jsx global>{`
        .pulse-dot { width: 8px; height: 8px; background: #10b981; borderRadius: 50%; animation: pulse 2s infinite; }
        @keyframes pulse { 0% { transform: scale(0.95); opacity: 0.7; } 70% { transform: scale(1.1); opacity: 1; } 100% { transform: scale(0.95); opacity: 0.7; } }
        .voice-rings { position: absolute; width: 140%; height: 140%; top: -20%; left: -20%; display: flex; align-items: center; justify-content: center; z-index: 1; }
        .voice-rings span { position: absolute; width: 100%; height: 100%; border: 2px solid #3b82f6; borderRadius: 50%; animation: voiceWave 1.5s infinite; opacity: 0; }
        .voice-rings span:nth-child(2) { animation-delay: 0.5s; }
        .voice-rings span:nth-child(3) { animation-delay: 1s; }
        @keyframes voiceWave { 0% { transform: scale(0.8); opacity: 0.8; } 100% { transform: scale(1.5); opacity: 0; } }
        .typing-indicator { display: flex; gap: 5px; padding: 12px 18px; width: fit-content; background: rgba(255,255,255,0.05); borderRadius: 12px; }
        .typing-indicator span { width: 7px; height: 7px; background: #3b82f6; border-radius: 50%; animation: bounce 1.4s infinite ease-in-out both; }
        @keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1.0); } }
        @keyframes scaleIn { from { transform: translate(-50%, -50%) scale(0.8); opacity: 0; } to { transform: translate(-50%, -50%) scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
}

function ConversationItem({ title, date, active = false }: { title: string, date: string, active?: boolean }) {
  return (
    <div style={{ padding: '1rem', borderRadius: '1rem', background: active ? 'rgba(59, 130, 246, 0.12)' : 'rgba(255, 255, 255, 0.02)', border: `1px solid ${active ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255, 255, 255, 0.05)'}`, cursor: 'pointer', transition: 'all 0.25s' }}>
      <div style={{ fontWeight: '700', fontSize: '0.95rem', color: active ? '#fff' : '#d1d1d6', marginBottom: '0.3rem' }}>{title}</div>
      <div style={{ fontSize: '0.75rem', color: active ? '#60a5fa' : '#71717a' }}>{date}</div>
    </div>
  );
}
