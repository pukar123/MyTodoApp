import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { TodoItem } from './models';

@Injectable({ providedIn: 'root' })
export class TodoApiService {
  private readonly http = inject(HttpClient);

  list(): Observable<TodoItem[]> {
    return this.http.get<TodoItem[]>('/api/todos');
  }

  create(title: string): Observable<TodoItem> {
    return this.http.post<TodoItem>('/api/todos', { title });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`/api/todos/${id}`);
  }
}
