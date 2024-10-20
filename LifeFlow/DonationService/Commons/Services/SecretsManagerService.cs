namespace DonationService.Commons.Services;

using Amazon.SecretsManager;
using Amazon.SecretsManager.Model;

public class SecretsManagerService
{
    private readonly IAmazonSecretsManager _secretsManagerClient = new AmazonSecretsManagerClient(); // Uses default credentials and region

    public async Task<string> GetSecretAsync(string secretName)
    {
        var request = new GetSecretValueRequest
        {
            SecretId = secretName
        };

        GetSecretValueResponse response = await _secretsManagerClient.GetSecretValueAsync(request);

        if (response.SecretString != null)
        {
            return response.SecretString;
        }

        var memoryStream = response.SecretBinary;
        StreamReader reader = new StreamReader(memoryStream);
        string decodedBinarySecret = System.Text.Encoding.UTF8.GetString(Convert.FromBase64String(reader.ReadToEnd()));
        return decodedBinarySecret;
    }
}
