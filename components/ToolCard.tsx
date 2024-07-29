import Image from 'next/image'

interface ToolCardProps {
  title: string;
  description: string;
  views: number;
  likes: number;
  comments: number;
}

export default function ToolCard({ title, description, views, likes, comments }: ToolCardProps) {
  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      <div className="flex items-center text-sm text-gray-500">
        <span className="mr-4">{views} 浏览</span>
        <span className="mr-4">{likes} 赞</span>
        <span>{comments} 评论</span>
      </div>
    </div>
  )
}