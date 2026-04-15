using System.ComponentModel.DataAnnotations;

namespace JovenVision.Application.DTOs.Event
{
    public class EventRequestDto
    {
        [Required(ErrorMessage = "El título es obligatorio.")]
        [StringLength(150, ErrorMessage = "El título no puede superar 150 caracteres.")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "El tipo es obligatorio.")]
        public string Type { get; set; } = string.Empty;

        [Required(ErrorMessage = "La fecha es obligatoria.")]
        public DateTime Date { get; set; }

        [StringLength(200, ErrorMessage = "La ubicación no puede superar 200 caracteres.")]
        public string? Location { get; set; }

        [Range(1, 1000, ErrorMessage = "La capacidad debe estar entre 1 y 1000.")]
        public int Capacity { get; set; }

        [Required(ErrorMessage = "El grupo es obligatorio.")]
        [Range(1, int.MaxValue, ErrorMessage = "El GroupId es obligatorio.")]
        public int GroupId { get; set; } = 0;
    }
}
