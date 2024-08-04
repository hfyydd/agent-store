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
      <span key={tag.id} className="mr-2 text-xs text-blue-500">
        #{tag.name}
      </span>
    ));
  };

  const renderPrice = () => {
    return (
      <span className="text-green-600 font-semibold">
        价格: {typeof price === 'number' ? `🐨${price.toFixed(2)}` : '未设置'}
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
      // 如果工作流是免费的，直接下载
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
      // 扣除余额并更新数据库
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
    // Create a Blob with the content
    const blob = new Blob([content], { type: 'text/yaml;charset=utf-8' });
    
    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);
    
    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.replace(/\s+/g, '_').toLowerCase()}.yml`; // Set the filename
    
    // Append to the document, click it, and remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Release the URL object
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div 
        className="border rounded-lg p-4 shadow-sm transition duration-300 ease-in-out hover:shadow-md hover:border-gray-400 hover:bg-gray-50 cursor-pointer h-48 flex flex-col justify-between transform hover:-translate-y-1 hover:scale-105"
        onClick={handleOpenModal}
      >
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-lg transition duration-300 ease-in-out hover:text-blue-600 line-clamp-1">{title}</h3>
            {renderPrice()}
          </div>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
        </div>
        <div>
          <div className="overflow-hidden h-6">
            {renderTags()}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
            <h2 className="text-2xl font-bold mb-4">{title}</h2>
            {renderPrice()}
            <p className="text-gray-600 mt-2 mb-4">{description}</p>
            <div className="mb-4">{renderTags()}</div>
            <div className="flex justify-end space-x-4">
              <button 
                onClick={handleDownload}
                className="p-2 text-green-500 hover:text-green-600 transition duration-300"
              >
                <FaDownload />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}