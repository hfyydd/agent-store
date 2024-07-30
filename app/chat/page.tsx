// app/chat/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import ChatContent from "@/components/ChatContent";
import Link from "next/link";

export default async function ChatPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="flex flex-col min-h-screen w-full">
      <nav className="w-full flex justify-between items-center border-b border-b-foreground/10 h-16 px-4">
        <Link 
          href="/" 
          className="text-blue-500 hover:text-blue-600 transition-colors duration-200"
        >
          <button className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            <span>Back to Home</span>
          </button>
        </Link>
        <LogoutButton />
      </nav>
      <ChatContent />
      <footer className="w-full border-t border-t-foreground/10 p-4 sm:p-6 lg:p-8 text-center text-xs">
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