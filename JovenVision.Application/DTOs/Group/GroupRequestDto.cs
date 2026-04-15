using System.ComponentModel.DataAnnotations;

namespace JovenVision.Application.DTOs.Group
{
    public class GroupRequestDto
    {
        [Required(ErrorMessage = "El nombre es obligatorio.")]
        [StringLength(100, ErrorMessage = "El nombre no puede superar 100 caracteres.")]
        public string Name { get; set; } = string.Empty;

        [StringLength(500, ErrorMessage = "La descripción no puede superar 500 caracteres.")]
        public string? Description { get; set; }

        [Range(1, 500, ErrorMessage = "La capacidad debe estar entre 1 y 500.")]
        public int Capacity { get; set; }
    }
}
