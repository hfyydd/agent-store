import { createClient } from "@/utils/supabase/server";
import TagNav from "@/components/TagNav";
import WorkflowList, { Workflow } from "@/components/WorkflowList";

interface FeaturedWorkflow {
  workflow_id: string;
  workflows: Workflow;
}

export default async function Index() {
  const supabase = createClient();
  let featuredWorkflow: FeaturedWorkflow | null = null;
  let workflows: Workflow[] = [];

  try {
    const { data: featuredData, error: featuredError } = await supabase
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
    } else {
      featuredWorkflow = featuredData;
    }

    const { data: workflowsData, error: workflowsError } = await supabase
      .from('workflows')
      .select('*')
      .order('created_at', { ascending: false });

    if (workflowsError) {
      console.error('Error fetching workflows:', workflowsError);
    } else if (workflowsData) {
      workflows = workflowsData as Workflow[];
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    // 在这里可以选择渲染一个错误页面
    return <div>An unexpected error occurred. Please try again later.</div>;
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
      <WorkflowList workflows={workflows} />
    </div>
  );
}