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
  
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });
  
    if (authError) {
      return redirect("/login?message=Could not authenticate user");
    }
  
    // If sign up is successful, insert a record into the accounts table
    if (authData.user) {
      const { error: insertError } = await supabase
        .from('accounts')
        .insert({
          user_id: authData.user.id,
          balance: 0,
          cumulative_charge: 0,
          gift_amount: 0,
          total_consumption: 0,
          yesterday_consumption: 0,
          this_month_consumption: 0,
        });
  
      if (insertError) {
        console.error("Error inserting account record:", insertError);
        // You might want to handle this error, perhaps by deleting the auth user or notifying an admin
      }
      const { error: profilesError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: authData.user.email,
        // Add any other fields you want to initialize
        // For example:
        // full_name: '',
        // avatar_url: '',
        // etc.
      });

    if (profilesError) {
      console.error("Error inserting profile record:", profilesError);
    }

    if (insertError || profilesError) {
      // You might want to handle these errors, perhaps by deleting the auth user or notifying an admin
      // For now, we'll just log the errors and continue
    }
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
  
    if (data && data.url) {
      // 重定向到 GitHub 进行认证
      return redirect(data.url);
    }
  
    // 注意：此时用户还没有完成 GitHub 认证，所以我们不能在这里创建 account
    // 我们需要在用户从 GitHub 重定向回来后检查并创建 account
    // 这个逻辑应该放在 /auth/callback 路由中
  
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