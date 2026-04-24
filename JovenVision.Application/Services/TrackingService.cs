using JovenVision.Application.Common;
using JovenVision.Application.Services.Interfaces;
using JovenVision.Domain.Entities;
using JovenVision.Infrastructure.Interfaces;

namespace JovenVision.Application.Services
{
    public class TrackingService : ITrackingService
    {
        private readonly ITrackingRepository _trackingRepository;
        private readonly IMemberRepository _memberRepository;

        public TrackingService(ITrackingRepository trackingRepository, IMemberRepository memberRepository)
        {
            _trackingRepository = trackingRepository;
            _memberRepository = memberRepository;
        }

        public Task<IEnumerable<Tracking>> GetAllAsync() =>
            _trackingRepository.GetAllAsync();

        public async Task<Tracking> GetByIdAsync(int id)
        {
            var tracking = await _trackingRepository.GetByIdAsync(id);
            if (tracking is null) throw new NotFoundException("Seguimiento", id);
            return tracking;
        }

        public async Task AddAsync(Tracking tracking)
        {
            var member = await _memberRepository.GetByIdAsync(tracking.MemberId);
            if (member is null) throw new NotFoundException("Miembro", tracking.MemberId);
            await _trackingRepository.AddAsync(tracking);
        }

        public async Task UpdateAsync(Tracking tracking)
        {
            var existing = await _trackingRepository.GetByIdAsync(tracking.Id);
            if (existing is null) throw new NotFoundException("Seguimiento", tracking.Id);
            existing.Description = tracking.Description;
            existing.Date = tracking.Date;
            existing.Type = tracking.Type;
            existing.MemberId = tracking.MemberId;
            existing.Status = tracking.Status;
            existing.ResponsibleId = tracking.ResponsibleId;
            await _trackingRepository.UpdateAsync(existing);
        }

        public async Task DeleteAsync(int id)
        {
            var existing = await _trackingRepository.GetByIdAsync(id);
            if (existing is null) throw new NotFoundException("Seguimiento", id);
            await _trackingRepository.DeleteAsync(id);
        }

        public Task<IEnumerable<Tracking>> GetByMemberAsync(int memberId) =>
            _trackingRepository.GetByMemberAsync(memberId);
    }
}
