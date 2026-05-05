namespace backend.Models
{
    public class Order
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public User? User { get; set; }

        public decimal TotalPrice { get; set; }

        public string Status { get; set; } = "Pending";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<OrderItem>? Items { get; set; }
    }
}