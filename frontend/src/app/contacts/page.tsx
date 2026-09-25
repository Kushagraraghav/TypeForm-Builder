"use client";

import { useEffect, useState } from "react";
import { contactApi } from "@/lib/api";
import { ArrowLeft, Users, Search, Mail, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";

export default function ContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateListModalOpen, setIsCreateListModalOpen] = useState(false);
  const [listName, setListName] = useState("");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const router = useRouter();
  const { addToast } = useToast();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const data = await contactApi.getContacts();
        setContacts(data);
      } catch (error) {
        addToast("Failed to load contacts", "error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchContacts();
  }, [addToast]);

  return (
    <div className="h-screen bg-zinc-50 flex flex-col font-sans">
      <header className="h-16 border-b bg-white flex items-center justify-between px-6 shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/dashboard')}
            className="p-2 hover:bg-zinc-100 rounded-md transition-colors text-zinc-500"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-zinc-400" />
            <h1 className="text-xl font-medium text-zinc-800">Contacts CRM</h1>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-light text-zinc-900 mb-2">Audience</h2>
              <p className="text-zinc-500">Manage everyone who has interacted with your forms.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input 
                  type="text" 
                  placeholder="Search emails..." 
                  className="pl-9 pr-4 py-2 bg-white border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all w-64 shadow-sm"
                />
              </div>
              <button 
                onClick={() => setIsCreateListModalOpen(true)}
                className="bg-zinc-900 text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-zinc-800 transition-colors"
              >
                Create list
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50/50">
                  <th className="px-6 py-4 text-sm font-medium text-zinc-500">Email Address</th>
                  <th className="px-6 py-4 text-sm font-medium text-zinc-500">First Seen</th>
                  <th className="px-6 py-4 text-sm font-medium text-zinc-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-zinc-500">
                      Loading contacts...
                    </td>
                  </tr>
                ) : contacts.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-zinc-500">
                      <Users className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                      <p className="text-lg font-medium text-zinc-900 mb-1">No contacts yet</p>
                      <p>When respondents answer an EMAIL question, they will appear here.</p>
                    </td>
                  </tr>
                ) : (
                  contacts.map((contact) => (
                    <tr key={contact.id} className="hover:bg-zinc-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-500 font-medium">
                            {contact.email.charAt(0).toUpperCase()}
                          </div>
                          <div className="font-medium text-zinc-900 flex items-center gap-2">
                            <Mail className="w-4 h-4 text-zinc-400" />
                            {contact.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-zinc-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-zinc-400" />
                          {new Date(contact.first_seen_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-sm font-medium text-zinc-400 hover:text-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity">
                          View profile
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isCreateListModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col">
            <div className="p-6 pb-2 relative">
              <button 
                onClick={() => setIsCreateListModalOpen(false)}
                className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
              <h2 className="text-2xl font-light text-zinc-900 mb-1">Create list</h2>
              <p className="text-zinc-500 text-sm">Lists will update automatically as you get new responses.</p>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="mb-6">
                <label className="block text-sm font-medium text-zinc-700 mb-2">List name</label>
                <input 
                  type="text" 
                  value={listName}
                  onChange={(e) => setListName(e.target.value)}
                  placeholder="Enter a name for your list" 
                  className="w-full px-4 py-2 bg-white border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Filters</label>
                <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4">
                  {/* Active Filters */}
                  {activeFilters.length > 0 && (
                    <div className="flex flex-col gap-2 mb-4">
                      {activeFilters.map((filter, idx) => (
                        <div key={idx} className="bg-white border border-zinc-200 rounded-md p-3 flex justify-between items-center shadow-sm">
                          <span className="text-sm font-medium text-zinc-700">{filter}</span>
                          <span className="text-sm text-zinc-400">is any of</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {isFilterDropdownOpen && (
                    <div className="bg-white border border-zinc-200 rounded-lg shadow-sm mb-4 animate-in fade-in duration-200">
                      <div className="p-2 border-b flex items-center gap-2 text-sm text-zinc-500 bg-white rounded-t-lg">
                        <Search className="w-4 h-4 ml-1" />
                        <input type="text" placeholder="Type something" className="flex-1 focus:outline-none bg-transparent" />
                      </div>
                      <div className="max-h-64 overflow-y-auto py-1">
                        {[
                          { icon: "Clock", label: "Last change" },
                          { icon: "Filter", label: "Sources" },
                          { icon: "Mail", label: "Email" },
                          { icon: "Database", label: "Data enrichment" },
                          { icon: "User", label: "Name" },
                          { icon: "MessageSquare", label: "Email subscription status" },
                          { icon: "FileText", label: "Notes" },
                          { icon: "Phone", label: "Phone number" },
                          { icon: "Briefcase", label: "Job title" },
                          { icon: "Linkedin", label: "LinkedIn URL" }
                        ].map((item, idx) => (
                          <div 
                            key={idx} 
                            onClick={() => {
                              setActiveFilters([...activeFilters, item.label]);
                              setIsFilterDropdownOpen(false);
                            }}
                            className="flex items-center gap-3 px-3 py-2 hover:bg-zinc-50 cursor-pointer text-sm text-zinc-700"
                          >
                            <div className="w-6 h-6 rounded bg-zinc-100 flex items-center justify-center text-zinc-500">
                              <div className="w-3 h-3 bg-zinc-400 rounded-sm"></div>
                            </div>
                            {item.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {!isFilterDropdownOpen && (
                    <button 
                      onClick={() => setIsFilterDropdownOpen(true)}
                      className="mt-2 flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-zinc-600 transition-colors"
                    >
                      <span className="text-lg leading-none">+</span> Add filter
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 border-t bg-zinc-50/50 flex justify-end gap-3">
              <button 
                onClick={() => setIsCreateListModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-zinc-900 text-white rounded-md text-sm font-medium hover:bg-zinc-800 transition-colors">
                Create list
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
