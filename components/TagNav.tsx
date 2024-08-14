"use client";

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { useState, useEffect } from 'react';

interface Tag {
  id: string;
  name: string;
}

const fetcher = async (url: string): Promise<Tag[]> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('An error occurred while fetching the data.');
  }
  return res.json();
};

export default function TagNav() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTag = searchParams.get('tag');
  const currentSearch = searchParams.get('search') || '';

  const [searchTerm, setSearchTerm] = useState(currentSearch);

  const { data:tags, error } = useSWR<Tag[]>('/api/tags', fetcher);
  console.log('Tags:', tags);

  if (error) console.error('Error fetching tags:', error);

  useEffect(() => {
    setSearchTerm(currentSearch);
  }, [currentSearch]);

  const handleTagClick = (tagId: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('tag', tagId);
    router.replace(`/?${newSearchParams.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newSearchParams = new URLSearchParams(searchParams);
    if (searchTerm) {
      newSearchParams.set('search', searchTerm);
    } else {
      newSearchParams.delete('search');
    }
    router.replace(`/?${newSearchParams.toString()}`);
  };

  return (
    <nav className="flex items-center justify-between py-2 border-b border-gray-200">
      <div className="flex-1 overflow-x-auto whitespace-nowrap pr-4">
        <Link 
          href="/" 
          className={`text-sm mr-4 px-3 py-1.5 rounded-full transition-colors duration-200
            ${!currentTag 
              ? 'bg-blue-100 text-blue-600 font-medium' 
              : 'text-gray-600 hover:bg-gray-100'
            }`}
        >
          全部
        </Link>
        {tags && tags?.map((tag) => (
          <button
            key={tag.id}
            onClick={() => handleTagClick(tag.id)}
            className={`text-sm mr-4 px-3 py-1.5 rounded-full transition-colors duration-200
              ${currentTag === tag.id
                ? 'bg-blue-100 text-blue-600 font-medium'
                : 'text-gray-600 hover:bg-gray-100'
              }`}
          >
            {tag.name}
          </button>
        ))}
      </div>
      <form onSubmit={handleSearch} className="flex-shrink-0">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜索 workflow..."
            className="w-64 pl-3 pr-10 py-1.5 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="absolute right-0 top-0 mt-1.5 mr-2 p-1 rounded-full text-gray-400 hover:text-blue-500 focus:outline-none"
          >
            <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </button>
        </div>
      </form>
    </nav>
  );
}