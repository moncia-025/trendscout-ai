import Link from "next/link";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200/80 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex h-12 max-w-6xl items-center justify-between px-6 sm:px-8 lg:px-12">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-900">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4 text-white"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12.963 2.286a.75.75 0 0 0-1.071-.136 9.742 9.742 0 0 0-3.046 3.046.75.75 0 0 0-.136 1.071 10.954 10.954 0 0 1 2.512-2.453 11.012 11.012 0 0 1 1.741 1.472ZM9.157 5.433a9.323 9.323 0 0 0-2.765 2.765.75.75 0 0 0 .136 1.071 10.954 10.954 0 0 1 2.512-2.453 11.012 11.012 0 0 1 1.741 1.472.75.75 0 0 0 1.071-.136 9.742 9.742 0 0 0-3.695-2.719ZM5.433 9.157a9.323 9.323 0 0 0-2.765 2.765.75.75 0 0 0 .136 1.071 10.954 10.954 0 0 1 2.512-2.453 11.012 11.012 0 0 1 1.741 1.472.75.75 0 0 0 1.071-.136 9.742 9.742 0 0 0-3.695-2.719ZM2.286 12.963a.75.75 0 0 0-.136 1.071 9.742 9.742 0 0 0 3.046 3.046.75.75 0 0 0 1.071-.136 10.954 10.954 0 0 1-2.512-2.453 11.012 11.012 0 0 1-1.472-1.741.75.75 0 0 0-1.071-.136 9.323 9.323 0 0 0-2.926-2.791Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <span className="text-sm font-semibold tracking-tight text-zinc-900">
            TrendScout
          </span>
        </Link>

        <nav className="hidden items-center gap-5 text-sm text-zinc-500 sm:flex">
          <Link href="/" className="transition-colors hover:text-zinc-900">
            Dashboard
          </Link>
          <Link href="/trends" className="transition-colors hover:text-zinc-900">
            趋势发现
          </Link>
          <Link
            href="/forecast"
            className="transition-colors hover:text-zinc-900"
          >
            趋势预测
          </Link>
          <Link
            href="/comparison"
            className="transition-colors hover:text-zinc-900"
          >
            趋势对比
          </Link>
          <Link
            href="/consultant"
            className="transition-colors hover:text-zinc-900"
          >
            AI 顾问
          </Link>
          <Link
            href="/stream-analysis"
            className="transition-colors hover:text-zinc-900"
          >
            流式分析
          </Link>
        </nav>

        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-xs font-medium text-zinc-600">
          CZ
        </div>
      </div>
    </header>
  );
}
