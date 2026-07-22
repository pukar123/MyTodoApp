using TodoApp.Application.Abstractions;
using TodoApp.Domain;

namespace TodoApp.Application.Tests;

internal sealed class FakeTodoRepository : ITodoRepository
{
    private readonly List<TodoItem> _items = [];

    public IReadOnlyList<TodoItem> Items => _items;

    public Task<IReadOnlyList<TodoItem>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        IReadOnlyList<TodoItem> snapshot = _items.ToList();
        return Task.FromResult(snapshot);
    }

    public Task AddAsync(TodoItem item, CancellationToken cancellationToken = default)
    {
        _items.Add(item);
        return Task.CompletedTask;
    }

    public Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var removedCount = _items.RemoveAll(item => item.Id == id);
        return Task.FromResult(removedCount > 0);
    }
}
