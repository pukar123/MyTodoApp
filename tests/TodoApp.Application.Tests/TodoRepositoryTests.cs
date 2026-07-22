using TodoApp.Domain;
using TodoApp.Infrastructure;

namespace TodoApp.Application.Tests;

[TestClass]
public sealed class TodoRepositoryTests
{
    [TestMethod]
    public async Task GetAllAsync_OnNewRepository_ReturnsEmptyList()
    {
        var repository = new TodoRepository();

        var items = await repository.GetAllAsync();

        Assert.IsEmpty(items);
    }

    [TestMethod]
    public async Task AddAsync_StoresItemRetrievableViaGetAll()
    {
        var repository = new TodoRepository();
        var item = TodoItem.Create("Persist me");

        await repository.AddAsync(item);
        var items = await repository.GetAllAsync();

        Assert.HasCount(1, items);
        Assert.AreEqual(item.Id, items[0].Id);
        Assert.AreEqual("Persist me", items[0].Title);
    }

    [TestMethod]
    public async Task DeleteAsync_WithExistingId_RemovesItemAndReturnsTrue()
    {
        var repository = new TodoRepository();
        var item = TodoItem.Create("Delete me");
        await repository.AddAsync(item);

        var removed = await repository.DeleteAsync(item.Id);

        Assert.IsTrue(removed);
        Assert.IsEmpty(await repository.GetAllAsync());
    }

    [TestMethod]
    public async Task DeleteAsync_WithUnknownId_ReturnsFalse()
    {
        var repository = new TodoRepository();

        var removed = await repository.DeleteAsync(Guid.NewGuid());

        Assert.IsFalse(removed);
    }
}
