"use client";

import { useState } from "react";

interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "email" | "url" | "textarea";
  rows?: number;
  required?: boolean;
  helpText?: string;
}

export default function TextInput({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  rows = 4,
  required = false,
  helpText,
}: TextInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const baseClasses = "w-full rounded-xl border bg-white/5 px-6 py-4 text-white outline-none transition-all resize-none";
  const borderClasses = isFocused 
    ? "border-[#6366f1] ring-4 ring-[#6366f1]/10" 
    : value.trim() 
    ? "border-emerald-500/50" 
    : "border-white/10";

  if (type === "textarea") {
    return (
      <div className="mb-6">
        <label className="text-sm font-bold text-white mb-3 block">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          rows={rows}
          className={`${baseClasses} ${borderClasses}`}
        />
        {helpText && <p className="text-xs text-slate-500 mt-2">{helpText}</p>}
      </div>
    );
  }

  return (
    <div className="mb-6">
      <label className="text-sm font-bold text-white mb-3 block">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className={`${baseClasses} ${borderClasses}`}
      />
      {helpText && <p className="text-xs text-slate-500 mt-2">{helpText}</p>}
    </div>
  );
}