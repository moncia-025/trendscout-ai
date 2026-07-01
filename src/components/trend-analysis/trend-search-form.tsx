"use client";

import { FormEvent, useState } from "react";

interface TrendSearchFormProps {
  defaultQuery?: string;
  loading?: boolean;
  onSearch: (query: string) => void;
}

export function TrendSearchForm({
  defaultQuery = "",
  loading = false,
  onSearch,
}: TrendSearchFormProps) {
  const [query, setQuery] = useState(defaultQuery);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch(query);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 sm:flex-row sm:items-center"
    >
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="输入趋势关键词，如 Coquette"
        disabled={loading}
        className="flex-1 rounded-lg border border-zinc-200/80 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-300 focus:ring-2 focus:ring-zinc-900/5 disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={loading || !query.trim()}
        className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-60"
      >
        {loading ? "分析中..." : "开始分析"}
      </button>
    </form>
  );
}
