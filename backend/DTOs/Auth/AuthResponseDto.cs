namespace backend.DTOs.Auth
{
    public class AuthResponseDto
    {
        public string? Token { get; set; }
        public UserResponseDto? User { get; set; }
    }

    public class UserResponseDto
    {
        public int Id { get; set; }
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string? Role { get; set; }
    }
}