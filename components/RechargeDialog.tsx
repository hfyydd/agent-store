import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

interface User {
  id: string;
  email: string;
  user_metadata?: {
    username?: string;
  };
}

interface RechargeDialogProps {
  user: User;
  onClose: () => void;
  onComplete: () => void;
}

const RechargeDialog: React.FC<RechargeDialogProps> = ({ user, onClose, onComplete }) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const handleRecharge = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('请输入有效的充值金额');
      return;
    }

    const supabase = createClient();
    const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();

    if (userError || !currentUser) {
      setError('无法获取当前用户信息');
      return;
    }

    // 开始一个事务
    const { data, error } = await supabase.rpc('recharge_account', {
      p_user_id: user.id,
      p_amount: Number(amount),
      p_admin_id: currentUser.id
    });

    if (error) {
      setError('充值失败: ' + error.message);
    } else {
      onComplete();
    }
  };

  // 使用可空链操作符和空值合并操作符来安全地访问用户名
  const displayName = user.user_metadata?.username ?? user.email ?? 'Unknown User';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl">
        <h2 className="text-xl font-bold mb-4">为 {displayName} 充值</h2>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="输入充值金额"
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded mr-2"
          >
            取消
          </button>
          <button
            onClick={handleRecharge}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            确认充值
          </button>
        </div>
      </div>
    </div>
  );
};

export default RechargeDialog;