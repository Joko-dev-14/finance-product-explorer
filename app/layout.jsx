import "./globals.css";
import { Inter } from "next/font/google";
import Header from "../src/ui/components/organisms/Header";

// next/font automatically self-hosts the font and eliminates the extra
// network round-trip to Google Fonts, improving CLS and privacy.
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// Next.js Metadata API — replaces any manual <title> / <meta> tags.
// Defined once in the root layout and inherited by every page.
export const metadata = {
  title: {
    default: "Moneybox Products",
    // Page-level layouts / pages can override just the segment:
    // e.g. title: "ISAs" renders as "ISAs | Moneybox Products"
    template: "%s | Moneybox Products",
  },
  description: "Explore all Moneybox savings and investment products",
  // Open Graph gives social platforms a rich preview when the URL is shared.
  openGraph: {
    title: "Moneybox Products",
    description: "Explore all Moneybox savings and investment products",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      {/*
        suppressHydrationWarning is required when browser extensions
        (e.g. password managers) inject extra attributes into <body>
        that cause a React hydration mismatch.
      */}
      <body suppressHydrationWarning className="min-h-screen bg-gray-100">
        {/* Accessibility: lets keyboard users jump past the nav to content */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        <Header />

        {/*
          id="main-content" is the target of the skip link above.
          The <main> landmark also helps screen readers understand page structure.
        */}
        <main id="main-content">{children}</main>
      </body>
    </html>
  );
}
