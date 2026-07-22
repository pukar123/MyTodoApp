using System.ComponentModel.DataAnnotations;

namespace TodoApp.Application.Todos;

public sealed record CreateTodoRequest([Required] string Title);
