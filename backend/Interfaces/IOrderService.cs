using backend.DTOs.Order;

namespace backend.Interfaces
{
    public interface IOrderService
    {
        Task<OrderDto> CreateOrderAsync(int userId);

        Task<IEnumerable<OrderDto>> GetUserOrdersAsync(int userId);
    }
}