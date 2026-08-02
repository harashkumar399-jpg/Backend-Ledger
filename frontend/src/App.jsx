import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TransferPage from './pages/TransferPage';
import TransactionHistoryPage from './pages/TransactionHistoryPage';
import SystemDepositPage from './pages/SystemDepositPage';
import BackendGuidePage from './pages/BackendGuidePage';
import './styles/index.css';

function MainApp() {
  const { isAuthenticated } = useAuth();
  const [authView, setAuthView] = useState('login'); // 'login' | 'register'
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [pageParams, setPageParams] = useState({});

  const handleNavigate = (page, params = {}) => {
    setCurrentPage(page);
    setPageParams(params);
  };

  // If user is not logged in, show Auth screens
  if (!isAuthenticated) {
    if (authView === 'register') {
      return <Register onSwitchToLogin={() => setAuthView('login')} />;
    }
    return <Login onSwitchToRegister={() => setAuthView('register')} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
      
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        
        <main style={{ flex: 1, overflowY: 'auto', background: 'radial-gradient(ellipse at 80% 0%, rgba(99, 102, 241, 0.06), transparent 70%)' }}>
          {currentPage === 'dashboard' && <Dashboard onNavigate={handleNavigate} />}
          {currentPage === 'transfer' && (
            <TransferPage
              initialFromAccount={pageParams.fromAccount}
              onNavigate={handleNavigate}
            />
          )}
          {currentPage === 'history' && <TransactionHistoryPage onNavigate={handleNavigate} />}
          {currentPage === 'deposit' && <SystemDepositPage onNavigate={handleNavigate} />}
          {currentPage === 'integration' && <BackendGuidePage />}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}
