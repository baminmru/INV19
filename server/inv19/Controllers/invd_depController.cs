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
    [Route("api/invd_dep")]
    public class invd_depController : Controller
    {
        private readonly MyContext _context;
        IHostingEnvironment _appEnvironment;

        public invd_depController(MyContext context, IHostingEnvironment appEnvironment)
        {
            _context = context;
            _appEnvironment = appEnvironment;
        }

        // GET: api/invd_dep
        [HttpGet]
        [AllowAnonymous]
        public IActionResult Getinvd_dep()
        {
            return Json (_context.invd_dep, _context.serializerSettings());
        }

        [HttpGet("combo")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetCombo()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT invd_depId id, ( [dbo].[invd_dep_BRIEF_F](invd_depId,null)  ) name
                         FROM            
                          invd_dep 
                            order by name ";
            return _context.GetRaw(sql);
        }
        
        [HttpGet("view")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetView()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT * FROM V_invd_dep ";
            return _context.GetRaw(sql);
        }
        
        // GET: api/invd_dep/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> Getinvd_dep([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varinvd_dep = await _context.invd_dep.SingleOrDefaultAsync(m => m.invd_depId == id);

            if (varinvd_dep == null)
            {
                return NotFound();
            }

            return Ok(varinvd_dep);
        }

        // PUT: api/invd_dep/5
        [HttpPut("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> Putinvd_dep([FromRoute] Guid id, [FromBody] invd_dep varinvd_dep)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != varinvd_dep.invd_depId)
            {
                return BadRequest();
            }

            _context.Entry(varinvd_dep).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!invd_depExists(id))
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

        // POST: api/invd_dep
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Postinvd_dep([FromBody] invd_dep varinvd_dep)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.invd_dep.Add(varinvd_dep);
            await _context.SaveChangesAsync();

            return CreatedAtAction("Getinvd_dep", new { id = varinvd_dep.invd_depId }, varinvd_dep);
        }

        // DELETE: api/invd_dep/5
        [HttpDelete("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> Deleteinvd_dep([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varinvd_dep = await _context.invd_dep.SingleOrDefaultAsync(m => m.invd_depId == id);
            if (varinvd_dep == null)
            {
                return NotFound();
            }

            _context.invd_dep.Remove(varinvd_dep);
            await _context.SaveChangesAsync();

            return Ok(varinvd_dep);
        }

        private bool invd_depExists(Guid id)
        {
            return _context.invd_dep.Any(e => e.invd_depId == id);
        }
    }
}
