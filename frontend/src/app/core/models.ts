export interface Session {
  token: string;
  username: string;
}

export interface TodoItem {
  id: string;
  title: string;
  createdAtUtc: string;
}
