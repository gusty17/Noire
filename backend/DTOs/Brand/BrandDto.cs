namespace backend.DTOs.Brand
{
    public class BrandDto
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public bool IsFeatured { get; set; }
        public int ProductCount { get; set; }
    }
}