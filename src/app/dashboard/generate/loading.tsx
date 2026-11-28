export default function GenerateLoading() {
  return (
    <div className="min-h-screen bg-[#F8F8FC]">
      <div className="mx-auto max-w-3xl px-4 py-5 sm:px-6 sm:py-6">
        <div className="h-4 w-40 rounded bg-slate-200 animate-pulse mb-6" />
        
        <div className="mb-6 flex items-start justify-between gap-4 animate-pulse">
          <div className="space-y-2 flex-1">
            <div className="h-6 w-48 rounded bg-slate-200" />
            <div className="h-3 w-72 rounded bg-slate-100" />
          </div>
          <div className="h-8 w-24 rounded-full bg-slate-100" />
        </div>

        <div className="mb-5 h-32 rounded-2xl border border-slate-200 bg-white animate-pulse" />
        <div className="mb-5 h-12 rounded-xl bg-slate-100 animate-pulse" />

        <div className="mb-5 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="space-y-4 animate-pulse">
            <div className="h-4 w-1/3 rounded bg-slate-200" />
            <div className="h-10 rounded-lg bg-slate-100" />
            <div className="h-4 w-1/4 rounded bg-slate-200" />
            <div className="h-24 rounded-lg bg-slate-100" />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 animate-pulse">
          <div className="h-9 w-24 rounded-full bg-slate-100" />
          <div className="h-9 w-32 rounded-full bg-slate-100" />
        </div>
      </div>
    </div>
  );
}