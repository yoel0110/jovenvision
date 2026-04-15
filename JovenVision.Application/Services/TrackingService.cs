using JovenVision.Application.Services.Interfaces;
using JovenVision.Domain.Entities;
using JovenVision.Infrastructure.Interfaces;

namespace JovenVision.Application.Services
{
    public class TrackingService : ITrackingService
    {
        private readonly ITrackingRepository _trackingRepository;

        public TrackingService(ITrackingRepository trackingRepository)
        {
            _trackingRepository = trackingRepository;
        }

        public Task<IEnumerable<Tracking>> GetAllAsync() =>
            _trackingRepository.GetAllAsync();

        public Task<Tracking> GetByIdAsync(int id) =>
            _trackingRepository.GetByIdAsync(id);

        public Task AddAsync(Tracking tracking) =>
            _trackingRepository.AddAsync(tracking);

        public Task UpdateAsync(Tracking tracking) =>
            _trackingRepository.UpdateAsync(tracking);

        public Task DeleteAsync(int id) =>
            _trackingRepository.DeleteAsync(id);

        public Task<IEnumerable<Tracking>> GetByMemberAsync(int memberId) =>
            _trackingRepository.GetByMemberAsync(memberId);
    }
}
