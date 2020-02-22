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
    [Route("api/inva_absnt")]
    public class inva_absntController : Controller
    {
        private readonly MyContext _context;
        IWebHostEnvironment _appEnvironment;

        public inva_absntController(MyContext context, IWebHostEnvironment appEnvironment)
        {
            _context = context;
            _appEnvironment = appEnvironment;
        }

        // GET: api/inva_absnt
        [HttpGet]
        //[AllowAnonymous]
        public IActionResult Getinva_absnt()
        {
            return Json (_context.inva_absnt, _context.serializerSettings());
        }

        [HttpGet("combo")]
        //[AllowAnonymous]
        public List<Dictionary<string, object>> GetCombo()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT inva_absntId id, ( [dbo].[inva_absnt_BRIEF_F](inva_absntId,null)  ) name
                         FROM            
                          inva_absnt 
                            order by name ";
            return _context.GetRaw(sql);
        }
        
        [HttpGet("byparent/{id}")]
        //[AllowAnonymous]
        public List<Dictionary<string, object>> GetByBarent([FromRoute] Guid id)
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT * FROM V_inva_absnt where inva_infoID='" + id.ToString() + "'";
            return _context.GetRaw(sql);
        }
        
        // GET: api/inva_absnt/5
        [HttpGet("{id}")]
        //[AllowAnonymous]
        public async Task<IActionResult> Getinva_absnt([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varinva_absnt = await _context.inva_absnt.SingleOrDefaultAsync(m => m.inva_absntId == id);

            if (varinva_absnt == null)
            {
                return NotFound();
            }

            return Ok(varinva_absnt);
        }

        // PUT: api/inva_absnt/5
        [HttpPut("{id}")]
        //[AllowAnonymous]
        public async Task<IActionResult> Putinva_absnt([FromRoute] Guid id, [FromBody] inva_absnt varinva_absnt)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != varinva_absnt.inva_absntId)
            {
                return BadRequest();
            }

            _context.Entry(varinva_absnt).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!inva_absntExists(id))
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

        // POST: api/inva_absnt
        [HttpPost]
        //[AllowAnonymous]
        public async Task<IActionResult> Postinva_absnt([FromBody] inva_absnt varinva_absnt)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.inva_absnt.Add(varinva_absnt);
            await _context.SaveChangesAsync();

            return CreatedAtAction("Getinva_absnt", new { id = varinva_absnt.inva_absntId }, varinva_absnt);
        }

        // DELETE: api/inva_absnt/5
        [HttpDelete("{id}")]
        //[AllowAnonymous]
        public async Task<IActionResult> Deleteinva_absnt([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varinva_absnt = await _context.inva_absnt.SingleOrDefaultAsync(m => m.inva_absntId == id);
            if (varinva_absnt == null)
            {
                return NotFound();
            }

            _context.inva_absnt.Remove(varinva_absnt);
            await _context.SaveChangesAsync();

            return Ok(varinva_absnt);
        }

        private bool inva_absntExists(Guid id)
        {
            return _context.inva_absnt.Any(e => e.inva_absntId == id);
        }
    }
}
