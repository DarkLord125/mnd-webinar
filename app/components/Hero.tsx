import { TargetIcon } from "./icons";

export function Hero() {
  return (
    <header className="hero-glow relative overflow-hidden bg-navy py-16 text-white sm:py-20 md:py-[88px] md:pb-[104px]">
      <div className="hero-grid" />
      <div className="relative mx-auto w-full max-w-[1120px] px-5 text-center sm:px-6">
        <span className="fade-up inline-flex items-center gap-2.5 rounded-full border border-amber/35 bg-white/5 px-4 py-2 text-[13px] font-medium tracking-[0.01em] text-[#ffd98a] backdrop-blur">
          <span className="pulse-dot" />
          Only a few seats remaining — Early Bird closes soon
        </span>

        <h1
          className="fade-up d1 mx-auto mt-6 mb-5 font-serif font-semibold leading-[1.02] tracking-[-0.01em] text-balance text-white"
          style={{ fontSize: "clamp(40px, 7.2vw, 88px)" }}
        >
          AI for{" "}
          <span className="font-medium italic text-amber">Every Woman.</span>
          <br />
          Live. Free-thinking. For You.
        </h1>

        <p
          className="fade-up d2 mx-auto mb-7 max-w-[640px] leading-[1.6] text-white/75"
          style={{ fontSize: "clamp(16px, 1.5vw, 18.5px)" }}
        >
          A focused 75-minute live session where you&apos;ll learn to use
          today&apos;s most useful AI tools — confidently, practically, and on
          your own terms.
        </p>

        <div className="fade-up d3">
          <span className="inline-flex items-center gap-2.5 rounded-full bg-teal px-5 py-2.5 text-sm font-semibold tracking-[0.01em] text-white shadow-[0_10px_24px_-10px_rgba(34,159,189,0.6)]">
            <TargetIcon className="h-3.5 w-3.5" />
            Live Online Session
            <span className="font-normal opacity-55">·</span>
            Limited Seats
          </span>
        </div>

        <div className="fade-up d4 mt-8 flex flex-wrap justify-center gap-x-7 gap-y-3 text-[13px] text-white/60 sm:mt-11">
          <span className="inline-flex items-center gap-2">
            <strong className="font-semibold text-white">75 min</strong>
            live on Zoom
          </span>
          <span className="hidden h-1 w-1 self-center rounded-full bg-white/30 sm:inline-block" />
          <span className="inline-flex items-center gap-2">
            Beginner friendly —{" "}
            <strong className="font-semibold text-white">
              no tech background needed
            </strong>
          </span>
          <span className="hidden h-1 w-1 self-center rounded-full bg-white/30 sm:inline-block" />
          <span className="inline-flex items-center gap-2">
            Free access to our internal AI guide
          </span>
        </div>
      </div>
    </header>
  );
}
