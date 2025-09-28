import { useDarkMode } from '../context/DarkModeContext';
import DarkModeToggle from './DarkModeToggle';

export default function Header() {
  const { isDarkMode } = useDarkMode();

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1001,
      background: isDarkMode ? '#1e293b' : '#ffffff',
      borderBottom: `1px solid ${isDarkMode ? '#475569' : '#e5e7eb'}`,
      padding: '12px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      transition: 'all 0.3s ease',
      boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <h1 style={{
          margin: 0,
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: isDarkMode ? '#f1f5f9' : '#1a202c',
          transition: 'color 0.3s ease'
        }}>
          🏥 Telemedicine Access
        </h1>
      </div>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <DarkModeToggle />
      </div>
    </header>
  );
}
