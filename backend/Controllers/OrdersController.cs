using backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] 
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _service;

        public OrderController(IOrderService service)
        {
            _service = service;
        }

        // POST: api/order (Checkout)
        [HttpPost]
        public async Task<IActionResult> CreateOrder()
        {
            try
            {
                int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

                var order = await _service.CreateOrderAsync(userId);
                return Ok(order);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // GET: api/order
        [HttpGet]
        public async Task<IActionResult> GetUserOrders()
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var orders = await _service.GetUserOrdersAsync(userId);
            return Ok(orders);
        }
    }
}