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
    <div className="container mx-auto px-4 py-8">
    {featuredWorkflow && featuredWorkflow.workflows && (
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">{featuredWorkflow.workflows.name}</h1>
        <p className="text-sm sm:text-base text-gray-600 mb-4">{featuredWorkflow.workflows.description}</p>
        <a
          href={`/chat?workflow=${featuredWorkflow.workflows.id}`}
          className="bg-black text-white px-4 py-2 rounded-full inline-block hover:bg-gray-800 transition-colors"
        >
          现在就试试吧
        </a>
      </header>
    )}
    <TagNav />
    {workflows && <WorkflowList workflows={workflows} />}
  </div>
);

}