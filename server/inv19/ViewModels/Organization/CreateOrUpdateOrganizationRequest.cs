using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace survey_api.ViewModels.Organization
{
    public class CreateOrUpdateOrganizationRequest
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
    }

    public class CreateOrUpdateOrganizationResponse
    {
    }
}
