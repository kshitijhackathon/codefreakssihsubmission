import { useState } from 'react';
import Head from 'next/head';
import styles from '../styles/SymptomChecker.module.css';

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;
    setIsLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms }),
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
          <form onSubmit={handleSubmit}>
            <textarea
              className={styles.textarea}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g., 'I have a fever, headache, and a sore throat...'"
              rows="4"
            />
            <button type="submit" className={styles.button} disabled={isLoading}>
              {isLoading ? 'Analyzing...' : 'Check Symptoms'}
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
