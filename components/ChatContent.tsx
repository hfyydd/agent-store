// components/ChatContent.tsx
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from "@/utils/supabase/client";

interface Workflow {
  id: string;
  name: string;
  test_url: string;
  // 添加其他必要的字段
}

export default function ChatContent() {
  const searchParams = useSearchParams();
  const workflowId = searchParams.get('workflow');
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(5);
  const router = useRouter();

  useEffect(() => {
    const fetchWorkflow = async () => {
      setIsLoading(true);
      setError(null);
      const supabase = createClient();
      const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .eq('id', workflowId)
        .single();

      if (error) {
        console.error('Error fetching workflow:', error);
        setError('Failed to load workflow. Please try again.');
      } else {
        setWorkflow(data);
        if (!data.test_url) {
          // 如果没有测试链接，开始倒计时
          const timer = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                clearInterval(timer);
                router.push('/store');
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        }
      }
      setIsLoading(false);
    };

    if (workflowId) {
      fetchWorkflow();
    } else {
      setError('No workflow specified');
      setIsLoading(false);
    }
  }, [workflowId, router]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  if (!workflow) {
    return <div className="flex justify-center items-center h-screen">No workflow found</div>;
  }

  return (
    <>
      <style jsx>{`
        @keyframes fadeNumber {
          0% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1.2); }
          100% { opacity: 0; transform: scale(1); }
        }
        .countdown-number {
          animation: fadeNumber 1s ease-out;
        }
      `}</style>
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-7xl flex justify-between items-center px-4 sm:px-6 lg:px-8">
          <div className="text-2xl font-bold">{workflow.name}</div>
        </div>
      </nav>

      <main className="flex-grow w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto w-full h-full">
          {workflow.test_url ? (
            <iframe
              src={workflow.test_url}
              style={{
                width: '100%',
                height: '80vh',
                minHeight: '700px',
                border: 'none',
              }}
              allow="microphone"
            />
          ) : (
            <div className="flex flex-col justify-center items-center h-[80vh] text-lg text-gray-500">
              <p>暂无测试连接</p>
              <div className="mt-8 text-6xl font-bold">
                <span className="countdown-number">{countdown}</span>
              </div>
              <p className="mt-4 text-sm">秒后自动返回商店页面...</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}