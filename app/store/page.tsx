import { createClient } from "@/utils/supabase/server";
import TagNav from "@/components/TagNav";
import WorkflowList from "@/components/WorkflowList";

interface Workflow {
  id: string;
  name: string;
  description: string;
  views: number;
  likes: number;
  // 添加其他需要的字段
}

interface FeaturedWorkflow {
  workflow_id: string;
  workflows: Workflow;
}

export default async function Index() {
  const supabase = createClient();

  const { data: featuredWorkflow, error: featuredError } = await supabase
    .from('featured_workflow')
    .select(`
      workflow_id,
      workflows (
        id,
        name,
        description
      )
    `)
    .single<FeaturedWorkflow>();

  if (featuredError) {
    console.error('Error fetching featured workflow:', featuredError);
  }

  // Fetch workflow data from Supabase
  const { data: workflows, error } = await supabase
    .from('workflows')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching workflows:', error);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <div className="max-w-full px-4 sm:px-6 lg:px-8 py-6 mx-auto">
          {featuredWorkflow && featuredWorkflow.workflows && (
            <header className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2 break-words">{featuredWorkflow.workflows.name}</h1>
              <p className="text-sm sm:text-base text-gray-600 mb-4 break-words">{featuredWorkflow.workflows.description}</p>
              <a
                href={`/chat?workflow=${featuredWorkflow.workflows.id}`}
                className="bg-black text-white px-4 py-2 text-sm sm:text-base rounded-full inline-block hover:bg-gray-800 transition-colors"
              >
                现在就试试吧
              </a>
            </header>
          )}
          <TagNav />
          {workflows && <WorkflowList workflows={workflows} />}
        </div>
      </main>

      <footer className="w-full border-t border-t-foreground/10 py-4 px-4 mt-auto">
        <div className="text-center text-xs">
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
        </div>
      </footer>
    </div>
  );
}