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