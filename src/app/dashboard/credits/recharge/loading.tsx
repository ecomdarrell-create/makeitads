export default function RechargeLoading() {
  return (
    <div className="min-h-screen bg-[#F8F8FC] py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 animate-pulse space-y-3">
          <div className="h-6 w-48 rounded bg-slate-200" />
          <div className="h-4 w-72 rounded bg-slate-100" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="h-48 rounded-2xl border border-slate-200 bg-white animate-pulse" />
          <div className="h-48 rounded-2xl border border-slate-200 bg-white animate-pulse" />
          <div className="h-48 rounded-2xl border border-slate-200 bg-white animate-pulse" />
        </div>
      </div>
    </div>
  );
}