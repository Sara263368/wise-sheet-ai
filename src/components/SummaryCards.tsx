import React from 'react';
import { BudgetSummary } from '../types';
import { ArrowUpCircle, ArrowDownCircle, Wallet } from 'lucide-react';

interface Props {
  summary: BudgetSummary;
}

export const SummaryCards: React.FC<Props> = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
        <div className="p-3 bg-green-100 rounded-full text-green-600">
          <ArrowUpCircle size={28} />
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Total Income</p>
          <p className="text-2xl font-bold text-gray-900">${summary.totalIncome.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
        <div className="p-3 bg-red-100 rounded-full text-red-600">
          <ArrowDownCircle size={28} />
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Total Expenses</p>
          <p className="text-2xl font-bold text-gray-900">${summary.totalExpenses.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
        <div className={`p-3 rounded-full ${summary.balance >= 0 ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
          <Wallet size={28} />
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Net Balance</p>
          <p className={`text-2xl font-bold ${summary.balance >= 0 ? 'text-gray-900' : 'text-red-500'}`}>
            ${summary.balance.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};
