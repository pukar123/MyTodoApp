namespace TodoApp.Domain;

public sealed class TodoItem
{
    public Guid Id { get; }

    public string Title { get; }

    public DateTime CreatedAtUtc { get; }

    private TodoItem(Guid id, string title, DateTime createdAtUtc)
    {
        Id = id;
        Title = title;
        CreatedAtUtc = createdAtUtc;
    }

    public static TodoItem Create(string? title)
    {
        var trimmedTitle = title?.Trim() ?? string.Empty;
        if (trimmedTitle.Length == 0)
        {
            throw new DomainException("A todo item requires a non-empty title.");
        }

        return new TodoItem(Guid.NewGuid(), trimmedTitle, DateTime.UtcNow);
    }
}
