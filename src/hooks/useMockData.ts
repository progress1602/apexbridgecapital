import React, { useState, useEffect } from 'react';

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'investment';
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  method?: string;
  plan?: string;
}

export interface Investment {
  id: string;
  planName: string;
  amount: number;
  roi: string;
  startDate: string;
  status: 'active' | 'completed';
}

export function useMockData() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);

  useEffect(() => {
    const savedTransactions = localStorage.getItem('apexbridge_transactions');
    const savedInvestments = localStorage.getItem('apexbridge_investments');
    
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
    else {
      const initial: Transaction[] = [
        { id: '1', type: 'deposit', amount: 5000, status: 'approved', date: '2024-03-10', method: 'Bitcoin' },
        { id: '2', type: 'investment', amount: 2000, status: 'approved', date: '2024-03-12', plan: 'Gold Plan' },
      ];
      setTransactions(initial);
      localStorage.setItem('apexbridge_transactions', JSON.stringify(initial));
    }

    if (savedInvestments) setInvestments(JSON.parse(savedInvestments));
    else {
      const initial: Investment[] = [
        { id: 'inv1', planName: 'Gold Plan', amount: 2000, roi: '15%', startDate: '2024-03-12', status: 'active' }
      ];
      setInvestments(initial);
      localStorage.setItem('apexbridge_investments', JSON.stringify(initial));
    }
  }, []);

  const addTransaction = (tx: Omit<Transaction, 'id' | 'date'>) => {
    const newTx: Transaction = {
      ...tx,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0],
    };
    const updated = [newTx, ...transactions];
    setTransactions(updated);
    localStorage.setItem('apexbridge_transactions', JSON.stringify(updated));
    return newTx;
  };

  const addInvestment = (inv: Omit<Investment, 'id' | 'startDate' | 'status'>) => {
    const newInv: Investment = {
      ...inv,
      id: Math.random().toString(36).substr(2, 9),
      startDate: new Date().toISOString().split('T')[0],
      status: 'active',
    };
    const updated = [newInv, ...investments];
    setInvestments(updated);
    localStorage.setItem('apexbridge_investments', JSON.stringify(updated));
    return newInv;
  };

  return { transactions, investments, addTransaction, addInvestment };
}
