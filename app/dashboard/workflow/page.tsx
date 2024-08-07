// app/workflow/page.tsx
import WorkflowClient from './WorkflowClient';
import { createClient } from "@/utils/supabase/server";

export default async function WorkflowPage() {
  const supabase = createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return <div>Error loading user information</div>;
  }

  const { data: workflows, error: workflowsError } = await supabase
    .from('workflows')
    .select('*')
    .eq('user_id', user.id)
    .order('views', { ascending: false });

  if (workflowsError) {
    console.error('Error fetching workflows:', workflowsError);
    return <div>Error loading workflows</div>;
  }

  return <WorkflowClient initialWorkflows={workflows || []} userId={user.id} />;
}