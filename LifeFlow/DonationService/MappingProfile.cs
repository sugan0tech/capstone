using System.Diagnostics.CodeAnalysis;
using AutoMapper;
using DonationService.Auth.Dto;
using DonationService.Entities;
using DonationService.Features.Address;
using DonationService.Features.BloodCenter;
using DonationService.Features.Client;
using DonationService.Features.DonationSlot;
using DonationService.Features.Donor;
using DonationService.Features.Orders;
using DonationService.Features.Payment;
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
        CreateMap<User, UserDto>()
            .ForMember(dto => dto.UserId, act => act.MapFrom(src => src.Id))
            .ForAllMembers(opts => { opts.Condition((src, dest, srcMember) => srcMember != null); });
        CreateMap<UserDto, User>()
            .ForMember(entity => entity.Id, act => act.MapFrom(dto => dto.UserId))
            .ForMember(entity => entity.Password, opt => opt.Condition(src => src.Password is { Length: > 0 }))
            .ForMember(entity => entity.HashKey, opt => opt.Condition(src => src.HashKey is { Length: > 0 }))
            .ForAllMembers(opts => { opts.Condition((src, dest, srcMember) => srcMember != null); });

        CreateMap<User, RegisterDTO>().ReverseMap();

        CreateMap<Donor, DonorDto>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        CreateMap<DonorDto, Donor>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

        CreateMap<Donor, DonorFetchDto>().ReverseMap();

        CreateMap<Address, AddressDto>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        CreateMap<AddressDto, Address>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

        CreateMap<BloodCenter, BloodCenterDto>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        CreateMap<BloodCenterDto, BloodCenter>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        CreateMap<BloodCenter, BloodCenterFetchDto>().ReverseMap();

        CreateMap<DonationSlot, DonationSlotDto>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        CreateMap<DonationSlotDto, DonationSlot>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        CreateMap<UnitBag, UnitBagDto>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        CreateMap<UnitBagDto, UnitBag>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

        // User sessions
        CreateMap<UserSessionDto, UserSession>()
            .ForMember(entity => entity.Id, act => act.MapFrom(dto => dto.SessionId));
        CreateMap<UserSession, UserSessionDto>()
            .ForMember(dto => dto.SessionId, act => act.MapFrom(src => src.Id));

        #region OrderService

        CreateMap<Order, OrderDto>().ReverseMap();
        CreateMap<Payment, PaymentDto>().ReverseMap();
        CreateMap<Client, ClientDto>().ReverseMap();

        #endregion
    }
}