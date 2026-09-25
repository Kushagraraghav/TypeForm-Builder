"use client";

import { useEffect, useState, useRef } from "react";
import { publicApi } from "@/lib/api";
import { Form, Question } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/Toast";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function PublicForm({ slug }: { slug: string }) {
  const [form, setForm] = useState<Form | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { addToast } = useToast();
  const inputRef = useRef<any>(null);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const data = await publicApi.getForm(slug);
        setForm(data);
      } catch (err) {
        setError("This form is not available or has been unpublished.");
      }
    };
    fetchForm();
  }, [slug]);

  useEffect(() => {
    // Focus input when question changes
    if (inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [currentIdx]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!form || isSubmitted) return;
      
      const q = form.questions[currentIdx];
      
      // Enter to go next (if not textarea)
      if (e.key === "Enter" && q.type !== 'LONG_TEXT') {
        e.preventDefault();
        handleNext();
      }
      
      // Handle Multiple Choice / Dropdown alphabet selection
      if ((q.type === 'MULTIPLE_CHOICE' || q.type === 'DROPDOWN') && q.options) {
        const key = e.key.toUpperCase();
        const code = key.charCodeAt(0);
        if (code >= 65 && code < 65 + q.options.length) {
          const optIndex = code - 65;
          setAnswers(prev => ({ ...prev, [q.id]: q.options[optIndex].label }));
          // Auto-advance after small delay
          setTimeout(() => handleNext(), 300);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIdx, form, isSubmitted, answers]);

  if (error) {
    return <div className="h-screen flex items-center justify-center bg-zinc-50 font-sans p-4 text-center">{error}</div>;
  }

  if (!form) return <div className="h-screen flex items-center justify-center bg-zinc-50">Loading...</div>;

  const validateCurrent = (): boolean => {
    const q = form.questions[currentIdx];
    const val = answers[q.id];
    
    if (q.required && (!val || val.trim() === "")) {
      addToast("Please fill this in", "error");
      return false;
    }
    
    if (val && q.type === 'EMAIL') {
      const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
      if (!emailRegex.test(val)) {
        addToast("Hmm... that email doesn't look right", "error");
        return false;
      }
    }
    
    if (val && q.type === 'NUMBER') {
      if (isNaN(Number(val))) {
        addToast("Please enter a valid number", "error");
        return false;
      }
    }
    
    return true;
  };

  const getTheme = () => {
    try {
      if (form?.theme_json) return JSON.parse(form.theme_json);
    } catch {}
    return { backgroundColor: '#f3f3f5', buttonColor: '#18181b', textColor: '#09090b' };
  };

  const theme = getTheme();

  const handleNext = () => {
    if (!validateCurrent()) return;
    
    const q = form.questions[currentIdx];
    const val = answers[q.id];
    
    // Evaluate logic jumps
    let jumpToId: number | null = null;
    if (q.settings_json && val) {
      try {
        const logic = JSON.parse(q.settings_json);
        if (logic[val]) {
          jumpToId = logic[val];
        }
      } catch {}
    }

    if (jumpToId) {
      const nextIdx = form.questions.findIndex(question => question.id === jumpToId);
      if (nextIdx !== -1) {
        setCurrentIdx(nextIdx);
        return;
      }
    }
    
    // Default next
    if (currentIdx < form.questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) setCurrentIdx(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateCurrent()) return;
    
    setIsSubmitting(true);
    try {
      const formattedAnswers = Object.entries(answers).map(([qId, val]) => ({
        question_id: parseInt(qId),
        value: val
      }));
      
      await publicApi.submitResponse(slug, formattedAnswers);
      setIsSubmitted(true);
    } catch {
      addToast("Something went wrong while submitting", "error");
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white font-sans p-8 text-center animate-in fade-in duration-1000">
        <h1 className="text-3xl md:text-4xl font-light mb-6 text-zinc-900">{form.thank_you_message}</h1>
      </div>
    );
  }

  const q = form.questions[currentIdx];
  if (!q) return null; // No questions
  
  const progress = ((currentIdx) / form.questions.length) * 100;

  return (
    <div className="h-screen flex flex-col bg-white font-sans overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative w-full max-w-4xl mx-auto">
        
        <AnimatePresence mode="wait">
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full flex items-start gap-4 md:gap-8"
          >
            <div className="text-zinc-400 font-medium text-xl md:text-2xl mt-1 shrink-0 flex items-center gap-2">
              {currentIdx + 1}
              <span className="text-zinc-300">→</span>
            </div>
            
            <div className="flex-1 w-full max-w-2xl">
              <h2 className="text-2xl md:text-4xl font-medium text-zinc-900 leading-tight mb-2">
                {q.title}
                {q.required && <span className="text-red-500 ml-2 text-2xl">*</span>}
              </h2>
              
              {q.description && (
                <p className="text-lg md:text-xl text-zinc-500 mb-8">{q.description}</p>
              )}

              <div className="mt-8 mb-12">
                {/* Short text, Email, Number */}
                {(q.type === 'SHORT_TEXT' || q.type === 'EMAIL' || q.type === 'NUMBER') && (
                  <input
                    ref={inputRef}
                    type={q.type === 'EMAIL' ? 'email' : q.type === 'NUMBER' ? 'number' : 'text'}
                    placeholder="Type your answer here..."
                    className="w-full text-2xl md:text-4xl border-b-2 border-zinc-200 pb-2 bg-transparent focus:outline-none focus:border-zinc-900 text-zinc-900 placeholder-zinc-300 transition-colors"
                    value={answers[q.id] || ''}
                    onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                  />
                )}
                
                {/* Long text */}
                {q.type === 'LONG_TEXT' && (
                  <textarea
                    ref={inputRef}
                    placeholder="Type your answer here..."
                    className="w-full text-xl md:text-2xl border-b-2 border-zinc-200 pb-2 bg-transparent focus:outline-none focus:border-zinc-900 text-zinc-900 placeholder-zinc-300 resize-none min-h-[150px] transition-colors"
                    value={answers[q.id] || ''}
                    onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                  />
                )}
                
                {/* Multiple Choice & Dropdown */}
                {(q.type === 'MULTIPLE_CHOICE' || q.type === 'DROPDOWN') && (
                  <div className="flex flex-col gap-3">
                    {q.options?.map((opt, idx) => {
                      const letter = String.fromCharCode(65 + idx);
                      const isSelected = answers[q.id] === opt.label;
                      return (
                        <div 
                          key={opt.id} 
                          onClick={() => {
                            setAnswers(prev => ({ ...prev, [q.id]: opt.label }));
                            setTimeout(() => handleNext(), 300);
                          }}
                          className={`flex items-center gap-4 border rounded-xl p-3 md:p-4 text-lg md:text-xl cursor-pointer transition-all ${
                            isSelected 
                              ? 'bg-zinc-100 border-zinc-900 ring-1 ring-zinc-900' 
                              : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300'
                          }`}
                        >
                          <div className={`w-7 h-7 rounded border flex items-center justify-center text-sm font-medium shrink-0 transition-colors ${
                            isSelected ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white border-zinc-300 text-zinc-600'
                          }`}>
                            {letter}
                          </div>
                          <span className="flex-1 font-medium">{opt.label}</span>
                          {isSelected && <span className="text-zinc-900 mr-2">✓</span>}
                        </div>
                      );
                    })}
                  </div>
                )}
                
                {/* Yes / No */}
                {q.type === 'YES_NO' && (
                  <div className="flex flex-col sm:flex-row gap-4">
                    {['Yes', 'No'].map((val, idx) => {
                      const letter = idx === 0 ? 'Y' : 'N';
                      const isSelected = answers[q.id] === val;
                      return (
                        <div 
                          key={val}
                          onClick={() => {
                            setAnswers(prev => ({ ...prev, [q.id]: val }));
                            setTimeout(() => handleNext(), 300);
                          }}
                          className={`flex-1 flex items-center gap-4 border rounded-xl p-4 text-xl cursor-pointer transition-all ${
                            isSelected 
                              ? 'bg-zinc-100 border-zinc-900 ring-1 ring-zinc-900' 
                              : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded border flex items-center justify-center text-sm font-medium shrink-0 transition-colors ${
                            isSelected ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white border-zinc-300 text-zinc-600'
                          }`}>
                            {letter}
                          </div>
                          <span className="font-medium">{val}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
                
                {/* Rating */}
                {q.type === 'RATING' && (
                  <div className="flex gap-2 md:gap-4 flex-wrap">
                    {[1, 2, 3, 4, 5].map((num) => {
                      const isSelected = answers[q.id] === num.toString();
                      return (
                        <div 
                          key={num} 
                          onClick={() => {
                            setAnswers(prev => ({ ...prev, [q.id]: num.toString() }));
                            setTimeout(() => handleNext(), 300);
                          }}
                          className={`w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center text-2xl md:text-3xl cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-zinc-900 text-yellow-400 scale-110 shadow-lg'
                              : 'bg-zinc-100 text-zinc-300 hover:bg-zinc-200 hover:text-zinc-400'
                          }`}
                        >
                          ★
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4">
                <button 
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="bg-zinc-900 text-white px-6 md:px-8 py-3 rounded-lg font-medium text-lg md:text-xl flex items-center gap-2 hover:bg-zinc-800 transition-colors shadow-sm disabled:opacity-70"
                >
                  {currentIdx === form.questions.length - 1 ? 'Submit' : 'OK'} <span className="text-sm opacity-70">✓</span>
                </button>
                <div className="hidden md:flex flex-col">
                  <span className="text-xs font-medium text-zinc-500">press Enter ↵</span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Navigation & Progress */}
      <div className="absolute bottom-0 w-full">
        {/* Progress bar */}
        <div className="w-full h-1.5 bg-zinc-100 relative">
          <div 
            className="absolute top-0 left-0 h-full bg-zinc-900 transition-all duration-500 ease-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between items-center p-4 md:px-8 bg-white/80 backdrop-blur-sm">
          <div className="flex gap-1">
            <button 
              onClick={handlePrev}
              disabled={currentIdx === 0}
              className="w-10 h-10 flex items-center justify-center bg-zinc-100 rounded hover:bg-zinc-200 disabled:opacity-50 transition-colors"
            >
              <ChevronUp className="w-5 h-5 text-zinc-700" />
            </button>
            <button 
              onClick={handleNext}
              className="w-10 h-10 flex items-center justify-center bg-zinc-100 rounded hover:bg-zinc-200 transition-colors"
            >
              <ChevronDown className="w-5 h-5 text-zinc-700" />
            </button>
          </div>
          
          <div className="text-sm font-medium text-zinc-500">
            {Math.round(progress)}% completed
          </div>
        </div>
      </div>
    </div>
  );
}
