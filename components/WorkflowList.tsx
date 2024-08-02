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

  const filteredWorkflows = tagId
    ? workflows.filter(workflow => workflow.tags.includes(tagId))
    : workflows;

  return (
    <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
      {filteredWorkflows.map((workflow) => (
        <ToolCard
          key={workflow.id}
          id={workflow.id}
          title={workflow.name}
          description={workflow.description}
          views={workflow.views}
          likes={workflow.likes}
          tagIds={workflow.tags}
          content={workflow.content}
          price={workflow.price}
        />
      ))}
    </main>
  );
}