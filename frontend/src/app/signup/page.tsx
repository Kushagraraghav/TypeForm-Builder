"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Mic, Plus, Sparkles, Send } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mainUse, setMainUse] = useState("");
  const [goal, setGoal] = useState("");

  const mainUses = ["Personal", "School", "Work"];
  const goals = [
    "Conduct research",
    "Get more customers and sales",
    "Recruit talent",
    "Engage or educate my audience",
    "Manage events, projects or requests",
    "Get feedback"
  ];

  return (
    <div className="min-h-screen bg-[#f3f4f6] dark:bg-black font-sans flex flex-col text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      {/* Progress Bar */}
      <header className="h-16 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-white/10 flex items-center justify-center gap-6 px-6 shrink-0 z-10 w-full text-sm font-medium transition-colors duration-300">
        <div className={`flex items-center gap-2 ${step >= 1 ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400 dark:text-zinc-600"}`}>
          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white ${step > 1 ? "bg-zinc-800 dark:bg-white dark:text-black" : step === 1 ? "bg-zinc-800 dark:bg-white dark:text-black" : "bg-zinc-300 dark:bg-zinc-700"}`}>
            {step > 1 ? <Check className="w-3 h-3" /> : "1"}
          </div>
          Create your account
        </div>
        <div className="w-16 h-px bg-zinc-300 dark:bg-zinc-700"></div>
        <div className={`flex items-center gap-2 ${step >= 2 ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400 dark:text-zinc-600"}`}>
          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white ${step >= 4 ? "bg-zinc-800 dark:bg-white dark:text-black" : (step === 2 || step === 3) ? "bg-zinc-800 dark:bg-white dark:text-black" : "bg-zinc-300 dark:bg-zinc-700"}`}>
            {step >= 4 ? <Check className="w-3 h-3" /> : "2"}
          </div>
          Customize your experience
        </div>
        <div className="w-16 h-px border-t border-dotted border-zinc-300 dark:border-zinc-700"></div>
        <div className={`flex items-center gap-2 ${step >= 4 ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400 dark:text-zinc-600"}`}>
          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 4 ? "bg-zinc-800 dark:bg-white text-white dark:text-black" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600"}`}>
            3
          </div>
          Create your first form
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto flex items-center justify-center p-8">
        <div className="w-full max-w-2xl">
          {/* Step 1 */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3 mb-10">
                <div className="bg-zinc-700 dark:bg-zinc-200 text-white dark:text-zinc-900 w-5 h-5 rounded flex items-center justify-center text-xs font-bold">1</div>
                <h1 className="text-3xl text-zinc-700 dark:text-zinc-300 font-light">Hello! What should we <span className="font-medium text-zinc-900 dark:text-zinc-100">call you?</span>*</h1>
              </div>

              <div className="space-y-8 max-w-md ml-8">
                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-2 font-medium">First name*</label>
                  <input 
                    type="text" 
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    placeholder="Jane" 
                    className="w-full bg-transparent border-b border-zinc-800 dark:border-zinc-200 pb-2 text-xl focus:outline-none placeholder:text-zinc-300 dark:placeholder:text-zinc-600"
                  />
                </div>
                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-2 font-medium">Last name*</label>
                  <input 
                    type="text" 
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    placeholder="Smith" 
                    className="w-full bg-transparent border-b border-zinc-300 dark:border-zinc-700 pb-2 text-xl focus:outline-none focus:border-zinc-800 dark:focus:border-zinc-200 transition-colors placeholder:text-zinc-300 dark:placeholder:text-zinc-600"
                  />
                </div>
                <button 
                  onClick={() => { if(firstName) setStep(2) }}
                  disabled={!firstName}
                  className="bg-[#352c3c] dark:bg-white text-white dark:text-zinc-900 px-6 py-2.5 rounded font-medium mt-4 disabled:opacity-50 hover:bg-[#251f2a] dark:hover:bg-zinc-200 transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex items-center gap-3 mb-10">
                <div className="bg-zinc-700 dark:bg-zinc-200 text-white dark:text-zinc-900 w-5 h-5 rounded flex items-center justify-center text-xs font-bold">2</div>
                <h1 className="text-3xl text-zinc-700 dark:text-zinc-300 font-light">{firstName || 'User'}, what's <span className="font-medium text-zinc-900 dark:text-zinc-100">the main thing</span> you'll be using Typeform for?*</h1>
              </div>

              <div className="space-y-3 max-w-md ml-8 mb-10">
                {mainUses.map((use, idx) => (
                  <button 
                    key={use}
                    onClick={() => setMainUse(use)}
                    className={`w-full text-left p-3 rounded flex items-center gap-3 transition-colors ${mainUse === use ? 'bg-zinc-200 dark:bg-zinc-800 border-2 border-zinc-400 dark:border-zinc-500' : 'bg-zinc-200/50 dark:bg-zinc-800/30 hover:bg-zinc-200 dark:hover:bg-zinc-800 border-2 border-transparent'}`}
                  >
                    <div className="w-6 h-6 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded text-xs flex items-center justify-center text-zinc-500 dark:text-zinc-400">{String.fromCharCode(65 + idx)}</div>
                    <span className="text-lg text-zinc-700 dark:text-zinc-300">{use}</span>
                  </button>
                ))}
              </div>

              <div className="ml-8">
                <button 
                  onClick={() => { if(mainUse) setStep(3) }}
                  disabled={!mainUse}
                  className="bg-[#352c3c] dark:bg-white text-white dark:text-zinc-900 px-6 py-2.5 rounded font-medium hover:bg-[#251f2a] dark:hover:bg-zinc-200 transition-colors disabled:opacity-50"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex items-center gap-3 mb-10">
                <div className="bg-zinc-700 dark:bg-zinc-200 text-white dark:text-zinc-900 w-5 h-5 rounded flex items-center justify-center text-xs font-bold">3</div>
                <h2 className="text-3xl text-zinc-700 dark:text-zinc-300 font-light">What do you want Typeform to <span className="font-medium text-zinc-900 dark:text-zinc-100">help with?</span>*</h2>
              </div>
              <div className="space-y-2 max-w-md ml-8 mb-8">
                {goals.map((g, idx) => (
                  <button 
                    key={g}
                    onClick={() => setGoal(g)}
                    className={`w-full text-left p-2.5 rounded flex items-center gap-3 transition-colors ${goal === g ? 'bg-zinc-200 dark:bg-zinc-800 border-2 border-zinc-400 dark:border-zinc-500' : 'bg-zinc-200/50 dark:bg-zinc-800/30 hover:bg-zinc-200 dark:hover:bg-zinc-800 border-2 border-transparent'}`}
                  >
                    <div className="w-6 h-6 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded text-xs flex items-center justify-center text-zinc-500 dark:text-zinc-400">{String.fromCharCode(65 + idx)}</div>
                    <span className="text-zinc-700 dark:text-zinc-300">{g}</span>
                  </button>
                ))}
              </div>
              
              <div className="ml-8">
                <button 
                  onClick={() => { if(goal) setStep(4) }}
                  disabled={!goal}
                  className="bg-[#352c3c] dark:bg-white text-white dark:text-zinc-900 px-6 py-2.5 rounded font-medium hover:bg-[#251f2a] dark:hover:bg-zinc-200 transition-colors disabled:opacity-50"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 4 (Typeform AI) */}
          {step === 4 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center text-center">
              <div className="text-zinc-500 dark:text-zinc-400 text-sm font-medium mb-3">Typeform AI</div>
              <h1 className="text-3xl text-zinc-800 dark:text-zinc-100 font-light mb-8">What would you like to create?</h1>

              <div className="w-full max-w-xl relative">
                <div className="absolute -top-3 -right-3 bg-purple-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase shadow-sm z-10 animate-bounce">
                  Coming soon
                </div>
                <div className="w-full h-40 bg-white dark:bg-zinc-900 border-2 border-purple-200 dark:border-purple-500/30 rounded-xl p-4 shadow-sm opacity-60 cursor-not-allowed flex flex-col relative overflow-hidden transition-colors">
                  <textarea 
                    disabled
                    placeholder="Explain the goal..."
                    className="w-full flex-1 resize-none outline-none text-lg bg-transparent cursor-not-allowed text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                  ></textarea>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex gap-3 text-zinc-400 dark:text-zinc-500">
                      <Mic className="w-5 h-5" />
                      <Plus className="w-5 h-5" />
                      <span className="font-bold tracking-widest leading-none">...</span>
                    </div>
                    <div className="w-8 h-8 rounded-lg border border-zinc-200 dark:border-white/10 flex items-center justify-center text-zinc-300 dark:text-zinc-600">
                      <Send className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-12">
                <button 
                  onClick={() => router.push('/dashboard')}
                  className="bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 px-6 py-3 rounded-lg font-medium transition-colors border border-zinc-200 dark:border-white/10"
                >
                  Start from scratch
                </button>
                <button 
                  disabled
                  className="bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 px-6 py-3 rounded-lg font-medium transition-colors border border-zinc-200 dark:border-white/10 flex items-center gap-2 relative cursor-not-allowed opacity-80"
                >
                  <span className="absolute -top-3 -right-3 bg-purple-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase shadow-sm z-10">
                    Coming soon
                  </span>
                  Sync to CRM
                  <span className="flex gap-1">
                    <span className="w-5 h-5 rounded bg-orange-500"></span>
                    <span className="w-5 h-5 rounded bg-blue-500"></span>
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
