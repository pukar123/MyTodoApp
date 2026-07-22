using TodoApp.Application.Exceptions;
using TodoApp.Application.Todos;

namespace TodoApp.Application.Tests;

[TestClass]
public sealed class TodoServiceTests
{
    private FakeTodoRepository _repository = null!;
    private TodoService _service = null!;

    [TestInitialize]
    public void Initialize()
    {
        _repository = new FakeTodoRepository();
        _service = new TodoService(_repository);
    }

    [TestMethod]
    public async Task ListAsync_WithNoItems_ReturnsEmptyList()
    {
        var items = await _service.ListAsync();

        Assert.IsEmpty(items);
    }

    [TestMethod]
    public async Task ListAsync_ReturnsAllItemsOrderedByCreationTime()
    {
        var first = await _service.AddAsync(new CreateTodoRequest("First task"));
        var second = await _service.AddAsync(new CreateTodoRequest("Second task"));

        var items = await _service.ListAsync();

        Assert.HasCount(2, items);
        Assert.AreEqual(first.Id, items[0].Id);
        Assert.AreEqual(second.Id, items[1].Id);
    }

    [TestMethod]
    public async Task AddAsync_WithValidTitle_StoresItemAndReturnsDto()
    {
        var created = await _service.AddAsync(new CreateTodoRequest("Buy groceries"));

        Assert.AreEqual("Buy groceries", created.Title);
        Assert.AreNotEqual(Guid.Empty, created.Id);
        Assert.AreEqual(DateTimeKind.Utc, created.CreatedAtUtc.Kind);
        Assert.HasCount(1, _repository.Items);
    }

    [TestMethod]
    public async Task AddAsync_TrimsTitleBeforeStoring()
    {
        var created = await _service.AddAsync(new CreateTodoRequest("  Walk the dog  "));

        Assert.AreEqual("Walk the dog", created.Title);
    }

    [TestMethod]
    [DataRow("")]
    [DataRow("   ")]
    [DataRow("\t\n")]
    public async Task AddAsync_WithEmptyOrWhitespaceTitle_ThrowsValidationException(string title)
    {
        await Assert.ThrowsExactlyAsync<ValidationException>(
            () => _service.AddAsync(new CreateTodoRequest(title)));

        Assert.IsEmpty(_repository.Items);
    }

    [TestMethod]
    public async Task DeleteAsync_WithExistingItem_RemovesIt()
    {
        var created = await _service.AddAsync(new CreateTodoRequest("Remove me"));

        await _service.DeleteAsync(created.Id);

        Assert.IsEmpty(_repository.Items);
    }

    [TestMethod]
    public async Task DeleteAsync_WithNonexistentItem_ThrowsNotFoundException()
    {
        await Assert.ThrowsExactlyAsync<NotFoundException>(
            () => _service.DeleteAsync(Guid.NewGuid()));
    }
}
