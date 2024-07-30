import Link from 'next/link';
import { createClient } from "@/utils/supabase/server";

export default async function NavBar() {
  const supabase = createClient();
  
  const { data: tags, error: tagsError } = await supabase
    .from('tags')
    .select('*')

  if (tagsError) {
    console.error('Error fetching tags:', tagsError);
  }

  return (
    <nav className="overflow-x-auto whitespace-nowrap py-4">
      <Link href="/" className="text-sm mr-4 pb-2 border-b-2 border-transparent hover:border-blue-500">
        全部
      </Link>
      {tags && tags.map((tag) => (
        <Link 
          key={tag.id} 
          href={`/?tag=${encodeURIComponent(tag.id)}`}
          className="text-sm mr-4 pb-2 border-b-2 border-transparent hover:border-blue-500"
        >
          {tag.name}
        </Link>
      ))}
    </nav>
  )
}