// import { createClient } from "@/utils/supabase/server";
// import Link from "next/link";
// import { redirect } from "next/navigation";

// export default async function LogoutButton() {
//   const supabase = createClient();

//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   const signOut = async () => {
//     "use server";

//     const supabase = createClient();
//     await supabase.auth.signOut();
//     return redirect("/login");
//   };

//   return user ? (
//     <div className="flex items-center gap-4">
//       你好, {user.email}!
//       <form action={signOut}>
//         <button className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
//           Logout
//         </button>
//       </form>
//     </div>
//   ) : (
//     <Link
//       href="/login"
//       className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
//     >
//       登录
//     </Link>
//   );
// }

'use client';

import React, { useState } from 'react';
import { signOut } from "@/app/actions/auth";

export default function LogoutButton() {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogoutClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmLogout = () => {
    signOut();
  };

  const handleCancelLogout = () => {
    setShowConfirm(false);
  };

  return (
    <>
      <button
        onClick={handleLogoutClick}
        className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
      >
        登出
      </button>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h2 className="text-xl font-bold mb-4">确认登出</h2>
            <p className="mb-4">您确定要登出吗？</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleCancelLogout}
                className="py-2 px-4 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                取消
              </button>
              <button
                onClick={handleConfirmLogout}
                className="py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600"
              >
                确认登出
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}