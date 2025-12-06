import React, { useState, useEffect } from 'react';
import { Transaction, TransactionType, Category, BudgetSummary } from './types';
import { SummaryCards } from './components/SummaryCards';
import { Charts } from './components/Charts';
import { TransactionTable } from './components/TransactionTable';
import { AIInsights } from './components/AIInsights';
import { LayoutDashboard, Table, BrainCircuit, Download } from 'lucide-react';

const App: React.FC = () => {
  // Initialize state from LocalStorage if available, otherwise use dummy data
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const savedData = localStorage.getItem('wise_sheet_transactions');
      if (savedData) {
        return JSON.parse(savedData);
      }
    } catch (e) {
      console.error("Failed to load transactions from local storage", e);
    }
    
    // Default dummy data for first-time users
    return [
      { id: '1', date: '2023-10-25', description: 'Monthly Salary', amount: 5000, type: TransactionType.INCOME, category: Category.SALARY },
      { id: '2', date: '2023-10-26', description: 'Grocery Run', amount: 150.50, type: TransactionType.EXPENSE, category: Category.FOOD },
      { id: '3', date: '2023-10-27', description: 'Electric Bill', amount: 120, type: TransactionType.EXPENSE, category: Category.UTILITIES },
      { id: '4', date: '2023-10-28', description: 'Cinema & Snacks', amount: 65, type: TransactionType.EXPENSE, category: Category.ENTERTAINMENT },
      { id: '5', date: '2023-10-29', description: 'Freelance Project', amount: 800, type: TransactionType.INCOME, category: Category.FREELANCE },
      { id: '6', date: '2023-10-30', description: 'Rent Payment', amount: 1200, type: TransactionType.EXPENSE, category: Category.HOUSING },
    ];
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'sheet' | 'ai'>('dashboard');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Handle PWA Install Prompt
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  // Save to LocalStorage whenever transactions change
  useEffect(() => {
    localStorage.setItem('wise_sheet_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const calculateSummary = (): BudgetSummary => {
    const totalIncome = transactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
    };
  };

  const addTransaction = (t: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...t,
      id: Math.random().toString(36).substr(2, 9), // Simple ID gen
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const summary = calculateSummary();

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                <LayoutDashboard size={20} />
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-800">WiseSheet</span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-4">
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
              >
                <LayoutDashboard size={18} />
                <span className="hidden sm:inline">Dashboard</span>
              </button>
              <button 
                onClick={() => setActiveTab('sheet')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'sheet' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
              >
                <Table size={18} />
                <span className="hidden sm:inline">Sheet View</span>
              </button>
              <button 
                onClick={() => setActiveTab('ai')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'ai' ? 'bg-purple-50 text-purple-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
              >
                <BrainCircuit size={18} />
                <span className="hidden sm:inline">Wise Advisor</span>
              </button>
              
              {deferredPrompt && (
                <button 
                  onClick={handleInstallClick}
                  className="px-3 py-2 rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center gap-2 shadow-sm animate-pulse"
                >
                  <Download size={18} />
                  <span className="hidden sm:inline">Install App</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Dynamic Content Rendering */}
        <div className="space-y-6">
          
          {/* Always show summary on Dashboard and AI tab, hide on Sheet for more space */}
          {activeTab !== 'sheet' && <SummaryCards summary={summary} />}

          {activeTab === 'dashboard' && (
            <div className="animate-fade-in">
              <Charts transactions={transactions} />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <div className="lg:col-span-2">
                    <TransactionTable transactions={transactions.slice(0, 5)} onAdd={addTransaction} onDelete={deleteTransaction} />
                    <div className="mt-2 text-center">
                        <button onClick={() => setActiveTab('sheet')} className="text-sm text-blue-600 hover:underline">View all transactions</button>
                    </div>
                 </div>
                 <div className="lg:col-span-1">
                    <AIInsights transactions={transactions} />
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'sheet' && (
            <div className="animate-fade-in">
              <TransactionTable transactions={transactions} onAdd={addTransaction} onDelete={deleteTransaction} />
            </div>
          )}

          {activeTab === 'ai' && (
             <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <AIInsights transactions={transactions} />
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold mb-4 text-gray-800">Why use WiseSheet?</h3>
                    <ul className="space-y-3 text-gray-600 text-sm">
                        <li className="flex items-start gap-2">
                            <span className="text-green-500 font-bold">✓</span>
                            <span>Track every penny with our Google Sheet-like interface.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-500 font-bold">✓</span>
                            <span>Get instant, AI-powered financial advice in Arabic or English.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-500 font-bold">✓</span>
                            <span>Visualize your spending habits to identify leaks.</span>
                        </li>
                    </ul>
                </div>
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;