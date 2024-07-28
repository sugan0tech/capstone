namespace DonationService.Features.Address.Query;

public interface IQueryHandler<TQuery, TResult>
{
    Task<TResult> Handle(TQuery query);
}