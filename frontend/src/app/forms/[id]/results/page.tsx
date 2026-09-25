"use client";

import { useEffect, useState, use } from "react";
import { formApi } from "@/lib/api";
import { Form, Response, Question } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import { ArrowLeft, Users, BarChart3, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ['#18181b', '#3f3f46', '#71717a', '#a1a1aa', '#d4d4d8'];

export default function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [form, setForm] = useState<Form | null>(null);
  const [responses, setResponses] = useState<Response[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'SUMMARY' | 'RESPONSES'>('SUMMARY');
  const [selectedResponse, setSelectedResponse] = useState<Response | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const router = useRouter();
  const { addToast } = useToast();
  const formId = parseInt(resolvedParams.id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [f, res, sum] = await Promise.all([
          formApi.getForm(formId),
          formApi.getResponses(formId),
          formApi.getSummary(formId)
        ]);
        setForm(f);
        setResponses(res);
        setSummary(sum);
      } catch (error) {
        addToast("Failed to load results", "error");
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [formId, router, addToast]);

  if (isLoading || !form) {
    return <div className="h-screen flex items-center justify-center bg-zinc-50">Loading Results...</div>;
  }

  const downloadCSV = () => {
    if (!form || responses.length === 0) {
      addToast("No responses to export", "error");
      return;
    }
    
    const headers = ["Submitted At", ...form.questions.map(q => `"${q.title.replace(/"/g, '""')}"`)];
    
    const rows = responses.map(res => {
      const row = [`"${new Date(res.submitted_at).toLocaleString()}"`];
      form.questions.forEach(q => {
        const ans = res.answers.find(a => a.question_id === q.id);
        row.push(ans?.value ? `"${ans.value.replace(/"/g, '""')}"` : '""');
      });
      return row.join(",");
    });
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${form.title.replace(/\s+/g, '_')}_responses.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast("CSV Downloaded", "success");
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-50">
      <header className="h-14 border-b bg-white flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push(`/forms/${form.id}`)} className="p-2 hover:bg-zinc-100 rounded-md text-zinc-500">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="font-medium text-lg">{form.title} - Results</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={downloadCSV}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-zinc-900 text-white rounded hover:bg-zinc-800 transition-colors"
          >
            Export CSV
          </button>
          <div className="flex bg-zinc-100 p-1 rounded-md">
            <button 
              className={`px-4 py-1 text-sm font-medium rounded-md ${activeTab === 'SUMMARY' ? 'bg-white shadow-sm' : 'text-zinc-500'}`}
              onClick={() => { setActiveTab('SUMMARY'); setSelectedResponse(null); }}
            >
              Summary
            </button>
            <button 
              className={`px-4 py-1 text-sm font-medium rounded-md ${activeTab === 'RESPONSES' ? 'bg-white shadow-sm' : 'text-zinc-500'}`}
              onClick={() => setActiveTab('RESPONSES')}
            >
              Responses ({responses.length})
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden flex">
        {activeTab === 'SUMMARY' ? (
          <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl border shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-zinc-600" />
                </div>
                <div>
                  <div className="text-3xl font-bold">{responses.length}</div>
                  <div className="text-sm text-zinc-500">Total Responses</div>
                </div>
              </div>
            </div>

            <h2 className="text-xl font-medium mb-6">Question Summary</h2>
            <div className="space-y-6">
              {form.questions.map((q, idx) => {
                const qSummary = summary[q.id];
                if (!qSummary) return null;
                
                return (
                  <div key={q.id} className="bg-white p-6 rounded-xl border shadow-sm">
                    <div className="flex items-start gap-4 mb-6">
                      <span className="font-medium text-zinc-400">{idx + 1}</span>
                      <h3 className="font-medium text-lg">{q.title}</h3>
                    </div>
                    
                    {qSummary.distribution ? (
                      <div className="h-64 w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={Object.entries(qSummary.distribution).map(([name, value]) => ({ name, value }))}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" allowDecimals={false} />
                            <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                            <Tooltip cursor={{fill: '#f4f4f5'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                            <Bar dataKey="value" fill="#18181b" radius={[0, 4, 4, 0]}>
                              {Object.entries(qSummary.distribution).map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    ) : qSummary.average !== undefined ? (
                      <div className="text-center py-4">
                        <div className="text-4xl font-bold text-zinc-900 mb-2">{qSummary.average} <span className="text-lg text-zinc-400 font-normal">/ 5</span></div>
                        <div className="text-sm text-zinc-500">Average Rating</div>
                      </div>
                    ) : (
                      <div className="text-zinc-500 text-sm">
                        {qSummary.count} answers. See individual responses for text content.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex overflow-hidden">
            {/* List of responses */}
            <div className="w-80 border-r bg-white overflow-y-auto shrink-0">
              {responses.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 text-sm">No responses yet.</div>
              ) : (
                responses.map((res, i) => (
                  <div 
                    key={res.id} 
                    className={`p-4 border-b cursor-pointer hover:bg-zinc-50 transition-colors ${selectedResponse?.id === res.id ? 'bg-zinc-50 border-l-4 border-l-zinc-900' : 'border-l-4 border-l-transparent'}`}
                    onClick={() => setSelectedResponse(res)}
                  >
                    <div className="font-medium mb-1">Response #{responses.length - i}</div>
                    <div className="text-xs text-zinc-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(res.submitted_at).toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Single response details */}
            <div className="flex-1 overflow-y-auto p-8 bg-zinc-50">
              {selectedResponse ? (
                <div className="max-w-3xl mx-auto space-y-6">
                  <div className="bg-white p-6 rounded-xl border shadow-sm mb-6 flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-medium">Response Details</h2>
                      <p className="text-zinc-500 text-sm mt-1">Submitted at {new Date(selectedResponse.submitted_at).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  {form.questions.map((q, idx) => {
                    const ans = selectedResponse.answers.find(a => a.question_id === q.id);
                    return (
                      <div key={q.id} className="bg-white p-6 rounded-xl border shadow-sm">
                        <div className="flex items-start gap-3 mb-2">
                          <span className="font-medium text-zinc-400">{idx + 1}</span>
                          <h3 className="font-medium text-zinc-700">{q.title}</h3>
                        </div>
                        <div className="pl-6 text-lg">
                          {ans?.value ? (
                            <span className="font-medium">{ans.value}</span>
                          ) : (
                            <span className="text-zinc-400 italic">No answer provided</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-zinc-400">
                  <BarChart3 className="w-12 h-12 mb-4 opacity-50" />
                  <p>Select a response from the list to view details.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
