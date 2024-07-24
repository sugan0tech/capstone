using System.ComponentModel.DataAnnotations;

namespace DonationService.Commons;

public class BaseEntity
{
    [Key] public int Id { get; set; }
}