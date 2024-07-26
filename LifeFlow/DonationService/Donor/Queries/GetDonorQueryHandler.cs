using MediatR;

namespace DonationService.Donor.Queries;

public class GetDonorQueryHandler(IDonorService donorService) : IRequestHandler<GetDonorQuery, DonorDto>
{
    public Task<DonorDto> Handle(GetDonorQuery request, CancellationToken cancellationToken)
    {
        return donorService.GetById(request.DonorId);
    }
}