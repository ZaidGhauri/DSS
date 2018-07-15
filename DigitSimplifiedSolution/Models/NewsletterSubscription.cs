using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace DigitSimplifiedSolution.Models
{
    public class NewsletterSubscription
    {
        [Key]
        public int Id { get; set; }
        public string Email { get; set; }
        public bool IsSubscribed { get; set; }
        public DateTime Created { get; set; }
    }
}