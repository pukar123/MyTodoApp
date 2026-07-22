using System.Collections.Concurrent;
using System.Security.Cryptography;
using TodoApp.Application.Abstractions;
using TodoApp.Application.Auth;

namespace TodoApp.Infrastructure;

public sealed class AuthService : IAuthService
{
    private const string DemoUsername = "demo@todo.local";
    private const string DemoPassword = "Demo123!";

    private readonly ConcurrentDictionary<string, string> _activeTokens = new();

    public LoginResponse? Login(LoginRequest request)
    {
        var usernameMatches = string.Equals(request.Username?.Trim(), DemoUsername, StringComparison.OrdinalIgnoreCase);
        var passwordMatches = string.Equals(request.Password, DemoPassword, StringComparison.Ordinal);
        if (!usernameMatches || !passwordMatches)
        {
            return null;
        }

        var token = Convert.ToHexString(RandomNumberGenerator.GetBytes(32));
        _activeTokens[token] = DemoUsername;
        return new LoginResponse(token, DemoUsername);
    }

    public string? GetUsernameFromToken(string token)
    {
        if (string.IsNullOrWhiteSpace(token))
        {
            return null;
        }

        return _activeTokens.TryGetValue(token, out var username) ? username : null;
    }
}
