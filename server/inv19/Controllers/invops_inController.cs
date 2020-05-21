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
    [Route("api/invops_in")]
    public class invops_inController : Controller
    {
        private readonly MyContext _context;
        IWebHostEnvironment _appEnvironment;
        private readonly TerminalService _terminalService;

        public invops_inController(MyContext context, IWebHostEnvironment appEnvironment, TerminalService terminalService)
        {
            _context = context;
            _appEnvironment = appEnvironment;
            _terminalService = terminalService;
        }



        // POST: api/invops_move
        [HttpPost]
        //[AllowAnonymous]
        public async Task<IActionResult> Postinvops_in([FromBody] invops_in varinvops_in)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            string result = "";
            var uid = User.GetUserId();
            result = await _terminalService.Operation_in(uid, varinvops_in);
            if (result == "OK")
            {
                return CreatedAtAction("Getinvops_in", new { id = varinvops_in.invops_inId }, varinvops_in);
            }
            else
            {
                return BadRequest(result);
            }

        }

        

       
        private bool invops_inExists(Guid id)
        {
            return _context.invops_in.Any(e => e.invops_inId == id);
        }
    }
}
