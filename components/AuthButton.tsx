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
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">欢迎, {user.email?.split('@')[0]}!</span>
          <Link
            href="/dashboard"
            className="py-2 px-4 rounded-full text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 shadow-sm"
          >
            控制台
          </Link>
        </div>
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
        className="py-2 px-4 flex items-center justify-center rounded-full text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 shadow-sm"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
        </svg>
        登录
      </Link>
    );
  }
}