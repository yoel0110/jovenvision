using System.ComponentModel.DataAnnotations;

namespace JovenVision.Application.DTOs.Role
{
    public class RoleRequestDto
    {
        [Required(ErrorMessage = "El nombre del rol es obligatorio.")]
        [StringLength(50, ErrorMessage = "El nombre no puede superar 50 caracteres.")]
        public string Name { get; set; } = string.Empty;
    }
}
