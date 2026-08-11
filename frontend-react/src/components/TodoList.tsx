"use client";

import { useTodosStore } from "@/store/todos-store";
import { TodoRow } from "@/components/TodoRow";

function LoadingSkeleton() {
  return (
    <div role="status" aria-label="Loading your todos" className="space-y-2.5">
      {[0, 1, 2].map((key) => (
        <div
          key={key}
          className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3"
        >
          <div className="flex w-full flex-col gap-2">
            <div className="h-3.5 w-1/2 animate-pulse rounded bg-white/10" />
            <div className="h-2.5 w-1/3 animate-pulse rounded bg-white/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TodoList() {
  const items = useTodosStore((state) => state.items);
  const loading = useTodosStore((state) => state.loading);
  const loadError = useTodosStore((state) => state.loadError);
  const loadTodos = useTodosStore((state) => state.loadTodos);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (loadError) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <p className="text-sm text-rose-300">{loadError}</p>
        <button
          type="button"
          onClick={() => loadTodos()}
          className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:from-indigo-400 hover:to-violet-400"
        >
          Try again
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-1.5 py-12 text-center">
        <p className="text-3xl" aria-hidden="true">
          🎉
        </p>
        <p className="text-base font-semibold text-white">All clear!</p>
        <p className="text-sm text-slate-400">
          You have no todos yet. Add your first task above.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <TodoRow key={item.id} item={item} />
      ))}
    </ul>
  );
}
