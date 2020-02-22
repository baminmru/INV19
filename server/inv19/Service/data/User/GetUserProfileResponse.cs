using inv19.models;
using System;
using System.Collections.Generic;
using System.Text;

namespace inv19.Services.Users.Data
{
    public class GetUserProfileRequest
    {
        public Guid Id { get; set; }
    }
    public class GetUserProfileResponse
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string MiddleName { get; set; }
        public string Phone { get; set; }
        // public Guid? OrganizationId { get; set; }

        public int islocked { get; set; }



        public string FullName
        {
            get
            {
                return $"{FirstName} {MiddleName} {LastName}";
            }
        }
        public Guid LoginId { get; set; }


        public GetUserProfileResponse()
        {

        }

        public GetUserProfileResponse(xUserInfo user)
        {
            Id = user.xUserInfoId;
            FirstName = user.name;
            MiddleName = user.partonymic;
            LastName = user.family;
            Phone = user.phone;
            LoginId = new Guid(user.login);
            islocked = (int) user.islocked;
            //OrganizationId = user.theClient ;

        }
    }

}
