import { createClient } from "@/utils/supabase/server";
import TagNav from "@/components/TagNav";
import WorkflowList from "@/components/WorkflowList";

interface Workflow {
  id: string;
  name: string;
  description: string;
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
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <div className="container mx-auto px-4">
          {featuredWorkflow && featuredWorkflow.workflows && (
            <header className="flex justify-between items-center py-8">
              <div>
                <h1 className="text-3xl font-bold mt-2">{featuredWorkflow.workflows.name}</h1>
                <p className="text-gray-600 mt-1">{featuredWorkflow.workflows.description}</p>
                <a
                  href={`/chat?workflow=${featuredWorkflow.workflows.id}`}
                  className="bg-black text-white px-6 py-2 rounded-full mt-4 inline-block"
                >
                  现在就试试吧
                </a>
              </div>
            </header>
          )}
          <TagNav />
          {workflows && <WorkflowList workflows={workflows} />}
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