import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import LoginForm from "@/components/LoginForm";

export default function Login({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const signIn = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }

    return redirect("/");
  };

  const signUp = async (formData: FormData) => {
    "use server";

    const origin = headers().get("origin");
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }

    return redirect("/login?message=Check email to continue sign in process");
  };

  const signInWithGitHub = async () => {
    "use server";
    
    const origin = headers().get("origin");
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("GitHub authentication error:", error);
      return redirect("/login?message=Could not authenticate with GitHub");
    }

    if (data && !data.url) {
      return redirect("/");
    }

    if (data && data.url) {
      return redirect(data.url);
    }

    return redirect("/login?message=Authentication process incomplete");
  };

  const signInWithGoogle = async () => {
    "use server";

    const origin = headers().get("origin");
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("Google authentication error:", error);
      return redirect("/login?message=Could not authenticate with Google");
    }

    if (data && !data.url) {
      return redirect("/");
    }

    if (data && data.url) {
      return redirect(data.url);
    }

    return redirect("/login?message=Authentication process incomplete");
  }

  return (
    <LoginForm 
      signIn={signIn}
      signUp={signUp}
      signInWithGitHub={signInWithGitHub}
      signInWithGoogle={signInWithGoogle}
      searchParams={searchParams}
    />
  );
}