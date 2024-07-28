using MediatR;

namespace DonationService.Features.BloodCenter.Queries;

public class GetBloodCenterQueryHandler(BloodCenterService bloodCenterService)
    : IRequestHandler<GetBloodCenterQuery, BloodCenterDto>
{
    public Task<BloodCenterDto> Handle(GetBloodCenterQuery request, CancellationToken cancellationToken)
    {
        return bloodCenterService.GetById(request.CenterId);
    }
}