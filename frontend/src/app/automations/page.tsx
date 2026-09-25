"use client";

import { useEffect, useState } from "react";
import { formApi, webhookApi } from "@/lib/api";
import { ArrowLeft, Zap, Plus, Trash2, Webhook, Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import { Form } from "@/lib/types";

export default function AutomationsPage() {
  const [forms, setForms] = useState<Form[]>([]);
  const [selectedFormId, setSelectedFormId] = useState<number | null>(null);
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  
  const router = useRouter();
  const { addToast } = useToast();

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const data = await formApi.getForms();
        setForms(data);
        if (data.length > 0) {
          setSelectedFormId(data[0].id);
        }
      } catch (error) {
        addToast("Failed to load forms", "error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchForms();
  }, [addToast]);

  useEffect(() => {
    if (selectedFormId) {
      fetchWebhooks(selectedFormId);
    }
  }, [selectedFormId]);

  const fetchWebhooks = async (formId: number) => {
    try {
      const data = await webhookApi.getWebhooks(formId);
      setWebhooks(data);
    } catch (error) {
      addToast("Failed to load webhooks", "error");
    }
  };

  const handleAddWebhook = async () => {
    if (!newUrl || !selectedFormId) return;
    try {
      await webhookApi.createWebhook(selectedFormId, { url: newUrl, is_active: true });
      setNewUrl("");
      setIsAdding(false);
      fetchWebhooks(selectedFormId);
      addToast("Webhook added", "success");
    } catch (error) {
      addToast("Failed to add webhook", "error");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await webhookApi.deleteWebhook(id);
      if (selectedFormId) fetchWebhooks(selectedFormId);
      addToast("Webhook deleted", "success");
    } catch (error) {
      addToast("Failed to delete webhook", "error");
    }
  };

  const handleToggle = async (id: number, currentStatus: boolean) => {
    try {
      await webhookApi.updateWebhook(id, { is_active: !currentStatus });
      if (selectedFormId) fetchWebhooks(selectedFormId);
    } catch (error) {
      addToast("Failed to update webhook", "error");
    }
  };

  return (
    <div className="h-screen bg-zinc-50 dark:bg-black flex flex-col font-sans transition-colors duration-300">
      <header className="h-16 border-b border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-950 flex items-center justify-between px-6 shrink-0 shadow-sm z-10 transition-colors duration-300">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/dashboard')}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors text-zinc-500 dark:text-zinc-400"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-zinc-400 dark:text-zinc-500" />
            <h1 className="text-xl font-medium text-zinc-800 dark:text-zinc-100">Automations</h1>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-72 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-white/10 flex flex-col transition-colors duration-300">
          <div className="p-4 border-b border-zinc-200 dark:border-white/10">
            <h3 className="font-medium text-zinc-800 dark:text-zinc-100">Select Form</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {isLoading ? (
              <div className="p-4 text-center text-zinc-400 dark:text-zinc-500"><Loader2 className="w-5 h-5 animate-spin mx-auto" /></div>
            ) : forms.map(f => (
              <div 
                key={f.id}
                onClick={() => setSelectedFormId(f.id)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedFormId === f.id ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'}`}
              >
                {f.title}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-8">
          {selectedFormId ? (
            <div className="max-w-4xl">
              <div className="mb-8">
                <h2 className="text-3xl font-light text-zinc-900 dark:text-zinc-100 mb-2">Webhooks</h2>
                <p className="text-zinc-500 dark:text-zinc-400">Send form submission data to external URLs instantly.</p>
              </div>

              <div className="bg-white dark:bg-zinc-950 rounded-xl shadow-sm border border-zinc-200 dark:border-white/10 p-6 mb-8 transition-colors duration-300">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-medium text-lg dark:text-zinc-100">Active Webhooks</h3>
                  {!isAdding && (
                    <button 
                      onClick={() => setIsAdding(true)}
                      className="flex items-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-2 rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors text-sm font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Add Webhook
                    </button>
                  )}
                </div>

                {isAdding && (
                  <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-lg border border-zinc-200 dark:border-white/10 mb-6 flex gap-3 transition-colors duration-300">
                    <input 
                      type="url" 
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      placeholder="https://example.com/webhook"
                      className="flex-1 px-4 py-2 border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-500"
                    />
                    <button onClick={handleAddWebhook} className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-2 rounded-md font-medium transition-colors">Save</button>
                    <button onClick={() => setIsAdding(false)} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 px-4 py-2 rounded-md font-medium transition-colors">Cancel</button>
                  </div>
                )}

                <div className="space-y-4">
                  {webhooks.length === 0 && !isAdding ? (
                    <div className="text-center py-12 border-2 border-dashed border-zinc-200 dark:border-white/10 rounded-lg text-zinc-500 dark:text-zinc-400">
                      <Webhook className="w-12 h-12 text-zinc-300 dark:text-zinc-600 mx-auto mb-3" />
                      <p>No webhooks configured for this form.</p>
                    </div>
                  ) : (
                    webhooks.map(wh => (
                      <div key={wh.id} className="flex items-center justify-between p-4 border border-zinc-200 dark:border-white/10 rounded-lg hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`w-3 h-3 rounded-full ${wh.is_active ? 'bg-green-500' : 'bg-zinc-300 dark:bg-zinc-600'}`}></div>
                          <div>
                            <p className="font-medium text-zinc-800 dark:text-zinc-200">{wh.url}</p>
                            <p className="text-sm text-zinc-500 dark:text-zinc-500">Added {new Date(wh.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => handleToggle(wh.id, wh.is_active)}
                            className={`px-3 py-1.5 rounded text-sm font-medium border border-zinc-200 dark:border-white/10 transition-colors ${wh.is_active ? 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'}`}
                          >
                            {wh.is_active ? 'Disable' : 'Enable'}
                          </button>
                          <button 
                            onClick={() => handleDelete(wh.id)}
                            className="p-1.5 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-zinc-500 dark:text-zinc-400">
              Select a form from the sidebar to manage its automations.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
