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
    <div style={{ padding: '28px', maxWidth: '1280px', margin: '0 auto' }}>
      
      {/* Top Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Financial Overview</h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Real-time balance derived from double-entry ledger database.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={refetch} className="btn btn-secondary" title="Refresh all accounts">
            <RefreshCw size={16} /> Sync All
          </button>
          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
            <Plus size={18} /> New Account
          </button>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
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
      <div style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Your Ledger Accounts</h2>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            {accounts.length} {accounts.length === 1 ? 'Account' : 'Accounts'} Active
          </span>
        </div>

        {loading ? (
          <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading ledger accounts from `/api/accounts`...
          </div>
        ) : accounts.length === 0 ? (
          <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
            <p style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '8px' }}>No Ledger Accounts Found</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Create your first account to begin performing transactions.
            </p>
            <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
              <Plus size={16} /> Open Account Now
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
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
      <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.05))', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'var(--primary-light)', padding: '12px', borderRadius: '12px', color: 'var(--primary)' }}>
            <History size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Transaction History & Ledger Logs</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {transactions.length > 0
                ? `${transactions.length} transactions logged in your active session.`
                : 'No transactions logged yet in this session.'}
            </p>
          </div>
        </div>

        <button onClick={() => onNavigate('history')} className="btn btn-secondary">
          View Full History <History size={16} />
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
