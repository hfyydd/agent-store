'use client';

import { useState, useEffect } from 'react';
import { createClient } from "@/utils/supabase/client";

interface Workflow {
  id: string;
  name: string;
  description: string;
  content: string;
  created_at: string;
}

export default function WorkflowClient({ initialWorkflows, userId }: { initialWorkflows: Workflow[], userId: string }) {
  const [workflows, setWorkflows] = useState<Workflow[]>(initialWorkflows);
  const [isUploading, setIsUploading] = useState(false);
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const content = await file.text();

      const { data: workflow, error: dbError } = await supabase
        .from('workflows')
        .insert({
          user_id: userId,
          name: file.name,
          content: content,
          description: 'New workflow'
        })
        .select()
        .single();

      if (dbError) throw dbError;

      await fetchWorkflows(); // Refresh the list after upload
    } catch (error) {
      console.error('Error uploading workflow:', error);
      alert('Failed to upload workflow: ' + (error as Error).message);
    } finally {
      setIsUploading(false);
    }
  };

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

      await fetchWorkflows(); // Refresh the list after deletion
      alert('Workflow deleted successfully');
    } catch (error) {
      console.error('Error deleting workflow:', error);
      alert('Failed to delete workflow');
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Workflows</h1>
      
      <div className="mb-6">
        <input
          type="file"
          accept=".yml,.txt"
          onChange={handleFileUpload}
          disabled={isUploading}
          className="hidden"
          id="workflow-upload"
        />
        <label
          htmlFor="workflow-upload"
          className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          {isUploading ? 'Uploading...' : 'Upload Workflow'}
        </label>
      </div>

      {workflows.length === 0 ? (
        <p>No workflows uploaded yet.</p>
      ) : (
        <ul className="space-y-4">
          {workflows.map((workflow) => (
            <li key={workflow.id} className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-semibold">{workflow.name}</h2>
              <p className="text-gray-600">{workflow.description}</p>
              <p className="text-sm text-gray-500">Created: {new Date(workflow.created_at).toLocaleString()}</p>
              <div className="mt-2 space-x-2">
                <button
                  onClick={() => {
                    const blob = new Blob([workflow.content], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${workflow.name}.dsl`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors"
                >
                  Download DSL
                </button>
                <button
                  onClick={() => {
                    alert(workflow.content.slice(0, 200) + '...');
                  }}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                >
                  Preview
                </button>
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
    </div>
  );
}