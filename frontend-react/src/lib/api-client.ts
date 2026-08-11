import type {
  CreateTodoRequest,
  LoginRequest,
  Session,
  TodoItem,
} from "./types";

const LOGIN_PATH = "/api/auth/login";

/**
 * Error thrown for any non-2xx API response (or a failure to reach the server).
 * `status` is 0 when the request never completed (network / CORS failure),
 * mirroring the Angular `HttpErrorResponse.status === 0` behaviour. `detail`
 * carries the RFC 7807 ProblemDetails `detail` field when present.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly detail?: string;

  constructor(status: number, detail?: string) {
    super(detail ?? `Request failed with status ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
  }
}

interface ApiClientConfig {
  getToken: () => string | null;
  onUnauthorized: () => void;
}

let config: ApiClientConfig = {
  getToken: () => null,
  onUnauthorized: () => {},
};

/**
 * Wires the client to the auth store so it can attach the bearer token and
 * react to 401s without creating a circular import between the store and the
 * client. Replaces the Angular auth interceptor.
 */
export function configureApiClient(next: ApiClientConfig): void {
  config = next;
}

async function readProblemDetail(response: Response): Promise<string | undefined> {
  try {
    const body = (await response.json()) as { detail?: string } | null;
    return body?.detail;
  } catch {
    return undefined;
  }
}

async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const headers = new Headers(init?.headers);
  const token = config.getToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(path, { ...init, headers });
  } catch {
    throw new ApiError(0);
  }

  if (!response.ok) {
    const isLoginRequest = path.includes(LOGIN_PATH);
    if (response.status === 401 && !isLoginRequest) {
      config.onUnauthorized();
    }

    const detail = await readProblemDetail(response);
    throw new ApiError(response.status, detail);
  }

  return response;
}

export async function login(
  username: string,
  password: string,
): Promise<Session> {
  const payload: LoginRequest = { username, password };
  const response = await apiFetch(LOGIN_PATH, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return (await response.json()) as Session;
}

export async function listTodos(): Promise<TodoItem[]> {
  const response = await apiFetch("/api/todos");
  return (await response.json()) as TodoItem[];
}

export async function createTodo(title: string): Promise<TodoItem> {
  const payload: CreateTodoRequest = { title };
  const response = await apiFetch("/api/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return (await response.json()) as TodoItem;
}

export async function deleteTodo(id: string): Promise<void> {
  await apiFetch(`/api/todos/${id}`, { method: "DELETE" });
}
