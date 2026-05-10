namespace backend.DTOs.Order
{
    public class OrderDto
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public string? UserEmail { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Address { get; set; }

        public decimal TotalPrice { get; set; }
        public string? Status { get; set; }

        public DateTime CreatedAt { get; set; }

        public List<OrderItemDto>? Items { get; set; }
    }
}