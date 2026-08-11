"use client";

import { create } from "zustand";
import { ApiError } from "@/lib/api-client";
import * as api from "@/lib/api-client";
import { toActionErrorMessage } from "@/lib/errors";
import type { TodoItem } from "@/lib/types";

const SUCCESS_MESSAGE_DURATION_MS = 3000;

interface TodosState {
  items: TodoItem[];
  loading: boolean;
  loadError: string | null;
  adding: boolean;
  actionError: string | null;
  successMessage: string | null;
  pendingDeleteId: string | null;
  deletingId: string | null;
  loadTodos: () => Promise<void>;
  addTodo: (title: string) => Promise<boolean>;
  requestDelete: (id: string) => void;
  cancelDelete: () => void;
  confirmDelete: (id: string) => Promise<void>;
  dismissActionError: () => void;
}

let successTimer: ReturnType<typeof setTimeout> | undefined;

export const useTodosStore = create<TodosState>((set) => {
  function showSuccess(message: string): void {
    set({ successMessage: message });
    clearTimeout(successTimer);
    successTimer = setTimeout(
      () => set({ successMessage: null }),
      SUCCESS_MESSAGE_DURATION_MS,
    );
  }

  function finishDelete(id: string, message: string): void {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
      deletingId: null,
      pendingDeleteId: null,
    }));
    showSuccess(message);
  }

  return {
    items: [],
    loading: true,
    loadError: null,
    adding: false,
    actionError: null,
    successMessage: null,
    pendingDeleteId: null,
    deletingId: null,

    loadTodos: async () => {
      set({ loading: true, loadError: null });
      try {
        const items = await api.listTodos();
        set({ items, loading: false });
      } catch (error) {
        set({
          loading: false,
          loadError: toActionErrorMessage(
            error,
            "The todo list could not be loaded.",
          ),
        });
      }
    },

    addTodo: async (title) => {
      const trimmed = title.trim();
      set({ adding: true, actionError: null });
      try {
        const item = await api.createTodo(trimmed);
        set((state) => ({ items: [...state.items, item], adding: false }));
        showSuccess(`Added "${item.title}".`);
        return true;
      } catch (error) {
        set({
          adding: false,
          actionError: toActionErrorMessage(
            error,
            "The todo could not be added.",
          ),
        });
        return false;
      }
    },

    requestDelete: (id) => set({ pendingDeleteId: id }),

    cancelDelete: () => set({ pendingDeleteId: null }),

    confirmDelete: async (id) => {
      set({ deletingId: id, actionError: null });
      try {
        await api.deleteTodo(id);
        finishDelete(id, "Todo deleted.");
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          finishDelete(
            id,
            "That todo no longer exists; the list has been refreshed.",
          );
          return;
        }

        set({
          deletingId: null,
          pendingDeleteId: null,
          actionError: toActionErrorMessage(
            error,
            "The todo could not be deleted.",
          ),
        });
      }
    },

    dismissActionError: () => set({ actionError: null }),
  };
});
