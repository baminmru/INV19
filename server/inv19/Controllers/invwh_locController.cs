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

namespace inv19.Controllers
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/invwh_loc")]
    public class invwh_locController : Controller
    {
        private readonly MyContext _context;
        IWebHostEnvironment _appEnvironment;

        public invwh_locController(MyContext context, IWebHostEnvironment appEnvironment)
        {
            _context = context;
            _appEnvironment = appEnvironment;
        }

        // GET: api/invwh_loc
        [HttpGet]
        //[AllowAnonymous]
        public IActionResult Getinvwh_loc()
        {
            return Json (_context.invwh_loc, _context.serializerSettings());
        }

        [HttpGet("combo")]
        //[AllowAnonymous]
        public List<Dictionary<string, object>> GetCombo()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT invwh_locId id, ( [dbo].[invwh_loc_BRIEF_F](invwh_locId,null)  ) name
                         FROM            
                          invwh_loc 
                            order by name ";
            return _context.GetRaw(sql);
        }
        
        [HttpGet("view")]
        //[AllowAnonymous]
        public List<Dictionary<string, object>> GetView()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT * FROM V_invwh_loc ";
            return _context.GetRaw(sql);
        }
        
        // GET: api/invwh_loc/5
        [HttpGet("{id}")]
        //[AllowAnonymous]
        public async Task<IActionResult> Getinvwh_loc([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varinvwh_loc = await _context.invwh_loc.SingleOrDefaultAsync(m => m.invwh_locId == id);

            if (varinvwh_loc == null)
            {
                return NotFound();
            }

            return Ok(varinvwh_loc);
        }

        // PUT: api/invwh_loc/5
        [HttpPut("{id}")]
        //[AllowAnonymous]
        public async Task<IActionResult> Putinvwh_loc([FromRoute] Guid id, [FromBody] invwh_loc varinvwh_loc)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != varinvwh_loc.invwh_locId)
            {
                return BadRequest();
            }

            _context.Entry(varinvwh_loc).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!invwh_locExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/invwh_loc
        [HttpPost]
        //[AllowAnonymous]
        public async Task<IActionResult> Postinvwh_loc([FromBody] invwh_loc varinvwh_loc)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.invwh_loc.Add(varinvwh_loc);
            await _context.SaveChangesAsync();

            return CreatedAtAction("Getinvwh_loc", new { id = varinvwh_loc.invwh_locId }, varinvwh_loc);
        }

        // DELETE: api/invwh_loc/5
        [HttpDelete("{id}")]
        //[AllowAnonymous]
        public async Task<IActionResult> Deleteinvwh_loc([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varinvwh_loc = await _context.invwh_loc.SingleOrDefaultAsync(m => m.invwh_locId == id);
            if (varinvwh_loc == null)
            {
                return NotFound();
            }

            _context.invwh_loc.Remove(varinvwh_loc);
            await _context.SaveChangesAsync();

            return Ok(varinvwh_loc);
        }

        private bool invwh_locExists(Guid id)
        {
            return _context.invwh_loc.Any(e => e.invwh_locId == id);
        }
    }
}
