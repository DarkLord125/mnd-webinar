import Image from "next/image";
import { Reveal } from "./Reveal";

const perks = [
  "40+ pages of real workflows, prompts & tool stacks we use daily",
  "Copy-paste prompt templates for writing, research, and planning",
  "Normally shared only with our clients — free for this cohort",
];

export function BonusEbook() {
  return (
    <section id="bonus" className="py-16 md:py-18">
      <div className="mx-auto w-full max-w-[1120px] px-5 sm:px-6">
        <Reveal>
          <div className="bonus-glow group relative grid grid-cols-1 items-center gap-10 overflow-hidden rounded-[28px] bg-gradient-to-br from-[#022437] via-navy to-navy-3 p-8 text-white sm:p-10 md:grid-cols-[minmax(240px,340px)_1fr] md:gap-14 md:p-14">
            <a
              href="#register"
              className="relative mx-auto block max-w-[260px] origin-center -rotate-4 overflow-hidden rounded-lg shadow-[0_30px_60px_-20px_rgba(0,0,0,0.5),0_12px_24px_-8px_rgba(0,0,0,0.3)] transition duration-500 group-hover:-translate-y-1 group-hover:-rotate-2 md:max-w-none"
            >
              <Image
                src="/assets/ebook-cover.png"
                alt="How We Use AI to Run Our Business — ebook cover"
                width={680}
                height={880}
                className="block w-full"
              />
            </a>

            <div className="relative">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber/35 bg-amber/15 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.1em] text-amber">
                <span className="h-1.5 w-1.5 rounded-full bg-amber shadow-[0_0_0_4px_rgba(255,185,21,0.2)]" />
                Free bonus · Yours to keep
              </span>

              <h2 className="m-0 mb-3.5 font-serif font-semibold leading-[1.08] text-white text-[clamp(28px,3.8vw,44px)]">
                Plus our{" "}
                <em className="font-medium not-italic italic text-amber">
                  full AI playbook
                </em>{" "}
                — free with your seat.
              </h2>

              <p className="m-0 mb-5 max-w-[520px] text-base leading-[1.6] text-white/75 sm:text-[16.5px]">
                Every registered attendee gets access to{" "}
                <strong className="text-white">
                  &ldquo;How We Use AI to Run Our Business&rdquo;
                </strong>{" "}
                — the same internal guide our team uses —{" "}
                <strong className="text-white">
                  delivered to your WhatsApp/Email right after the live session
                  ends
                </strong>
                . No fluff, no BS, just the exact workflows that save us hours
                every week.
              </p>

              <ul className="m-0 grid list-none gap-2.5 p-0">
                {perks.map((perk) => (
                  <li
                    key={perk}
                    className="bonus-bullet flex items-start gap-3 text-[14.5px] text-white/85"
                  >
                    {perk}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
