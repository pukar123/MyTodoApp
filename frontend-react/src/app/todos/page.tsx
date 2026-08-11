"use client";

import { useEffect } from "react";
import { useTodosStore } from "@/store/todos-store";
import { TopBar } from "@/components/TopBar";
import { AddTodoForm } from "@/components/AddTodoForm";
import { TodoList } from "@/components/TodoList";
import { Alert } from "@/components/Alert";

export default function TodosPage() {
  const loadTodos = useTodosStore((state) => state.loadTodos);
  const loading = useTodosStore((state) => state.loading);
  const loadError = useTodosStore((state) => state.loadError);
  const itemCount = useTodosStore((state) => state.items.length);
  const successMessage = useTodosStore((state) => state.successMessage);
  const actionError = useTodosStore((state) => state.actionError);
  const dismissActionError = useTodosStore((state) => state.dismissActionError);

  useEffect(() => {
    void loadTodos();
  }, [loadTodos]);

  const showCount = !loading && !loadError;

  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />

      <main className="mx-auto w-full max-w-2xl flex-1 space-y-4 px-4 py-6">
        <AddTodoForm />

        {successMessage ? (
          <Alert variant="success">{successMessage}</Alert>
        ) : null}

        {actionError ? (
          <Alert variant="error" onDismiss={dismissActionError}>
            {actionError}
          </Alert>
        ) : null}

        <section
          aria-labelledby="list-heading"
          className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/20 backdrop-blur-xl"
        >
          <h2
            id="list-heading"
            className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-200"
          >
            Your tasks
            {showCount ? (
              <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-white/10 px-2 py-0.5 text-xs font-medium text-slate-300">
                {itemCount}
              </span>
            ) : null}
          </h2>

          <TodoList />
        </section>
      </main>
    </div>
  );
}
