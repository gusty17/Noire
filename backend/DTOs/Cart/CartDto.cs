namespace backend.DTOs.Cart
{
    public class CartDto
    {
        public List<CartItemDto>? Items { get; set; }

        public decimal TotalPrice { get; set; }
    }
}