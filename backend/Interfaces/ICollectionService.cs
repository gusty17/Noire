using backend.DTOs.Collection;

namespace backend.Interfaces
{
    public interface ICollectionService
    {
        Task<IEnumerable<CollectionDto>> GetAllAsync();
        Task<CollectionDto?> GetByIdAsync(int id);
        Task<CollectionDto> CreateAsync(CreateCollectionDto dto);
        Task<bool> UpdateAsync(int id, UpdateCollectionDto dto);
        Task<bool> DeleteAsync(int id);
    }
}