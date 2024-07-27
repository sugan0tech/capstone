using DonationService.Commons.Enums;
using DonationService.DonationSlot;

namespace DonationService.Donor;

/// <summary>
/// Interface defining operations for managing donors.
/// </summary>
public interface IDonorService
{
    /// <summary>
    /// Retrieves a donor by their associated user ID.
    /// </summary>
    /// <param name="userId">The ID of the user associated with the donor.</param>
    /// <returns>A <see cref="Task{DonorDto}"/> representing the asynchronous operation, with a <see cref="DonorDto"/> result containing donor details.</returns>
    Task<DonorDto> GetByUserId(int userId);

    /// <summary>
    /// Retrieves a donor by their unique donor ID.
    /// </summary>
    /// <param name="donorId">The unique ID of the donor.</param>
    /// <returns>A <see cref="Task{DonorDto}"/> representing the asynchronous operation, with a <see cref="DonorDto"/> result containing donor details.</returns>
    Task<DonorDto> GetById(int donorId);

    /// <summary>
    /// Retrieves all donors.
    /// </summary>
    /// <returns>A <see cref="Task{List{DonorDto}}"/> representing the asynchronous operation, with a list of <see cref="DonorDto"/> objects.</returns>
    Task<List<DonorDto>> GetAll();

    /// <summary>
    /// Retrieves donors based on their location.
    /// </summary>
    /// <param name="lat">The latitude of the location.</param>
    /// <param name="lon">The longitude of the location.</param>
    /// <returns>A <see cref="Task{List{DonorFetchDto}}"/> representing the asynchronous operation, with a list of <see cref="DonorDto"/> objects.</returns>
    Task<List<DonorFetchDto>> GetByLocation(double lat, double lon);

    /// <summary>
    /// Retrieves donors based on their location and blood type.
    /// </summary>
    /// <param name="lat">The latitude of the location.</param>
    /// <param name="lon">The longitude of the location.</param>
    /// <param name="bloodType">The antigen type of the blood.</param>
    /// <param name="subtype">The subtype of the blood.</param>
    /// <returns>A <see cref="Task{List{DonorFetchDto}}"/> representing the asynchronous operation, with a list of <see cref="DonorDto"/> objects.</returns>
    Task<List<DonorFetchDto>> GetByLocationAndBloodType(double lat, double lon, AntigenType bloodType, BloodSubtype subtype);

    /// <summary>
    /// Deletes a donor by their unique donor ID.
    /// </summary>
    /// <param name="id">The unique ID of the donor to be deleted.</param>
    /// <returns>A <see cref="Task{DonorDto}"/> representing the asynchronous operation, with a <see cref="DonorDto"/> result containing the deleted donor's details.</returns>
    Task<DonorDto> DeleteById(int id);

    /// <summary>
    /// Adds a new donor.
    /// </summary>
    /// <param name="donor">The donor details to be added.</param>
    /// <returns>A <see cref="Task{DonorDto}"/> representing the asynchronous operation, with a <see cref="DonorDto"/> result containing the added donor's details.</returns>
    Task<DonorDto> Add(DonorDto donor);

    /// <summary>
    /// Updates an existing donor's details.
    /// </summary>
    /// <param name="donor">The donor details to be updated.</param>
    /// <returns>A <see cref="Task{DonorDto}"/> representing the asynchronous operation, with a <see cref="DonorDto"/> result containing the updated donor's details.</returns>
    Task<DonorDto> Update(DonorDto donor);

    public Task<List<DonationSlotDto>> GetCompletedSlotsByDonor(int donorId);
    public Task<DonationSlotDto> GetCurrentSlotsByDonor(int donorId);
}