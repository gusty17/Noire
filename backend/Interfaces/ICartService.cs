using backend.DTOs.Cart;

namespace backend.Interfaces
{
    public interface ICartService
    {
        Task<CartDto> GetCartAsync(int userId);

        Task AddToCartAsync(int userId, AddToCartDto dto);

        Task RemoveFromCartAsync(int userId, int productId);

        Task ClearCartAsync(int userId);
    }
}