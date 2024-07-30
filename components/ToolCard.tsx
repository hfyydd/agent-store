"use client"
import Link from 'next/link';
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from 'react';

interface ToolCardProps {
  id: string;
  title: string;
  description: string;
  views: number;
  likes: number;
  tagIds: string[];
  content: string;
}

interface Tag {
  id: string;
  name: string;
}

export default function ToolCard({ id, title, description, views, likes, tagIds, content }: ToolCardProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const supabase = createClient();

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

    fetchTags();
  }, [tagIds]);

  // Function to render tags
  const renderTags = () => {
    if (tags.length === 0) return null;
    
    return tags.map((tag) => (
      <span key={tag.id} className="mr-2 text-xs text-blue-500">
        #{tag.name}
      </span>
    ));
  };

  return (
    <Link href={`/chat?workflow=${encodeURIComponent(id)}`} passHref>
      <div className="border rounded-lg p-4 shadow-sm transition duration-300 ease-in-out hover:shadow-md hover:border-gray-400 hover:bg-gray-50 cursor-pointer h-48 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-lg mb-2 transition duration-300 ease-in-out hover:text-blue-600 line-clamp-1">{title}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
        </div>
        <div>
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <span className="mr-4 transition duration-300 ease-in-out hover:text-gray-700">{views} 浏览</span>
            <span className="transition duration-300 ease-in-out hover:text-gray-700">{likes} 赞</span>
          </div>
          <div className="overflow-hidden h-6">
            {renderTags()}
          </div>
        </div>
      </div>
    </Link>
  )
}