using TodoApp.Application.Auth;
using TodoApp.Infrastructure;

namespace TodoApp.Application.Tests;

[TestClass]
public sealed class AuthServiceTests
{
    private const string ValidUsername = "demo@todo.local";
    private const string ValidPassword = "Demo123!";

    [TestMethod]
    public void Login_WithValidCredentials_ReturnsTokenAndUsername()
    {
        var authService = new AuthService();

        var response = authService.Login(new LoginRequest(ValidUsername, ValidPassword));

        Assert.IsNotNull(response);
        Assert.AreEqual(ValidUsername, response.Username);
        Assert.IsFalse(string.IsNullOrWhiteSpace(response.Token));
    }

    [TestMethod]
    public void Login_WithValidCredentials_IssuesTokenThatValidates()
    {
        var authService = new AuthService();

        var response = authService.Login(new LoginRequest(ValidUsername, ValidPassword));

        Assert.IsNotNull(response);
        Assert.AreEqual(ValidUsername, authService.GetUsernameFromToken(response.Token));
    }

    [TestMethod]
    [DataRow("demo@todo.local", "wrong-password")]
    [DataRow("someone@else.local", "Demo123!")]
    [DataRow("", "")]
    public void Login_WithInvalidCredentials_ReturnsNull(string username, string password)
    {
        var authService = new AuthService();

        var response = authService.Login(new LoginRequest(username, password));

        Assert.IsNull(response);
    }

    [TestMethod]
    public void GetUsernameFromToken_WithUnknownToken_ReturnsNull()
    {
        var authService = new AuthService();

        Assert.IsNull(authService.GetUsernameFromToken("not-a-real-token"));
        Assert.IsNull(authService.GetUsernameFromToken(""));
    }
}
