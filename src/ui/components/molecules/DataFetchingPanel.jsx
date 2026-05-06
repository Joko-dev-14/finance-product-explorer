// DataFetchingPanel is a Server Component.
// It receives pre-computed metadata as props from the parent Server Component
// (app/page.jsx) — no client-side fetch needed here.
//
// This component exists purely to make the data-fetching architecture
// visible in the UI, which is useful for demonstrations and learning.

export default function DataFetchingPanel({ meta }) {
  const fetchedAt = new Date(meta.fetchedAt);

  const strategies = [
    {
      label: "Home page",
      strategy: "Server Component",
      detail: "Fetched on the server at request time. Credentials stay server-side.",
      color: "bg-green-100 text-green-800",
      tag: "RSC",
    },
    {
      label: "Search bar",
      strategy: "Client fetch → Route Handler",
      detail: "useEffect + fetch() calls /api/search. Debounced at 300ms.",
      color: "bg-blue-100 text-blue-800",
      tag: "CSR",
    },
    {
      label: "Product pages",
      strategy: "generateStaticParams (SSG)",
      detail: "Pre-rendered at build time. Dynamic slugs via [slug] segment.",
      color: "bg-purple-100 text-purple-800",
      tag: "SSG",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 pb-6">
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
            Data Fetching Architecture
          </h2>
          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-500">
            {meta.total} products · {meta.categories} categories · {meta.fetchDuration}ms
          </span>
        </div>

        {/* Strategy cards */}
        <div className="mb-4 grid gap-3 sm:grid-cols-3">
          {strategies.map((s) => (
            <div key={s.label} className="rounded-xl border border-gray-100 bg-gray-50 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-700">{s.label}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${s.color}`}>
                  {s.tag}
                </span>
              </div>
              <p className="mb-1 text-xs font-semibold text-gray-800">{s.strategy}</p>
              <p className="text-[11px] leading-relaxed text-gray-500">{s.detail}</p>
            </div>
          ))}
        </div>

        {/* Live fetch metadata */}
        <div className="flex flex-wrap gap-x-6 gap-y-1 border-t border-gray-100 pt-3 text-[11px] text-gray-500">
          <span>
            <span className="font-medium text-gray-700">Cache strategy:</span>{" "}
            {meta.cacheStrategy}
          </span>
          <span>
            <span className="font-medium text-gray-700">Last fetched:</span>{" "}
            {fetchedAt.toLocaleTimeString()} on {fetchedAt.toLocaleDateString()}
          </span>
          <span>
            <span className="font-medium text-gray-700">Source:</span> Contentful CMS
          </span>
        </div>
      </div>
    </div>
  );
}
