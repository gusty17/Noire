using backend.Data;
using backend.DTOs.Brand;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class BrandService : IBrandService
    {
        private readonly ApplicationDbContext _context;

        public BrandService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<BrandDto>> GetAllAsync()
        {
            return await _context.Brands
                .Select(b => new BrandDto
                {
                    Id = b.Id,
                    Name = b.Name,
                    IsFeatured = b.IsFeatured,
                    ProductCount = b.Products.Count()
                })
                .ToListAsync();
        }

        public async Task<BrandDto?> GetByIdAsync(int id)
        {
            var brand = await _context.Brands.FindAsync(id);

            if (brand == null) return null;

            return new BrandDto
            {
                Id = brand.Id,
                Name = brand.Name,
                IsFeatured = brand.IsFeatured
            };
        }

        public async Task<BrandDto> CreateAsync(CreateBrandDto dto)
        {
            var brand = new Brand
            {
                Name = dto.Name
            };

            _context.Brands.Add(brand);
            await _context.SaveChangesAsync();

            return new BrandDto
            {
                Id = brand.Id,
                Name = brand.Name,
                IsFeatured = brand.IsFeatured
            };
        }

        public async Task<bool> UpdateAsync(int id, UpdateBrandDto dto)
        {
            var brand = await _context.Brands.FindAsync(id);

            if (brand == null) return false;

            brand.Name = dto.Name;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var brand = await _context.Brands.FindAsync(id);

            if (brand == null) return false;

            _context.Brands.Remove(brand);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> SetFeaturedAsync(int id, bool isFeatured)
        {
            var brand = await _context.Brands.FindAsync(id);

            if (brand == null) return false;

            brand.IsFeatured = isFeatured;
            await _context.SaveChangesAsync();

            return true;
            
        }
    }
}