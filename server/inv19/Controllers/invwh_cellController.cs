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
    [Route("api/invwh_cell")]
    public class invwh_cellController : Controller
    {
        private readonly MyContext _context;
        IWebHostEnvironment _appEnvironment;

        public invwh_cellController(MyContext context, IWebHostEnvironment appEnvironment)
        {
            _context = context;
            _appEnvironment = appEnvironment;
        }

        // GET: api/invwh_cell
        [HttpGet]
        //[AllowAnonymous]
        public IActionResult Getinvwh_cell()
        {
            return Json (_context.invwh_cell, _context.serializerSettings());
        }

        [HttpGet("combo")]
        //[AllowAnonymous]
        public List<Dictionary<string, object>> GetCombo()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT invwh_cellId id, ( [dbo].[invwh_cell_BRIEF_F](invwh_cellId,null)  ) name
                         FROM            
                          invwh_cell 
                            order by name ";
            return _context.GetRaw(sql);
        }
        
        [HttpGet("byparent/{id}")]
        //[AllowAnonymous]
        public List<Dictionary<string, object>> GetByBarent([FromRoute] Guid id)
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT * FROM V_invwh_cell where invwh_locID='" + id.ToString() + "'";
            return _context.GetRaw(sql);
        }
        
        // GET: api/invwh_cell/5
        [HttpGet("{id}")]
        //[AllowAnonymous]
        public async Task<IActionResult> Getinvwh_cell([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varinvwh_cell = await _context.invwh_cell.SingleOrDefaultAsync(m => m.invwh_cellId == id);

            if (varinvwh_cell == null)
            {
                return NotFound();
            }

            return Ok(varinvwh_cell);
        }

        // PUT: api/invwh_cell/5
        [HttpPut("{id}")]
        //[AllowAnonymous]
        public async Task<IActionResult> Putinvwh_cell([FromRoute] Guid id, [FromBody] invwh_cell varinvwh_cell)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != varinvwh_cell.invwh_cellId)
            {
                return BadRequest();
            }

            _context.Entry(varinvwh_cell).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!invwh_cellExists(id))
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

        // POST: api/invwh_cell
        [HttpPost]
        //[AllowAnonymous]
        public async Task<IActionResult> Postinvwh_cell([FromBody] invwh_cell varinvwh_cell)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.invwh_cell.Add(varinvwh_cell);
            await _context.SaveChangesAsync();

            return CreatedAtAction("Getinvwh_cell", new { id = varinvwh_cell.invwh_cellId }, varinvwh_cell);
        }

        // DELETE: api/invwh_cell/5
        [HttpDelete("{id}")]
        //[AllowAnonymous]
        public async Task<IActionResult> Deleteinvwh_cell([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varinvwh_cell = await _context.invwh_cell.SingleOrDefaultAsync(m => m.invwh_cellId == id);
            if (varinvwh_cell == null)
            {
                return NotFound();
            }

            _context.invwh_cell.Remove(varinvwh_cell);
            await _context.SaveChangesAsync();

            return Ok(varinvwh_cell);
        }

        private bool invwh_cellExists(Guid id)
        {
            return _context.invwh_cell.Any(e => e.invwh_cellId == id);
        }
    }
}
