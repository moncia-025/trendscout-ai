import Link from "next/link";

interface TrendBreadcrumbProps {
  trendName: string;
}

export function TrendBreadcrumb({ trendName }: TrendBreadcrumbProps) {
  return (
    <nav aria-label="面包屑导航" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-zinc-500">
        <li>
          <Link href="/" className="transition-colors hover:text-zinc-900">
            首页
          </Link>
        </li>
        <li aria-hidden="true" className="text-zinc-300">
          /
        </li>
        <li>
          <Link href="/" className="transition-colors hover:text-zinc-900">
            趋势分析
          </Link>
        </li>
        <li aria-hidden="true" className="text-zinc-300">
          /
        </li>
        <li className="font-medium text-zinc-900">{trendName}</li>
      </ol>
    </nav>
  );
}
