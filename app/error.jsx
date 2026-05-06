"use client";
// app/error.jsx — Next.js App Router error boundary convention.
// Must be a Client Component ("use client") because it receives the `reset`
// function as a prop and needs to attach it to a click handler.
//
// Next.js automatically wraps each route segment in an error boundary.
// If the async Page (or any Server Component it renders) throws — for example
// because Contentful is down or the API token is wrong — Next.js catches the
// error and renders this file instead of a blank screen.
//
// Props provided by Next.js:
//   error  — the Error object that was thrown (includes error.message)
//   reset  — a function that re-renders the segment, retrying the fetch

export default function Error({ error, reset }) {
  return (
    <div className="mx-auto mt-24 max-w-md px-6 text-center">
      <div className="rounded-xl border border-red-100 bg-white p-8 shadow-sm">
        {/* Icon */}
        <div className="mb-4 text-4xl">⚠️</div>

        <h2 className="mb-2 text-lg font-semibold text-gray-800">
          Something went wrong
        </h2>

        <p className="mb-6 text-sm text-gray-500">
          {/* Show the real error message in development; keep it vague in
              production to avoid leaking implementation details. */}
          {process.env.NODE_ENV === "development"
            ? error?.message ?? "An unexpected error occurred."
            : "We couldn't load the products. Please try again."}
        </p>

        <button
          onClick={reset}
          className="rounded-lg bg-[#78e3df] px-6 py-2.5 text-sm font-medium text-gray-800 transition-opacity hover:opacity-70"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
