'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/hooks/useAdmin';
import { createClient } from '@/utils/supabase/client';

interface Transaction {
  id: string;
  user_id: string;
  admin_id: string;
  amount: number;
  created_at: string;
  status: string;
  user_email?: string;
  admin_email?: string;
}

const TransactionPage: React.FC = () => {
  const router = useRouter();
  const { isAdmin, loading } = useAdmin();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/dashboard/basic');
    } else if (isAdmin) {
      fetchTransactions();
    }
  }, [isAdmin, loading, router]);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const supabase = createClient();
      
      // 获取交易记录，并包含用户和管理员的邮箱
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *
        `)
        .eq('transaction_type', 'recharge')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedTransactions = data?.map(transaction => ({
        ...transaction,
        user_email: transaction.user?.email,
        admin_email: transaction.admin?.email
      })) || [];

      setTransactions(formattedTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError('Failed to load transactions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">充值记录</h1>
      <button
        onClick={fetchTransactions}
        className="mb-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
      >
        刷新充值记录
      </button>
      {transactions.length === 0 ? (
        <p className="text-center text-gray-500">暂无充值记录</p>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">日期</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用户</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">管理员</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">金额</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(transaction.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.user_email || transaction.user_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.admin_email || transaction.admin_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    🐨{transaction.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TransactionPage;