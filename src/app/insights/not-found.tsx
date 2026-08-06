import Link from "next/link";
import { ArrowLeft, FileX } from "lucide-react";
import GlobalNavbar from "@/components/shared/GlobalNavbar";
import GlobalFooter from "@/components/shared/GlobalFooter";

export default function InsightsNotFound() {
  return (
    <div className="min-h-screen bg-[#FAFAFC] flex flex-col">
      <GlobalNavbar />
      
      <main className="flex-grow flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-md mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50 mb-6">
            <FileX className="h-10 w-10 text-red-500" />
          </div>
          
          <h1 className="text-3xl font-bold text-[#111827] mb-3">Article not found</h1>
          <p className="text-[#64748B] mb-8 leading-relaxed">
            The article you're looking for may have been moved or deleted.
          </p>
          
          <Link 
            href="/insights"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#6366f1] text-white rounded-xl font-semibold hover:bg-[#5558e6] hover:shadow-lg transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Insights
          </Link>
        </div>
      </main>

      <GlobalFooter />
    </div>
  );
}