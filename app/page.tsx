import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import AuthButton from "../components/AuthButton";
import NavBar from "@/components/NavBar";
import ToolCard from "@/components/ToolCard";

export default async function Index() {

  const supabase = createClient();

  // Fetch workflow data from Supabase
  const { data: workflows, error } = await supabase
    .from('workflows')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching workflows:', error);
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <nav className="w-full flex justify-end border-b border-b-foreground/10 h-16">
        <div className="container mx-auto px-4 flex justify-end items-center h-full">
          <AuthButton />
        </div>
      </nav>
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <div className="container mx-auto px-4">
          <header className="flex justify-between items-center py-8">
            <div>
              <h1 className="text-3xl font-bold mt-2">MBTI人格类型测试专家</h1>
              <p className="text-gray-600 mt-1">这不仅是一个自我发现的过程也是一次自我完善的旅程</p>
              <button className="bg-black text-white px-6 py-2 rounded-full mt-4">现在就试试吧</button>
            </div>
          </header>

          <NavBar />

          <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {workflows && workflows.map((workflow) => (
              <ToolCard
                key={workflow.id}
                id={workflow.id}
                title={workflow.name}
                description={workflow.description}
                views={workflow.views}
                likes={workflow.likes}
                tags={workflow.tags}
                content={workflow.content}
              />
            ))}
          </main>
        </div>
      </div>

      <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
        <p>
          Powered by{" "}
          <a
            href=""
            target="_blank"
            className="font-bold hover:underline"
            rel="noreferrer"
          >
            找自己
          </a>
        </p>
      </footer>
    </div>
  );
}