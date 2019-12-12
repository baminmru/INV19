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
    [Route("api/invm_info")]
    public class invm_infoController : Controller
    {
        private readonly MyContext _context;
        IHostingEnvironment _appEnvironment;

        public invm_infoController(MyContext context, IHostingEnvironment appEnvironment)
        {
            _context = context;
            _appEnvironment = appEnvironment;
        }

        // GET: api/invm_info
        [HttpGet]
        [AllowAnonymous]
        public IActionResult Getinvm_info()
        {
            return Json (_context.invm_info, _context.serializerSettings());
        }

        [HttpGet("combo")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetCombo()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT invm_infoId id, ( [dbo].[invm_info_BRIEF_F](invm_infoId,null)  ) name
                         FROM            
                          invm_info 
                            order by name ";
            return _context.GetRaw(sql);
        }
        
        [HttpGet("view")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetView()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT * FROM V_invm_info ";
            return _context.GetRaw(sql);
        }
        
        // GET: api/invm_info/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> Getinvm_info([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varinvm_info = await _context.invm_info.SingleOrDefaultAsync(m => m.invm_infoId == id);

            if (varinvm_info == null)
            {
                return NotFound();
            }

            return Ok(varinvm_info);
        }

        // PUT: api/invm_info/5
        [HttpPut("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> Putinvm_info([FromRoute] Guid id, [FromBody] invm_info varinvm_info)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != varinvm_info.invm_infoId)
            {
                return BadRequest();
            }

            _context.Entry(varinvm_info).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!invm_infoExists(id))
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

        // POST: api/invm_info
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Postinvm_info([FromBody] invm_info varinvm_info)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.invm_info.Add(varinvm_info);
            await _context.SaveChangesAsync();

            return CreatedAtAction("Getinvm_info", new { id = varinvm_info.invm_infoId }, varinvm_info);
        }

        // DELETE: api/invm_info/5
        [HttpDelete("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> Deleteinvm_info([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varinvm_info = await _context.invm_info.SingleOrDefaultAsync(m => m.invm_infoId == id);
            if (varinvm_info == null)
            {
                return NotFound();
            }

            _context.invm_info.Remove(varinvm_info);
            await _context.SaveChangesAsync();

            return Ok(varinvm_info);
        }

        private bool invm_infoExists(Guid id)
        {
            return _context.invm_info.Any(e => e.invm_infoId == id);
        }
    }
}
