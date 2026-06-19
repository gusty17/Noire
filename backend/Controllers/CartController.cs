using backend.DTOs.Cart;
using backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // 🔥 All endpoints require login
    public class CartController : ControllerBase
    {
        private readonly ICartService _service;

        public CartController(ICartService service)
        {
            _service = service;
        }

        // GET: api/cart
        [HttpGet]
        public async Task<IActionResult> GetCart()
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var cart = await _service.GetCartAsync(userId);
            return Ok(cart);
        }

        // POST: api/cart
        [HttpPost]
        public async Task<IActionResult> AddToCart(AddToCartDto dto)
        {
            try
            {
                int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

                await _service.AddToCartAsync(userId, dto);
                return Ok(new { message = "Item added to cart" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // DELETE: api/cart/product/5
        [HttpDelete("product/{productId}")]
        public async Task<IActionResult> RemoveFromCart(int productId)
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            await _service.RemoveFromCartAsync(userId, productId);
            return NoContent();
        }

        // DELETE: api/cart/clear
        [HttpDelete("clear")]
        public async Task<IActionResult> ClearCart()
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            await _service.ClearCartAsync(userId);
            return NoContent();
        }
    }
}