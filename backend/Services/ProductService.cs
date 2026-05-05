using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.DTOs.Product;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class ProductService : IProductService
    {
        private readonly ApplicationDbContext _context;

        public ProductService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ProductDto>> GetAllAsync()
        {
            return await _context.Products
                .Include(p => p.Brand)
                .Include(p => p.Collection)
                .Select(p => new ProductDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price,
                    Stock = p.Stock,
                    ImageUrl = p.ImageUrl ?? "",
                    BrandName = p.Brand != null ? p.Brand.Name : "",
                    CollectionName = p.Collection != null ? p.Collection.Name : "",
                })
                .ToListAsync();
        }

        public async Task<ProductDto?> GetByIdAsync(int id)
        {
            var p = await _context.Products
                .Include(p => p.Brand)
                .Include(p => p.Collection)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (p == null) return null;

            return new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Price = p.Price,
                Stock = p.Stock,
                ImageUrl = p.ImageUrl ?? "",
                BrandName = p.Brand != null ? p.Brand.Name : "",
                CollectionName = p.Collection != null ? p.Collection.Name : ""
            };
        }

        public async Task<IEnumerable<ProductDto>> GetByBrandAsync(int brandId)
        {
            return await _context.Products
                .Where(p => p.BrandId == brandId)
                .Include(p => p.Brand)
                .Include(p => p.Collection)
                .Select(p => new ProductDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price,
                    Stock = p.Stock,
                    ImageUrl = p.ImageUrl ?? "",
                    BrandName = p.Brand != null ? p.Brand.Name : "",
                    CollectionName = p.Collection != null ? p.Collection.Name : ""
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<ProductDto>> GetByCollectionAsync(int collectionId)
        {
            return await _context.Products
                .Where(p => p.CollectionId == collectionId)
                .Include(p => p.Brand)
                .Include(p => p.Collection)
                .Select(p => new ProductDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price,
                    Stock = p.Stock,
                    ImageUrl = p.ImageUrl ?? "",
                    BrandName = p.Brand != null ? p.Brand.Name : "",
                    CollectionName = p.Collection != null ? p.Collection.Name : ""
                })
                .ToListAsync();
        }

        public async Task<ProductDto> CreateAsync(CreateProductDto dto)
        {
            try
            {
                // Validate required fields
                if (string.IsNullOrWhiteSpace(dto.Name))
                    throw new Exception("Product name is required");

                // Validate Brand exists
                var brandExists = await _context.Brands.AnyAsync(b => b.Id == dto.BrandId);
                if (!brandExists)
                    throw new Exception($"Brand with ID {dto.BrandId} not found. Please create a brand first.");

                // Validate Collection exists
                var collectionExists = await _context.Collections.AnyAsync(c => c.Id == dto.CollectionId);
                if (!collectionExists)
                    throw new Exception($"Collection with ID {dto.CollectionId} not found. Please create a collection first.");

                string? imagePath = null;

                if (dto.Image != null)
                {
                    try
                    {
                        var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");

                        if (!Directory.Exists(folderPath))
                            Directory.CreateDirectory(folderPath);

                        var fileName = Guid.NewGuid() + Path.GetExtension(dto.Image.FileName);
                        var fullPath = Path.Combine(folderPath, fileName);

                        using (var stream = new FileStream(fullPath, FileMode.Create))
                        {
                            await dto.Image.CopyToAsync(stream);
                        }

                        imagePath = $"/images/{fileName}";
                    }
                    catch (Exception fileEx)
                    {
                        throw new Exception($"Error uploading image: {fileEx.Message}");
                    }
                }

                var product = new Product
                {
                    Name = dto.Name,
                    Description = dto.Description,
                    Price = dto.Price,
                    Stock = dto.Stock,
                    ImageUrl = imagePath,
                    BrandId = dto.BrandId,
                    CollectionId = dto.CollectionId,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Products.Add(product);
                await _context.SaveChangesAsync();

                var created = await GetByIdAsync(product.Id);
                return created!;
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to create product: {ex.Message}");
            }
        }

        public async Task<bool> UpdateAsync(int id, UpdateProductDto dto)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null) return false;

            if (dto.Image != null)
            {
                var folderPath = Path.Combine("wwwroot", "images");

                if (!Directory.Exists(folderPath))
                    Directory.CreateDirectory(folderPath);

                var fileName = Guid.NewGuid() + Path.GetExtension(dto.Image.FileName);
                var fullPath = Path.Combine(folderPath, fileName);

                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    await dto.Image.CopyToAsync(stream);
                }

                product.ImageUrl = $"/images/{fileName}";
            }

            product.Name = dto.Name;
            product.Description = dto.Description;
            product.Price = dto.Price;
            product.Stock = dto.Stock;
            product.BrandId = dto.BrandId;
            product.CollectionId = dto.CollectionId;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null) return false;

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}