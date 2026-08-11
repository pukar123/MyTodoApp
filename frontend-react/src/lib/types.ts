export interface Session {
  token: string;
  username: string;
}

export interface TodoItem {
  id: string;
  title: string;
  createdAtUtc: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface CreateTodoRequest {
  title: string;
}
