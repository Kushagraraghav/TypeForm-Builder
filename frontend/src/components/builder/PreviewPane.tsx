"use client";

import { Form, Question, QuestionOption } from "@/lib/types";

export default function PreviewPane({ 
  question, 
  form,
  isSettingsSelected
}: { 
  question: Question | null,
  form: Form,
  isSettingsSelected: boolean
}) {
  
  if (isSettingsSelected) {
    return (
      <div className="flex-1 bg-zinc-50 flex flex-col items-center justify-center p-8">
        <div className="max-w-2xl w-full aspect-[4/3] bg-white rounded-xl shadow-sm border p-12 flex flex-col items-center justify-center text-center">
          <h1 className="text-3xl font-light mb-4">{form.title}</h1>
          <p className="text-zinc-500 mb-8 max-w-md">Welcome screen preview. Add a welcome screen feature later, or just start with questions.</p>
          <button className="bg-zinc-900 text-white px-6 py-2 rounded-md font-medium">Start</button>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="flex-1 bg-zinc-50 flex items-center justify-center">
        <p className="text-zinc-400">Select a question to preview</p>
      </div>
    );
  }

  const getTheme = () => {
    try {
      if (form?.theme_json) return JSON.parse(form.theme_json);
    } catch {}
    return { backgroundColor: '#f1f5f9', buttonColor: '#18181b', textColor: '#0f172a' };
  };

  const theme = getTheme();

  const renderInputPreview = () => {
    switch (question.type) {
      case 'SHORT_TEXT':
      case 'EMAIL':
      case 'NUMBER':
        return (
          <input 
            type="text" 
            placeholder="Type your answer here..." 
            className="w-full text-3xl md:text-4xl pb-3 bg-transparent focus:outline-none mt-12 transition-colors font-light"
            style={{ borderBottom: `2px solid ${theme.buttonColor}40`, color: theme.textColor }}
            readOnly
          />
        );
      case 'LONG_TEXT':
        return (
          <textarea 
            placeholder="Type your answer here..." 
            className="w-full text-2xl md:text-3xl pb-3 bg-transparent focus:outline-none mt-12 resize-none min-h-[150px] transition-colors font-light"
            style={{ borderBottom: `2px solid ${theme.buttonColor}40`, color: theme.textColor }}
            readOnly
          />
        );
      case 'MULTIPLE_CHOICE':
        return (
          <div className="mt-12 flex flex-col gap-3">
            {question.options?.map((opt: QuestionOption, idx: number) => (
              <div key={idx} className="flex items-center gap-4 rounded p-4 text-xl md:text-2xl cursor-pointer transition-colors opacity-80" style={{ backgroundColor: `${theme.buttonColor}10`, color: theme.textColor }}>
                <div className="w-8 h-8 rounded flex items-center justify-center text-sm font-medium shrink-0" style={{ backgroundColor: theme.buttonColor, color: '#fff' }}>
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className="font-light">{opt.label || `Option ${idx + 1}`}</span>
              </div>
            ))}
            {(!question.options || question.options.length === 0) && (
              <p className="italic text-lg mt-4 opacity-50" style={{ color: theme.textColor }}>No options added yet</p>
            )}
          </div>
        );
      case 'DROPDOWN':
        return (
          <div className="mt-12 pb-3 flex justify-between items-center text-3xl md:text-4xl font-light cursor-pointer transition-colors opacity-50" style={{ borderBottom: `2px solid ${theme.buttonColor}40`, color: theme.textColor }}>
            <span>Select an option...</span>
            <span className="text-2xl">▼</span>
          </div>
        );
      case 'YES_NO':
        return (
          <div className="mt-12 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 rounded p-5 text-center text-xl md:text-2xl cursor-pointer transition-colors flex items-center justify-center gap-3 opacity-80" style={{ backgroundColor: `${theme.buttonColor}10`, color: theme.textColor }}>
              <span className="w-8 h-8 rounded flex items-center justify-center text-sm font-medium" style={{ backgroundColor: theme.buttonColor, color: '#fff' }}>Y</span>
              <span className="font-light">Yes</span>
            </div>
            <div className="flex-1 rounded p-5 text-center text-xl md:text-2xl cursor-pointer transition-colors flex items-center justify-center gap-3 opacity-80" style={{ backgroundColor: `${theme.buttonColor}10`, color: theme.textColor }}>
              <span className="w-8 h-8 rounded flex items-center justify-center text-sm font-medium" style={{ backgroundColor: theme.buttonColor, color: '#fff' }}>N</span>
              <span className="font-light">No</span>
            </div>
          </div>
        );
      case 'RATING':
        return (
          <div className="mt-12 flex gap-3 flex-wrap">
            {[1, 2, 3, 4, 5].map((num) => (
              <div key={num} className="w-16 h-16 rounded flex items-center justify-center text-3xl cursor-pointer transition-colors shadow-sm opacity-80" style={{ backgroundColor: `${theme.buttonColor}10`, color: theme.textColor }}>
                ★
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 relative flex flex-col items-center justify-center p-8 overflow-y-auto transition-colors" style={{ backgroundColor: theme.backgroundColor }}>
      {/* Subtle dotted background pattern */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none" style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '24px 24px', color: theme.textColor }}></div>
      
      <div className="relative z-10 w-full max-w-4xl min-h-[600px] rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white/50 p-12 md:p-20 flex flex-col justify-center animate-in zoom-in-95 duration-500 transition-colors" style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}>
        <div className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded" style={{ backgroundColor: theme.buttonColor, color: '#fff' }}>Live Preview</div>
        <div className="flex items-start gap-6">
          <div className="text-xl font-medium mt-1 flex items-center gap-3 opacity-50" style={{ color: theme.textColor }}>
            <span className="flex items-center justify-center w-8 h-8 rounded-full border shadow-sm" style={{ borderColor: theme.textColor }}>{form.questions.findIndex(q => q.id === question.id) + 1}</span>
            <span>→</span>
          </div>
          <div className="flex-1 w-full max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-light leading-tight mb-4" style={{ color: theme.textColor }}>
              {question.title || "..."}
              {question.required && <span className="text-red-500 ml-3 text-3xl">*</span>}
            </h2>
            
            {question.description && (
              <p className="text-xl md:text-2xl mt-2 font-light opacity-70" style={{ color: theme.textColor }}>{question.description}</p>
            )}

            <div className="mt-8">
              {renderInputPreview()}
            </div>

            <div className="mt-14 flex items-center gap-4">
              <button className="px-8 py-3.5 rounded font-medium flex items-center gap-3 transition-all hover:shadow-lg active:scale-95 text-lg" style={{ backgroundColor: theme.buttonColor, color: '#fff' }}>
                OK <span className="text-sm opacity-70">✓</span>
              </button>
              <span className="text-sm font-medium opacity-50" style={{ color: theme.textColor }}>press Enter ↵</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
