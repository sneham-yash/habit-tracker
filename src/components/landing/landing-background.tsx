export function LandingBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden"
      aria-hidden
    >
      <div className="bg-primary/12 absolute -top-32 -left-32 h-96 w-96 rounded-full blur-3xl dark:bg-primary/6" />
      <div className="bg-primary/8 absolute top-1/4 -right-24 h-80 w-80 rounded-full blur-3xl dark:bg-primary/5" />
      <div className="bg-primary/6 absolute bottom-0 left-1/3 h-72 w-72 rounded-full blur-3xl dark:bg-primary/4" />

      <svg
        className="text-primary absolute top-16 -left-4 h-72 w-36 opacity-[0.07] dark:opacity-[0.11]"
        viewBox="0 0 120 220"
        fill="none"
      >
        <path
          d="M16 200 C36 160 28 110 40 72 C52 34 44 18 56 8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="3 7"
        />
        <circle cx="16" cy="200" r="3" fill="currentColor" />
        <circle cx="40" cy="72" r="2.5" fill="currentColor" />
        <circle cx="56" cy="8" r="2" fill="currentColor" />
      </svg>

      <svg
        className="text-primary absolute top-24 right-8 h-48 w-48 opacity-[0.06] dark:opacity-[0.09]"
        viewBox="0 0 160 160"
        fill="none"
      >
        <circle cx="120" cy="40" r="28" stroke="currentColor" strokeWidth="1" />
        <circle cx="120" cy="40" r="48" stroke="currentColor" strokeWidth="0.75" />
        <circle cx="120" cy="40" r="68" stroke="currentColor" strokeWidth="0.5" />
      </svg>

      <svg
        className="text-primary absolute -right-8 bottom-12 h-64 w-64 opacity-[0.08] dark:opacity-[0.12]"
        viewBox="0 0 200 200"
        fill="currentColor"
      >
        <rect x="20" y="160" width="40" height="12" rx="2" />
        <rect x="50" y="130" width="40" height="12" rx="2" />
        <rect x="80" y="100" width="40" height="12" rx="2" />
        <rect x="110" y="70" width="40" height="12" rx="2" />
        <rect x="140" y="40" width="40" height="12" rx="2" />
      </svg>

      <svg
        className="text-primary absolute bottom-32 left-12 h-40 w-40 opacity-[0.05] dark:opacity-[0.08]"
        viewBox="0 0 120 120"
        fill="none"
      >
        <path
          d="M20 100 L20 80 L40 80 L40 60 L60 60 L60 40 L80 40"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
