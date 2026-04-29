import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function WhatsAppIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M16.003 3C8.82 3 3 8.82 3 16c0 2.293.6 4.448 1.65 6.318L3 29l6.86-1.624A12.93 12.93 0 0 0 16.003 29C23.18 29 29 23.18 29 16S23.18 3 16.003 3Zm0 23.4a10.36 10.36 0 0 1-5.276-1.45l-.378-.225-3.97.94.94-3.866-.246-.4A10.34 10.34 0 0 1 5.6 16c0-5.74 4.66-10.4 10.4-10.4 5.74 0 10.4 4.66 10.4 10.4 0 5.74-4.66 10.4-10.4 10.4Zm5.71-7.78c-.31-.156-1.84-.91-2.126-1.014-.286-.105-.495-.156-.703.156-.21.31-.808 1.014-.99 1.222-.183.21-.365.234-.677.078-.31-.156-1.317-.485-2.508-1.547-.926-.825-1.553-1.844-1.736-2.156-.183-.31-.02-.48.137-.635.14-.14.31-.365.467-.547.156-.183.21-.31.31-.52.105-.21.052-.39-.026-.547-.078-.156-.703-1.69-.964-2.314-.254-.61-.512-.527-.703-.537-.182-.01-.39-.012-.6-.012-.21 0-.547.078-.834.39-.286.31-1.094 1.07-1.094 2.61 0 1.54 1.12 3.027 1.276 3.236.156.21 2.207 3.37 5.348 4.726.747.323 1.33.516 1.785.66.75.24 1.433.206 1.973.125.602-.09 1.84-.752 2.1-1.48.26-.728.26-1.353.183-1.482-.078-.13-.286-.21-.598-.365Z" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <polyline points="5 12 10 17 19 8" />
    </svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export function LockIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden="true"
      {...props}
    >
      <rect x={3} y={11} width={18} height={11} rx={2} />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export function SparkleIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}

export function WarningIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1={12} y1={9} x2={12} y2={13} />
      <line x1={12} y1={17} x2={12.01} y2={17} />
    </svg>
  );
}

export function TargetIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx={12} cy={12} r={9} />
      <circle cx={12} cy={12} r={3} fill="currentColor" />
    </svg>
  );
}
