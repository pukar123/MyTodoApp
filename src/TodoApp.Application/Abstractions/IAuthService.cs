using TodoApp.Application.Auth;

namespace TodoApp.Application.Abstractions;

public interface IAuthService
{
    LoginResponse? Login(LoginRequest request);

    string? GetUsernameFromToken(string token);
}
