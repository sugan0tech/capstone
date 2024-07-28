using System.Diagnostics.CodeAnalysis;
using AutoMapper;
using DonationService.Auth;
using DonationService.Auth.Dto;
using DonationService.Entities;
using DonationService.Features.Address;
using DonationService.Features.BloodCenter;
using DonationService.Features.DonationSlot;
using DonationService.Features.Donor;
using DonationService.Features.UnitBag;
using DonationService.Features.User;
using DonationService.Features.UserSession;

namespace DonationService;

[ExcludeFromCodeCoverage]
public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // to fix the skip mapping for FK ids which set as optional, to skip those ( by default it's set to 0 ()
        CreateMap<int?, int>().ConvertUsing((src, dest) => src ?? dest);

        // User mappings
        CreateMap<Entities.User, UserDto>()
            .ForMember(dto => dto.UserId, act => act.MapFrom(src => src.Id))
            .ForAllMembers(opts => { opts.Condition((src, dest, srcMember) => srcMember != null); });
        CreateMap<UserDto, Entities.User>()
            .ForMember(entity => entity.Id, act => act.MapFrom(dto => dto.UserId))
            .ForMember(entity => entity.Password, opt => opt.Condition(src => src.Password is { Length: > 0 }))
            .ForMember(entity => entity.HashKey, opt => opt.Condition(src => src.HashKey is { Length: > 0 }))
            .ForAllMembers(opts => { opts.Condition((src, dest, srcMember) => srcMember != null); });

        CreateMap<Entities.User, RegisterDTO>().ReverseMap();

        CreateMap<Entities.Donor, DonorDto>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        CreateMap<DonorDto, Entities.Donor>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

        CreateMap<Entities.Donor, DonorFetchDto>().ReverseMap();

        CreateMap<Address, AddressDto>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        CreateMap<AddressDto, Address>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

        CreateMap<Entities.BloodCenter, BloodCenterDto>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        CreateMap<BloodCenterDto, Entities.BloodCenter>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        CreateMap<Entities.BloodCenter, BloodCenterFetchDto>().ReverseMap();

        CreateMap<Entities.DonationSlot, DonationSlotDto>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        CreateMap<DonationSlotDto, Entities.DonationSlot>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        CreateMap<Entities.UnitBag, UnitBagDto>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        CreateMap<UnitBagDto, Entities.UnitBag>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

        // User sessions
        CreateMap<UserSessionDto, Entities.UserSession>()
            .ForMember(entity => entity.Id, act => act.MapFrom(dto => dto.SessionId));
        CreateMap<Entities.UserSession, UserSessionDto>()
            .ForMember(dto => dto.SessionId, act => act.MapFrom(src => src.Id));
    }
}