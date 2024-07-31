using System.ComponentModel.DataAnnotations;

namespace DonationService.Commons;

public class BaseEntity
{
    [Key] public int Id { get; set; }
    public bool IsDeleted { get; set; }

    // todo all the dates in entites will be moved with offset
    public DateTimeOffset? DeletedAt { get; set; }

    public void Undo()
    {
        IsDeleted = false;
        DeletedAt = null;
    }
}