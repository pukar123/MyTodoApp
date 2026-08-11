import { ApiError } from "./api-client";

/** Maps a login failure to the user-facing message used by the Angular app. */
export function toLoginErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 401) {
      return "The username or password is incorrect.";
    }
    if (error.status === 400) {
      return "Please enter both a username and a password.";
    }
    if (error.status === 0) {
      return "The server cannot be reached. Make sure the API is running.";
    }
  }

  return "Something went wrong while signing in. Please try again.";
}

/**
 * Maps a todo action failure to a user-facing message, preferring the server's
 * ProblemDetails `detail` on validation errors, matching the Angular todos page.
 */
export function toActionErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) {
    if (error.status === 400) {
      return error.detail ?? "The request was invalid. Please check your input.";
    }
    if (error.status === 0) {
      return "The server cannot be reached. Make sure the API is running.";
    }
  }

  return fallback;
}
