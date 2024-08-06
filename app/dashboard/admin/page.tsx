'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/hooks/useAdmin';
import { createClient } from '@/utils/supabase/client';
import RechargeDialog from '@/components/RechargeDialog';
import { FaSearch } from 'react-icons/fa';

interface User {
  id: string;
  email: string;
  user_metadata?: {
    username?: string;
  };
  balance: number;
}

const AdminPage: React.FC = () => {
  const router = useRouter();
  const { isAdmin, loading } = useAdmin();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/dashboard/basic');
    } else if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin, loading, router]);

  useEffect(() => {
    const filtered = users.filter(user => 
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [users, searchTerm]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session');
      }
  
      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecharge = (user: User) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleRechargeComplete = () => {
    setIsDialogOpen(false);
    setSelectedUser(null);
    fetchUsers(); // Refresh user list
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
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
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">管理员管理</h1>
      <div className="mb-4 flex justify-between items-center">
        <button
          onClick={fetchUsers}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          刷新用户列表
        </button>
        <div className="relative">
          <input
            type="text"
            placeholder="搜索邮箱..."
            value={searchTerm}
            onChange={handleSearch}
            className="border border-gray-300 rounded-md py-2 px-4 pr-10 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute right-3 top-2.5 text-gray-400">
            <FaSearch />
          </span>
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用户名</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">邮箱</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">余额</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{user.user_metadata?.username || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.balance.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleRecharge(user)}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                      >
                        充值
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="mt-4 text-right text-gray-600">
        总用户数: {users.length} | 当前显示: {filteredUsers.length}
      </div>
      {isDialogOpen && selectedUser && (
        <RechargeDialog
          user={selectedUser}
          onClose={() => setIsDialogOpen(false)}
          onComplete={handleRechargeComplete}
        />
      )}
    </div>
  );
};

export default AdminPage;