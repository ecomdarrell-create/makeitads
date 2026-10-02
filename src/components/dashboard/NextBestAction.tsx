import Link from 'next/link';
import { Lightbulb } from 'lucide-react';

interface NextBestActionProps {
  data: {
    title: string;
    description: string;
    action: string;
    href: string;
    cost: number;
  };
}

export function NextBestAction({ data }: NextBestActionProps) {
  return (
    <div className="bg-[#F9FAFB] border border-gray-200 rounded-xl p-4 sm:p-5">
      <div className="flex items-start gap-2.5 sm:gap-3">
        <div className="p-1.5 sm:p-2 bg-indigo-100 rounded-lg text-[#6366F1] mt-0.5 flex-shrink-0">
          <Lightbulb className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xs sm:text-sm font-semibold text-[#111827] mb-1">{data.title}</h3>
          <p className="text-[10px] sm:text-xs text-gray-600 mb-2 sm:mb-3 leading-relaxed">{data.description}</p>
          
          <Link
            href={data.href}
            className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-[#6366F1] hover:text-[#5558e6] transition-colors"
          >
            {data.action}
            {data.cost > 0 && <span className="text-gray-400 font-normal">({data.cost} crédits)</span>}
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}