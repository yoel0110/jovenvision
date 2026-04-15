using System.ComponentModel.DataAnnotations;

namespace JovenVision.Application.DTOs.Attendance
{
    public class AttendanceRequestDto
    {
        [Required(ErrorMessage = "El miembro es obligatorio.")]
        public int MemberId { get; set; }

        [Required(ErrorMessage = "El evento es obligatorio.")]
        public int EventId { get; set; }

        [Required(ErrorMessage = "El estado es obligatorio.")]
        [RegularExpression("^(Present|Absent|Justified)$", ErrorMessage = "El estado debe ser Present, Absent o Justified.")]
        public string Status { get; set; } = "Present";
    }
}
