using backend.DTOs.Collection;
using backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CollectionController : ControllerBase
    {
        private readonly ICollectionService _collectionService;

        public CollectionController(ICollectionService collectionService)
        {
            _collectionService = collectionService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var collections = await _collectionService.GetAllAsync();
            return Ok(collections);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var collection = await _collectionService.GetByIdAsync(id);

            if (collection == null)
                return NotFound();

            return Ok(collection);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create(CreateCollectionDto dto)
        {
            var collection = await _collectionService.CreateAsync(dto);
            return Ok(collection);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, UpdateCollectionDto dto)
        {
            var result = await _collectionService.UpdateAsync(id, dto);

            if (!result)
                return NotFound();

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _collectionService.DeleteAsync(id);

            if (!result)
                return NotFound();

            return NoContent();
        }
    }
}