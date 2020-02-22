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
    [Route("api/invd_store")]
    public class invd_storeController : Controller
    {
        private readonly MyContext _context;
        IWebHostEnvironment _appEnvironment;

        public invd_storeController(MyContext context, IWebHostEnvironment appEnvironment)
        {
            _context = context;
            _appEnvironment = appEnvironment;
        }

        // GET: api/invd_store
        [HttpGet]
        //[AllowAnonymous]
        public IActionResult Getinvd_store()
        {
            return Json (_context.invd_store, _context.serializerSettings());
        }

        [HttpGet("combo")]
        //[AllowAnonymous]
        public List<Dictionary<string, object>> GetCombo()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT invd_storeId id, ( [dbo].[invd_store_BRIEF_F](invd_storeId,null)  ) name
                         FROM            
                          invd_store 
                            order by name ";
            return _context.GetRaw(sql);
        }
        
        [HttpGet("view")]
        //[AllowAnonymous]
        public List<Dictionary<string, object>> GetView()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT * FROM V_invd_store ";
            return _context.GetRaw(sql);
        }
        
        // GET: api/invd_store/5
        [HttpGet("{id}")]
        //[AllowAnonymous]
        public async Task<IActionResult> Getinvd_store([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varinvd_store = await _context.invd_store.SingleOrDefaultAsync(m => m.invd_storeId == id);

            if (varinvd_store == null)
            {
                return NotFound();
            }

            return Ok(varinvd_store);
        }

        // PUT: api/invd_store/5
        [HttpPut("{id}")]
        //[AllowAnonymous]
        public async Task<IActionResult> Putinvd_store([FromRoute] Guid id, [FromBody] invd_store varinvd_store)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != varinvd_store.invd_storeId)
            {
                return BadRequest();
            }

            _context.Entry(varinvd_store).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!invd_storeExists(id))
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

        // POST: api/invd_store
        [HttpPost]
        //[AllowAnonymous]
        public async Task<IActionResult> Postinvd_store([FromBody] invd_store varinvd_store)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.invd_store.Add(varinvd_store);
            await _context.SaveChangesAsync();

            return CreatedAtAction("Getinvd_store", new { id = varinvd_store.invd_storeId }, varinvd_store);
        }

        // DELETE: api/invd_store/5
        [HttpDelete("{id}")]
        //[AllowAnonymous]
        public async Task<IActionResult> Deleteinvd_store([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varinvd_store = await _context.invd_store.SingleOrDefaultAsync(m => m.invd_storeId == id);
            if (varinvd_store == null)
            {
                return NotFound();
            }

            _context.invd_store.Remove(varinvd_store);
            await _context.SaveChangesAsync();

            return Ok(varinvd_store);
        }

        private bool invd_storeExists(Guid id)
        {
            return _context.invd_store.Any(e => e.invd_storeId == id);
        }
    }
}
