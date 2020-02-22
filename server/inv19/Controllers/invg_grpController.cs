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
    [Route("api/invg_grp")]
    public class invg_grpController : Controller
    {
        private readonly MyContext _context;
        IWebHostEnvironment _appEnvironment;

        public invg_grpController(MyContext context, IWebHostEnvironment appEnvironment)
        {
            _context = context;
            _appEnvironment = appEnvironment;
        }

        // GET: api/invg_grp
        [HttpGet]
        //[AllowAnonymous]
        public IActionResult Getinvg_grp()
        {
            return Json (_context.invg_grp, _context.serializerSettings());
        }

        [HttpGet("combo")]
        //[AllowAnonymous]
        public List<Dictionary<string, object>> GetCombo()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT invg_grpId id, ( [dbo].[invg_grp_BRIEF_F](invg_grpId,null)  ) name
                         FROM            
                          invg_grp 
                            order by name ";
            return _context.GetRaw(sql);
        }
        
        [HttpGet("view")]
        //[AllowAnonymous]
        public List<Dictionary<string, object>> GetView()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT * FROM V_invg_grp ";
            return _context.GetRaw(sql);
        }
        
        // GET: api/invg_grp/5
        [HttpGet("{id}")]
        //[AllowAnonymous]
        public async Task<IActionResult> Getinvg_grp([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varinvg_grp = await _context.invg_grp.SingleOrDefaultAsync(m => m.invg_grpId == id);

            if (varinvg_grp == null)
            {
                return NotFound();
            }

            return Ok(varinvg_grp);
        }

        // PUT: api/invg_grp/5
        [HttpPut("{id}")]
        //[AllowAnonymous]
        public async Task<IActionResult> Putinvg_grp([FromRoute] Guid id, [FromBody] invg_grp varinvg_grp)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != varinvg_grp.invg_grpId)
            {
                return BadRequest();
            }

            _context.Entry(varinvg_grp).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!invg_grpExists(id))
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

        // POST: api/invg_grp
        [HttpPost]
        //[AllowAnonymous]
        public async Task<IActionResult> Postinvg_grp([FromBody] invg_grp varinvg_grp)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.invg_grp.Add(varinvg_grp);
            await _context.SaveChangesAsync();

            return CreatedAtAction("Getinvg_grp", new { id = varinvg_grp.invg_grpId }, varinvg_grp);
        }

        // DELETE: api/invg_grp/5
        [HttpDelete("{id}")]
        //[AllowAnonymous]
        public async Task<IActionResult> Deleteinvg_grp([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varinvg_grp = await _context.invg_grp.SingleOrDefaultAsync(m => m.invg_grpId == id);
            if (varinvg_grp == null)
            {
                return NotFound();
            }

            _context.invg_grp.Remove(varinvg_grp);
            await _context.SaveChangesAsync();

            return Ok(varinvg_grp);
        }

        private bool invg_grpExists(Guid id)
        {
            return _context.invg_grp.Any(e => e.invg_grpId == id);
        }
    }
}
