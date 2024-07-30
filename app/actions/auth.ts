"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
export async function signOut() {
    

    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect("/login");
  };