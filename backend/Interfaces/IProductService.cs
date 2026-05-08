using backend.DTOs.Product;

namespace backend.Interfaces
{
    public interface IProductService
    {
        Task<IEnumerable<ProductDto>> GetAllAsync();
        Task<ProductDto?> GetByIdAsync(int id);

        Task<IEnumerable<ProductDto>> GetByBrandAsync(int brandId);
        Task<IEnumerable<ProductDto>> GetByCollectionAsync(int collectionId);
        Task<IEnumerable<ProductDto>> SearchAsync(string query);

        Task<ProductDto> CreateAsync(CreateProductDto dto);
        Task<bool> UpdateAsync(int id, UpdateProductDto dto);
        Task<bool> DeleteAsync(int id);
    }
}