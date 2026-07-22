using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TodoApp.Application.Todos;

namespace TodoApp.Api.Controllers;

[ApiController]
[Route("api/todos")]
[Authorize]
public sealed class TodosController : ControllerBase
{
    private readonly ITodoService _todoService;
    private readonly ILogger<TodosController> _logger;

    public TodosController(ITodoService todoService, ILogger<TodosController> logger)
    {
        _todoService = todoService;
        _logger = logger;
    }

    [HttpGet]
    [ProducesResponseType<IReadOnlyList<TodoItemDto>>(StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<TodoItemDto>>> List(CancellationToken cancellationToken)
    {
        var items = await _todoService.ListAsync(cancellationToken);
        _logger.LogInformation("Listed {Count} todo items", items.Count);
        return Ok(items);
    }

    [HttpPost]
    [ProducesResponseType<TodoItemDto>(StatusCodes.Status201Created)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<TodoItemDto>> Create(CreateTodoRequest request, CancellationToken cancellationToken)
    {
        var created = await _todoService.AddAsync(request, cancellationToken);
        _logger.LogInformation("Created todo item {TodoId} with title {Title}", created.Id, created.Title);
        return Created($"/api/todos/{created.Id}", created);
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        await _todoService.DeleteAsync(id, cancellationToken);
        _logger.LogInformation("Deleted todo item {TodoId}", id);
        return NoContent();
    }
}
