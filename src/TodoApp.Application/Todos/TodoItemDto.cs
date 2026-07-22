namespace TodoApp.Application.Todos;

public sealed record TodoItemDto(Guid Id, string Title, DateTime CreatedAtUtc);
