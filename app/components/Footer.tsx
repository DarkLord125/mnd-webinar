export function Footer() {
  return (
    <footer className="bg-navy py-10 text-[13px] text-white/50">
      <div className="mx-auto flex w-full max-w-[1120px] flex-wrap items-center justify-between gap-5 px-5 sm:px-6">
        <span>© 2026 MyNextDeveloper. All rights reserved.</span>
        <a
          href="https://mynextdeveloper.com"
          target="_blank"
          rel="noopener"
          className="border-b border-white/15 text-white/75 transition hover:border-amber hover:text-amber"
        >
          Website
        </a>
      </div>
    </footer>
  );
}
