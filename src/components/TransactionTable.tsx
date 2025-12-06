import React, { useState } from 'react';
import { Transaction, TransactionType, Category } from '../types';
import { Trash2, Plus } from 'lucide-react';
interface Props {
  transactions: Transaction[];
  onAdd: (t: Omit<Transaction, 'id'>) => void;
  onDelete: (id: string) => void;
}

export const TransactionTable: React.FC<Props> = ({ transactions, onAdd, onDelete }) => {
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newDesc, setNewDesc] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newType, setNewType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [newCategory, setNewCategory] = useState<Category>(Category.FOOD);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesc || !newAmount) return;

    onAdd({
      date: newDate,
      description: newDesc,
      amount: parseFloat(newAmount),
      type: newType,
      category: newCategory,
    });

    setNewDesc('');
    setNewAmount('');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Transactions (Spreadsheet View)</h3>
      </div>
      
      {/* Input Row (Simulating the 'Add Row' of a sheet) */}
      <div className="bg-gray-50 p-4 border-b border-gray-200">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2 md:items-center">
            <input 
              type="date" 
              value={newDate} 
              onChange={e => setNewDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              required
            />
            <input 
              type="text" 
              placeholder="Description (e.g., Grocery)" 
              value={newDesc} 
              onChange={e => setNewDesc(e.target.value)}
              className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              required
            />
            <select 
              value={newType} 
              onChange={e => setNewType(e.target.value as TransactionType)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value={TransactionType.EXPENSE}>Expense</option>
              <option value={TransactionType.INCOME}>Income</option>
            </select>
            <select 
              value={newCategory} 
              onChange={e => setNewCategory(e.target.value as Category)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-32"
            >
              {Object.values(Category).map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <input 
              type="number" 
              placeholder="Amount" 
              value={newAmount} 
              onChange={e => setNewAmount(e.target.value)}
              className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              step="0.01"
              required
            />
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors flex items-center justify-center"
            >
              <Plus size={18} />
            </button>
        </form>
      </div>

      {/* Table Header */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
              <th className="p-4 font-medium border-b">Date</th>
              <th className="p-4 font-medium border-b">Description</th>
              <th className="p-4 font-medium border-b">Category</th>
              <th className="p-4 font-medium border-b">Type</th>
              <th className="p-4 font-medium border-b text-right">Amount</th>
              <th className="p-4 font-medium border-b text-center">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-100">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-400">
                  No transactions yet. Add one above!
                </td>
              </tr>
            ) : (
              transactions.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="p-4 text-gray-700 whitespace-nowrap">{t.date}</td>
                  <td className="p-4 text-gray-900 font-medium">{t.description}</td>
                  <td className="p-4 text-gray-600">
                    <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                      {t.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${t.type === TransactionType.INCOME ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {t.type}
                    </span>
                  </td>
                  <td className={`p-4 text-right font-mono font-medium ${t.type === TransactionType.INCOME ? 'text-green-600' : 'text-gray-900'}`}>
                    {t.type === TransactionType.EXPENSE ? '-' : '+'}${t.amount.toFixed(2)}
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => onDelete(t.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      title="Delete transaction"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
