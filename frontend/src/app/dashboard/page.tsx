"use client";

import { useEffect, useState } from "react";
import { formApi } from "@/lib/api";
import { Form } from "@/lib/types";
import { Plus, MoreHorizontal, FileText, Search, LayoutGrid, List } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function Dashboard() {
  const [forms, setForms] = useState<Form[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { addToast } = useToast();
  const [activeMenu, setActiveMenu] = useState<number | null>(null);

  const fetchForms = async () => {
    try {
      const data = await formApi.getForms();
      setForms(data);
    } catch (error) {
      addToast("Failed to load forms", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  const handleCreateForm = async () => {
    try {
      const newForm = await formApi.createForm({ title: "New Form" });
      router.push(`/forms/${newForm.id}`);
    } catch (error) {
      addToast("Failed to create form", "error");
    }
  };

  const handleDuplicate = async (id: number) => {
    try {
      await formApi.duplicateForm(id);
      addToast("Form duplicated", "success");
      fetchForms();
    } catch (error) {
      addToast("Failed to duplicate form", "error");
    }
    setActiveMenu(null);
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Delete "${title}"? This will permanently delete the form and its responses.`)) return;
    
    try {
      await formApi.deleteForm(id);
      addToast("Form deleted", "success");
      fetchForms();
    } catch (error) {
      addToast("Failed to delete form", "error");
    }
    setActiveMenu(null);
  };

  const handlePublishToggle = async (form: Form) => {
    try {
      if (form.status === "PUBLISHED") {
        await formApi.unpublishForm(form.id);
        addToast("Form unpublished", "success");
      } else {
        await formApi.publishForm(form.id);
        addToast("Form published", "success");
      }
      fetchForms();
    } catch (error) {
      addToast("Failed to change publish status", "error");
    }
    setActiveMenu(null);
  };

  return (
    <div className="flex h-screen bg-[#F3F3F5] dark:bg-zinc-900 font-sans">
      {/* Sidebar - Dark theme like Typeform */}
      <aside className="w-64 bg-zinc-900 dark:bg-black text-white flex flex-col border-r border-transparent dark:border-white/10">
        <div className="flex items-center gap-3 p-6 mb-4">
          <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center text-white font-bold text-sm">
            W
          </div>
          <span className="font-medium text-sm tracking-wide">My Workspace</span>
        </div>
        
        <div className="px-6 mb-8">
          <button
            onClick={handleCreateForm}
            className="w-full flex items-center justify-center gap-2 bg-white text-black px-4 py-2 rounded hover:bg-gray-100 transition-colors font-medium text-sm"
          >
            <Plus className="w-4 h-4" />
            Create typeform
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          <a href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-white bg-white/10 rounded-md font-medium text-sm">
            <FileText className="w-4 h-4 opacity-70" />
            Typeforms
          </a>
          <a href="/contacts" className="flex items-center gap-3 px-3 py-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-md text-sm transition-colors">
            Contacts
          </a>
          <a href="/automations" className="flex items-center gap-3 px-3 py-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-md text-sm transition-colors">
            Automations
          </a>
        </nav>
        
        <div className="p-6 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer opacity-80 hover:opacity-100 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full"></div>
            <span className="text-sm font-medium">Raghav</span>
          </div>
          <ThemeToggle />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 border-b border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-950 flex items-center justify-between px-8 shrink-0">
          <h1 className="text-xl font-medium text-zinc-800 dark:text-zinc-100">My workspace</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-9 pr-4 py-1.5 bg-zinc-100 dark:bg-zinc-800 border-transparent focus:bg-white dark:focus:bg-zinc-900 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-500 transition-all w-64 text-zinc-900 dark:text-zinc-100"
              />
            </div>
          </div>
        </header>

        <div className="p-8 flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center mt-20 text-zinc-500 dark:text-zinc-400">Loading your typeforms...</div>
          ) : forms.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full max-h-[400px]">
              <div className="w-24 h-24 mb-6 relative">
                <div className="absolute inset-0 bg-emerald-100 dark:bg-emerald-900/30 rounded-full animate-pulse"></div>
                <FileText className="w-10 h-10 text-emerald-600 dark:text-emerald-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <h2 className="text-2xl font-light mb-2 text-zinc-800 dark:text-zinc-100">Nothing here yet</h2>
              <p className="text-zinc-500 dark:text-zinc-400 mb-8 max-w-sm text-center">Create your first typeform to start collecting responses.</p>
              <button
                onClick={handleCreateForm}
                className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-6 py-3 rounded hover:bg-zinc-800 dark:hover:bg-zinc-200 font-medium transition-colors"
              >
                Create a typeform
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {forms.map(form => (
                <div key={form.id} className="group bg-white dark:bg-zinc-950 rounded-lg shadow-sm border border-zinc-200 dark:border-white/10 hover:shadow-md transition-all flex flex-col relative h-[240px]">
                  <div 
                    className="flex-1 bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 flex items-center justify-center cursor-pointer p-6 relative overflow-hidden rounded-t-lg group-hover:from-zinc-100 group-hover:to-zinc-200 dark:group-hover:from-zinc-800 dark:group-hover:to-zinc-700 transition-colors"
                    onClick={() => router.push(`/forms/${form.id}`)}
                  >
                    <div className="text-center w-full">
                       <h3 className="font-medium text-lg text-zinc-800 dark:text-zinc-100 truncate px-2" title={form.title}>{form.title}</h3>
                    </div>
                  </div>
                  
                  <div className="p-4 border-t border-zinc-100 dark:border-white/10 bg-white dark:bg-zinc-950 rounded-b-lg flex items-center justify-between">
                    <div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                        {form.response_count} response{form.response_count !== 1 ? 's' : ''}
                      </p>
                    </div>
                    
                    <div className="relative">
                      <button 
                        onClick={() => setActiveMenu(activeMenu === form.id ? null : form.id)}
                        className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                      
                      {activeMenu === form.id && (
                        <div className="absolute right-0 bottom-full mb-2 w-48 bg-white dark:bg-zinc-900 rounded shadow-xl border border-zinc-100 dark:border-white/10 py-1 z-10 text-sm overflow-hidden">
                          <button className="w-full text-left px-4 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 font-medium" onClick={() => {
                            router.push(`/forms/${form.id}`);
                          }}>
                            Edit
                          </button>
                          <button className="w-full text-left px-4 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 font-medium" onClick={() => {
                            router.push(`/forms/${form.id}/results`);
                          }}>
                            Results
                          </button>
                          <button className="w-full text-left px-4 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 font-medium" onClick={() => handlePublishToggle(form)}>
                            {form.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                          </button>
                          <button className="w-full text-left px-4 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 font-medium" onClick={() => handleDuplicate(form.id)}>
                            Duplicate
                          </button>
                          <div className="h-px bg-zinc-100 dark:bg-white/10 my-1"></div>
                          <button className="w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 font-medium" onClick={() => handleDelete(form.id, form.title)}>
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {form.status === "PUBLISHED" && (
                    <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/50 backdrop-blur border border-zinc-200 dark:border-white/10 text-zinc-800 dark:text-zinc-200 text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wider">
                      Published
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
