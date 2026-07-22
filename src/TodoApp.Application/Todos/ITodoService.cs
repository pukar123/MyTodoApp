namespace TodoApp.Application.Todos;

public interface ITodoService
{
    Task<IReadOnlyList<TodoItemDto>> ListAsync(CancellationToken cancellationToken = default);

    Task<TodoItemDto> AddAsync(CreateTodoRequest request, CancellationToken cancellationToken = default);

    Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
