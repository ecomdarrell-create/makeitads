'use client';

import { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface TooltipProps {
  text: string;
}

export function Tooltip({ text }: TooltipProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow(!show)}
        className="text-gray-400 hover:text-[#6366F1] transition-colors"
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>

      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-[10px] rounded-lg z-50 max-w-[200px] whitespace-normal">
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
}