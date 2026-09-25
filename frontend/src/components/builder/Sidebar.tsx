"use client";

import { Question } from "@/lib/types";
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, Trash2, FileText, AlignLeft, List, ChevronDown, Mail, Hash, CheckSquare, Star } from "lucide-react";
import { useState } from "react";

const getIcon = (type: string) => {
  switch (type) {
    case 'SHORT_TEXT': return <FileText className="w-4 h-4" />;
    case 'LONG_TEXT': return <AlignLeft className="w-4 h-4" />;
    case 'MULTIPLE_CHOICE': return <List className="w-4 h-4" />;
    case 'DROPDOWN': return <ChevronDown className="w-4 h-4" />;
    case 'EMAIL': return <Mail className="w-4 h-4" />;
    case 'NUMBER': return <Hash className="w-4 h-4" />;
    case 'YES_NO': return <CheckSquare className="w-4 h-4" />;
    case 'RATING': return <Star className="w-4 h-4" />;
    default: return <FileText className="w-4 h-4" />;
  }
};

const SortableQuestion = ({ question, selected, onSelect, onDelete, onDuplicate, index }: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    position: 'relative' as any,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={`group flex items-center p-2 mx-2 my-1 rounded-md cursor-pointer transition-colors ${
        selected ? 'bg-zinc-100 ring-1 ring-zinc-200' : 'hover:bg-zinc-50'
      } ${isDragging ? 'opacity-50 shadow-md' : ''}`}
      onClick={() => onSelect(question.id)}
    >
      <div 
        {...attributes} 
        {...listeners}
        className="p-1 mr-1 text-zinc-400 hover:text-zinc-600 cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="w-4 h-4" />
      </div>
      <div className="w-5 h-5 flex items-center justify-center bg-zinc-200 text-zinc-600 rounded text-xs font-medium mr-2 shrink-0">
        {index + 1}
      </div>
      <div className="mr-2 text-zinc-500 shrink-0">
        {getIcon(question.type)}
      </div>
      <div className="flex-1 truncate text-sm font-medium text-zinc-700">
        {question.title || "..."}
      </div>
      <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={(e) => { e.stopPropagation(); onDuplicate(question.id); }}
          className="p-1 text-zinc-400 hover:text-zinc-600 mr-1"
          title="Duplicate"
        >
          <FileText className="w-4 h-4" />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(question.id); }}
          className="p-1 text-zinc-400 hover:text-red-500"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default function Sidebar({ 
  questions, 
  selectedId, 
  onSelect, 
  onAdd, 
  onDelete,
  onDuplicate,
  onReorder,
  activeTab,
  setActiveTab
}: { 
  questions: Question[], 
  selectedId: number | null, 
  onSelect: (id: number) => void,
  onAdd: (type: Question['type']) => void,
  onDelete: (id: number) => void,
  onDuplicate: (id: number) => void,
  onReorder: (questions: Question[]) => void,
  activeTab: 'CONTENT' | 'LOGIC' | 'DESIGN',
  setActiveTab: (tab: 'CONTENT' | 'LOGIC' | 'DESIGN') => void
}) {
  const [showAddMenu, setShowAddMenu] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = questions.findIndex((q) => q.id === active.id);
      const newIndex = questions.findIndex((q) => q.id === over.id);
      
      const reordered = arrayMove(questions, oldIndex, newIndex);
      onReorder(reordered);
    }
  };

  const addTypes: {type: Question['type'], label: string}[] = [
    { type: 'SHORT_TEXT', label: 'Short Text' },
    { type: 'LONG_TEXT', label: 'Long Text' },
    { type: 'MULTIPLE_CHOICE', label: 'Multiple Choice' },
    { type: 'DROPDOWN', label: 'Dropdown' },
    { type: 'EMAIL', label: 'Email' },
    { type: 'NUMBER', label: 'Number' },
    { type: 'YES_NO', label: 'Yes/No' },
    { type: 'RATING', label: 'Rating' },
  ];

  return (
    <div className="w-72 bg-white flex flex-col shrink-0 relative shadow-[1px_0_10px_rgba(0,0,0,0.05)] z-10 border-r border-zinc-200">
      <div className="flex border-b border-zinc-200 bg-zinc-50/50 p-2 gap-1">
        <button onClick={() => setActiveTab('CONTENT')} className={`flex-1 text-xs font-medium py-1.5 rounded transition-all ${activeTab === 'CONTENT' ? 'bg-white shadow-sm border border-zinc-200 text-zinc-900 font-semibold' : 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100'}`}>Content</button>
        <button onClick={() => setActiveTab('LOGIC')} className={`flex-1 text-xs font-medium py-1.5 rounded transition-all ${activeTab === 'LOGIC' ? 'bg-white shadow-sm border border-zinc-200 text-zinc-900 font-semibold' : 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100'}`}>Logic</button>
        <button onClick={() => setActiveTab('DESIGN')} className={`flex-1 text-xs font-medium py-1.5 rounded transition-all ${activeTab === 'DESIGN' ? 'bg-white shadow-sm border border-zinc-200 text-zinc-900 font-semibold' : 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100'}`}>Design</button>
      </div>
      
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={questions.map(q => q.id)}
            strategy={verticalListSortingStrategy}
          >
            {questions.map((q, idx) => (
              <SortableQuestion
                key={q.id}
                question={q}
                index={idx}
                selected={selectedId === q.id}
                onSelect={onSelect}
                onDelete={onDelete}
                onDuplicate={onDuplicate}
              />
            ))}
          </SortableContext>
        </DndContext>
        
        {questions.length === 0 && (
          <div className="text-center p-8 text-sm text-zinc-500">
            No questions yet.
          </div>
        )}
      </div>

      <div className="p-4 bg-zinc-50 border-t border-zinc-100 relative">
        <button 
          onClick={() => setShowAddMenu(!showAddMenu)}
          className="w-full flex items-center justify-center gap-2 bg-zinc-900 text-white py-2.5 rounded hover:bg-zinc-800 transition-colors text-sm font-medium shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add new question
        </button>

        {showAddMenu && (
          <div className="absolute bottom-[calc(100%+8px)] left-4 right-4 bg-white border border-zinc-200 rounded-lg shadow-xl overflow-hidden z-20">
            <div className="bg-zinc-50 px-3 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider border-b border-zinc-100">
              Question Types
            </div>
            <div className="max-h-64 overflow-y-auto py-1">
              {addTypes.map((t) => (
                <button
                  key={t.type}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-zinc-100 text-sm text-left text-zinc-700 font-medium transition-colors"
                  onClick={() => {
                    onAdd(t.type);
                    setShowAddMenu(false);
                  }}
                >
                  <span className="text-zinc-400 bg-white p-1 rounded border border-zinc-200 shadow-sm">{getIcon(t.type)}</span>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
