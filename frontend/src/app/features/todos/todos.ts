import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { TodoItem } from '../../core/models';
import { TodoApiService } from '../../core/todo-api.service';

const SUCCESS_MESSAGE_DURATION_MS = 3000;

function nonWhitespaceValidator(control: AbstractControl<string>): ValidationErrors | null {
  return control.value.trim().length > 0 ? null : { whitespace: true };
}

@Component({
  selector: 'app-todos',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './todos.html',
  styleUrl: './todos.css',
})
export class Todos {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly todoApi = inject(TodoApiService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly items = signal<TodoItem[]>([]);
  protected readonly loading = signal(true);
  protected readonly loadError = signal<string | null>(null);
  protected readonly adding = signal(false);
  protected readonly actionError = signal<string | null>(null);
  protected readonly successMessage = signal<string | null>(null);
  protected readonly pendingDeleteId = signal<string | null>(null);
  protected readonly deletingId = signal<string | null>(null);

  protected readonly username = computed(() => this.authService.session()?.username ?? '');

  protected readonly addForm = this.formBuilder.group({
    title: ['', [Validators.required, nonWhitespaceValidator]],
  });

  private successTimer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    this.loadTodos();
  }

  protected loadTodos(): void {
    this.loading.set(true);
    this.loadError.set(null);

    this.todoApi.list().subscribe({
      next: (items) => {
        this.items.set(items);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.loading.set(false);
        this.loadError.set(this.toErrorMessage(error, 'The todo list could not be loaded.'));
      },
    });
  }

  protected addTodo(): void {
    if (this.addForm.invalid) {
      this.addForm.markAllAsTouched();
      return;
    }

    const title = this.addForm.getRawValue().title.trim();
    this.adding.set(true);
    this.actionError.set(null);

    this.todoApi.create(title).subscribe({
      next: (item) => {
        this.items.update((items) => [...items, item]);
        this.addForm.reset({ title: '' });
        this.adding.set(false);
        this.showSuccess(`Added "${item.title}".`);
      },
      error: (error: unknown) => {
        this.adding.set(false);
        this.actionError.set(this.toErrorMessage(error, 'The todo could not be added.'));
      },
    });
  }

  protected requestDelete(id: string): void {
    this.pendingDeleteId.set(id);
  }

  protected cancelDelete(): void {
    this.pendingDeleteId.set(null);
  }

  protected confirmDelete(id: string): void {
    this.deletingId.set(id);
    this.actionError.set(null);

    this.todoApi.delete(id).subscribe({
      next: () => this.finishDelete(id, 'Todo deleted.'),
      error: (error: unknown) => {
        if (error instanceof HttpErrorResponse && error.status === 404) {
          this.finishDelete(id, 'That todo no longer exists; the list has been refreshed.');
          return;
        }

        this.deletingId.set(null);
        this.pendingDeleteId.set(null);
        this.actionError.set(this.toErrorMessage(error, 'The todo could not be deleted.'));
      },
    });
  }

  protected dismissActionError(): void {
    this.actionError.set(null);
  }

  protected logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  protected isTitleInvalid(): boolean {
    const control = this.addForm.controls.title;
    return control.invalid && (control.touched || control.dirty);
  }

  private finishDelete(id: string, message: string): void {
    this.items.update((items) => items.filter((item) => item.id !== id));
    this.deletingId.set(null);
    this.pendingDeleteId.set(null);
    this.showSuccess(message);
  }

  private showSuccess(message: string): void {
    this.successMessage.set(message);
    clearTimeout(this.successTimer);
    this.successTimer = setTimeout(
      () => this.successMessage.set(null),
      SUCCESS_MESSAGE_DURATION_MS,
    );
  }

  private toErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 400) {
        const detail = (error.error as { detail?: string } | null)?.detail;
        return detail ?? 'The request was invalid. Please check your input.';
      }
      if (error.status === 0) {
        return 'The server cannot be reached. Make sure the API is running.';
      }
    }

    return fallback;
  }
}
