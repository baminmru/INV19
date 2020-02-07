using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Text;
using Newtonsoft.Json;
using System.Xml;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using inv19.models;
using Microsoft.AspNetCore.Authorization;
using System.Text.RegularExpressions;
using System.Net.Http;
using Microsoft.Extensions.Configuration;
using System.Net.Mail;
using Microsoft.Extensions.Logging;

namespace inv19
{
    public class SharedFunc
    {
        public static IConfiguration configuration { get; set; }
        public static ILogger logger { get; set; }  = null;

       

        public static string ReadJSON(string FilePath, Guid ID, string postfix)
        {
            string realFileName;
            realFileName = ID.ToString().Replace("{", "").Replace("}", "").Replace("-", "") + postfix +".json";
            if (File.Exists(FilePath + realFileName))
            {
                return System.IO.File.ReadAllText(FilePath + realFileName, Encoding.UTF8);
            }
            else
            {
                return "{}";
            }

        }




        public static async Task<bool> SendEmail(string Email, string Body, string Title)
        {
            try
            {

                if (configuration["smtp_run"].ToLower() == "true")
                {

                    var SmtpServer = new SmtpClient();
                    SmtpServer.Credentials = new System.Net.NetworkCredential(configuration["smtp_usr"], configuration["smtp_pwd"]);
                    SmtpServer.Port = int.Parse(configuration["smtp_port"]);
                    SmtpServer.Host = configuration["smtp_srv"];
                    if (configuration["smtp_SSL"].ToLower() == "true")
                    {
                        SmtpServer.EnableSsl = true;
                    }
                    else
                    {
                        SmtpServer.EnableSsl = false;
                    }


                    MailMessage mail;

                    mail = new MailMessage();
                    mail.From = new MailAddress(configuration["smtp_replay_to"], "Администратор", Encoding.UTF8);

                    if (Email != "")
                    {
                        mail.To.Add(Email);
                    }
                    else
                    {
                        mail.To.Add(configuration["smtp_checker_email"]);
                    }


                    mail.Subject = Title;
                    mail.Body = Body;
                    mail.IsBodyHtml = true;

                    mail.DeliveryNotificationOptions = DeliveryNotificationOptions.OnFailure;
                    mail.ReplyToList.Add(configuration["smtp_replay_to"]);
                    await SmtpServer.SendMailAsync(mail);
                }
        
            }
            catch (Exception ex)
            {
                if (logger != null)
                    logger.LogError(ex, "SendEmail");
                return false;
            }
        
            return true;
        }


    }
}
