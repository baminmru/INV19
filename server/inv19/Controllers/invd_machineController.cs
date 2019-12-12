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
    [Route("api/invd_machine")]
    public class invd_machineController : Controller
    {
        private readonly MyContext _context;
        IHostingEnvironment _appEnvironment;

        public invd_machineController(MyContext context, IHostingEnvironment appEnvironment)
        {
            _context = context;
            _appEnvironment = appEnvironment;
        }

        // GET: api/invd_machine
        [HttpGet]
        [AllowAnonymous]
        public IActionResult Getinvd_machine()
        {
            return Json (_context.invd_machine, _context.serializerSettings());
        }

        [HttpGet("combo")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetCombo()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT invd_machineId id, ( [dbo].[invd_machine_BRIEF_F](invd_machineId,null)  ) name
                         FROM            
                          invd_machine 
                            order by name ";
            return _context.GetRaw(sql);
        }
        
        [HttpGet("view")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetView()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT * FROM V_invd_machine ";
            return _context.GetRaw(sql);
        }
        
        // GET: api/invd_machine/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> Getinvd_machine([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varinvd_machine = await _context.invd_machine.SingleOrDefaultAsync(m => m.invd_machineId == id);

            if (varinvd_machine == null)
            {
                return NotFound();
            }

            return Ok(varinvd_machine);
        }

        // PUT: api/invd_machine/5
        [HttpPut("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> Putinvd_machine([FromRoute] Guid id, [FromBody] invd_machine varinvd_machine)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != varinvd_machine.invd_machineId)
            {
                return BadRequest();
            }

            _context.Entry(varinvd_machine).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!invd_machineExists(id))
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

        // POST: api/invd_machine
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Postinvd_machine([FromBody] invd_machine varinvd_machine)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.invd_machine.Add(varinvd_machine);
            await _context.SaveChangesAsync();

            return CreatedAtAction("Getinvd_machine", new { id = varinvd_machine.invd_machineId }, varinvd_machine);
        }

        // DELETE: api/invd_machine/5
        [HttpDelete("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> Deleteinvd_machine([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varinvd_machine = await _context.invd_machine.SingleOrDefaultAsync(m => m.invd_machineId == id);
            if (varinvd_machine == null)
            {
                return NotFound();
            }

            _context.invd_machine.Remove(varinvd_machine);
            await _context.SaveChangesAsync();

            return Ok(varinvd_machine);
        }

        private bool invd_machineExists(Guid id)
        {
            return _context.invd_machine.Any(e => e.invd_machineId == id);
        }
    }
}
