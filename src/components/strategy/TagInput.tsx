"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

interface TagInputProps {
  label: string;
  tags: string[];
  onAdd: (tag: string) => void;
  onRemove: (index: number) => void;
  placeholder?: string;
  required?: boolean;
  helpText?: string;
}

export default function TagInput({
  label,
  tags,
  onAdd,
  onRemove,
  placeholder = "Type and press Enter...",
  required = false,
  helpText,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    if (inputValue.trim() && !tags.includes(inputValue.trim())) {
      onAdd(inputValue.trim());
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="mb-6">
      <label className="text-sm font-bold text-white mb-3 block">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white outline-none focus:border-[#6366f1] transition-colors"
        />
        <button
          onClick={handleAdd}
          disabled={!inputValue.trim()}
          className="rounded-lg bg-[#6366f1] px-4 py-2 text-white hover:bg-[#5558e6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <div
              key={index}
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 group hover:border-[#6366f1]/30 transition-colors"
            >
              <span className="text-sm text-white">{tag}</span>
              <button
                onClick={() => onRemove(index)}
                className="text-slate-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {helpText && <p className="text-xs text-slate-500 mt-2">{helpText}</p>}
    </div>
  );
}