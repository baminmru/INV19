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
    [Route("api/invd_op")]
    public class invd_opController : Controller
    {
        private readonly MyContext _context;
        IWebHostEnvironment _appEnvironment;

        public invd_opController(MyContext context, IWebHostEnvironment appEnvironment)
        {
            _context = context;
            _appEnvironment = appEnvironment;
        }

        // GET: api/invd_op
        [HttpGet]
        //[AllowAnonymous]
        public IActionResult Getinvd_op()
        {
            return Json (_context.invd_op, _context.serializerSettings());
        }

        [HttpGet("combo")]
        //[AllowAnonymous]
        public List<Dictionary<string, object>> GetCombo()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT invd_opId id, ( [dbo].[invd_op_BRIEF_F](invd_opId,null)  ) name
                         FROM            
                          invd_op 
                            order by name ";
            return _context.GetRaw(sql);
        }
        
        [HttpGet("view")]
        //[AllowAnonymous]
        public List<Dictionary<string, object>> GetView()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT * FROM V_invd_op ";
            return _context.GetRaw(sql);
        }
        
        // GET: api/invd_op/5
        [HttpGet("{id}")]
        //[AllowAnonymous]
        public async Task<IActionResult> Getinvd_op([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varinvd_op = await _context.invd_op.SingleOrDefaultAsync(m => m.invd_opId == id);

            if (varinvd_op == null)
            {
                return NotFound();
            }

            return Ok(varinvd_op);
        }

        // PUT: api/invd_op/5
        [HttpPut("{id}")]
        //[AllowAnonymous]
        public async Task<IActionResult> Putinvd_op([FromRoute] Guid id, [FromBody] invd_op varinvd_op)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != varinvd_op.invd_opId)
            {
                return BadRequest();
            }

            _context.Entry(varinvd_op).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!invd_opExists(id))
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

        // POST: api/invd_op
        [HttpPost]
        //[AllowAnonymous]
        public async Task<IActionResult> Postinvd_op([FromBody] invd_op varinvd_op)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.invd_op.Add(varinvd_op);
            await _context.SaveChangesAsync();

            return CreatedAtAction("Getinvd_op", new { id = varinvd_op.invd_opId }, varinvd_op);
        }

        // DELETE: api/invd_op/5
        [HttpDelete("{id}")]
        //[AllowAnonymous]
        public async Task<IActionResult> Deleteinvd_op([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varinvd_op = await _context.invd_op.SingleOrDefaultAsync(m => m.invd_opId == id);
            if (varinvd_op == null)
            {
                return NotFound();
            }

            _context.invd_op.Remove(varinvd_op);
            await _context.SaveChangesAsync();

            return Ok(varinvd_op);
        }

        private bool invd_opExists(Guid id)
        {
            return _context.invd_op.Any(e => e.invd_opId == id);
        }
    }
}
