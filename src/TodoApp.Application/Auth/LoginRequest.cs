using System.ComponentModel.DataAnnotations;

namespace TodoApp.Application.Auth;

public sealed record LoginRequest(
    [Required] string Username,
    [Required] string Password);
