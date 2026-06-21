export function AuthBackgroundArt() {
  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden"
      aria-hidden
    >
      <div className="bg-primary/10 absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl dark:bg-primary/5" />
      <div className="bg-primary/6 absolute -right-16 top-1/3 h-56 w-56 rounded-full blur-3xl dark:bg-primary/4" />

      <svg
        className="text-primary absolute top-20 -left-2 h-56 w-28 opacity-[0.07] dark:opacity-[0.11]"
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
        className="text-primary absolute top-12 right-0 h-40 w-40 opacity-[0.06] dark:opacity-[0.09]"
        viewBox="0 0 160 160"
        fill="none"
      >
        <circle cx="120" cy="40" r="28" stroke="currentColor" strokeWidth="1" />
        <circle cx="120" cy="40" r="48" stroke="currentColor" strokeWidth="0.75" />
        <circle cx="120" cy="40" r="68" stroke="currentColor" strokeWidth="0.5" />
      </svg>

      <svg
        className="text-primary absolute -right-4 bottom-0 h-52 w-52 opacity-[0.08] dark:opacity-[0.12]"
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
        className="text-primary absolute bottom-24 left-6 h-32 w-32 opacity-[0.05] dark:opacity-[0.08]"
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
