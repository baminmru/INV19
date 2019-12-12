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
    [Route("api/inva_info")]
    public class inva_infoController : Controller
    {
        private readonly MyContext _context;
        IHostingEnvironment _appEnvironment;

        public inva_infoController(MyContext context, IHostingEnvironment appEnvironment)
        {
            _context = context;
            _appEnvironment = appEnvironment;
        }

        // GET: api/inva_info
        [HttpGet]
        [AllowAnonymous]
        public IActionResult Getinva_info()
        {
            return Json (_context.inva_info, _context.serializerSettings());
        }

        [HttpGet("combo")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetCombo()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT inva_infoId id, ( [dbo].[inva_info_BRIEF_F](inva_infoId,null)  ) name
                         FROM            
                          inva_info 
                            order by name ";
            return _context.GetRaw(sql);
        }
        
        [HttpGet("view")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetView()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT * FROM V_inva_info ";
            return _context.GetRaw(sql);
        }
        
        // GET: api/inva_info/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> Getinva_info([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varinva_info = await _context.inva_info.SingleOrDefaultAsync(m => m.inva_infoId == id);

            if (varinva_info == null)
            {
                return NotFound();
            }

            return Ok(varinva_info);
        }

        // PUT: api/inva_info/5
        [HttpPut("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> Putinva_info([FromRoute] Guid id, [FromBody] inva_info varinva_info)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != varinva_info.inva_infoId)
            {
                return BadRequest();
            }

            _context.Entry(varinva_info).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!inva_infoExists(id))
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

        // POST: api/inva_info
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Postinva_info([FromBody] inva_info varinva_info)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.inva_info.Add(varinva_info);
            await _context.SaveChangesAsync();

            return CreatedAtAction("Getinva_info", new { id = varinva_info.inva_infoId }, varinva_info);
        }

        // DELETE: api/inva_info/5
        [HttpDelete("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> Deleteinva_info([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varinva_info = await _context.inva_info.SingleOrDefaultAsync(m => m.inva_infoId == id);
            if (varinva_info == null)
            {
                return NotFound();
            }

            _context.inva_info.Remove(varinva_info);
            await _context.SaveChangesAsync();

            return Ok(varinva_info);
        }

        private bool inva_infoExists(Guid id)
        {
            return _context.inva_info.Any(e => e.inva_infoId == id);
        }
    }
}
