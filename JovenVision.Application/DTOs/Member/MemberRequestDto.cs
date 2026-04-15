using System.ComponentModel.DataAnnotations;

namespace JovenVision.Application.DTOs.Member
{
    public class MemberRequestDto
    {
        [Required(ErrorMessage = "El nombre es obligatorio.")]
        [StringLength(100, ErrorMessage = "El nombre no puede superar 100 caracteres.")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "El correo es obligatorio.")]
        [EmailAddress(ErrorMessage = "El correo no tiene un formato válido.")]
        public string Email { get; set; } = string.Empty;

        [Phone(ErrorMessage = "El teléfono no tiene un formato válido.")]
        public string? Phone { get; set; }

        [Required(ErrorMessage = "El estado es obligatorio.")]
        [RegularExpression("^(Active|Inactive|New)$", ErrorMessage = "El estado debe ser Active, Inactive o New.")]
        public string Status { get; set; } = "New";
    }
}
