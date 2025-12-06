export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export enum Category {
  FOOD = 'Food',
  HOUSING = 'Housing',
  TRANSPORT = 'Transport',
  UTILITIES = 'Utilities',
  ENTERTAINMENT = 'Entertainment',
  HEALTH = 'Health',
  SALARY = 'Salary',
  FREELANCE = 'Freelance',
  OTHER = 'Other',
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: Category;
}

export interface BudgetSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}
