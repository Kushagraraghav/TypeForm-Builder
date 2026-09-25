"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#18181b] text-white font-sans overflow-x-hidden selection:bg-purple-500/30">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-[1400px] mx-auto border-b border-white/5">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-2 h-5 bg-white rounded-full"></div>
              <div className="w-3.5 h-5 bg-white rounded-full opacity-80"></div>
            </div>
            <span className="text-xl font-medium tracking-tight">Typeform</span>
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm font-medium">
          <button onClick={() => router.push('/login')} className="hover:text-zinc-300 transition-colors hidden md:block">Log in</button>
          <button className="border border-white/20 px-4 py-2 rounded-md hover:bg-white/5 transition-colors hidden md:block">Contact sales</button>
          <button 
            onClick={() => router.push('/login')}
            className="bg-white text-[#18181b] px-5 py-2 rounded-md hover:bg-zinc-200 transition-colors"
          >
            Sign up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center pt-24 pb-32 px-4 relative z-10 text-center max-w-4xl mx-auto">
        <div className="text-purple-300 font-bold tracking-widest text-[11px] mb-8 uppercase">
          AI FORMS & AUTOMATION
        </div>
        
        <h1 className="text-5xl md:text-[5.5rem] font-serif mb-8 leading-[1.05] tracking-tight text-white">
          Your favorite forms.<br/>
          Now with AI automation.
        </h1>
        
        <p className="text-lg md:text-xl text-zinc-300 mb-10 max-w-2xl font-light leading-relaxed">
          Combine AI forms and automated workflows to drive revenue growth. Run in-depth research and manage the entire customer lifecycle. All in Typeform.
        </p>
        
        <button 
          onClick={() => router.push('/login')}
          className="bg-white text-[#18181b] px-8 py-4 rounded-md font-medium text-lg hover:bg-zinc-200 transition-all hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95"
        >
          Get started—it's free
        </button>
      </main>

      {/* Cards Section */}
      <div className="max-w-[1200px] mx-auto px-4 pb-32 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[400px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {/* Card 1 */}
          <div className="bg-[#1e1e20] rounded-xl p-8 border border-white/10 shadow-2xl relative group h-[220px] flex flex-col justify-between hover:border-purple-500/50 transition-colors">
            <div>
              <p className="text-[11px] text-zinc-400 font-bold tracking-widest mb-3 uppercase">ASK</p>
              <h3 className="text-2xl font-medium text-white mb-3">Intelligent Forms</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">Build forms that adapt to every respondent and then analyze your data for rich insights.</p>
            </div>
            <div className="w-full h-1 bg-white/10 rounded-full mt-4 overflow-hidden"><div className="w-1/3 h-full bg-purple-500 rounded-full"></div></div>
          </div>
          
          {/* Card 2 */}
          <div className="bg-[#1e1e20] rounded-xl p-8 border border-white/10 shadow-2xl relative group h-[220px] flex flex-col hover:border-purple-500/50 transition-colors overflow-hidden">
            <div className="absolute right-0 bottom-0 w-32 h-32 bg-purple-500/20 blur-[50px]"></div>
            <div>
              <p className="text-[11px] text-zinc-400 font-bold tracking-widest mb-3 uppercase">ACT</p>
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-2xl font-medium text-white">Growth Flow</h3>
                <span className="bg-purple-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">NEW</span>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed relative z-10">Convert and keep customers with automated AI segmentation and follow-ups.</p>
            </div>
          </div>
          
          {/* Card 3 */}
          <div className="bg-[#1e1e20] rounded-xl p-8 border border-white/10 shadow-2xl relative group h-[220px] flex flex-col hover:border-purple-500/50 transition-colors overflow-hidden">
            <div className="absolute right-0 bottom-0 w-32 h-32 bg-purple-500/20 blur-[50px]"></div>
            <div>
              <p className="text-[11px] text-zinc-400 font-bold tracking-widest mb-3 uppercase">LEARN</p>
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-2xl font-medium text-white">Research Flow</h3>
                <span className="bg-purple-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">NEW</span>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed relative z-10">Make confident business decisions fast with AI-moderated studies and automated reports.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
