namespace JovenVision.Domain.Entities
{
    public class Event : EntityBase
    {
        public string Title { get; set; }
        public string Type { get; set; }
        public DateTime Date { get; set; }
        public string Location { get; set; }
        public int Capacity { get; set; }
        public int GroupId { get; set; }
    }
}
