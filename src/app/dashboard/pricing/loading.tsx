export default function PricingLoading() {
  return (
    <div className="min-h-screen bg-[#F8F8FC] px-4 py-5 sm:px-6 sm:py-6">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6 space-y-2">
          <div className="h-6 w-64 animate-pulse rounded bg-slate-100" />
          <div className="h-3 w-80 animate-pulse rounded bg-slate-100" />
        </div>

        {/* Plans skeleton */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-56 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
      </div>
    </div>
  );
}