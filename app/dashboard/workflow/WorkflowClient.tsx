// app/workflow/WorkflowClient.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from "@/utils/supabase/client";
import UploadWorkflowDialog from '@/components/UploadWorkflowDialog';

interface Workflow {
  id: string;
  name: string;
  description: string;
  content: string;
  created_at: string;
  icon_url?: string;
}

export default function WorkflowClient({ initialWorkflows, userId }: { initialWorkflows: Workflow[], userId: string }) {
  const [workflows, setWorkflows] = useState<Workflow[]>(initialWorkflows);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const supabase = createClient();

  const fetchWorkflows = async () => {
    const { data, error } = await supabase
      .from('workflows')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching workflows:', error);
      alert('Failed to fetch workflows');
    } else {
      setWorkflows(data || []);
    }
  };

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const handleDelete = async (workflowId: string) => {
    if (!confirm('Are you sure you want to delete this workflow?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('workflows')
        .delete()
        .eq('id', workflowId);

      if (error) throw error;

      await fetchWorkflows();
      alert('Workflow deleted successfully');
    } catch (error) {
      console.error('Error deleting workflow:', error);
      alert('Failed to delete workflow');
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">我的 Workflows</h1>
      
      <button
        onClick={() => setIsDialogOpen(true)}
        className="mb-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        上传 Workflow
      </button>

      {workflows.length === 0 ? (
        <p>还没有 workflows 上传 😭.</p>
      ) : (
        <ul className="space-y-4">
          {workflows.map((workflow) => (
            <li key={workflow.id} className="bg-white p-4 rounded shadow flex items-center">
              <img src={workflow.icon_url || '/default-icon.png'} alt={workflow.name} className="w-12 h-12 mr-4" />
              <div className="flex-grow">
                <h2 className="text-lg font-semibold">{workflow.name}</h2>
                <p className="text-gray-600">{workflow.description}</p>
                <p className="text-sm text-gray-500">Created: {new Date(workflow.created_at).toLocaleString()}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    const blob = new Blob([workflow.content], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${workflow.name}.yml`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors"
                >
                  下载
                </button>
                {/* <button
                  onClick={() => {
                    alert(workflow.content.slice(0, 200) + '...');
                  }}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                >
                  Preview
                </button> */}
                <button
                  onClick={() => handleDelete(workflow.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <UploadWorkflowDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onUploadSuccess={fetchWorkflows}
        userId={userId}
      />
    </div>
  );
}