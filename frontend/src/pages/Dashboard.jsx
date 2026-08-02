import React, { useState } from 'react';
import StatCard from '../components/dashboard/StatCard';
import AccountCard from '../components/dashboard/AccountCard';
import CreateAccountModal from '../components/dashboard/CreateAccountModal';
import { useAccounts } from '../hooks/useAccounts';
import { useTransactions } from '../hooks/useTransactions';
import { formatCurrency } from '../utils/formatters';
import { Wallet, CreditCard, Activity, Plus, ArrowLeftRight, RefreshCw, History } from 'lucide-react';

export default function Dashboard({ onNavigate }) {
  const { accounts, totalBalance, loading, createAccount, creating, getBalance, refetch } = useAccounts();
  const { transactions } = useTransactions();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateAccount = async () => {
    try {
      await createAccount();
      setIsModalOpen(false);
    } catch (err) {
      alert(`Account creation failed: ${err.message}`);
    }
  };

  const handleQuickTransfer = (accountId) => {
    onNavigate('transfer', { fromAccount: accountId });
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      
      {/* Top Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Financial Overview</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Real-time balance derived from double-entry ledger database.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', width: window.innerWidth <= 480 ? '100%' : 'auto' }}>
          <button onClick={refetch} className="btn btn-secondary" style={{ flex: 1 }} title="Refresh all accounts">
            <RefreshCw size={15} /> Sync All
          </button>
          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary" style={{ flex: 1 }}>
            <Plus size={16} /> New Account
          </button>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <StatCard
          title="Total Net Ledger Balance"
          value={formatCurrency(totalBalance)}
          subtitle="Sum across all active INR accounts"
          icon={Wallet}
          color="#6366f1"
        />
        <StatCard
          title="Active Accounts"
          value={accounts.length}
          subtitle="User accounts bound to token"
          icon={CreditCard}
          color="#10b981"
        />
        <StatCard
          title="Total Transactions Executed"
          value={transactions.length}
          subtitle="Atomic double-entry entries"
          icon={Activity}
          color="#8b5cf6"
        />
      </div>

      {/* Accounts Section */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Your Ledger Accounts</h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {accounts.length} {accounts.length === 1 ? 'Account' : 'Accounts'} Active
          </span>
        </div>

        {loading ? (
          <div className="glass-card" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading ledger accounts...
          </div>
        ) : accounts.length === 0 ? (
          <div className="glass-card" style={{ padding: '32px', textAlign: 'center' }}>
            <p style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '6px' }}>No Ledger Accounts Found</p>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Create your first account to begin performing transactions.
            </p>
            <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
              <Plus size={16} /> Open Account Now
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {accounts.map((acc) => (
              <AccountCard
                key={acc._id}
                account={acc}
                onRefreshBalance={getBalance}
                onQuickTransfer={handleQuickTransfer}
              />
            ))}
          </div>
        )}
      </div>

      {/* View Full History Banner */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.05))', border: '1px solid rgba(99, 102, 241, 0.2)', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ background: 'var(--primary-light)', padding: '10px', borderRadius: '12px', color: 'var(--primary)' }}>
            <History size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Transaction History & Ledger Logs</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {transactions.length > 0
                ? `${transactions.length} transactions logged in your active session.`
                : 'No transactions logged yet in this session.'}
            </p>
          </div>
        </div>

        <button onClick={() => onNavigate('history')} className="btn btn-secondary mobile-full-width">
          View Full History <History size={15} />
        </button>
      </div>

      {/* Create Account Modal */}
      <CreateAccountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateAccount}
        creating={creating}
      />
    </div>
  );
}
