import React from 'react';
import { Transaction, TransactionType } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface Props {
  transactions: Transaction[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export const Charts: React.FC<Props> = ({ transactions }) => {
  // Aggregate expenses by category
  const expensesByCategory = transactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);

  const pieData = Object.entries(expensesByCategory).map(([name, value]) => ({ name, value }));

  // Aggregate by date (last 7 entries usually, simplified here to all unique dates sorted)
  const txByDate = transactions.reduce((acc, curr) => {
    if (!acc[curr.date]) acc[curr.date] = { date: curr.date, income: 0, expense: 0 };
    if (curr.type === TransactionType.INCOME) acc[curr.date].income += curr.amount;
    else acc[curr.date].expense += curr.amount;
    return acc;
  }, {} as Record<string, any>);

  const barData = Object.values(txByDate).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (transactions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-xl border border-dashed border-gray-300">
        <p className="text-gray-400">Add transactions to see visuals</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Expense Breakdown</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Cash Flow</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tick={{fontSize: 12}} />
              <YAxis tick={{fontSize: 12}} />
              <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
              <Legend />
              <Bar dataKey="income" name="Income" fill="#00C49F" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" name="Expense" fill="#FF8042" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
