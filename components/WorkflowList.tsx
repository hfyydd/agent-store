// components/WorkflowList.tsx
"use client";

import { useSearchParams } from "next/navigation";
import ToolCard from "@/components/ToolCard";

interface Workflow {
  id: string;
  name: string;
  description: string;
  views: number;
  likes: number;
  tags: string[];
  content: string;
  price?: number;
}

interface WorkflowListProps {
  workflows: Workflow[];
}
export default function WorkflowList({ workflows }: WorkflowListProps) {
  const searchParams = useSearchParams();
  const tagId = searchParams.get('tag');
  const searchTerm = searchParams.get('search');

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesTag = !tagId || workflow.tags.includes(tagId);
    const matchesSearch = !searchTerm || 
      workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workflow.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTag && matchesSearch;
  });

  return (
    <div className="mt-8">
      {filteredWorkflows.length === 0 ? (
        <p className="text-center text-gray-500">没有找到匹配的工作流程</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredWorkflows.map((workflow) => (
            <ToolCard
              key={workflow.id}
              id={workflow.id}
              title={workflow.name}
              description={workflow.description}
              tagIds={workflow.tags}
              content={workflow.content}
              price={workflow.price}
            />
          ))}
        </div>
      )}
    </div>
  );
}