'use client';

import { useState } from 'react';
import { Search, Briefcase, MapPin, TrendingUp, Building2, Loader2, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Job {
  title: string;
  salary: string;
  skills: string[];
  companies: string[];
}

export default function JobsPage() {
  const [skills, setSkills] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skills.trim()) return;

    setIsLoading(true);
    setSearched(true);
    setJobs([]);

    try {
      const res = await fetch('/api/jobs/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skills }),
      });
      const data = await res.json();
      setJobs(data.jobs || data.fallback || []);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const quickSkills = ['React', 'Python', 'Java', 'Machine Learning', 'DevOps', 'Flutter'];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '8rem 2rem 4rem' }}>
      {/* Hero */}
      <div className="fade-in" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.4rem 1rem', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)',
          borderRadius: '2rem', fontSize: '0.8rem', color: '#60a5fa', marginBottom: '1.5rem', fontWeight: '600'
        }}>
          <Sparkles size={14} /> Powered by AI
        </div>
        <h1 className="gradient-text" style={{ fontSize: '3.5rem', lineHeight: '1.15', marginBottom: '1rem', fontWeight: '800' }}>
          AI Job Search
        </h1>
        <p style={{ fontSize: '1.15rem', color: '#a1a1aa', maxWidth: '550px', margin: '0 auto' }}>
          Enter your skills and let AI find the best-matching roles, salaries, and companies in India.
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} style={{ maxWidth: '700px', margin: '0 auto 1.5rem' }}>
        <div className="glass" style={{
          display: 'flex', alignItems: 'center', gap: '1rem',
          padding: '0.5rem 0.5rem 0.5rem 1.5rem', borderRadius: '1rem'
        }}>
          <Search size={20} color="#71717a" />
          <input
            type="text"
            placeholder="e.g. React, Node.js, Python, AWS..."
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: '#fff', fontSize: '1rem', padding: '0.75rem 0'
            }}
          />
          <button
            type="submit"
            disabled={isLoading || !skills.trim()}
            className="premium-btn"
            style={{
              padding: '0.85rem 2rem', borderRadius: '0.75rem', fontWeight: '600',
              fontSize: '0.925rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
              cursor: isLoading || !skills.trim() ? 'not-allowed' : 'pointer',
              opacity: isLoading || !skills.trim() ? 0.6 : 1
            }}
          >
            {isLoading ? <><Loader2 size={18} className="spin" /> Searching...</> : <>Find Roles <ArrowRight size={16} /></>}
          </button>
        </div>
      </form>

      {/* Quick Fill */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginBottom: '3rem' }}>
        <span style={{ fontSize: '0.8rem', color: '#71717a', marginRight: '0.25rem', lineHeight: '2.2' }}>Quick:</span>
        {quickSkills.map(s => (
          <button key={s} onClick={() => setSkills(prev => prev ? `${prev}, ${s}` : s)} style={{
            padding: '0.35rem 0.85rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: '500',
            background: 'rgba(255,255,255,0.04)', border: '1px solid var(--glass-border)', color: '#a1a1aa', cursor: 'pointer'
          }}>
            + {s}
          </button>
        ))}
      </div>

      {/* Results */}
      {isLoading && (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <Loader2 size={40} color="#3b82f6" className="spin" style={{ margin: '0 auto 1rem' }} />
          <p style={{ color: '#a1a1aa' }}>AI is analyzing the market for your skills...</p>
        </div>
      )}

      {!isLoading && jobs.length > 0 && (
        <div className="fade-in" style={{ display: 'grid', gap: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
            Found <span style={{ color: '#3b82f6' }}>{jobs.length}</span> matching roles
          </h2>
          {jobs.map((job, idx) => (
            <div key={idx} className="glass-card" style={{
              display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'start', gap: '1.5rem'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{
                    width: '42px', height: '42px', borderRadius: '0.75rem',
                    background: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Briefcase size={20} color="#3b82f6" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', margin: 0, fontWeight: '700' }}>{job.title}</h3>
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                  {job.skills?.map((skill, i) => (
                    <span key={i} style={{
                      padding: '0.3rem 0.7rem', borderRadius: '2rem', fontSize: '0.75rem',
                      background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#d4d4d8'
                    }}>
                      {skill}
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.85rem', color: '#a1a1aa' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Building2 size={14} /> {job.companies?.join(', ')}
                  </span>
                </div>
              </div>

              <div style={{
                padding: '0.75rem 1.25rem', borderRadius: '0.75rem',
                background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
                textAlign: 'center', whiteSpace: 'nowrap'
              }}>
                <div style={{ fontSize: '0.7rem', color: '#10b981', textTransform: 'uppercase', fontWeight: '600', marginBottom: '0.2rem' }}>Salary</div>
                <div style={{ fontSize: '1rem', fontWeight: '700', color: '#34d399' }}>{job.salary}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && searched && jobs.length === 0 && (
        <div className="glass-card fade-in" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#a1a1aa' }}>No results found. Try different skills.</p>
        </div>
      )}

      <style jsx global>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
}
