using MediatR;

namespace DonationService.Features.BloodCenter.Queries;

public class GetBloodCenterQuery(int centerId) : IRequest<BloodCenterDto>
{
    public int CenterId { get; init; } = centerId;
}