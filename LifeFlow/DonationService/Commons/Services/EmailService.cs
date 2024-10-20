using Amazon.SecretsManager;
using Amazon.SecretsManager.Model;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace DonationService.Commons.Services;

public class EmailService(IConfiguration configuration, IAmazonSecretsManager secretsManager)
{
    public void SendEmail(string recipientEmail, string subject, string body)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("Matrimony Service Desk", "yenbinmaster@gmail.com"));
        message.To.Add(new MailboxAddress("", recipientEmail));
        message.Subject = subject;

        message.Body = new TextPart("plain")
        {
            Text = body
        };

        // Fetch the email password from AWS Secrets Manager
        string secretName = "LifeFlowSecrets";
        var request = new GetSecretValueRequest
        {
            SecretId = secretName,
            VersionStage = "AWSCURRENT"
        };

        GetSecretValueResponse response;
        try
        {
            response = secretsManager.GetSecretValueAsync(request).Result;
        }
        catch (Exception e)
        {
            throw new Exception("Failed to retrieve secret from AWS Secrets Manager", e);
        }

        string secretString = response.SecretString;
        var secretData = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, string>>(secretString);
        var emailPassword = secretData.ContainsKey("EmailAppPassword") ? secretData["EmailAppPassword"] : null;

        if (emailPassword == null)
            throw new Exception("No email app password found in AWS Secrets Manager");

        // Use the retrieved email password to authenticate and send the email
        using (var smtpClient = new SmtpClient())
        {
            smtpClient.Connect("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
            smtpClient.Authenticate("yenbinmaster@gmail.com", emailPassword);

            smtpClient.Send(message);
            smtpClient.Disconnect(true);
        }
    }
}
