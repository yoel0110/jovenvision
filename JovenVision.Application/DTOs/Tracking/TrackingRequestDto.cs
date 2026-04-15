using System.ComponentModel.DataAnnotations;

namespace JovenVision.Application.DTOs.Tracking
{
    public class TrackingRequestDto
    {
        [Required(ErrorMessage = "La descripción es obligatoria.")]
        [StringLength(500, ErrorMessage = "La descripción no puede superar 500 caracteres.")]
        public string Description { get; set; } = string.Empty;

        [Required(ErrorMessage = "La fecha es obligatoria.")]
        public DateTime Date { get; set; }

        [Required(ErrorMessage = "El tipo es obligatorio.")]
        public string Type { get; set; } = string.Empty;

        [Required(ErrorMessage = "El miembro es obligatorio.")]
        public int MemberId { get; set; }
    }
}
