using inv19.models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace inv19.Services.Data.User
{
    public class GetOrganizationsRequest
    {
    }
    public class GetOrganizationsResponse
    {
        public List<OrganizationItem> Items { get; set; }
    }

    public class OrganizationItem
    {
        public Guid Id { get; set; }
        public string Name { get; set; }

        //public OrganizationItem()
        //{

        //}

        //public OrganizationItem(moncli_info model)
        //{
        //    Id = model.moncli_infoId;
        //    Name = model.Name;
        //}
    }
}
