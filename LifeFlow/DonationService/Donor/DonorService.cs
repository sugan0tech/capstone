using AutoMapper;
using DonationService.Address.Request;
using DonationService.Commons;
using DonationService.Commons.Enums;
using DonationService.Exceptions;
using MediatR;

namespace DonationService.Donor;

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

    public async Task<List<DonorFetchDto>> GetByLocation(double lat, double lon)
    {
        var donors = await repo.GetAll();
        var distancedNearbyDonors = new List<DonorFetchDto>();
        donors.ForEach(d =>
        {
            if (d.AddressId == null)
            {
                return;
            }

            var address = mediator.Send(new GetAddressByIdRequest { AddressId = (int)d.AddressId }).Result;
            if (GetDistance(address.Latitude, address.Longitude, lat, lon) <= 50)
                distancedNearbyDonors.Add(mapper.Map<DonorFetchDto>(d));
        });


        return distancedNearbyDonors.OrderBy(donor => donor.distance).Take(5).ToList();
    }

    public async Task<List<DonorFetchDto>> GetByLocationAndBloodType(double lat, double lon, AntigenType bloodType,
        BloodSubtype subtype)
    {
        var donors = await repo.GetAll();
        var distancedNearbyDonors = new List<DonorFetchDto>();
        donors.ForEach(d =>
        {
            if (d.AddressId == null)
            {
                return;
            }

            var address = mediator.Send(new GetAddressByIdRequest { AddressId = (int)d.AddressId }).Result;
            var distance = GetDistance(address.Latitude, address.Longitude, lat, lon);
            if (IsCompatibleBloodType(d.BloodAntigenType, bloodType) &&
                d.BloodAntigenType == bloodType &&
                d.BloodSubtype == subtype &&
                distance <= 50)
            {
                var donorFecable = mapper.Map<DonorFetchDto>(d);
                donorFecable.distance = distance;
                distancedNearbyDonors.Add(donorFecable);
            }
        });


        return distancedNearbyDonors.OrderBy(donor => donor.distance).Take(5).ToList();
    }

    public async Task<DonorDto> DeleteById(int id)
    {
        var donor = await repo.DeleteById(id);
        return mapper.Map<DonorDto>(donor);
    }

    public async Task<DonorDto> Add(DonorDto donorDto)
    {
        try
        {
            await GetByUserId(donorDto.UserId);
        }
        catch (KeyNotFoundException)
        {
            var donor = mapper.Map<Donor>(donorDto);
            donor = await repo.Add(donor);
            return mapper.Map<DonorDto>(donor);
        }

        throw new DuplicateRequestException("This user already have donor profile");
    }

    public async Task<DonorDto> Update(DonorDto donorDto)
    {
        var donor = await repo.GetById(donorDto.Id);
        if (donorDto.AddressId != null)
        {
            var address = await mediator.Send(new GetAddressByIdRequest { AddressId = (int)donorDto.AddressId });
            if (address.EntityId == donor.Id && address.EntityType.Equals("Donor"))
            {
                donor.AddressId = donorDto.AddressId;
            }
            else
            {
                throw new InvalidUpdateOperationException("Donor already has address");
            }
        }

        mapper.Map(donorDto, donor);
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


    private static readonly Dictionary<AntigenType, List<AntigenType>> BloodTypeCompatibility = new()
    {
        {
            AntigenType.OPositive,
            new List<AntigenType>
                { AntigenType.OPositive, AntigenType.APositive, AntigenType.BPositive, AntigenType.ABPositive }
        },
        {
            AntigenType.ONegative,
            new List<AntigenType>
            {
                AntigenType.OPositive, AntigenType.ONegative, AntigenType.APositive, AntigenType.ANegative,
                AntigenType.BPositive, AntigenType.BNegative, AntigenType.ABPositive, AntigenType.ABNegative
            }
        },
        { AntigenType.APositive, new List<AntigenType> { AntigenType.APositive, AntigenType.ABPositive } },
        {
            AntigenType.ANegative,
            new List<AntigenType>
                { AntigenType.APositive, AntigenType.ANegative, AntigenType.ABPositive, AntigenType.ABNegative }
        },
        { AntigenType.BPositive, new List<AntigenType> { AntigenType.BPositive, AntigenType.ABPositive } },
        {
            AntigenType.BNegative,
            new List<AntigenType>
                { AntigenType.BPositive, AntigenType.BNegative, AntigenType.ABPositive, AntigenType.ABNegative }
        },
        { AntigenType.ABPositive, new List<AntigenType> { AntigenType.ABPositive } },
        { AntigenType.ABNegative, new List<AntigenType> { AntigenType.ABPositive, AntigenType.ABNegative } }
    };


    private bool IsCompatibleBloodType(AntigenType donorType, AntigenType recipientType)
    {
        return BloodTypeCompatibility.ContainsKey(donorType) &&
               BloodTypeCompatibility[donorType].Contains(recipientType);
    }
}