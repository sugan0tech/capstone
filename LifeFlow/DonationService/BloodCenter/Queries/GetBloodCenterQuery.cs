using MediatR;

namespace DonationService.BloodCenter.Queries;

public class GetBloodCenterQuery(int centerId) : IRequest<BloodCenterDto>
{
    public int CenterId { get; init; } = centerId;
}