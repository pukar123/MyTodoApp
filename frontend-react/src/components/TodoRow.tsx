"use client";

import { useTodosStore } from "@/store/todos-store";
import type { TodoItem } from "@/lib/types";
import { Spinner } from "@/components/Spinner";

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "medium",
});

function formatCreatedAt(value: string): string {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : dateFormatter.format(parsed);
}

export function TodoRow({ item }: { item: TodoItem }) {
  const pendingDeleteId = useTodosStore((state) => state.pendingDeleteId);
  const deletingId = useTodosStore((state) => state.deletingId);
  const requestDelete = useTodosStore((state) => state.requestDelete);
  const cancelDelete = useTodosStore((state) => state.cancelDelete);
  const confirmDelete = useTodosStore((state) => state.confirmDelete);

  const isConfirming = pendingDeleteId === item.id;
  const isDeleting = deletingId === item.id;

  return (
    <li className="group animate-in flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 transition hover:border-white/20 hover:bg-white/[0.06]">
      <div className="flex min-w-0 flex-col">
        <span className="truncate font-medium text-white">{item.title}</span>
        <span className="mt-0.5 text-xs text-slate-500">
          Created {formatCreatedAt(item.createdAtUtc)}
        </span>
      </div>

      {isConfirming ? (
        <div className="flex shrink-0 items-center gap-2">
          <span className="text-xs text-slate-400">Delete?</span>
          <button
            type="button"
            disabled={isDeleting}
            onClick={() => confirmDelete(item.id)}
            className="flex items-center gap-1.5 rounded-lg bg-rose-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? (
              <>
                <Spinner className="h-3.5 w-3.5" />
                Deleting…
              </>
            ) : (
              "Yes, delete"
            )}
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={cancelDelete}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => requestDelete(item.id)}
          className="shrink-0 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-400 opacity-0 transition hover:border-rose-400/40 hover:bg-rose-500/10 hover:text-rose-200 focus-visible:opacity-100 group-hover:opacity-100"
        >
          Delete
        </button>
      )}
    </li>
  );
}
