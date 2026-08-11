"use client";

import { useState } from "react";
import { useTodosStore } from "@/store/todos-store";
import { Spinner } from "@/components/Spinner";

export function AddTodoForm() {
  const addTodo = useTodosStore((state) => state.addTodo);
  const adding = useTodosStore((state) => state.adding);

  const [title, setTitle] = useState("");
  const [touched, setTouched] = useState(false);

  const invalid = touched && title.trim().length === 0;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setTouched(true);

    if (title.trim().length === 0) {
      return;
    }

    const succeeded = await addTodo(title);
    if (succeeded) {
      setTitle("");
      setTouched(false);
    }
  };

  return (
    <section
      aria-labelledby="add-heading"
      className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/20 backdrop-blur-xl"
    >
      <h2 id="add-heading" className="mb-3 text-sm font-semibold text-slate-200">
        Add a task
      </h2>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-2">
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="What needs to be done?"
            aria-label="Todo title"
            aria-invalid={invalid}
            className={`w-full flex-1 rounded-xl border bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none transition focus:ring-2 ${
              invalid
                ? "border-rose-400/60 focus:ring-rose-400/30"
                : "border-white/10 focus:border-indigo-400/60 focus:ring-indigo-400/30"
            }`}
          />
          <button
            type="submit"
            disabled={adding}
            className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:from-indigo-400 hover:to-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {adding ? (
              <>
                <Spinner className="h-4 w-4" />
                Adding…
              </>
            ) : (
              "Add"
            )}
          </button>
        </div>
        {invalid ? (
          <p className="text-xs text-rose-300">
            Please enter a title. Whitespace-only titles are not allowed.
          </p>
        ) : null}
      </form>
    </section>
  );
}
