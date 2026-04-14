import "./globals.css";
import Header from "../src/ui/components/organisms/Header";

export const metadata = {
  title: "Moneybox Products",
  description: "Explore all Moneybox products",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Header />
        <main id="main-content">{children}</main>
      </body>
    </html>
  );
}
