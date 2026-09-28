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
    
    if (savedTransactions) {
      try {
        setTransactions(JSON.parse(savedTransactions));
      } catch {
        setTransactions([]);
      }
    } else {
      setTransactions([]);
    }

    if (savedInvestments) {
      try {
        setInvestments(JSON.parse(savedInvestments));
      } catch {
        setInvestments([]);
      }
    } else {
      setInvestments([]);
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

  const updateTransactionStatus = (id: string, status: any) => {
    const updated = transactions.map(tx => tx.id === id ? { ...tx, status } : tx);
    setTransactions(updated);
    localStorage.setItem('apexbridge_transactions', JSON.stringify(updated));
  };

  const deleteTransaction = (id: string) => {
    const updated = transactions.filter(tx => tx.id !== id);
    setTransactions(updated);
    localStorage.setItem('apexbridge_transactions', JSON.stringify(updated));
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

  return { transactions, investments, addTransaction, addInvestment, updateTransactionStatus, deleteTransaction };
}
