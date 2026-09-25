"use client";

import { useEffect, useState, useCallback } from "react";
import { formApi, questionApi } from "@/lib/api";
import { Form, Question } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import { ArrowLeft, Check, Link, Play, Settings } from "lucide-react";
import Sidebar from "./Sidebar";
import SettingsPanel from "./SettingsPanel";
import PreviewPane from "./PreviewPane";

export default function Builder({ formId }: { formId: number }) {
  const [form, setForm] = useState<Form | null>(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'CONTENT' | 'LOGIC' | 'DESIGN'>('CONTENT');
  
  const router = useRouter();
  const { addToast } = useToast();

  const fetchForm = useCallback(async () => {
    try {
      const data = await formApi.getForm(formId);
      setForm(data);
      if (data.questions.length > 0 && !selectedQuestionId) {
        setSelectedQuestionId(data.questions[0].id);
      }
    } catch (error) {
      addToast("Failed to load form", "error");
      router.push("/");
    } finally {
      setIsLoading(false);
    }
  }, [formId, selectedQuestionId, addToast, router]);

  useEffect(() => {
    fetchForm();
  }, [fetchForm]);

  const updateForm = async (updates: Partial<Form>) => {
    if (!form) return;
    setIsSaving(true);
    try {
      setForm({ ...form, ...updates });
      await formApi.updateForm(form.id, updates);
    } catch {
      addToast("Failed to update form", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const addQuestion = async (type: Question["type"]) => {
    if (!form) return;
    setIsSaving(true);
    try {
      const q = await questionApi.createQuestion(form.id, { type, title: "New Question" });
      const updatedQuestions = [...form.questions, q];
      setForm({ ...form, questions: updatedQuestions });
      setSelectedQuestionId(q.id);
    } catch {
      addToast("Failed to add question", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const updateQuestion = async (id: number, updates: Partial<Question>) => {
    if (!form) return;
    // Optimistic UI update
    const newQuestions = form.questions.map(q => q.id === id ? { ...q, ...updates } : q);
    setForm({ ...form, questions: newQuestions });
    
    setIsSaving(true);
    try {
      await questionApi.updateQuestion(id, updates);
    } catch {
      addToast("Failed to update question", "error");
      // Rollback on fail would go here
    } finally {
      setIsSaving(false);
    }
  };

  const deleteQuestion = async (id: number) => {
    if (!form) return;
    if (!confirm("Delete this question?")) return;
    
    setIsSaving(true);
    try {
      await questionApi.deleteQuestion(id);
      const newQuestions = form.questions.filter(q => q.id !== id);
      setForm({ ...form, questions: newQuestions });
      if (selectedQuestionId === id) {
        setSelectedQuestionId(newQuestions.length > 0 ? newQuestions[0].id : null);
      }
    } catch {
      addToast("Failed to delete question", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const duplicateQuestion = async (id: number) => {
    if (!form) return;
    const qToCopy = form.questions.find(q => q.id === id);
    if (!qToCopy) return;

    setIsSaving(true);
    try {
      // API call to create new question
      const q = await questionApi.createQuestion(form.id, { 
        type: qToCopy.type, 
        title: qToCopy.title + " (Copy)",
        description: qToCopy.description,
        required: qToCopy.required,
        options: qToCopy.options.map(o => ({ label: o.label, position: o.position }))
      });
      const updatedQuestions = [...form.questions, q];
      setForm({ ...form, questions: updatedQuestions });
      setSelectedQuestionId(q.id);
      addToast("Question duplicated", "success");
    } catch {
      addToast("Failed to duplicate question", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReorder = async (reorderedQuestions: Question[]) => {
    if (!form) return;
    setForm({ ...form, questions: reorderedQuestions });
    try {
      const items = reorderedQuestions.map((q, idx) => ({ id: q.id, position: idx }));
      await questionApi.reorderQuestions(form.id, items);
    } catch {
      addToast("Failed to reorder questions", "error");
    }
  };

  const publishForm = async () => {
    if (!form) return;
    try {
      await formApi.publishForm(form.id);
      setForm({ ...form, status: "PUBLISHED" });
      addToast("Form published successfully!", "success");
    } catch {
      addToast("Failed to publish", "error");
    }
  };

  if (isLoading || !form) {
    return <div className="h-screen flex items-center justify-center bg-zinc-50">Loading Builder...</div>;
  }

  const selectedQuestion = form.questions.find(q => q.id === selectedQuestionId) || null;

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Top Bar */}
      <header className="h-14 border-b border-zinc-200 bg-white flex items-center justify-between px-4 shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.02)] z-20">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push("/")} className="p-2 hover:bg-zinc-100 rounded-md text-zinc-500 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col">
            <input
              type="text"
              value={form.title}
              onChange={(e) => updateForm({ title: e.target.value })}
              className="font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-zinc-200 px-2 py-0.5 rounded text-zinc-900 bg-transparent hover:bg-zinc-50 transition-colors"
            />
            {isSaving ? (
              <span className="text-[10px] text-zinc-400 px-2 uppercase tracking-wide font-medium">Saving...</span>
            ) : (
              <span className="text-[10px] text-zinc-400 px-2 uppercase tracking-wide font-medium flex items-center gap-1"><Check className="w-3 h-3"/> Saved</span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => window.open(`/to/${form.slug}`, '_blank')}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded transition-colors"
          >
            <Play className="w-4 h-4" />
            Preview
          </button>
          
          <button 
            onClick={publishForm}
            className={`px-4 py-1.5 text-sm font-medium rounded transition-colors shadow-sm ${
              form.status === "PUBLISHED" 
                ? "bg-zinc-100 text-zinc-800 border-zinc-200"
                : "bg-zinc-900 text-white hover:bg-zinc-800"
            }`}
          >
            {form.status === "PUBLISHED" ? "Published" : "Publish"}
          </button>
        </div>
      </header>

      {/* Builder Main Area */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          questions={form.questions} 
          selectedId={selectedQuestionId} 
          onSelect={setSelectedQuestionId}
          onAdd={addQuestion}
          onDelete={deleteQuestion}
          onDuplicate={duplicateQuestion}
          onReorder={handleReorder}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        
        <PreviewPane 
          question={selectedQuestion} 
          form={form}
          isSettingsSelected={selectedQuestionId === null}
        />
        
        <SettingsPanel 
          question={selectedQuestion} 
          form={form}
          onUpdateQuestion={(updates) => selectedQuestion && updateQuestion(selectedQuestion.id, updates)}
          onUpdateForm={updateForm}
          onSelectFormSettings={() => setSelectedQuestionId(null)}
          activeTab={activeTab}
        />
      </div>
    </div>
  );
}
