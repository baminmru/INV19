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
    [Route("api/invp_data")]
    public class invp_dataController : Controller
    {
        private readonly MyContext _context;
        IWebHostEnvironment _appEnvironment;

        public invp_dataController(MyContext context, IWebHostEnvironment appEnvironment)
        {
            _context = context;
            _appEnvironment = appEnvironment;
        }

        // GET: api/invp_data
        [HttpGet]
        //[AllowAnonymous]
        public IActionResult Getinvp_data()
        {
            return Json (_context.invp_data, _context.serializerSettings());
        }

        [HttpGet("combo")]
        //[AllowAnonymous]
        public List<Dictionary<string, object>> GetCombo()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT invp_dataId id, ( [dbo].[invp_data_BRIEF_F](invp_dataId,null)  ) name
                         FROM            
                          invp_data 
                            order by name ";
            return _context.GetRaw(sql);
        }
        
        [HttpGet("view")]
        //[AllowAnonymous]
        public List<Dictionary<string, object>> GetView()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT * FROM V_invp_data ";
            return _context.GetRaw(sql);
        }
        
        // GET: api/invp_data/5
        [HttpGet("{id}")]
        //[AllowAnonymous]
        public async Task<IActionResult> Getinvp_data([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varinvp_data = await _context.invp_data.SingleOrDefaultAsync(m => m.invp_dataId == id);

            if (varinvp_data == null)
            {
                return NotFound();
            }

            return Ok(varinvp_data);
        }

        // PUT: api/invp_data/5
        [HttpPut("{id}")]
        //[AllowAnonymous]
        public async Task<IActionResult> Putinvp_data([FromRoute] Guid id, [FromBody] invp_data varinvp_data)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != varinvp_data.invp_dataId)
            {
                return BadRequest();
            }

            _context.Entry(varinvp_data).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!invp_dataExists(id))
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

        // POST: api/invp_data
        [HttpPost]
        //[AllowAnonymous]
        public async Task<IActionResult> Postinvp_data([FromBody] invp_data varinvp_data)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.invp_data.Add(varinvp_data);
            await _context.SaveChangesAsync();

            return CreatedAtAction("Getinvp_data", new { id = varinvp_data.invp_dataId }, varinvp_data);
        }

        // DELETE: api/invp_data/5
        [HttpDelete("{id}")]
        //[AllowAnonymous]
        public async Task<IActionResult> Deleteinvp_data([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varinvp_data = await _context.invp_data.SingleOrDefaultAsync(m => m.invp_dataId == id);
            if (varinvp_data == null)
            {
                return NotFound();
            }

            _context.invp_data.Remove(varinvp_data);
            await _context.SaveChangesAsync();

            return Ok(varinvp_data);
        }

        private bool invp_dataExists(Guid id)
        {
            return _context.invp_data.Any(e => e.invp_dataId == id);
        }
    }
}
