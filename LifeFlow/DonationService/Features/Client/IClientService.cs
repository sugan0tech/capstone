namespace DonationService.Features.Client;

public interface IClientService
{
    public Task<ClientDto> getByUserId(int userId);
}