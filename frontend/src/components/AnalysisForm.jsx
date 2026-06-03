import { useState } from 'react';

export default function AnalysisForm({ onSubmit, isLoading }) {
  const [text, setText] = useState('');
  const isValid = text.trim().length >= 20;
  const charCount = text.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ position: 'relative' }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste the job offer, recruiter message, or onboarding email here..."
          rows={8}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '10px',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
            fontSize: '0.9rem',
            resize: 'vertical',
            outline: 'none',
            fontFamily: 'var(--font-body)',
            lineHeight: '1.7',
            transition: 'border-color 0.15s',
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
        />
        <div style={{
          position: 'absolute',
          bottom: '12px',
          right: '14px',
          fontSize: '0.7rem',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
        }}>
          {charCount}/15000
        </div>
      </div>

      <button
        onClick={() => isValid && !isLoading && onSubmit(text)}
        disabled={!isValid || isLoading}
        style={{
          padding: '14px 24px',
          borderRadius: '8px',
          border: 'none',
          backgroundColor: isValid && !isLoading ? 'var(--text-primary)' : 'var(--border)',
          color: isValid && !isLoading ? 'var(--bg)' : 'var(--text-muted)',
          fontSize: '0.875rem',
          fontWeight: '500',
          fontFamily: 'var(--font-display)',
          letterSpacing: '0.02em',
          cursor: isValid && !isLoading ? 'pointer' : 'not-allowed',
          transition: 'all 0.15s',
          width: '100%',
        }}
      >
        {isLoading ? 'Scanning...' : 'Run Trustellix Scan →'}
      </button>

      {!isValid && text.length > 0 && (
        <p style={{
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)',
        }}>
          Minimum 20 characters required
        </p>
      )}
    </div>
  );
}