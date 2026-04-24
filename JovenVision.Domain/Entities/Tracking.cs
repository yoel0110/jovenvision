namespace JovenVision.Domain.Entities
{
    public class Tracking
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public DateTime Date { get; set; }
        public string Type { get; set; }
        public string Status { get; set; } = "Pending";
        public int? ResponsibleId { get; set; }
        public virtual User? Responsible { get; set; }
        public int MemberId { get; set; }
        public virtual Member Member { get; set; } = null!;
    }
}
