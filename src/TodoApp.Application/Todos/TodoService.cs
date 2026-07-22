using TodoApp.Application.Abstractions;
using TodoApp.Application.Exceptions;
using TodoApp.Domain;

namespace TodoApp.Application.Todos;

public sealed class TodoService : ITodoService
{
    private readonly ITodoRepository _repository;

    public TodoService(ITodoRepository repository)
    {
        _repository = repository;
    }

    public async Task<IReadOnlyList<TodoItemDto>> ListAsync(CancellationToken cancellationToken = default)
    {
        var items = await _repository.GetAllAsync(cancellationToken);
        return items
            .OrderBy(item => item.CreatedAtUtc)
            .Select(ToDto)
            .ToList();
    }

    public async Task<TodoItemDto> AddAsync(CreateTodoRequest request, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.Title))
        {
            throw new ValidationException("Title is required and must not be empty or whitespace.");
        }

        var item = TodoItem.Create(request.Title);
        await _repository.AddAsync(item, cancellationToken);
        return ToDto(item);
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var removed = await _repository.DeleteAsync(id, cancellationToken);
        if (!removed)
        {
            throw new NotFoundException($"Todo item '{id}' was not found.");
        }
    }

    private static TodoItemDto ToDto(TodoItem item) => new(item.Id, item.Title, item.CreatedAtUtc);
}
