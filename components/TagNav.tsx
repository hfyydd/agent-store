"use client";

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import useSWR from 'swr';

interface Tag {
  id: string;
  name: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function TagNav() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTag = searchParams.get('tag');

  const { data: tags, error } = useSWR<Tag[]>('/api/tags', fetcher);

  if (error) console.error('Error fetching tags:', error);

  const handleTagClick = (tagId: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('tag', tagId);
    router.replace(`/?${newSearchParams.toString()}`);
  };

  return (
    <nav className="overflow-x-auto whitespace-nowrap py-4">
      <Link 
        href="/" 
        className={`text-sm mr-4 px-3 py-2 rounded-full transition-colors duration-200
          ${!currentTag 
            ? 'bg-blue-500 text-white font-semibold' 
            : 'bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-500'
          }`}
      >
        全部
      </Link>
      {tags && tags.map((tag) => (
        <button
          key={tag.id}
          onClick={() => handleTagClick(tag.id)}
          className={`text-sm mr-4 px-3 py-2 rounded-full transition-colors duration-200
            ${currentTag === tag.id
              ? 'bg-blue-500 text-white font-semibold'
              : 'bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-500'
            }`}
        >
          {tag.name}
        </button>
      ))}
    </nav>
  );
}