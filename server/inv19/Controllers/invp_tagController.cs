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
    [Route("api/invp_tag")]
    public class invp_tagController : Controller
    {
        private readonly MyContext _context;
        IHostingEnvironment _appEnvironment;

        public invp_tagController(MyContext context, IHostingEnvironment appEnvironment)
        {
            _context = context;
            _appEnvironment = appEnvironment;
        }

        // GET: api/invp_tag
        [HttpGet]
        //[AllowAnonymous]
        public IActionResult Getinvp_tag()
        {
            return Json (_context.invp_tag, _context.serializerSettings());
        }

        [HttpGet("combo")]
        //[AllowAnonymous]
        public List<Dictionary<string, object>> GetCombo()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT invp_tagId id, ( [dbo].[invp_tag_BRIEF_F](invp_tagId,null)  ) name
                         FROM            
                          invp_tag 
                            order by name ";
            return _context.GetRaw(sql);
        }
        
        [HttpGet("byparent/{id}")]
        //[AllowAnonymous]
        public List<Dictionary<string, object>> GetByBarent([FromRoute] Guid id)
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT * FROM V_invp_tag where invp_dataID='" + id.ToString() + "'";
            return _context.GetRaw(sql);
        }
        
        // GET: api/invp_tag/5
        [HttpGet("{id}")]
        //[AllowAnonymous]
        public async Task<IActionResult> Getinvp_tag([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varinvp_tag = await _context.invp_tag.SingleOrDefaultAsync(m => m.invp_tagId == id);

            if (varinvp_tag == null)
            {
                return NotFound();
            }

            return Ok(varinvp_tag);
        }

        // PUT: api/invp_tag/5
        [HttpPut("{id}")]
        //[AllowAnonymous]
        public async Task<IActionResult> Putinvp_tag([FromRoute] Guid id, [FromBody] invp_tag varinvp_tag)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != varinvp_tag.invp_tagId)
            {
                return BadRequest();
            }

            _context.Entry(varinvp_tag).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!invp_tagExists(id))
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

        // POST: api/invp_tag
        [HttpPost]
        //[AllowAnonymous]
        public async Task<IActionResult> Postinvp_tag([FromBody] invp_tag varinvp_tag)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.invp_tag.Add(varinvp_tag);
            await _context.SaveChangesAsync();

            return CreatedAtAction("Getinvp_tag", new { id = varinvp_tag.invp_tagId }, varinvp_tag);
        }

        // DELETE: api/invp_tag/5
        [HttpDelete("{id}")]
        //[AllowAnonymous]
        public async Task<IActionResult> Deleteinvp_tag([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varinvp_tag = await _context.invp_tag.SingleOrDefaultAsync(m => m.invp_tagId == id);
            if (varinvp_tag == null)
            {
                return NotFound();
            }

            _context.invp_tag.Remove(varinvp_tag);
            await _context.SaveChangesAsync();

            return Ok(varinvp_tag);
        }

        private bool invp_tagExists(Guid id)
        {
            return _context.invp_tag.Any(e => e.invp_tagId == id);
        }
    }
}
