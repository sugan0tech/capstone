using AutoMapper;
using DonationService.Address.Request;
using DonationService.Commons;
using DonationService.Commons.Enums;
using MediatR;

namespace DonationService.Donor
{
    public class DonorService(IBaseRepo<Donor> repo, IMediator mediator, IMapper mapper) : IDonorService
    {
        public Task<DonorDto> GetByUserId(int userId)
        {
            var donor = repo.GetAll().Result.FirstOrDefault(d => d.UserId == userId);
            if (donor == null)
                throw new KeyNotFoundException($"Donor with UserId {userId} not found");

            return Task.FromResult(mapper.Map<DonorDto>(donor));
        }

        public async Task<DonorDto> GetById(int donorId)
        {
            var donor = await repo.GetById(donorId);
            return mapper.Map<DonorDto>(donor);
        }

        public async Task<List<DonorDto>> GetAll()
        {
            var donors = await repo.GetAll();
            return mapper.Map<List<DonorDto>>(donors);
        }

        public async Task<List<DonorDto>> GetByLocation(double lat, double lon)
        {
            var donors = await repo.GetAll();
            var nearbyDonors = donors.Where(d =>
                {
                    if (d.AddressId == null)
                    {
                        return false;
                    }
                    var address = mediator.Send(new GetAddressByIdRequest{AddressId = (int) d.AddressId}).Result;
                    return GetDistance(address.Latitude, address.Longitude, lat, lon)
                           <= 50;
                })
                .Take(5)
                .ToList();

            return mapper.Map<List<DonorDto>>(nearbyDonors);
        }

        public async Task<List<DonorDto>> GetByLocationAndBloodType(double lat, double lon, AntigenType bloodType,
            BloodSubtype subtype)
        {
            var donors = await repo.GetAll();
            var nearbyDonors = donors.Where(d =>
                {
                    if (d.AddressId == null)
                    {
                        return false;
                    }
                    var address = mediator.Send(new GetAddressByIdRequest{AddressId = (int) d.AddressId}).Result;
                    return d.BloodAntigenType == bloodType &&
                           d.BloodSubtype == subtype &&
                           GetDistance(address.Latitude, address.Longitude, lat, lon) <= 50;
                })
                .Take(5)
                .ToList();

            return mapper.Map<List<DonorDto>>(nearbyDonors);
        }

        public async Task<DonorDto> DeleteById(int id)
        {
            var donor = await repo.DeleteById(id);
            return mapper.Map<DonorDto>(donor);
        }

        public async Task<DonorDto> Add(DonorDto donorDto)
        {
            var donor = mapper.Map<Donor>(donorDto);
            donor = await repo.Add(donor);
            return mapper.Map<DonorDto>(donor);
        }

        public async Task<DonorDto> Update(DonorDto donorDto)
        {
            var donor = mapper.Map<Donor>(donorDto);
            donor = await repo.Update(donor);
            return mapper.Map<DonorDto>(donor);
        }

        private double GetDistance(double lat1, double lon1, double lat2, double lon2)
        {
            const double R = 6371e3; // metres
            var phi1 = lat1 * Math.PI / 180;
            var phi2 = lat2 * Math.PI / 180;
            var deltaPhi = (lat2 - lat1) * Math.PI / 180;
            var deltaLambda = (lon2 - lon1) * Math.PI / 180;

            var a = Math.Sin(deltaPhi / 2) * Math.Sin(deltaPhi / 2) +
                    Math.Cos(phi1) * Math.Cos(phi2) *
                    Math.Sin(deltaLambda / 2) * Math.Sin(deltaLambda / 2);
            var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));

            return R * c / 1000; // distance in km
        }
    }
}