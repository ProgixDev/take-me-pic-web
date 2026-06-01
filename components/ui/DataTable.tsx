"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown, Search } from "lucide-react";
import { cn } from "@/lib/cn";

export interface Column<T> {
  key: string;
  header: string;
  /** render a cell; falls back to (row as any)[key] */
  cell?: (row: T) => React.ReactNode;
  /** value used for sorting & search */
  sortValue?: (row: T) => string | number;
  className?: string;
  align?: "left" | "right" | "center";
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  onRowClick?: (row: T) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  pageSize?: number;
  empty?: string;
}

/** Reusable admin table — client-side search, sort and pagination over mock data. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DataTable<T = any>({
  columns,
  rows,
  onRowClick,
  searchable = true,
  searchPlaceholder = "rechercher…",
  pageSize = 10,
  empty = "Rien à afficher.",
}: DataTableProps<T>) {
  const [q, setQ] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [asc, setAsc] = useState(true);
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    let out = rows;
    if (q.trim()) {
      const needle = q.toLowerCase();
      out = out.filter((r) =>
        columns.some((c) => {
          const v = c.sortValue ? c.sortValue(r) : (r as Record<string, unknown>)[c.key];
          return String(v ?? "").toLowerCase().includes(needle);
        })
      );
    }
    if (sortKey) {
      const col = columns.find((c) => c.key === sortKey);
      if (col) {
        out = [...out].sort((a, b) => {
          const va = col.sortValue ? col.sortValue(a) : (a as Record<string, unknown>)[sortKey];
          const vb = col.sortValue ? col.sortValue(b) : (b as Record<string, unknown>)[sortKey];
          if (va === vb) return 0;
          const r = (va as number) > (vb as number) ? 1 : -1;
          return asc ? r : -r;
        });
      }
    }
    return out;
  }, [rows, q, sortKey, asc, columns]);

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, pages - 1);
  const slice = filtered.slice(current * pageSize, current * pageSize + pageSize);

  return (
    <div>
      {searchable && (
        <div className="mb-3 flex items-center gap-2 bg-card border-[1.5px] border-ink rounded-[4px] px-3 py-2 max-w-sm shadow-ink-sm">
          <Search size={16} className="text-ink-faded" />
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(0);
            }}
            placeholder={searchPlaceholder}
            className="bg-transparent outline-none w-full font-[family-name:var(--font-hand)] text-lg text-ink placeholder:text-ink-faded"
          />
        </div>
      )}
      <div className="bg-card border-[1.5px] border-ink rounded-[4px] overflow-hidden shadow-ink-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b-[1.5px] border-dashed border-[var(--ink-line)] bg-paper-2/60">
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={cn(
                    "px-4 py-3 font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded",
                    c.align === "right" && "text-right",
                    c.align === "center" && "text-center",
                    c.sortValue && "cursor-pointer select-none"
                  )}
                  onClick={() => {
                    if (!c.sortValue) return;
                    if (sortKey === c.key) setAsc((a) => !a);
                    else {
                      setSortKey(c.key);
                      setAsc(true);
                    }
                  }}
                >
                  <span className="inline-flex items-center gap-1">
                    {c.header}
                    {c.sortValue && <ArrowUpDown size={11} className="opacity-50" />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slice.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center font-[family-name:var(--font-hand)] text-lg text-ink-faded">
                  {empty}
                </td>
              </tr>
            )}
            {slice.map((row, i) => (
              <tr
                key={i}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  "border-b border-[var(--ink-line)] last:border-0 transition",
                  onRowClick && "cursor-pointer hover:bg-paper-warm/70"
                )}
              >
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={cn(
                      "px-4 py-3 font-[family-name:var(--font-serif)] text-[14px] text-ink align-middle",
                      c.align === "right" && "text-right",
                      c.align === "center" && "text-center",
                      c.className
                    )}
                  >
                    {c.cell ? c.cell(row) : String((row as Record<string, unknown>)[c.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pages > 1 && (
        <div className="mt-3 flex items-center justify-between">
          <span className="font-[family-name:var(--font-type)] text-[11px] uppercase tracking-[0.1em] text-ink-faded">
            {filtered.length} résultats · page {current + 1}/{pages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={current === 0}
              className="px-3 py-1.5 border-[1.5px] border-ink rounded-[4px] bg-card text-sm disabled:opacity-40 hover:bg-paper-warm transition cursor-pointer disabled:cursor-default"
            >
              ← préc.
            </button>
            <button
              onClick={() => setPage((p) => Math.min(pages - 1, p + 1))}
              disabled={current >= pages - 1}
              className="px-3 py-1.5 border-[1.5px] border-ink rounded-[4px] bg-card text-sm disabled:opacity-40 hover:bg-paper-warm transition cursor-pointer disabled:cursor-default"
            >
              suiv. →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
