using DigitSimplifiedSolution.Models;
using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Web;
using System.Web.Mvc;

namespace DigitSimplifiedSolution.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";
            return View();
        }
        [HttpPost]
        public ActionResult Newsletter(string srchTerm)
        {
            if (!string.IsNullOrEmpty(srchTerm))
            {
                using (var context = new ApplicationDbContext())
                {
                    var newsletter = new NewsletterSubscription();
                    newsletter.Email = srchTerm;
                    newsletter.Created = DateTime.Now;
                    newsletter.IsSubscribed = true;
                    context.NewsletterSubscription.Add(newsletter);
                    context.SaveChanges();
                }
                NewsletterEmail(null, srchTerm, null);   
            }
            return Redirect("/");
        }
        [HttpPost]
        public ActionResult ContactUs(string Name, string email, string Message)
        {
            if (string.IsNullOrEmpty(Name) || string.IsNullOrEmpty(email) || string.IsNullOrEmpty(Message))
            {
                return Redirect("/");
            }
            using (var context = new ApplicationDbContext())
            {
                var contactUs = new ContactUs();
                contactUs.Name = Name;
                contactUs.Email = email;
                contactUs.Message = Message;
                contactUs.IsAck = false;
                contactUs.Created = DateTime.Now;
                context.ContactUs.Add(contactUs);
                context.SaveChanges();
            }
            NewsletterEmail(Name, email, Message);
            return Redirect("/");
        }
        private void NewsletterEmail(string name, string email, string message)
        {
            var firstName = name;
            if (string.IsNullOrEmpty(name)) firstName = email.Split('@')[0];
            Hashtable ht = new Hashtable();
            ht.Add("FIRSTNAME", firstName);
            ht.Add("LASTNAME", "");
            ht.Add("EMAIL", email);
            if (!string.IsNullOrEmpty(message)) ht.Add("Meassage", message);
            try
            {
                String EmailBody = GetContextFromHTML(ht, Server.MapPath("~/app_themes/vena/emailtemplate/register.html"));
                SendEmail(EmailBody, email, "NEWSLETTER: Successfully sent");
            }
            catch { }
        }
        private string SendEmail(string body, string to, string subject)
        {
            var from = "";
            MailMessage msg = new MailMessage();
            string[] ToEmailList = to.Split(',');

            subject = subject.Replace('\r', ' ').Replace('\n', ' ');

            msg.From = new MailAddress(from);
            //msg.CC.Add(from);      
            foreach (var toemail in ToEmailList)
            {
                msg.To.Add(new MailAddress(toemail));
            }
            //msg.CC.Add("info@alkitabacademy.com");
            msg.Subject = subject;
            msg.IsBodyHtml = true;
            msg.Body = body;
            using (SmtpClient client = new SmtpClient())
            {
                client.UseDefaultCredentials = false;
                client.Credentials = new NetworkCredential("", "");
                client.Host = "smtp.gmail.com"; //"smtp.gmail.com";
                client.Port = 587;//25;
                client.DeliveryMethod = SmtpDeliveryMethod.Network;
                client.EnableSsl = true;
                client.Send(msg);
                return "Success";
            }
        }
        public static String GetContextFromHTML(Hashtable paramLst, string Path)
        {
            string context = "";
            using (StreamReader sr = new StreamReader(Path))
            {
                String line;
                while ((line = sr.ReadLine()) != null)
                {
                    context += line;
                }
            }
            if (context.Length > 0)
            {
                foreach (DictionaryEntry key in paramLst)
                {
                    context = context.Replace(key.Key.ToString(), Convert.ToString(key.Value));
                }
            }
            return context;
        }
    }
}