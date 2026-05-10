using backend.DTOs.Auth;

namespace backend.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
        Task<AuthResponseDto?> LoginAsync(LoginDto dto);
        Task<bool> UpdateUserAsync(int userId, UpdateUserDto dto);
    }
}