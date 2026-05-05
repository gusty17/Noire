using backend.DTOs.Product;
using backend.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _service;

        public ProductController(IProductService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _service.GetAllAsync());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _service.GetByIdAsync(id);
            if (product == null) return NotFound();

            return Ok(product);
        }

        [HttpGet("brand/{brandId}")]
        public async Task<IActionResult> GetByBrand(int brandId)
        {
            return Ok(await _service.GetByBrandAsync(brandId));
        }

        [HttpGet("collection/{collectionId}")]
        public async Task<IActionResult> GetByCollection(int collectionId)
        {
            return Ok(await _service.GetByCollectionAsync(collectionId));
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] CreateProductDto dto)
        {
            try
            {
                var product = await _service.CreateAsync(dto);
                return Ok(product);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id,[FromForm] UpdateProductDto dto)
        {
            var result = await _service.UpdateAsync(id, dto);

            if (!result) return NotFound();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _service.DeleteAsync(id);

            if (!result) return NotFound();

            return NoContent();
        }
    }
}