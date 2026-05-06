export default function Header() {
  return (
    // sticky + top-0 + z-10: header stays visible while the page scrolls.
    // shadow-sm gives a subtle depth cue that separates it from the content.
    <header className="sticky top-0 z-10 w-full bg-white shadow-sm">
      <div className="mx-auto max-w-6xl px-6 py-4 text-center">
        Finance Product Explorer
      </div>
    </header>
  );
}
