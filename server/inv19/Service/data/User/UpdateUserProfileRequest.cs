using inv19.Services.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace inv19.Services.Users.Data
{
    public class UpdateUserProfileRequest : BaseRequest
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string MiddleName { get; set; }
        public string Phone { get; set; }
    }

    public class UpdateUserProfileResponse
    {
        public string Status { get; set; }
    }
}
