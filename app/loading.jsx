// app/loading.jsx — Next.js App Router convention.
// This file is automatically shown by Next.js while the async Page component
// (which fetches from Contentful) is resolving. It uses React Suspense under
// the hood, so there's no manual state management needed.

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-6 pt-12">
      {/* Header nav skeleton */}
      <div className="mb-8 mt-8 flex items-center justify-center gap-6">
        <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
        <div className="h-6 w-40 animate-pulse rounded bg-gray-200" />
        <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
      </div>

      {/* Three-card carousel skeleton — desktop */}
      <div className="hidden gap-4 md:flex">
        {/* Inactive card left */}
        <div className="flex-1 animate-pulse rounded-xl bg-gray-300 p-5 opacity-60">
          <div className="mx-auto mb-4 h-5 w-24 rounded bg-gray-400" />
        </div>

        {/* Active card centre — taller to reflect expanded state */}
        <div className="flex-[2] animate-pulse rounded-xl bg-gray-400 p-5">
          <div className="mx-auto mb-6 h-5 w-32 rounded bg-gray-500" />
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="mb-2 h-12 rounded-lg bg-gray-500 opacity-70"
            />
          ))}
        </div>

        {/* Inactive card right */}
        <div className="flex-1 animate-pulse rounded-xl bg-gray-300 p-5 opacity-60">
          <div className="mx-auto mb-4 h-5 w-24 rounded bg-gray-400" />
        </div>
      </div>

      {/* Single-card skeleton — mobile */}
      <div className="flex md:hidden">
        <div className="w-full animate-pulse rounded-xl bg-gray-400 p-5">
          <div className="mx-auto mb-6 h-5 w-32 rounded bg-gray-500" />
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="mb-2 h-12 rounded-lg bg-gray-500 opacity-70"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
