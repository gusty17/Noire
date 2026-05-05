using backend.Data;
using backend.DTOs.Cart;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class CartService : ICartService
    {
        private readonly ApplicationDbContext _context;

        public CartService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<CartDto> GetCartAsync(int userId)
        {
            var cart = await GetOrCreateCart(userId);

            var items = cart.Items.Select(i => new CartItemDto
            {
                ProductId = i.ProductId,
                ProductName = i.Product.Name,
                ImageUrl = i.Product.ImageUrl,
                Price = i.Product.Price,
                Quantity = i.Quantity
            }).ToList();

            var total = items.Sum(i => i.Price * i.Quantity);

            return new CartDto
            {
                Items = items,
                TotalPrice = total
            };
        }

        public async Task AddToCartAsync(int userId, AddToCartDto dto)
        {
            var cart = await GetOrCreateCart(userId);

            var item = cart.Items
                .FirstOrDefault(i => i.ProductId == dto.ProductId);

            if (item != null)
            {
                item.Quantity += dto.Quantity;
            }
            else
            {
                cart.Items.Add(new CartItem
                {
                    ProductId = dto.ProductId,
                    Quantity = dto.Quantity
                });
            }

            await _context.SaveChangesAsync();
        }

        public async Task RemoveFromCartAsync(int userId, int productId)
        {
            var cart = await GetOrCreateCart(userId);

            var item = cart.Items
                .FirstOrDefault(i => i.ProductId == productId);

            if (item != null)
            {
                _context.CartItems.Remove(item);
                await _context.SaveChangesAsync();
            }
        }

        public async Task ClearCartAsync(int userId)
        {
            var cart = await GetOrCreateCart(userId);

            _context.CartItems.RemoveRange(cart.Items);
            await _context.SaveChangesAsync();
        }

        // 🔥 Helper method (VERY IMPORTANT)
        private async Task<Cart> GetOrCreateCart(int userId)
        {
            var cart = await _context.Carts
                .Include(c => c.Items)
                .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
            {
                cart = new Cart
                {
                    UserId = userId,
                    Items = new List<CartItem>()
                };

                _context.Carts.Add(cart);
                await _context.SaveChangesAsync();
            }

            return cart;
        }
    }
}