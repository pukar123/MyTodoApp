import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Session } from './models';

const STORAGE_KEY = 'todoapp.session';

function readStoredSession(): Session | null {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<Session>;
    if (typeof parsed.token === 'string' && typeof parsed.username === 'string') {
      return { token: parsed.token, username: parsed.username };
    }
  } catch {
    sessionStorage.removeItem(STORAGE_KEY);
    return null;
  }

  sessionStorage.removeItem(STORAGE_KEY);
  return null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly sessionSignal = signal<Session | null>(readStoredSession());

  readonly session = this.sessionSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.sessionSignal() !== null);

  get token(): string | null {
    return this.sessionSignal()?.token ?? null;
  }

  login(username: string, password: string): Observable<Session> {
    return this.http
      .post<Session>('/api/auth/login', { username, password })
      .pipe(
        tap((session) => {
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
          this.sessionSignal.set(session);
        }),
      );
  }

  logout(): void {
    sessionStorage.removeItem(STORAGE_KEY);
    this.sessionSignal.set(null);
  }
}
