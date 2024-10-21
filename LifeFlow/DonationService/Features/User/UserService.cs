using AutoMapper;
using DonationService.Commons;
using DonationService.Exceptions;

namespace DonationService.Features.User;

public class UserService(
    IBaseRepo<Entities.User> repo,
    IMapper mapper) : IUserService
{
    public async Task<UserDto> GetById(int userId)
    {
        try
        {
            var user = await repo.GetById(userId);
            return mapper.Map<UserDto>(user);
        }
        catch (KeyNotFoundException e)
        {
            throw;
        }
    }

    /// <intheritdoc />
    public async Task<List<UserDto>> GetAll()
    {
        var users = await repo.GetAll();
        return users.ConvertAll(input => mapper.Map<UserDto>(input)).ToList();
    }

    /// <intheritdoc />
    public async Task<UserDto> Add(UserDto dto)
    {
        var user = mapper.Map<Entities.User>(dto);
        user.IsVerified = false;
        var usr = await repo.Add(user);
        return mapper.Map<UserDto>(usr);
    }

    /// <intheritdoc />
    public async Task<UserDto> Update(UserDto dto)
    {
        try
        {
            // var user = mapper.Map<User>(dto);
            var user = await repo.GetById(dto.Id);
            var pswd = user.Password;
            var hashkey = user.HashKey;
            user = mapper.Map(dto, user);
            if (user.Password.Length == 0 && user.HashKey.Length == 0)
            {
                user.Password = pswd;
                user.HashKey = hashkey;
            }

            var usr = await repo.Update(user);
            return mapper.Map<UserDto>(usr);
        }
        catch (KeyNotFoundException e)
        {
            throw;
        }
    }

    /// <intheritdoc />
    public async Task<UserDto> GetByEmail(string email)
    {
        var users = await repo.GetAll();
        var user = users.Find(user => user.Email.Equals(email, StringComparison.OrdinalIgnoreCase));

        if (user == null) throw new UserNotFoundException(email);
        return mapper.Map<UserDto>(user);
    }

    /// <intheritdoc />
    public async Task<UserDto> Validate(int userId, bool status)
    {
        try
        {
            var user = await repo.GetById(userId);
            user.IsVerified = status;
            return mapper.Map<UserDto>(await repo.Update(user));
        }
        catch (KeyNotFoundException e)
        {
            throw;
        }
    }

    /// <intheritdoc />
    public async Task<UserDto> DeleteById(int id)
    {
        try
        {
            return mapper.Map<UserDto>(await repo.DeleteById(id));
        }
        catch (KeyNotFoundException e)
        {
            throw;
        }
    }
}