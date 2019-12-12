﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace inv19.Services.Data.User
{
    public class UpdateUserProfileRoleRequest
    {
        public Guid Id { get; set; }
        public string Role { get; set; }
    }

    public class UpdateUserProfileRoleResponse
    {
        public string Status { get; set; }
    }
}
