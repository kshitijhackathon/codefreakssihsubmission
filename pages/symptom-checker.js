import { useEffect } from 'react';
import Link from 'next/link';

const EXTERNAL_URL = 'https://ai-1-itlj.onrender.com/';

export default function SymptomCheckerRedirect() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Replace history entry so Back returns to Home
      window.location.replace(EXTERNAL_URL);
    }
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '24px' }}>
      <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', maxWidth: '560px', width: '100%', textAlign: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '20px' }}>Opening Symptom Checker…</h1>
        <p style={{ marginTop: '8px', color: '#6b7280' }}>If it doesn’t open automatically, use the button below.</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '16px' }}>
          <a href={EXTERNAL_URL} style={{ padding: '10px 14px', background: '#059669', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}>Open Symptom Checker</a>
          <Link href="/" style={{ padding: '10px 14px', border: '1px solid #e5e7eb', borderRadius: '8px', textDecoration: 'none', color: '#111827' }}>Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
