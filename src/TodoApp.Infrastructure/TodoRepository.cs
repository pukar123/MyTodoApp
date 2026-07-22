using System.Collections.Concurrent;
using TodoApp.Application.Abstractions;
using TodoApp.Domain;

namespace TodoApp.Infrastructure;

public sealed class TodoRepository : ITodoRepository
{
    private readonly ConcurrentDictionary<Guid, TodoItem> _items = new();

    public Task<IReadOnlyList<TodoItem>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        IReadOnlyList<TodoItem> snapshot = _items.Values.ToList();
        return Task.FromResult(snapshot);
    }

    public Task AddAsync(TodoItem item, CancellationToken cancellationToken = default)
    {
        _items[item.Id] = item;
        return Task.CompletedTask;
    }

    public Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return Task.FromResult(_items.TryRemove(id, out _));
    }
}
