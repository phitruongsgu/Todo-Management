using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApp.API.Data;
using TodoApp.API.Models;

namespace TodoApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TodoController : ControllerBase
    {
        private readonly TodoDbContext _dbContext;
        public TodoController(TodoDbContext todoDbContext)
        {
            _dbContext = todoDbContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllTodos()
        {
            var todos = await _dbContext.Todos
                .Where(x => x.IsDeleted == false) // công việc bị đánh đã xoá thì không cho hiển thị
                .OrderByDescending(x => x.CreatedDate)
                .ToListAsync();

            return Ok(todos);
        }

        [HttpGet]
        [Route("get-deleted-todos")]
        public async Task<IActionResult> GetDeletedTodos()
        {
            var todos = await _dbContext.Todos
                .Where(x => x.IsDeleted == true)
                .OrderByDescending(x => x.CreatedDate)
                .ToListAsync();

            return Ok(todos);
        }

        [HttpPost]
        public async Task<IActionResult> AddTodo(Todo todo)
        {
            todo.Id = Guid.NewGuid();

            _dbContext.Todos.Add(todo);
            await _dbContext.SaveChangesAsync();

            return Ok(todo);
        }

        [HttpPut]
        [Route("{id:Guid}")]
        public async Task<IActionResult> UpdateTodo([FromRoute] Guid id, Todo todoUpdateRequest)
        {
            var todo = await _dbContext.Todos.FindAsync(id);

            if (todo == null)
            {
                return NotFound();
            }    

            todo.IsCompleted = todoUpdateRequest.IsCompleted;
            todo.CompletedDate = DateTime.Now;

            await _dbContext.SaveChangesAsync();

            return Ok(todo);
        }

        [HttpDelete]
        [Route("{id:Guid}")]
        public async Task<IActionResult> DeleteTodo([FromRoute] Guid id)
        {
            var todo = await _dbContext.Todos.FindAsync(id);

            if (todo == null)
            {
                return NotFound();
            }    

            todo.IsDeleted = true;
            todo.DeletedDate = DateTime.Now;

            await _dbContext.SaveChangesAsync();

            return Ok(todo);
        }

        [HttpPut]
        [Route("undo-deleted-todo/{id:Guid}")]
        public async Task<IActionResult> UndoDeletedTodo([FromRoute] Guid id, Todo undoDeleteTodoRequest)
        {
            var todo = await _dbContext.Todos.FindAsync(id);

            if (todo == null)
            {
                return NotFound();
            }    

            todo.DeletedDate = null;
            todo.IsDeleted = false;

            await _dbContext.SaveChangesAsync();

            return Ok(todo);
        }
    }
}
