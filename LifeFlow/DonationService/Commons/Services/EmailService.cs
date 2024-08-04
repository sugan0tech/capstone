using Azure.Security.KeyVault.Secrets;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace DonationService.Commons.Services;

public class EmailService(IConfiguration configuration, SecretClient secretClient)
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

        var emailPassword = secretClient.GetSecret("EmailAppPassword").Value.Value;

        using (var smtpClient = new SmtpClient())
        {
            smtpClient.Connect("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
            smtpClient.Authenticate("yenbinmaster@gmail.com", emailPassword);

            smtpClient.Send(message);
            smtpClient.Disconnect(true);
        }
    }
}