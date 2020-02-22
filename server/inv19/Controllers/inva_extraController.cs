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
    [Route("api/inva_extra")]
    public class inva_extraController : Controller
    {
        private readonly MyContext _context;
        IWebHostEnvironment _appEnvironment;

        public inva_extraController(MyContext context, IWebHostEnvironment appEnvironment)
        {
            _context = context;
            _appEnvironment = appEnvironment;
        }

        // GET: api/inva_extra
        [HttpGet]
        //[AllowAnonymous]
        public IActionResult Getinva_extra()
        {
            return Json (_context.inva_extra, _context.serializerSettings());
        }

        [HttpGet("combo")]
        //[AllowAnonymous]
        public List<Dictionary<string, object>> GetCombo()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT inva_extraId id, ( [dbo].[inva_extra_BRIEF_F](inva_extraId,null)  ) name
                         FROM            
                          inva_extra 
                            order by name ";
            return _context.GetRaw(sql);
        }
        
        [HttpGet("byparent/{id}")]
        //[AllowAnonymous]
        public List<Dictionary<string, object>> GetByBarent([FromRoute] Guid id)
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT * FROM V_inva_extra where inva_infoID='" + id.ToString() + "'";
            return _context.GetRaw(sql);
        }
        
        // GET: api/inva_extra/5
        [HttpGet("{id}")]
        //[AllowAnonymous]
        public async Task<IActionResult> Getinva_extra([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varinva_extra = await _context.inva_extra.SingleOrDefaultAsync(m => m.inva_extraId == id);

            if (varinva_extra == null)
            {
                return NotFound();
            }

            return Ok(varinva_extra);
        }

        // PUT: api/inva_extra/5
        [HttpPut("{id}")]
        //[AllowAnonymous]
        public async Task<IActionResult> Putinva_extra([FromRoute] Guid id, [FromBody] inva_extra varinva_extra)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != varinva_extra.inva_extraId)
            {
                return BadRequest();
            }

            _context.Entry(varinva_extra).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!inva_extraExists(id))
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

        // POST: api/inva_extra
        [HttpPost]
        //[AllowAnonymous]
        public async Task<IActionResult> Postinva_extra([FromBody] inva_extra varinva_extra)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.inva_extra.Add(varinva_extra);
            await _context.SaveChangesAsync();

            return CreatedAtAction("Getinva_extra", new { id = varinva_extra.inva_extraId }, varinva_extra);
        }

        // DELETE: api/inva_extra/5
        [HttpDelete("{id}")]
        //[AllowAnonymous]
        public async Task<IActionResult> Deleteinva_extra([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varinva_extra = await _context.inva_extra.SingleOrDefaultAsync(m => m.inva_extraId == id);
            if (varinva_extra == null)
            {
                return NotFound();
            }

            _context.inva_extra.Remove(varinva_extra);
            await _context.SaveChangesAsync();

            return Ok(varinva_extra);
        }

        private bool inva_extraExists(Guid id)
        {
            return _context.inva_extra.Any(e => e.inva_extraId == id);
        }
    }
}
