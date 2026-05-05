namespace backend.DTOs.Order
{
    public class OrderDto
    {
        public int Id { get; set; }

        public decimal TotalPrice { get; set; }
        public string? Status { get; set; }

        public DateTime CreatedAt { get; set; }

        public List<OrderItemDto>? Items { get; set; }
    }
}