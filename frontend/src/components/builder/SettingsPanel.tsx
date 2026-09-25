"use client";

import { useState } from "react";
import { Form, Question, QuestionOption } from "@/lib/types";
import { optionApi } from "@/lib/api";
import { GripVertical, Plus, Trash2, Settings, Type } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export default function SettingsPanel({ 
  question, 
  form,
  onUpdateQuestion,
  onUpdateForm,
  onSelectFormSettings,
  activeTab
}: { 
  question: Question | null,
  form: Form,
  onUpdateQuestion: (updates: Partial<Question>) => void,
  onUpdateForm: (updates: Partial<Form>) => void,
  onSelectFormSettings: () => void,
  activeTab: 'CONTENT' | 'LOGIC' | 'DESIGN'
}) {
  const { addToast } = useToast();
  const [isAddingOption, setIsAddingOption] = useState(false);

  const handleAddOption = async () => {
    if (!question) return;
    setIsAddingOption(true);
    try {
      const newOpt = await optionApi.createOption(question.id, { label: "New Option" });
      const currentOpts = question.options || [];
      onUpdateQuestion({ options: [...currentOpts, newOpt] });
    } catch {
      addToast("Failed to add option", "error");
    } finally {
      setIsAddingOption(false);
    }
  };

  const handleDeleteOption = async (optionId: number) => {
    if (!question) return;
    try {
      await optionApi.deleteOption(optionId);
      const newOpts = (question.options || []).filter(o => o.id !== optionId);
      onUpdateQuestion({ options: newOpts });
    } catch {
      addToast("Failed to delete option", "error");
    }
  };

  const handleUpdateOptionLocal = (optionId: number, label: string) => {
    if (!question) return;
    const newOpts = (question.options || []).map(o => o.id === optionId ? { ...o, label } : o);
    onUpdateQuestion({ options: newOpts });
  };

  const updateTheme = (key: string, value: string) => {
    let currentTheme: any = { backgroundColor: '#f3f3f5', buttonColor: '#18181b', textColor: '#09090b' };
    try {
      if (form.theme_json) currentTheme = JSON.parse(form.theme_json);
    } catch {}
    
    currentTheme[key] = value;
    onUpdateForm({ theme_json: JSON.stringify(currentTheme) });
  };

  const getTheme = (key: string, defaultVal: string) => {
    try {
      if (form.theme_json) return JSON.parse(form.theme_json)[key] || defaultVal;
    } catch {}
    return defaultVal;
  };

  const updateLogicJump = (optValue: string, jumpToId: number | null) => {
    if (!question) return;
    let logic: any = {};
    try {
      if (question.settings_json) logic = JSON.parse(question.settings_json);
    } catch {}
    
    if (jumpToId === null) {
      delete logic[optValue];
    } else {
      logic[optValue] = jumpToId;
    }
    
    onUpdateQuestion({ settings_json: JSON.stringify(logic) });
  };

  const getLogicJump = (optValue: string) => {
    if (!question || !question.settings_json) return "";
    try {
      return JSON.parse(question.settings_json)[optValue] || "";
    } catch {
      return "";
    }
  };

  if (activeTab === 'DESIGN') {
    return (
      <div className="w-80 bg-white flex flex-col shrink-0 shadow-[-1px_0_10px_rgba(0,0,0,0.05)] z-10 border-l border-zinc-200">
        <div className="p-4 border-b border-zinc-100">
          <h3 className="font-semibold text-zinc-900">Custom Themes</h3>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-zinc-900 mb-2">Background Color</label>
            <div className="flex items-center gap-3">
              <input type="color" value={getTheme('backgroundColor', '#f3f3f5')} onChange={(e) => updateTheme('backgroundColor', e.target.value)} className="w-8 h-8 rounded border-none cursor-pointer p-0" />
              <input type="text" value={getTheme('backgroundColor', '#f3f3f5')} onChange={(e) => updateTheme('backgroundColor', e.target.value)} className="flex-1 border rounded px-3 py-1.5 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-zinc-900 mb-2">Button Color</label>
            <div className="flex items-center gap-3">
              <input type="color" value={getTheme('buttonColor', '#18181b')} onChange={(e) => updateTheme('buttonColor', e.target.value)} className="w-8 h-8 rounded border-none cursor-pointer p-0" />
              <input type="text" value={getTheme('buttonColor', '#18181b')} onChange={(e) => updateTheme('buttonColor', e.target.value)} className="flex-1 border rounded px-3 py-1.5 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-zinc-900 mb-2">Text Color</label>
            <div className="flex items-center gap-3">
              <input type="color" value={getTheme('textColor', '#09090b')} onChange={(e) => updateTheme('textColor', e.target.value)} className="w-8 h-8 rounded border-none cursor-pointer p-0" />
              <input type="text" value={getTheme('textColor', '#09090b')} onChange={(e) => updateTheme('textColor', e.target.value)} className="flex-1 border rounded px-3 py-1.5 text-sm" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'LOGIC') {
    return (
      <div className="w-80 bg-white flex flex-col shrink-0 shadow-[-1px_0_10px_rgba(0,0,0,0.05)] z-10 border-l border-zinc-200">
        <div className="p-4 border-b border-zinc-100">
          <h3 className="font-semibold text-zinc-900">Logic Jumps</h3>
        </div>
        <div className="p-6 overflow-y-auto">
          {!question ? (
            <p className="text-sm text-zinc-500">Select a question to add logic jumps.</p>
          ) : (question.type !== 'MULTIPLE_CHOICE' && question.type !== 'DROPDOWN' && question.type !== 'YES_NO') ? (
            <p className="text-sm text-zinc-500">Logic jumps are only supported for Multiple Choice, Dropdown, and Yes/No questions in this demo.</p>
          ) : (
            <div className="space-y-6">
              <p className="text-sm text-zinc-600 font-medium">When user answers:</p>
              {question.options?.map((opt: QuestionOption) => (
                <div key={opt.id} className="bg-zinc-50 p-3 rounded-lg border border-zinc-200">
                  <div className="text-sm font-semibold text-zinc-900 mb-2">"{opt.label}"</div>
                  <label className="block text-xs text-zinc-500 mb-1">Jump to...</label>
                  <select 
                    value={getLogicJump(opt.label)} 
                    onChange={(e) => updateLogicJump(opt.label, e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full border border-zinc-200 rounded p-1.5 text-sm bg-white"
                  >
                    <option value="">Next Question (Default)</option>
                    {form.questions.map(q => {
                      if (q.id === question.id) return null;
                      return <option key={q.id} value={q.id}>{q.title}</option>
                    })}
                  </select>
                </div>
              ))}
              {question.type === 'YES_NO' && (
                <>
                  <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-200">
                    <div className="text-sm font-semibold text-zinc-900 mb-2">"Yes"</div>
                    <label className="block text-xs text-zinc-500 mb-1">Jump to...</label>
                    <select 
                      value={getLogicJump("Yes")} 
                      onChange={(e) => updateLogicJump("Yes", e.target.value ? parseInt(e.target.value) : null)}
                      className="w-full border border-zinc-200 rounded p-1.5 text-sm bg-white"
                    >
                      <option value="">Next Question (Default)</option>
                      {form.questions.map(q => (q.id !== question.id ? <option key={q.id} value={q.id}>{q.title}</option> : null))}
                    </select>
                  </div>
                  <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-200">
                    <div className="text-sm font-semibold text-zinc-900 mb-2">"No"</div>
                    <label className="block text-xs text-zinc-500 mb-1">Jump to...</label>
                    <select 
                      value={getLogicJump("No")} 
                      onChange={(e) => updateLogicJump("No", e.target.value ? parseInt(e.target.value) : null)}
                      className="w-full border border-zinc-200 rounded p-1.5 text-sm bg-white"
                    >
                      <option value="">Next Question (Default)</option>
                      {form.questions.map(q => (q.id !== question.id ? <option key={q.id} value={q.id}>{q.title}</option> : null))}
                    </select>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white flex flex-col shrink-0 shadow-[-1px_0_10px_rgba(0,0,0,0.05)] z-10 border-l border-zinc-200">
      <div className="flex border-b border-zinc-100">
        <button 
          className={`flex-1 py-4 text-sm font-semibold transition-colors ${question ? 'text-zinc-900 border-b-2 border-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}
        >
          Question
        </button>
        <button 
          onClick={onSelectFormSettings}
          className={`flex-1 py-4 text-sm font-semibold transition-colors ${!question ? 'text-zinc-900 border-b-2 border-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}
        >
          Form
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {!question ? (
          <div className="space-y-8">
            <div>
              <label className="block text-sm font-semibold text-zinc-900 mb-2">Form Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => onUpdateForm({ title: e.target.value })}
                className="w-full border-b border-zinc-200 py-2 text-sm focus:outline-none focus:border-zinc-900 transition-colors bg-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-zinc-900 mb-2">Thank You Message</label>
              <textarea
                value={form.thank_you_message}
                onChange={(e) => onUpdateForm({ thank_you_message: e.target.value })}
                rows={4}
                className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/20 focus:border-zinc-900 transition-all resize-none bg-zinc-50 hover:bg-white"
              />
              <p className="text-xs text-zinc-400 mt-2">Shown after the form is submitted.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Settings</label>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-700">Required</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={question.required}
                    onChange={(e) => onUpdateQuestion({ required: e.target.checked })}
                  />
                  <div className="w-10 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
            </div>

            <div className="h-px bg-zinc-100"></div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Content</label>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2 text-zinc-700">Question Title</label>
                  <textarea
                    value={question.title}
                    onChange={(e) => onUpdateQuestion({ title: e.target.value })}
                    className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/20 focus:border-zinc-900 transition-all resize-none bg-zinc-50 hover:bg-white"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-zinc-700">Description</label>
                  <textarea
                    value={question.description || ''}
                    onChange={(e) => onUpdateQuestion({ description: e.target.value })}
                    className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/20 focus:border-zinc-900 transition-all resize-none bg-zinc-50 hover:bg-white"
                    rows={2}
                    placeholder="Optional help text..."
                  />
                </div>
              </div>
            </div>

            {(question.type === 'MULTIPLE_CHOICE' || question.type === 'DROPDOWN') && (
              <>
                <div className="h-px bg-zinc-100"></div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Choices</label>
                  <div className="space-y-3">
                    {question.options?.map((opt: QuestionOption) => (
                      <div key={opt.id} className="flex items-center gap-2 group">
                        <div className="p-1 cursor-grab text-zinc-300 hover:text-zinc-500">
                          <GripVertical className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          value={opt.label}
                          onChange={(e) => handleUpdateOptionLocal(opt.id, e.target.value)}
                          onBlur={async (e) => {
                            try {
                              await optionApi.updateOption(opt.id, { label: e.target.value });
                            } catch {
                              addToast("Failed to save option label", "error");
                            }
                          }}
                          className="flex-1 border border-zinc-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/20 focus:border-zinc-900 bg-zinc-50 hover:bg-white transition-all"
                        />
                        <button 
                          onClick={() => handleDeleteOption(opt.id)}
                          className="p-1.5 text-zinc-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    
                    <button 
                      onClick={handleAddOption}
                      disabled={isAddingOption}
                      className="mt-4 text-sm text-zinc-500 font-medium flex items-center gap-2 hover:text-zinc-900 transition-colors w-full p-2 rounded hover:bg-zinc-50 justify-center"
                    >
                      <Plus className="w-4 h-4" /> Add choice
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
