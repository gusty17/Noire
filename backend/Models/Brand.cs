namespace backend.Models
{
    public class Brand
    {
        public int Id { get; set; }
        public string? Name { get; set; }

        public bool IsFeatured { get; set; }

        public ICollection<Product>? Products { get; set; }
    }
}