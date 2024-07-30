// app/layout.tsx
import Sidebar from "@/components/Sidebar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // 检查当前路径，如果是根路径，则重定向到 BasicInfo
  if (typeof window !== 'undefined' && window.location.pathname === '/') {
    redirect('/basicinfo');
  }

  return (
    <html lang="en">
      <body>
        <div className="flex flex-col min-h-screen w-full">
          <nav className="w-full flex justify-between items-center border-b border-b-foreground/10 h-16 px-4">
            <Link
              href="/basicinfo"
              className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
            >
              Home
            </Link>
            <div className="flex items-center gap-4">
              <LogoutButton />
            </div>
          </nav>
          <div className="flex flex-1 w-full">
            <Sidebar />
            <main className="flex-1 p-6 overflow-auto">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}