using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Authorization;
using inv19.models;
using inv19.Services;
using MySys.Common.Extensions;

namespace inv19.Controllers
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/invops_out")]
    public class invops_outController : Controller
    {
        private readonly MyContext _context;
        IWebHostEnvironment _appEnvironment;
        private readonly TerminalService _terminalService;

        public invops_outController(MyContext context, IWebHostEnvironment appEnvironment, TerminalService terminalService)
        {
            _context = context;
            _appEnvironment = appEnvironment;
            _terminalService = terminalService;
        }

       

        // POST: api/invops_out
        [HttpPost]
        //[AllowAnonymous]
        public async Task<IActionResult> Postinvops_out([FromBody] invops_out varinvops_out)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string result = "";

            var uid = User.GetUserId();

            result = await _terminalService.Operation_out(uid, varinvops_out);
            if (result == "OK")
            {
                return CreatedAtAction("Getinvops_out", new { id = varinvops_out.invops_outId }, varinvops_out);
            }
            else
            {
                return BadRequest(result);
            }





        }

       
        private bool invops_outExists(Guid id)
        {
            return _context.invops_out.Any(e => e.invops_outId == id);
        }
    }
}
