using backend.DTOs.Order;

namespace backend.Interfaces
{
    public interface IOrderService
    {
        Task<OrderDto> CreateOrderAsync(int userId);

        Task<IEnumerable<OrderDto>> GetUserOrdersAsync(int userId);

        Task<IEnumerable<OrderDto>> GetAllOrdersAsync();

        Task<bool> UpdateOrderStatusAsync(int orderId, string status);
    }
}