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
    [Route("api/inva_real")]
    public class inva_realController : Controller
    {
        private readonly MyContext _context;
        IWebHostEnvironment _appEnvironment;

        public inva_realController(MyContext context, IWebHostEnvironment appEnvironment)
        {
            _context = context;
            _appEnvironment = appEnvironment;
        }

        // GET: api/inva_real
        [HttpGet]
        //[AllowAnonymous]
        public IActionResult Getinva_real()
        {
            return Json (_context.inva_real, _context.serializerSettings());
        }

        [HttpGet("combo")]
        //[AllowAnonymous]
        public List<Dictionary<string, object>> GetCombo()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT inva_realId id, ( [dbo].[inva_real_BRIEF_F](inva_realId,null)  ) name
                         FROM            
                          inva_real 
                            order by name ";
            return _context.GetRaw(sql);
        }
        
        [HttpGet("byparent/{id}")]
        //[AllowAnonymous]
        public List<Dictionary<string, object>> GetByBarent([FromRoute] Guid id)
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT * FROM V_inva_real where inva_infoID='" + id.ToString() + "'";
            return _context.GetRaw(sql);
        }
        
        // GET: api/inva_real/5
        [HttpGet("{id}")]
        //[AllowAnonymous]
        public async Task<IActionResult> Getinva_real([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varinva_real = await _context.inva_real.SingleOrDefaultAsync(m => m.inva_realId == id);

            if (varinva_real == null)
            {
                return NotFound();
            }

            return Ok(varinva_real);
        }

        // PUT: api/inva_real/5
        [HttpPut("{id}")]
        //[AllowAnonymous]
        public async Task<IActionResult> Putinva_real([FromRoute] Guid id, [FromBody] inva_real varinva_real)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != varinva_real.inva_realId)
            {
                return BadRequest();
            }

            _context.Entry(varinva_real).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!inva_realExists(id))
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

        // POST: api/inva_real
        [HttpPost]
        //[AllowAnonymous]
        public async Task<IActionResult> Postinva_real([FromBody] inva_real varinva_real)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.inva_real.Add(varinva_real);
            await _context.SaveChangesAsync();

            return CreatedAtAction("Getinva_real", new { id = varinva_real.inva_realId }, varinva_real);
        }

        // DELETE: api/inva_real/5
        [HttpDelete("{id}")]
        //[AllowAnonymous]
        public async Task<IActionResult> Deleteinva_real([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varinva_real = await _context.inva_real.SingleOrDefaultAsync(m => m.inva_realId == id);
            if (varinva_real == null)
            {
                return NotFound();
            }

            _context.inva_real.Remove(varinva_real);
            await _context.SaveChangesAsync();

            return Ok(varinva_real);
        }

        private bool inva_realExists(Guid id)
        {
            return _context.inva_real.Any(e => e.inva_realId == id);
        }
    }
}
