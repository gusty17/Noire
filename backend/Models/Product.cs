namespace backend.Models
{
    public class Product
    {
        public int Id { get; set; }

        public string? Name { get; set; }
        public string? Description { get; set; }

        public decimal Price { get; set; }
        public int Stock { get; set; }

        public string? ImageUrl { get; set; }

        // Relations
        public int BrandId { get; set; }
        public Brand? Brand { get; set; }

        public int CollectionId { get; set; }
        public Collection? Collection { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}