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
using MySys.Common.Extensions;
using inv19.Services;

namespace inv19.Controllers
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/invops_move")]
    public class invops_moveController : Controller
    {
        private readonly MyContext _context;
        IWebHostEnvironment _appEnvironment;
        private readonly TerminalService _terminalService;

        public invops_moveController(MyContext context, IWebHostEnvironment appEnvironment, TerminalService terminalService)
        {
            _context = context;
            _appEnvironment = appEnvironment;
            _terminalService = terminalService;
        }



        // POST: api/invops_move
        [HttpPost]
        //[AllowAnonymous]
        public async Task<IActionResult> Postinvops_move([FromBody] invops_move varinvops_move)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            string result = "";
            var uid = User.GetUserId();
            result = await _terminalService.Operaion_move(uid, varinvops_move);
            if (result == "OK") { 
                return CreatedAtAction("Getinvops_move", new { id = varinvops_move.invops_moveId }, varinvops_move);
            }
            else
            {
                return BadRequest(result);
            }

        }

       

        private bool invops_moveExists(Guid id)
        {
            return _context.invops_move.Any(e => e.invops_moveId == id);
        }
    }
}
