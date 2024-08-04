import { NextResponse } from 'next/server';
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  const supabase = createClient();
  
  const { data: tags, error } = await supabase
    .from('tags')
    .select('*');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(tags);
}