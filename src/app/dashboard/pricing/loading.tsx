export default function PricingLoading() {
  return (
    <div className="min-h-screen bg-[#F8F8FC] py-10 md:py-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 animate-pulse space-y-3">
          <div className="h-8 w-64 rounded bg-slate-200" />
          <div className="h-4 w-96 rounded bg-slate-100" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          <div className="h-[400px] rounded-2xl border border-slate-200 bg-white animate-pulse" />
          <div className="h-[400px] rounded-2xl border border-slate-200 bg-white animate-pulse" />
          <div className="md:col-span-2 h-[200px] rounded-2xl border border-slate-200 bg-white animate-pulse" />
        </div>
      </div>
    </div>
  );
}