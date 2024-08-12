// components/WorkflowList.tsx
"use client"
import { useSearchParams } from "next/navigation";
import ToolCard from "@/components/ToolCard";
import { useState } from "react";

export interface Workflow {
  id: string;
  name: string;
  description: string;
  views: number;
  tags: string[];
  content: string;
  price?: number;
  icon_url: string;
  test_url: string;
  downloads: number;
}

interface WorkflowListProps {
  workflows: Workflow[];
}

type SortOption = 'price' | 'views' | 'name' | 'downloads';

export default function WorkflowList({ workflows }: WorkflowListProps) {
  const [sortBy, setSortBy] = useState<SortOption>('downloads');
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

  const sortedWorkflows = [...filteredWorkflows].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return (a.price || 0) - (b.price || 0);
      case 'views':
        return b.views - a.views;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'downloads':
        return b.downloads - a.downloads;
      default:
        return 0;
    }
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {sortedWorkflows.map((workflow) => (
        <ToolCard
          key={workflow.id}
          id={workflow.id}
          title={workflow.name}
          description={workflow.description}
          tagIds={workflow.tags}
          content={workflow.content}
          price={workflow.price}
          icon_url={workflow.icon_url}
          test_url={workflow.test_url}
          views={workflow.views}
          downloads={workflow.downloads}
        />
      ))}
    </div>
  );
}