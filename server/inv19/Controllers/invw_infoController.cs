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
    [Route("api/invw_info")]
    public class invw_infoController : Controller
    {
        private readonly MyContext _context;
        IWebHostEnvironment _appEnvironment;

        public invw_infoController(MyContext context, IWebHostEnvironment appEnvironment)
        {
            _context = context;
            _appEnvironment = appEnvironment;
        }

        // GET: api/invw_info
        [HttpGet]
        //[AllowAnonymous]
        public IActionResult Getinvw_info()
        {
            return Json (_context.invw_info, _context.serializerSettings());
        }

        [HttpGet("combo")]
        //[AllowAnonymous]
        public List<Dictionary<string, object>> GetCombo()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT invw_infoId id, ( [dbo].[invw_info_BRIEF_F](invw_infoId,null)  ) name
                         FROM            
                          invw_info 
                            order by name ";
            return _context.GetRaw(sql);
        }
        
        [HttpGet("view")]
        //[AllowAnonymous]
        public List<Dictionary<string, object>> GetView()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT * FROM V_invw_info ";
            return _context.GetRaw(sql);
        }
        
        // GET: api/invw_info/5
        [HttpGet("{id}")]
        //[AllowAnonymous]
        public async Task<IActionResult> Getinvw_info([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varinvw_info = await _context.invw_info.SingleOrDefaultAsync(m => m.invw_infoId == id);

            if (varinvw_info == null)
            {
                return NotFound();
            }

            return Ok(varinvw_info);
        }

        // PUT: api/invw_info/5
        [HttpPut("{id}")]
        //[AllowAnonymous]
        public async Task<IActionResult> Putinvw_info([FromRoute] Guid id, [FromBody] invw_info varinvw_info)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != varinvw_info.invw_infoId)
            {
                return BadRequest();
            }

            _context.Entry(varinvw_info).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!invw_infoExists(id))
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

        // POST: api/invw_info
        [HttpPost]
        //[AllowAnonymous]
        public async Task<IActionResult> Postinvw_info([FromBody] invw_info varinvw_info)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.invw_info.Add(varinvw_info);
            await _context.SaveChangesAsync();

            return CreatedAtAction("Getinvw_info", new { id = varinvw_info.invw_infoId }, varinvw_info);
        }

        // DELETE: api/invw_info/5
        [HttpDelete("{id}")]
        //[AllowAnonymous]
        public async Task<IActionResult> Deleteinvw_info([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varinvw_info = await _context.invw_info.SingleOrDefaultAsync(m => m.invw_infoId == id);
            if (varinvw_info == null)
            {
                return NotFound();
            }

            _context.invw_info.Remove(varinvw_info);
            await _context.SaveChangesAsync();

            return Ok(varinvw_info);
        }

        private bool invw_infoExists(Guid id)
        {
            return _context.invw_info.Any(e => e.invw_infoId == id);
        }
    }
}
