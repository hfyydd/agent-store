import Link from 'next/link';

interface ToolCardProps {
  id: string;
  title: string;
  description: string;
  views: number;
  likes: number;
  tags: string | string[] | null;
  content: string;
}

export default function ToolCard({ id, title, description, views, likes, tags, content }: ToolCardProps) {
  // Function to render tags
  const renderTags = () => {
    if (!tags) return null;
    
    const tagArray = Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',') : [];
    
    return tagArray.map((tag, index) => (
      <span key={index} className="mr-2 text-xs text-blue-500">#{typeof tag === 'string' ? tag.trim() : tag}</span>
    ));
  };

  return (
    <Link href={`/chat?workflow=${encodeURIComponent(id)}`} passHref>
      <div className="border rounded-lg p-4 shadow-sm transition duration-300 ease-in-out hover:shadow-md hover:border-gray-400 hover:bg-gray-50 cursor-pointer">
        <h3 className="font-bold text-lg mb-2 transition duration-300 ease-in-out hover:text-blue-600">{title}</h3>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <span className="mr-4 transition duration-300 ease-in-out hover:text-gray-700">{views} 浏览</span>
          <span className="transition duration-300 ease-in-out hover:text-gray-700">{likes} 赞</span>
        </div>
        <div>
          {renderTags()}
        </div>
      </div>
    </Link>
  )
}