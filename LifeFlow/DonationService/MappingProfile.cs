using System.Diagnostics.CodeAnalysis;
using DonationService.Address;
using DonationService.BloodCenter;
using DonationService.DonationSlot;
using DonationService.Donor;
using DonationService.UnitBag;
using DonationService.User;
using DonationService.UserSession;

namespace DonationService;

[ExcludeFromCodeCoverage]
public class MappingProfile : AutoMapper.Profile
{
    public MappingProfile()
    {
        // to fix the skip mapping for FK ids which set as optional, to skip those ( by default it's set to 0 ()
        CreateMap<int?, int>().ConvertUsing((src, dest) => src ?? dest);

        // User mappings
        CreateMap<User.User, UserDto>()
            .ForMember(dto => dto.UserId, act => act.MapFrom(src => src.Id))
            .ForAllMembers(opts => { opts.Condition((src, dest, srcMember) => srcMember != null); });
        CreateMap<UserDto, User.User>()
            .ForMember(entity => entity.Id, act => act.MapFrom(dto => dto.UserId))
            .ForMember(entity => entity.Password, opt => opt.Condition(src => src.Password is { Length: > 0 }))
            .ForMember(entity => entity.HashKey, opt => opt.Condition(src => src.HashKey is { Length: > 0 }))
            .ForAllMembers(opts => { opts.Condition((src, dest, srcMember) => srcMember != null); });

        CreateMap<User.User, RegisterDTO>().ReverseMap();
        
        CreateMap<Donor.Donor, DonorDto>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        CreateMap<DonorDto, Donor.Donor>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        
        CreateMap<Donor.Donor, DonorFetchDto>().ReverseMap();
        
        CreateMap<Address.Address, AddressDto>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        CreateMap<AddressDto, Address.Address>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        
        CreateMap<BloodCenter.BloodCenter, BloodCenterDto>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        CreateMap<BloodCenterDto, BloodCenter.BloodCenter>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        
        CreateMap<DonationSlot.DonationSlot, DonationSlotDto>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        CreateMap<DonationSlotDto, DonationSlot.DonationSlot>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        CreateMap<UnitBag.UnitBag, UnitBagDto>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        CreateMap<UnitBagDto, UnitBag.UnitBag>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

        // User sessions
        CreateMap<UserSessionDto, UserSession.UserSession>()
            .ForMember(entity => entity.Id, act => act.MapFrom(dto => dto.SessionId));
        CreateMap<UserSession.UserSession, UserSessionDto>()
            .ForMember(dto => dto.SessionId, act => act.MapFrom(src => src.Id));
    }
}