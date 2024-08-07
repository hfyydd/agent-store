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
        className="py-2 px-4 rounded-full text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 shadow-sm flex items-center"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        登出
      </button>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
            <h2 className="text-xl font-bold mb-4 text-gray-800">确认登出</h2>
            <p className="mb-6 text-gray-600">您确定要退出登录吗？</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelLogout}
                className="py-2 px-4 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors duration-200 text-sm font-medium"
              >
                取消
              </button>
              <button
                onClick={handleConfirmLogout}
                className="py-2 px-4 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200 text-sm font-medium"
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