using backend.Data;
using backend.DTOs.Order;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class OrderService : IOrderService
    {
        private readonly ApplicationDbContext _context;

        public OrderService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<OrderDto> CreateOrderAsync(int userId)
        {
            var cart = await _context.Carts
                .Include(c => c.Items)
                .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null || !cart.Items.Any())
                throw new Exception("Cart is empty");

            var order = new Order
            {
                UserId = userId,
                Items = new List<OrderItem>()
            };

            decimal total = 0;

            foreach (var item in cart.Items)
            {
                var orderItem = new OrderItem
                {
                    ProductId = item.ProductId,
                    ProductName = item.Product.Name,
                    Price = item.Product.Price,
                    Quantity = item.Quantity
                };

                total += item.Product.Price * item.Quantity;
                order.Items.Add(orderItem);
            }

            order.TotalPrice = total;

            _context.Orders.Add(order);

            // 🔥 Clear cart after checkout
            _context.CartItems.RemoveRange(cart.Items);

            await _context.SaveChangesAsync();

            return new OrderDto
            {
                Id = order.Id,
                TotalPrice = order.TotalPrice,
                Status = order.Status,
                CreatedAt = order.CreatedAt,
                Items = order.Items.Select(i => new OrderItemDto
                {
                    ProductName = i.ProductName,
                    Price = i.Price,
                    Quantity = i.Quantity
                }).ToList()
            };
        }

        public async Task<IEnumerable<OrderDto>> GetUserOrdersAsync(int userId)
        {
            return await _context.Orders
                .Where(o => o.UserId == userId)
                .Include(o => o.Items)
                .Select(o => new OrderDto
                {
                    Id = o.Id,
                    TotalPrice = o.TotalPrice,
                    Status = o.Status,
                    CreatedAt = o.CreatedAt,
                    Items = o.Items.Select(i => new OrderItemDto
                    {
                        ProductName = i.ProductName,
                        Price = i.Price,
                        Quantity = i.Quantity
                    }).ToList()
                })
                .ToListAsync();
        }
    }
}