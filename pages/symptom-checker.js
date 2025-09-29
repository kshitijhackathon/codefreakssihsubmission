import { useState } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/SymptomChecker.module.css';
import { HiIdentification as HiOutlineIdentification, HiExclamationCircle as HiOutlineExclamationCircle, HiCheckCircle as HiOutlineCheckCircle } from 'react-icons/hi';

// Import database only on client side
let nabhaGramDB;
if (typeof window !== 'undefined') {
  nabhaGramDB = require('../lib/nabhaGramDatabase').default;
}

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [nabhaGramID, setNabhaGramID] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [validatedPatient, setValidatedPatient] = useState(null);

  const handleValidateID = async (e) => {
    e.preventDefault();
    if (!nabhaGramID.trim()) {
      setValidationError('Please enter your NabhaGram ID');
      return;
    }

    setIsValidating(true);
    setValidationError('');

    try {
      if (typeof window !== 'undefined' && nabhaGramDB) {
        const patientData = nabhaGramDB.getNabhaGramIDById(nabhaGramID);
        
        if (patientData) {
          setValidatedPatient(patientData);
        } else {
          setValidationError('Invalid NabhaGram ID. Please check your ID or generate a new one.');
          setValidatedPatient(null);
        }
      } else {
        setValidationError('Service temporarily unavailable. Please try again later.');
      }
    } catch (error) {
      console.error('Validation error:', error);
      setValidationError('Error validating ID. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatedPatient) {
      setResult({ error: 'Please validate your NabhaGram ID first.' });
      return;
    }
    
    if (!symptoms.trim()) {
      setResult({ error: 'Please enter your symptoms.' });
      return;
    }
    
    setIsLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          symptoms,
          nabhaGramID: validatedPatient.id,
          patientName: validatedPatient.fullName
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error('Failed to fetch recommendations', error);
      setResult({ error: 'Failed to get a response. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Symptom Checker - NabhaCare</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Symptom Checker</h1>
        <p className={styles.description}>
          Describe your symptoms below to get an initial analysis. This is not a substitute for professional medical advice.
        </p>

        <div className={styles.card}>
          {/* NabhaGram ID Validation Section */}
          {!validatedPatient ? (
            <div style={{ marginBottom: '20px', padding: '15px', background: '#fef3c7', borderRadius: '8px', border: '1px solid #f59e0b' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <HiOutlineIdentification style={{ marginRight: '8px', color: '#d97706', fontSize: '18px' }} />
                <h3 style={{ margin: 0, color: '#92400e', fontSize: '16px' }}>NabhaGram ID Required</h3>
              </div>
              <p style={{ margin: '0 0 10px 0', color: '#92400e', fontSize: '13px' }}>
                Please enter your NabhaGram ID to use symptom checker. If you don&apos;t have one, 
                <Link href="/" style={{ color: '#059669', textDecoration: 'underline', marginLeft: '5px' }}>generate it here</Link>.
              </p>
              
              <form onSubmit={handleValidateID} style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <input 
                    type="text" 
                    value={nabhaGramID} 
                    onChange={(e) => setNabhaGramID(e.target.value.toUpperCase())} 
                    placeholder="e.g., NBHABC2025000001"
                    required 
                    style={{ 
                      width: '100%', 
                      padding: '8px', 
                      borderRadius: '4px', 
                      border: validationError ? '1px solid #dc2626' : '1px solid #d1d5db',
                      fontSize: '13px'
                    }} 
                  />
                  {validationError && (
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '4px', color: '#dc2626', fontSize: '11px' }}>
                      <HiOutlineExclamationCircle style={{ marginRight: '4px', fontSize: '12px' }} />
                      {validationError}
                    </div>
                  )}
                </div>
                <button 
                  type="submit" 
                  disabled={isValidating}
                  style={{ 
                    padding: '8px 15px', 
                    background: isValidating ? '#9ca3af' : '#059669', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '4px', 
                    cursor: isValidating ? 'not-allowed' : 'pointer', 
                    fontWeight: 'bold',
                    fontSize: '13px'
                  }}
                >
                  {isValidating ? 'Validating...' : 'Validate'}
                </button>
              </form>
            </div>
          ) : (
            <div style={{ marginBottom: '20px', padding: '12px', background: '#d1fae5', borderRadius: '8px', border: '1px solid #10b981' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <HiOutlineCheckCircle style={{ marginRight: '8px', color: '#059669', fontSize: '18px' }} />
                <div>
                  <div style={{ fontWeight: 'bold', color: '#065f46', marginBottom: '2px', fontSize: '14px' }}>
                    ✅ Verified: {validatedPatient.fullName}
                  </div>
                  <div style={{ fontSize: '11px', color: '#047857' }}>
                    NabhaGram ID: {validatedPatient.id}
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setValidatedPatient(null);
                    setNabhaGramID('');
                  }}
                  style={{ 
                    marginLeft: 'auto', 
                    padding: '4px 8px', 
                    background: '#f3f4f6', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '4px', 
                    cursor: 'pointer',
                    fontSize: '11px'
                  }}
                >
                  Change ID
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <textarea
              className={styles.textarea}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g., 'I have a fever, headache, and a sore throat...'"
              rows="4"
              disabled={!validatedPatient}
              style={{ 
                background: validatedPatient ? 'white' : '#f3f4f6',
                color: validatedPatient ? '#111827' : '#6b7280'
              }}
            />
            {!validatedPatient && (
              <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#6b7280', textAlign: 'center' }}>
                Please validate your NabhaGram ID first to use symptom checker
              </p>
            )}
            <button 
              type="submit" 
              className={styles.button} 
              disabled={isLoading || !validatedPatient}
              style={{ 
                background: validatedPatient ? '#059669' : '#9ca3af',
                cursor: validatedPatient ? 'pointer' : 'not-allowed'
              }}
            >
              {isLoading ? 'Analyzing...' : validatedPatient ? 'Check Symptoms' : 'Please Validate ID First'}
            </button>
          </form>
        </div>

        {result && (
          <div className={`${styles.card} ${styles.resultsCard}`}>
            <h2 className={styles.resultsTitle}>Analysis Results</h2>
            {result.error && <p className={styles.errorText}>{result.error}</p>}
            {result.answer && <p>{result.answer}</p>}
            {result.redFlagWarning && (
              <div className={styles.redFlag}>
                <strong>URGENT:</strong> {result.redFlagWarning}
              </div>
            )}
            {result.differentialDiagnosis && result.differentialDiagnosis.length > 0 && (
              <div className={styles.resultSection}>
                <h3>Possible Conditions</h3>
                <ul>
                  {result.differentialDiagnosis.map(d => (
                    <li key={d.name}>{d.name} ({d.confidence}% confidence)</li>
                  ))}
                </ul>
              </div>
            )}
            {result.recommendations && result.recommendations.length > 0 && (
              <div className={styles.resultSection}>
                <h3>Recommendations</h3>
                <ul>
                  {result.recommendations.map((rec, i) => (
                    <li key={i}>{rec.isReferral ? `Referral: ${rec.medicine}` : `Medicine: ${rec.medicine}`} - {rec.guideline}</li>
                  ))}
                </ul>
              </div>
            )}
            {result.lab_recommendations && result.lab_recommendations.length > 0 && (
              <div className={styles.resultSection}>
                <h3>Lab Tests</h3>
                <p>{result.lab_recommendations.join(', ')}</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default SymptomChecker;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common']))
    }
  };
}
