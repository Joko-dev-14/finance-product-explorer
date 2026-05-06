// Header is a Server Component — it has no state or browser APIs,
// so there is no need for "use client". Keeping it server-only means
// it is never shipped in the client JS bundle, saving bytes.
import Image from "next/image";

export default function Header() {
  return (
    // sticky + top-0 + z-10: header stays visible while the page scrolls.
    // shadow-sm gives a subtle depth cue that separates it from the content.
    <header className="sticky top-0 z-10 w-full bg-white shadow-sm">
      <div className="mx-auto max-w-6xl px-6 py-4 text-center">
        {/*
          next/image replaces plain <img> tags. Benefits:
          - Automatic WebP / AVIF conversion for modern browsers
          - Lazy-loads images below the fold by default
          - Reserves layout space upfront (width + height) so the page
            doesn't shift when the image loads (avoids CLS)
          - priority prop on above-the-fold images disables lazy-load
            and adds a <link rel="preload"> for faster LCP
        */}
        <Image
          src="/moneybox_logo.png"
          alt="Moneybox"
          width={162}
          height={40}
          priority
          className="inline-block"
        />
      </div>
    </header>
  );
}
