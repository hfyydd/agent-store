import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default async function AuthButton() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return (
      <div className="flex items-center gap-4 flex-wrap">
        <span className="text-sm">欢迎👏, {user.email}!</span>
        <Link
          href="/dashboard"
          className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover hidden md:inline-block"
        >
          控制台
        </Link>
        <span className="text-sm text-gray-500 md:hidden">
          请在桌面端访问控制台
        </span>
        <LogoutButton />
      </div>
    );
  } else {
    return (
      <Link
        href="/login"
        className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
      >
        登录
      </Link>
    );
  }
}