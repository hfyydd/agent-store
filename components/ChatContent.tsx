// components/ChatContent.tsx
'use client';

import { useSearchParams } from 'next/navigation';
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

  useEffect(() => {
    const fetchWorkflow = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .eq('id', workflowId)
        .single();

      if (error) {
        console.error('Error fetching workflow:', error);
      } else {
        setWorkflow(data);
      }
    };

    if (workflowId) {
      fetchWorkflow();
    }
  }, [workflowId]);

  if (!workflow) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-7xl flex justify-between items-center px-4 sm:px-6 lg:px-8">
          <div className="text-2xl font-bold">{workflow.name}</div>
          {/* 你可能需要将 LogoutButton 移到这个组件中 */}
          
        </div>
      </nav>

      <main className="flex-grow w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto w-full h-full">
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
        </div>
      </main>
    </>
  );
}