namespace backend.DTOs.Product
{
    public class CreateProductDto
    {
        public string? Name { get; set; }
        public string? Description { get; set; }

        public decimal Price { get; set; }
        public int Stock { get; set; }

        public IFormFile? Image { get; set; }

        public int BrandId { get; set; }
        public int CollectionId { get; set; }
    }
}