"use client"
import { useState, useEffect } from 'react';
import { createClient } from "@/utils/supabase/client";
import ConfirmDialog from '@/components/ConfirmDialog';

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
  user_id: string;
  approved: 'approved' | 'pending' | 'rejected';
  rejection_reason: string | null;
}

export default function ReviewPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [filteredWorkflows, setFilteredWorkflows] = useState<Workflow[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentWorkflow, setCurrentWorkflow] = useState<Workflow | null>(null);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject' | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const supabase = createClient();

  const fetchWorkflows = async () => {
    const { data, error } = await supabase
      .from('workflows')
      .select('*')
      .order('created_at', { ascending: false });
  
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

  useEffect(() => {
    let result = workflows;
    
    if (filterStatus !== 'all') {
      result = result.filter(workflow => workflow.approved === filterStatus);
    }
    
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      result = result.filter(workflow => 
        workflow.name.toLowerCase().includes(lowercasedTerm) ||
        workflow.description.toLowerCase().includes(lowercasedTerm) ||
        workflow.tags.some(tag => tag.toLowerCase().includes(lowercasedTerm))
      );
    }
    
    setFilteredWorkflows(result);
  }, [workflows, filterStatus, searchTerm]);

  const handleReviewClick = (workflow: Workflow, action: 'approve' | 'reject') => {
    setCurrentWorkflow(workflow);
    setApprovalAction(action);
    setRejectionReason('');
    setDialogOpen(true);
  };

  const handleReview = async () => {
    if (!currentWorkflow || !approvalAction) return;

    try {
      let updateData;
      if (approvalAction === 'approve') {
        updateData = { approved: 'approved', rejection_reason: null };
      } else {
        updateData = { approved: 'rejected', rejection_reason: rejectionReason || null };
      }

      const { error } = await supabase
        .from('workflows')
        .update(updateData)
        .eq('id', currentWorkflow.id);

      if (error) throw error;

      await fetchWorkflows();
      alert(`Workflow ${approvalAction === 'approve' ? '批准' : '拒绝'}成功`);
    } catch (error) {
      console.error('Error reviewing workflow:', error);
      alert('审核操作失败');
    } finally {
      setDialogOpen(false);
      setCurrentWorkflow(null);
      setApprovalAction(null);
      setRejectionReason('');
    }
  };

  const handleDownload = (workflow: Workflow) => {
    const blob = new Blob([workflow.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workflow.name}.yml`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Workflows 审核</h1>

      <div className="mb-4 flex space-x-4">
        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="all">全部</option>
          <option value="pending">未审批</option>
          <option value="approved">已审批</option>
          <option value="rejected">已拒绝</option>
        </select>
        <input 
          type="text" 
          placeholder="搜索..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded flex-grow"
        />
      </div>

      {filteredWorkflows.length === 0 ? (
        <p>没有匹配的 workflows.</p>
      ) : (
        <ul className="space-y-4">
          {filteredWorkflows.map((workflow) => (
            <li key={workflow.id} className="bg-white p-4 rounded shadow flex items-center">
              <img src={workflow.icon_url || '/default-icon.png'} alt={workflow.name} className="w-12 h-12 mr-4" />
              <div className="flex-grow">
                <h2 className="text-lg font-semibold">{workflow.name}</h2>
                <p className="text-gray-600">{workflow.description}</p>
                <p className="text-sm text-gray-500">Created: {new Date(workflow.created_at).toLocaleString()}</p>
                <p className="text-sm text-gray-500">User ID: {workflow.user_id}</p>
                <p className="text-sm text-gray-500">Price: ${workflow.price}</p>
                <p className="text-sm text-gray-500">Type: {workflow.type}</p>
                <p className="text-sm text-gray-500">Tags: {workflow.tags.join(', ')}</p>
                <p className={`text-sm font-semibold ${
                  workflow.approved === 'pending'
                    ? 'text-yellow-500'
                    : workflow.approved === 'approved'
                    ? 'text-green-500'
                    : 'text-red-500'
                }`}>
                  Status: {
                    workflow.approved === 'pending'
                      ? '未审批'
                      : workflow.approved === 'approved'
                      ? '已审批'
                      : '已拒绝'
                  }
                </p>
                {workflow.rejection_reason && (
                  <p className="text-sm text-red-500">
                    拒绝原因: {workflow.rejection_reason}
                  </p>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleDownload(workflow)}
                  className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                  title="下载"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={() => handleReviewClick(workflow, 'approve')}
                  className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                  title="批准"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={() => handleReviewClick(workflow, 'reject')}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  title="拒绝"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleReview}
        title={approvalAction === 'approve' ? "确认批准" : "确认拒绝"}
        message={
          approvalAction === 'approve'
            ? "你确定要批准这个 workflow 吗？"
            : (
              <>
                <p>你确定要拒绝这个 workflow 吗？</p>
                <textarea
                  className="mt-2 w-full p-2 border rounded"
                  placeholder="请输入拒绝原因"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
              </>
            )
        }
      />
    </div>
  );
}