'use client';

import { useState, useCallback } from 'react';
import { Upload, Loader2, CheckCircle2, Sparkles, TrendingUp, AlertCircle, RotateCcw, FileText, ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';

interface Analysis {
  score: number;
  improvements: string[];
  missingSkills: string[];
  industryFit: string;
}

export default function AnalyzerPage() {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const [pasteMode, setPasteMode] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) router.push('/auth/login');
    };
    checkAuth();
  }, [router]);

  const analyzeFile = async (file: File) => {
    setIsAnalyzing(true);
    setError('');
    setFileName(file.name);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/analyze', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.analysis) setAnalysis(data.analysis);
      else setError('Analysis failed. Try again later.');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeText = async () => {
    if (!pasteText.trim()) return;
    setIsAnalyzing(true);
    setError('');
    setFileName('Pasted Resume');

    const formData = new FormData();
    formData.append('text', pasteText);

    try {
      const res = await fetch('/api/analyze', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.analysis) setAnalysis(data.analysis);
      else setError('Analysis failed.');
    } catch {
      setError('Network error.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) analyzeFile(file);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) analyzeFile(file);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Work';
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '8rem 2rem 4rem' }}>
      <div className="fade-in" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.4rem 1rem', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)',
          borderRadius: '2rem', fontSize: '0.8rem', color: '#a78bfa', marginBottom: '1.5rem', fontWeight: '600'
        }}>
          <Sparkles size={14} /> AI-Powered Documentation Analysis
        </div>
        <h1 className="gradient-text" style={{ fontSize: '3.5rem', lineHeight: '1.15', marginBottom: '1rem', fontWeight: '800' }}>
          Knowledge Base AI
        </h1>
        <p style={{ fontSize: '1.15rem', color: '#a1a1aa', maxWidth: '550px', margin: '0 auto' }}>
          Upload support manuals or product docs. AI will score the depth of information and identify gaps in your knowledge base.
        </p>
      </div>

      {!analysis && !isAnalyzing && (
        <div className="fade-in">
          {/* Mode Toggle */}
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '2rem' }}>
            <button onClick={() => setPasteMode(false)} style={{
              padding: '0.6rem 1.5rem', borderRadius: '0.75rem', fontSize: '0.875rem', fontWeight: '600',
              background: !pasteMode ? '#3b82f6' : 'var(--glass-bg)',
              color: '#fff', border: `1px solid ${!pasteMode ? '#3b82f6' : 'var(--glass-border)'}`, cursor: 'pointer'
            }}>
              <Upload size={14} style={{ display: 'inline', marginRight: '0.4rem', verticalAlign: 'middle' }} /> Upload PDF
            </button>
            <button onClick={() => setPasteMode(true)} style={{
              padding: '0.6rem 1.5rem', borderRadius: '0.75rem', fontSize: '0.875rem', fontWeight: '600',
              background: pasteMode ? '#3b82f6' : 'var(--glass-bg)',
              color: '#fff', border: `1px solid ${pasteMode ? '#3b82f6' : 'var(--glass-border)'}`, cursor: 'pointer'
            }}>
              <FileText size={14} style={{ display: 'inline', marginRight: '0.4rem', verticalAlign: 'middle' }} /> Paste Text
            </button>
          </div>

          {!pasteMode ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              style={{
                padding: '4rem 2rem', borderRadius: '1.5rem', textAlign: 'center', cursor: 'pointer',
                background: isDragOver ? 'rgba(59,130,246,0.08)' : 'var(--glass-bg)',
                border: `2px dashed ${isDragOver ? '#3b82f6' : 'var(--glass-border)'}`,
                transition: 'all 0.3s'
              }}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <input id="file-input" type="file" accept=".pdf,.txt,.doc,.docx" onChange={handleFileSelect} style={{ display: 'none' }} />
              <div style={{
                width: '64px', height: '64px', borderRadius: '1rem', background: 'rgba(59,130,246,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem'
              }}>
                <Upload size={28} color="#60a5fa" />
              </div>
              <p style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.5rem' }}>Drag & drop your resume</p>
              <p style={{ color: '#71717a', fontSize: '0.9rem' }}>PDF, TXT, or DOC — up to 5MB</p>
            </div>
          ) : (
            <div>
              <textarea
                placeholder="Paste your resume content here..."
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                style={{
                  width: '100%', minHeight: '250px', padding: '1.5rem', borderRadius: '1rem',
                  background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
                  color: '#fff', fontSize: '0.9rem', lineHeight: '1.7', outline: 'none', resize: 'vertical',
                  fontFamily: 'Inter, sans-serif'
                }}
              />
              <button onClick={analyzeText} disabled={!pasteText.trim()} className="premium-btn" style={{
                width: '100%', padding: '1rem', borderRadius: '0.75rem', marginTop: '1rem',
                fontWeight: '700', fontSize: '1rem',
                cursor: pasteText.trim() ? 'pointer' : 'not-allowed',
                opacity: pasteText.trim() ? 1 : 0.5
              }}>
                Analyze Resume
              </button>
            </div>
          )}
        </div>
      )}

      {/* Loading State */}
      {isAnalyzing && (
        <div className="glass-card fade-in" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <Loader2 size={48} color="#3b82f6" className="spin" style={{ margin: '0 auto 1.5rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>Analyzing {fileName}...</h3>
          <p style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>AI is scanning for ATS compatibility, skill gaps, and improvements</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="glass-card fade-in" style={{ textAlign: 'center', padding: '2rem', borderColor: 'rgba(239,68,68,0.3)' }}>
          <AlertCircle size={32} color="#ef4444" style={{ margin: '0 auto 1rem' }} />
          <p style={{ color: '#f87171' }}>{error}</p>
        </div>
      )}

      {/* Results */}
      {analysis && (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Score Card */}
          <div className="glass-card" style={{
            display: 'flex', alignItems: 'center', gap: '2rem', padding: '2rem',
            background: 'linear-gradient(135deg, rgba(59,130,246,0.05), rgba(139,92,246,0.05))'
          }}>
            <div style={{ position: 'relative', width: '120px', height: '120px', flexShrink: 0 }}>
              <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="60" cy="60" r="52" stroke="rgba(255,255,255,0.06)" strokeWidth="8" fill="none" />
                <circle
                  cx="60" cy="60" r="52" stroke={getScoreColor(analysis.score)} strokeWidth="8" fill="none"
                  strokeDasharray={2 * Math.PI * 52} strokeDashoffset={2 * Math.PI * 52 * (1 - analysis.score / 100)}
                  strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }}
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '2rem', fontWeight: '800', color: getScoreColor(analysis.score) }}>{analysis.score}</span>
                <span style={{ fontSize: '0.65rem', color: '#71717a', textTransform: 'uppercase', fontWeight: '600' }}>{getScoreLabel(analysis.score)}</span>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Knowledge Quality Score</h2>
              <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '1rem' }}>
                Content Fit: <strong style={{ color: '#fff' }}>Technical Support</strong>
              </p>
              <button onClick={() => { setAnalysis(null); setFileName(''); setPasteText(''); }} style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem',
                color: '#60a5fa', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '500'
              }}>
                <RotateCcw size={14} /> Analyze another document
              </button>
            </div>
          </div>

          {/* Improvements + Skills Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <TrendingUp size={20} color="#10b981" />
                <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Content Clarity</h3>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {analysis.improvements.map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.875rem', color: '#d4d4d8', lineHeight: '1.5' }}>
                    <CheckCircle2 size={16} color="#3b82f6" style={{ flexShrink: 0, marginTop: '0.15rem' }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <Sparkles size={20} color="#f59e0b" />
                <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Information Gaps</h3>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                {analysis.missingSkills.map((skill, i) => (
                  <span key={i} style={{
                    padding: '0.45rem 1rem', borderRadius: '2rem', fontSize: '0.8rem',
                    background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)',
                    color: '#fbbf24', fontWeight: '500'
                  }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
}
