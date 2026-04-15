namespace JovenVision.Application.Common
{
    public class NotFoundException : Exception
    {
        public NotFoundException(string entityName, int id)
            : base($"{entityName} con id {id} no fue encontrado.") { }

        public NotFoundException(string message) : base(message) { }
    }
}
