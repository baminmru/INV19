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
    [Route("api/invd_zone")]
    public class invd_zoneController : Controller
    {
        private readonly MyContext _context;
        IHostingEnvironment _appEnvironment;

        public invd_zoneController(MyContext context, IHostingEnvironment appEnvironment)
        {
            _context = context;
            _appEnvironment = appEnvironment;
        }

        // GET: api/invd_zone
        [HttpGet]
        [AllowAnonymous]
        public IActionResult Getinvd_zone()
        {
            return Json (_context.invd_zone, _context.serializerSettings());
        }

        [HttpGet("combo")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetCombo()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT invd_zoneId id, ( [dbo].[invd_zone_BRIEF_F](invd_zoneId,null)  ) name
                         FROM            
                          invd_zone 
                            order by name ";
            return _context.GetRaw(sql);
        }
        
        [HttpGet("view")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetView()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT * FROM V_invd_zone ";
            return _context.GetRaw(sql);
        }
        
        // GET: api/invd_zone/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> Getinvd_zone([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varinvd_zone = await _context.invd_zone.SingleOrDefaultAsync(m => m.invd_zoneId == id);

            if (varinvd_zone == null)
            {
                return NotFound();
            }

            return Ok(varinvd_zone);
        }

        // PUT: api/invd_zone/5
        [HttpPut("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> Putinvd_zone([FromRoute] Guid id, [FromBody] invd_zone varinvd_zone)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != varinvd_zone.invd_zoneId)
            {
                return BadRequest();
            }

            _context.Entry(varinvd_zone).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!invd_zoneExists(id))
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

        // POST: api/invd_zone
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Postinvd_zone([FromBody] invd_zone varinvd_zone)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.invd_zone.Add(varinvd_zone);
            await _context.SaveChangesAsync();

            return CreatedAtAction("Getinvd_zone", new { id = varinvd_zone.invd_zoneId }, varinvd_zone);
        }

        // DELETE: api/invd_zone/5
        [HttpDelete("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> Deleteinvd_zone([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varinvd_zone = await _context.invd_zone.SingleOrDefaultAsync(m => m.invd_zoneId == id);
            if (varinvd_zone == null)
            {
                return NotFound();
            }

            _context.invd_zone.Remove(varinvd_zone);
            await _context.SaveChangesAsync();

            return Ok(varinvd_zone);
        }

        private bool invd_zoneExists(Guid id)
        {
            return _context.invd_zone.Any(e => e.invd_zoneId == id);
        }
    }
}
