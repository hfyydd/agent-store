"use client"
import { useState, useEffect } from 'react';
import { createClient } from "@/utils/supabase/client";
import { FaDownload, FaTimes } from 'react-icons/fa';
import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';

interface ToolCardProps {
  id: string;
  title: string;
  description: string;
  tagIds: string[];
  content: string;
  price?: number;
}

interface Tag {
  id: string;
  name: string;
}

export default function ToolCard({ id, title, description, tagIds, content, price }: ToolCardProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const supabase = createClient();

  const [userBalance, setUserBalance] = useState(0);
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    async function fetchTags() {
      if (tagIds && tagIds.length > 0) {
        const { data, error } = await supabase
          .from('tags')
          .select('id, name')
          .in('id', tagIds);

        if (error) {
          console.error('Error fetching tags:', error);
        } else if (data) {
          setTags(data);
        }
      }
    }

    async function fetchUserBalance() {
      if (user) {
        const { data, error } = await supabase
          .from('accounts')
          .select('balance')
          .eq('user_id', user.id)
          .single();
        if (data) {
          setUserBalance(data.balance);
        } else if (error) {
          console.error('Error fetching user balance:', error);
        }
      }
    }

    fetchTags();
    fetchUserBalance();
  }, [tagIds, user, supabase]);

  const renderTags = () => {
    if (tags.length === 0) return null;
    
    return tags.map((tag) => (
      <span key={tag.id} className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-1 mb-1">
        #{tag.name}
      </span>
    ));
  };

  const renderPrice = () => {
    return (
      <span className="text-green-600 font-semibold text-sm">
        {typeof price === 'number' ? `🐨${price.toFixed(2)}` : '免费'}
      </span>
    );
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleDownload = async () => {
    if (!user) {
      alert('请先登录');
      return;
    }

    if (!price || price <= 0) {
      downloadWorkflow();
      return;
    }

    if (userBalance < price) {
      alert('余额不足，请前往充值页面充值');
      router.push('/dashboard/recharge'); 
      return;
    }

    const isConfirmed = window.confirm(`确认下载吗？将从您的账户中扣除 🐨${price.toFixed(2)}`);
    
    if (isConfirmed) {
      const { data, error } = await supabase.rpc('purchase_workflow', {
        workflow_id: id,
        workflow_price: price
      });

      if (error) {
        console.error('Purchase failed:', error);
        alert('购买失败，请重试');
      } else {
        setUserBalance(prevBalance => prevBalance - price);
        downloadWorkflow();
      }
    }
  };

  const downloadWorkflow = () => {
    const blob = new Blob([content], { type: 'text/yaml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.replace(/\s+/g, '_').toLowerCase()}.yml`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
          <div 
      className="border rounded-lg p-3 shadow-sm transition duration-300 ease-in-out hover:shadow-md hover:border-gray-400 hover:bg-gray-50 cursor-pointer flex flex-col justify-between h-full overflow-hidden"
      onClick={handleOpenModal}
    >
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-base sm:text-lg transition duration-300 ease-in-out hover:text-blue-600 line-clamp-2 flex-grow mr-2">{title}</h3>
          <div className="flex-shrink-0">
            {renderPrice()}
          </div>
        </div>
        <p className="text-gray-600 text-xs sm:text-sm mb-2 line-clamp-2">{description}</p>
      </div>
      <div className="flex flex-wrap mt-1 overflow-hidden">
        {renderTags()}
      </div>
    </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
            <div className="p-4">
              <h2 className="text-lg font-bold mb-2">{title}</h2>
              {renderPrice()}
              <p className="text-gray-600 text-sm mt-2 mb-3">{description}</p>
              <div className="mb-3 flex flex-wrap">{renderTags()}</div>
              <div className="flex justify-end">
                <button 
                  onClick={handleDownload}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300 flex items-center text-sm"
                >
                  <FaDownload className="mr-2" /> 下载
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}