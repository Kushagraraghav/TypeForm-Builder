"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#f3f4f6] dark:bg-black flex flex-col font-sans transition-colors duration-300">
      <div className="p-6 flex justify-between items-center">
        <button 
          onClick={() => router.push('/')}
          className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-md transition-colors text-zinc-500 dark:text-zinc-400"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white dark:bg-zinc-950 rounded-2xl shadow-xl p-8 border border-zinc-100 dark:border-white/10 transition-colors duration-300">
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-2 h-6 bg-zinc-900 dark:bg-white rounded-full"></div>
                <div className="w-4 h-6 bg-zinc-900 dark:bg-white rounded-full opacity-80"></div>
              </div>
              <span className="text-2xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100">Typeform</span>
            </div>
          </div>

          <h1 className="text-2xl font-light text-center text-zinc-800 dark:text-zinc-200 mb-8">
            Hello, who's this?
          </h1>

          <div className="space-y-4">
            <button 
              onClick={() => signIn('google', { callbackUrl: '/signup' })}
              className="w-full flex items-center justify-center gap-3 border border-zinc-300 dark:border-white/20 rounded-md py-3 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                <path fill="none" d="M1 1h22v22H1z"/>
              </svg>
              Sign in with Google
            </button>
            <button 
              disabled
              className="w-full flex items-center justify-center gap-3 border border-zinc-300 dark:border-white/10 rounded-md py-3 text-zinc-700 dark:text-zinc-500 font-medium transition-colors relative opacity-70 cursor-not-allowed bg-zinc-50 dark:bg-zinc-900"
            >
              <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase shadow-sm">
                Coming soon
              </span>
              <svg className="w-5 h-5 text-black dark:text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.26-.79 3.59-.76 1.54.04 2.82.72 3.53 1.76-3.03 1.77-2.52 5.82.49 7.02-.73 1.79-1.63 3.4-2.69 4.15zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Sign in with Apple
            </button>
          </div>
        </div>

        <p className="mt-8 text-sm text-zinc-500 dark:text-zinc-500 text-center max-w-sm">
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
