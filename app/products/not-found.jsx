import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto mt-24 max-w-md px-6 text-center">
      <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
        <div className="mb-4 text-4xl">🔍</div>
        <h2 className="mb-2 text-lg font-semibold text-gray-800">Product not found</h2>
        <p className="mb-6 text-sm text-gray-500">
          That product doesn't exist or may have been removed from Contentful.
        </p>
        <Link
          href="/"
          className="rounded-lg bg-[#78e3df] px-6 py-2.5 text-sm font-medium text-gray-800 transition-opacity hover:opacity-70"
        >
          Back to all products
        </Link>
      </div>
    </div>
  );
}
