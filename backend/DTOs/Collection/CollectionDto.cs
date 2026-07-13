namespace backend.DTOs.Collection
{
    public class CollectionDto
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public bool IsFeatured { get; set; }
        public int ProductCount { get; set; }
    }
}