"use client"
import { useState, useEffect } from 'react';
import { createClient } from "@/utils/supabase/client";
import { FaEye, FaComment, FaStar } from 'react-icons/fa';
import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface ToolCardProps {
  id: string;
  title: string;
  description: string;
  tagIds: string[];
  content: string;
  price?: number;
  icon_url: string;
  views?: number;
  comments?: number;
  favorites?: number;
}

interface Tag {
  id: string;
  name: string;
}

export default function ToolCard({ id, title, description, tagIds, content, price, icon_url, views = 0, comments = 0, favorites = 0 }: ToolCardProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const supabase = createClient();
  const { user } = useUser();
  const router = useRouter();

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
  }, [tagIds, supabase]);

  const handleViewInChat = () => {
    router.push(`/chat?workflow=${id}`);
  };

  const renderTags = () => {
    if (tags.length === 0) return null;

    return tags.map((tag) => (
      <span key={tag.id} className="mr-2 text-xs text-blue-500">
        #{tag.name}
      </span>
    ));
  };

  const renderPrice = () => {
    return (
      <span className="text-green-600 font-semibold">
        🐨{typeof price === 'number' ? price.toFixed(2) : '未设置'}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition duration-300 ease-in-out" onClick={handleViewInChat}>
      <div className="flex items-start mb-3">
        {icon_url && (
          <Image
            src={icon_url}
            alt={title}
            width={80}
            height={80}
            className="rounded-lg mr-3"
          />
        )}
        <div className="flex-grow">
          <h3 className="font-bold text-lg mb-1">{title}</h3>
          <div className="flex items-center text-gray-500 text-sm">
            {renderPrice()}
          </div>
        </div>
      </div>
      <p className="text-gray-600 text-sm mb-3 line-clamp-3">{description}</p>
      <div className="flex flex-wrap gap-1 mb-3">
        {renderTags()}
      </div>
      <div className="flex items-center text-gray-500 text-sm">
        <span className="mr-3 flex items-center">
          <FaEye className="mr-1" /> {views}
        </span>
        <span className="flex items-center">
          <FaStar className="mr-1" /> {favorites}
        </span>
      </div>
    </div>
  );
}