using backend.Data;
using backend.DTOs.Collection;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class CollectionService : ICollectionService
    {
        private readonly ApplicationDbContext _context;

        public CollectionService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<CollectionDto>> GetAllAsync()
        {
            return await _context.Collections
                .Select(c => new CollectionDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    IsFeatured = c.IsFeatured,
                    ProductCount = c.Products.Count()
                })
                .ToListAsync();
        }

        public async Task<CollectionDto?> GetByIdAsync(int id)
        {
            var collection = await _context.Collections.FindAsync(id);

            if (collection == null) return null;

            return new CollectionDto
            {
                Id = collection.Id,
                Name = collection.Name,
                IsFeatured = collection.IsFeatured
            };
        }

        public async Task<CollectionDto> CreateAsync(CreateCollectionDto dto)
        {
            var collection = new Collection
            {
                Name = dto.Name
            };

            _context.Collections.Add(collection);
            await _context.SaveChangesAsync();

            return new CollectionDto
            {
                Id = collection.Id,
                Name = collection.Name,
                IsFeatured = collection.IsFeatured
            };
        }

        public async Task<bool> UpdateAsync(int id, UpdateCollectionDto dto)
        {
            var collection = await _context.Collections.FindAsync(id);

            if (collection == null) return false;

            collection.Name = dto.Name;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var collection = await _context.Collections.FindAsync(id);

            if (collection == null) return false;

            _context.Collections.Remove(collection);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> SetFeaturedAsync(int id, bool isFeatured)
        {
            var collection = await _context.Collections.FindAsync(id);

            if (collection == null) return false;

            collection.IsFeatured = isFeatured;
            await _context.SaveChangesAsync();

            return true;
        }
    }
}