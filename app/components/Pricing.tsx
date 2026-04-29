import { SparkleIcon, WarningIcon } from "./icons";
import { Reveal } from "./Reveal";

type ValueRow = { label: string; value: string; highlight?: boolean; original?: string };

const valueRows: ValueRow[] = [
  { label: "75-min live session & Q&A", value: "₹999" },
  { label: '"How We Use AI to Run Our Business" ebook', value: "₹799" },
  { label: "WhatsApp community access", value: "Free" },
];

export function Pricing() {
  return (
    <section
      id="pricing"
      className="border-y border-hairline bg-white py-18 md:py-24"
    >
      <div className="mx-auto w-full max-w-[1120px] px-5 sm:px-6">
        <Reveal className="mx-auto mb-12 max-w-[720px] text-center md:mb-14">
          <span className="mb-4 inline-block text-[12.5px] font-bold uppercase tracking-[0.14em] text-teal">
            Pricing
          </span>
          <h2 className="m-0 font-serif font-semibold leading-[1.08] tracking-[-0.005em] text-balance text-navy text-[clamp(32px,4.5vw,52px)]">
            Early Bird offer — for a limited time
          </h2>
        </Reveal>

        <div className="flex justify-center">
          <Reveal className="w-full max-w-[520px]">
            <div className="relative w-full overflow-hidden rounded-[20px] border border-hairline bg-white p-7 shadow-brand-md transition duration-300 hover:-translate-y-1 hover:shadow-brand-lg sm:p-8 md:p-11">
              <span className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal to-amber" />

              <span className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-amber/15 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-[#a06b00]">
                <span className="h-1.5 w-1.5 rounded-full bg-amber" />
                Early Bird
              </span>

              <div className="mb-4 flex items-baseline gap-3.5">
                <span className="text-xl font-medium text-muted line-through decoration-[1.5px]">
                  ₹999
                </span>
                <span className="font-serif text-[52px] font-semibold leading-none tracking-[-0.01em] text-navy sm:text-[64px]">
                  ₹499
                </span>
                <span className="text-sm font-medium text-muted">/ seat</span>
              </div>

              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-whatsapp/10 px-3.5 py-2 text-[13.5px] font-semibold text-[#0e7a3c]">
                <SparkleIcon className="h-3.5 w-3.5" />
                You save ₹500 — 50% off
              </div>

              <div className="flex items-start gap-3 rounded-lg border border-amber/35 bg-amber/10 px-4 py-3.5 text-[13.5px] leading-[1.5] text-[#6b4a00]">
                <WarningIcon className="mt-px h-[18px] w-[18px] flex-shrink-0 text-amber" />
                <span>
                  <strong className="font-bold text-[#4d3500]">Heads up:</strong>{" "}
                  price goes back to ₹999 as soon as early bird seats are
                  filled. Lock in your spot while it lasts.
                </span>
              </div>

              <div className="mt-8 rounded-[14px] border border-dashed border-teal/35 bg-teal/5 px-5 py-4">
                <p className="m-0 mb-2.5 text-xs font-bold uppercase tracking-[0.14em] text-teal">
                  What&apos;s included
                </p>
                <ul className="m-0 grid list-none gap-2 p-0 text-[14.5px]">
                  {valueRows.map((row) => (
                    <li
                      key={row.label}
                      className="flex justify-between gap-4 text-body"
                    >
                      <span>{row.label}</span>
                      <strong className="font-semibold text-navy">
                        {row.value}
                      </strong>
                    </li>
                  ))}
                  <li className="mt-1 flex justify-between gap-4 border-t border-teal/25 pt-2.5 font-semibold text-body">
                    <span>Total value</span>
                    <strong className="text-base font-semibold text-teal">
                      <span className="mr-1.5 font-medium text-muted line-through">
                        ₹1798
                      </span>
                      ₹499
                    </strong>
                  </li>
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
