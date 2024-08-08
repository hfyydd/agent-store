// app/workflow/WorkflowClient.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from "@/utils/supabase/client";
import UploadWorkflowDialog from '@/components/UploadWorkflowDialog';
import UpdateWorkflowDialog from '@/components/UpdateWorkflowDialog';

interface Workflow {
  id: string;
  name: string;
  description: string;
  icon_url: string | null;
  content: string;
  test_url: string;
  tags: string[];
  price: number;
  type: 'workflow' | 'prompt';
  created_at: string;
  approved: 'approved' | 'pending' | 'rejected';
  rejection_reason: string | null;
}

export default function WorkflowClient({ initialWorkflows, userId }: { initialWorkflows: Workflow[], userId: string }) {
  const [workflows, setWorkflows] = useState<Workflow[]>(initialWorkflows);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);

  const supabase = createClient();
  const handleUpdate = (workflow: Workflow) => {
    setSelectedWorkflow(workflow);
    setIsUpdateDialogOpen(true);
  };

  const fetchWorkflows = async () => {
    const { data, error } = await supabase
      .from('workflows')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching workflows:', error);
      alert('加载工作流失败');
    } else {
      setWorkflows(data || []);
    }
  };

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const handleDelete = async (workflowId: string) => {
    if (!confirm('确认删除该工作流?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('workflows')
        .delete()
        .eq('id', workflowId);

      if (error) throw error;

      await fetchWorkflows();
      alert('Workflow 删除成功');
    } catch (error) {
      console.error('Error deleting workflow:', error);
      alert('Workflow 删除失败');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-500';
      case 'rejected':
        return 'text-red-500';
      default:
        return 'text-yellow-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return '已审批';
      case 'rejected':
        return '已拒绝';
      default:
        return '未审批';
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
                <p className={`text-sm font-semibold ${getStatusColor(workflow.approved)}`}>
                  审核状态: {getStatusText(workflow.approved)}
                </p>
                {workflow.rejection_reason && (
                  <p className="text-sm text-red-500">
                    拒绝原因: {workflow.rejection_reason}
                  </p>
                )}
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
                  className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                  title="下载"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={() => handleUpdate(workflow)}
                  className="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-colors"
                  title="更新"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(workflow.id)}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  title="删除"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
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
      {selectedWorkflow && (
        <UpdateWorkflowDialog
          isOpen={isUpdateDialogOpen}
          onClose={() => {
            setIsUpdateDialogOpen(false);
            setSelectedWorkflow(null);
          }}
          onUpdateSuccess={fetchWorkflows}
          workflow={selectedWorkflow}
        />
      )}
    </div>
  );
}