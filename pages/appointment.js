import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { HiIdentification as HiOutlineIdentification, HiExclamationCircle as HiOutlineExclamationCircle, HiCheckCircle as HiOutlineCheckCircle } from 'react-icons/hi';

// Import database only on client side
let nabhaGramDB;
if (typeof window !== 'undefined') {
  nabhaGramDB = require('../lib/nabhaGramDatabase').default;
}

export default function Appointment() {
  const [patientName, setPatientName] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [message, setMessage] = useState('');
  const [bookedAppointment, setBookedAppointment] = useState(null);
  const [nabhaGramID, setNabhaGramID] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [validatedPatient, setValidatedPatient] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/doctors')
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          setDoctors(data);
          setSelectedDoctor(data[0].name);
        }
      });
  }, []);

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
          setPatientName(patientData.fullName);
          setMessage('');
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
      setMessage('Please validate your NabhaGram ID first.');
      return;
    }
    
    if (!selectedDoctor) {
      setMessage('Please select a doctor.');
      return;
    }
    
    setMessage('');
    setBookedAppointment(null);

    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        patientName: validatedPatient.fullName, 
        nabhaGramID: validatedPatient.id,
        doctor: selectedDoctor, 
        date, 
        time 
      }),
    });

    if (res.ok) {
      const newAppointment = await res.json();
      setMessage(`Appointment booked successfully! Your token is: ${newAppointment.token}`);
      setBookedAppointment(newAppointment);
      setPatientName('');
      setDate('');
      setTime('');
      setNabhaGramID('');
      setValidatedPatient(null);
    } else {
      setMessage('Failed to book appointment. Please try again.');
    }
  };

  return (
    <div>
      <header style={{ background: 'white', padding: '15px 30px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: '#059669', fontSize: '24px', margin: 0 }}>Book an Appointment</h1>
        <button onClick={() => router.push('/')} style={{ padding: '10px 20px', background: '#e5e7eb', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Back to Home</button>
      </header>
      <main style={{ padding: '40px', maxWidth: '700px', margin: '40px auto' }}>
        <div style={{ background: '#f9fafb', padding: '30px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
          
          {/* NabhaGram ID Validation Section */}
          {!validatedPatient ? (
            <div style={{ marginBottom: '30px', padding: '20px', background: '#fef3c7', borderRadius: '8px', border: '1px solid #f59e0b' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                <HiOutlineIdentification style={{ marginRight: '8px', color: '#d97706', fontSize: '20px' }} />
                <h3 style={{ margin: 0, color: '#92400e', fontSize: '18px' }}>NabhaGram ID Required</h3>
              </div>
              <p style={{ margin: '0 0 15px 0', color: '#92400e', fontSize: '14px' }}>
                Please enter your NabhaGram ID to book an appointment. If you don't have one, 
                <a href="/" style={{ color: '#059669', textDecoration: 'underline', marginLeft: '5px' }}>generate it here</a>.
              </p>
              
              <form onSubmit={handleValidateID} style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#92400e' }}>NabhaGram ID</label>
                  <input 
                    type="text" 
                    value={nabhaGramID} 
                    onChange={(e) => setNabhaGramID(e.target.value.toUpperCase())} 
                    placeholder="e.g., NBHABC2025000001"
                    required 
                    style={{ 
                      width: '100%', 
                      padding: '10px', 
                      borderRadius: '6px', 
                      border: validationError ? '1px solid #dc2626' : '1px solid #d1d5db',
                      fontSize: '14px'
                    }} 
                  />
                  {validationError && (
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '5px', color: '#dc2626', fontSize: '12px' }}>
                      <HiOutlineExclamationCircle style={{ marginRight: '4px', fontSize: '14px' }} />
                      {validationError}
                    </div>
                  )}
                </div>
                <button 
                  type="submit" 
                  disabled={isValidating}
                  style={{ 
                    padding: '10px 20px', 
                    background: isValidating ? '#9ca3af' : '#059669', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '6px', 
                    cursor: isValidating ? 'not-allowed' : 'pointer', 
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}
                >
                  {isValidating ? 'Validating...' : 'Validate ID'}
                </button>
              </form>
            </div>
          ) : (
            <div style={{ marginBottom: '30px', padding: '15px', background: '#d1fae5', borderRadius: '8px', border: '1px solid #10b981' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <HiOutlineCheckCircle style={{ marginRight: '8px', color: '#059669', fontSize: '20px' }} />
                <div>
                  <div style={{ fontWeight: 'bold', color: '#065f46', marginBottom: '2px' }}>
                    ✅ Verified: {validatedPatient.fullName}
                  </div>
                  <div style={{ fontSize: '12px', color: '#047857' }}>
                    NabhaGram ID: {validatedPatient.id}
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setValidatedPatient(null);
                    setNabhaGramID('');
                    setPatientName('');
                  }}
                  style={{ 
                    marginLeft: 'auto', 
                    padding: '5px 10px', 
                    background: '#f3f4f6', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '4px', 
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Change ID
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Patient Name</label>
              <input 
                type="text" 
                value={patientName} 
                onChange={(e) => setPatientName(e.target.value)} 
                required 
                disabled={validatedPatient}
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  borderRadius: '6px', 
                  border: '1px solid #d1d5db',
                  background: validatedPatient ? '#f3f4f6' : 'white',
                  color: validatedPatient ? '#6b7280' : '#111827'
                }} 
              />
              {validatedPatient && (
                <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#6b7280' }}>
                  Name auto-filled from verified NabhaGram ID
                </p>
              )}
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Doctor</label>
              <select value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', background: 'white' }}>
                {doctors.length === 0 ? (
                  <option disabled>No doctors available</option>
                ) : (
                  doctors.map(doc => <option key={doc.id} value={doc.name}>{doc.name} - {doc.specialty}</option>)
                )}
              </select>
              {selectedDoctor && doctors.find(doc => doc.name === selectedDoctor) && (
                <div style={{ marginTop: '8px', padding: '8px', background: '#f0f9ff', borderRadius: '6px', border: '1px solid #0ea5e9' }}>
                  <p style={{ margin: 0, fontSize: '14px', color: '#0c4a6e' }}>
                    <strong>Specialization:</strong> {doctors.find(doc => doc.name === selectedDoctor).specialty}
                  </p>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Date</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Time</label>
                <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
              </div>
            </div>
            <button 
              type="submit" 
              disabled={!validatedPatient}
              style={{ 
                width: '100%', 
                background: validatedPatient ? '#059669' : '#9ca3af', 
                color: 'white', 
                border: 'none', 
                padding: '15px', 
                borderRadius: '6px', 
                cursor: validatedPatient ? 'pointer' : 'not-allowed', 
                fontWeight: 'bold', 
                fontSize: '16px' 
              }}
            >
              {validatedPatient ? 'Book Appointment' : 'Please Validate NabhaGram ID First'}
            </button>
          </form>
          {message && <p style={{ marginTop: '20px', textAlign: 'center', padding: '10px', background: bookedAppointment ? '#d1fae5' : '#fee2e2', color: bookedAppointment ? '#065f46' : '#991b1b', borderRadius: '8px', fontWeight: 'bold' }}>{message}</p>}
          {bookedAppointment && (
            <div style={{marginTop: '20px', textAlign: 'center'}}>
              <button onClick={() => router.push('/patient-view')} style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Go to Your Patient Dashboard</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
