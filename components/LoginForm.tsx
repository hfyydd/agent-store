'use client'

import { useState } from 'react';

interface LoginFormProps {
  signIn: (formData: FormData) => Promise<void>;
  signUp: (formData: FormData) => Promise<void>;
  signInWithGitHub: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  searchParams: { message: string };
}

export default function LoginForm({ signIn, signUp, signInWithGitHub, signInWithGoogle, searchParams }: LoginFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 min-w-[400px]">
      <div className="w-full max-w-[600px] bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-8">{isLogin ? '欢迎回来' : '创建账户'}</h2>
        <form className="space-y-6" action={isLogin ? signIn : signUp}>
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              required
              className={`w-full px-4 py-3 border ${emailFocused || email ? 'border-green-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-green-500`}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <label
              htmlFor="email"
              className={`absolute left-4 transition-all duration-200 ${
                emailFocused || email
                  ? '-top-2.5 text-sm text-green-500 bg-white px-1'
                  : 'top-3 text-gray-500'
              }`}
            >
              电子邮件地址
            </label>
          </div>
          <div className="relative">
            <input
              id="password"
              name="password"
              type="password"
              required
              className={`w-full px-4 py-3 border ${passwordFocused || password ? 'border-green-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-green-500`}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <label
              htmlFor="password"
              className={`absolute left-4 transition-all duration-200 ${
                passwordFocused || password
                  ? '-top-2.5 text-sm text-green-500 bg-white px-1'
                  : 'top-3 text-gray-500'
              }`}
            >
              密码
            </label>
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              继续
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">
            {isLogin ? '还没有账户？' : '已经有账户？'}
          </span>
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="ml-1 text-green-600 hover:text-green-500 font-medium"
          >
            {isLogin ? '注册' : '登录'}
          </button>
        </div>

        <div className="mt-8 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">或</span>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {/* <form action={signInWithGoogle}>
            <button
              type="submit"
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              继续使用 Google 登录
            </button>
          </form> */}
          <form action={signInWithGitHub}>
            <button
              type="submit"
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.164 6.839 9.49.5.09.682-.218.682-.486 0-.24-.009-.875-.013-1.718-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12c0-5.523-4.477-10-10-10z" />
              </svg>
              继续使用 GitHub 登录
            </button>
          </form>
        </div>
      </div>

      {searchParams?.message && (
        <p className="mt-4 p-4 bg-red-100 text-red-700 text-center rounded-md">
          {searchParams.message}
        </p>
      )}
    </div>
  );
}