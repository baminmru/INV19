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
    [Route("api/xUserInfo")]
    public class xUserInfoController : Controller
    {
        private readonly MyContext _context;
        IWebHostEnvironment _appEnvironment;

        public xUserInfoController(MyContext context, IWebHostEnvironment appEnvironment)
        {
            _context = context;
            _appEnvironment = appEnvironment;
        }

        // GET: api/xUserInfo
        [HttpGet]
        //[AllowAnonymous]
        public IActionResult GetxUserInfo()
        {
            return Json (_context.xUserInfo, _context.serializerSettings());
        }

        [HttpGet("combo")]
        //[AllowAnonymous]
        public List<Dictionary<string, object>> GetCombo()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT xUserInfoId id, ( [dbo].[xUserInfo_BRIEF_F](xUserInfoId,null)  ) name
                         FROM            
                          xUserInfo 
                            order by name ";
            return _context.GetRaw(sql);
        }
        
        [HttpGet("view")]
        //[AllowAnonymous]
        public List<Dictionary<string, object>> GetView()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT * FROM V_xUserInfo ";
            return _context.GetRaw(sql);
        }
        
        // GET: api/xUserInfo/5
        [HttpGet("{id}")]
        //[AllowAnonymous]
        public async Task<IActionResult> GetxUserInfo([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varxUserInfo = await _context.xUserInfo.SingleOrDefaultAsync(m => m.xUserInfoId == id);

            if (varxUserInfo == null)
            {
                return NotFound();
            }

            return Ok(varxUserInfo);
        }

        // PUT: api/xUserInfo/5
        [HttpPut("{id}")]
        //[AllowAnonymous]
        public async Task<IActionResult> PutxUserInfo([FromRoute] Guid id, [FromBody] xUserInfo varxUserInfo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != varxUserInfo.xUserInfoId)
            {
                return BadRequest();
            }

            _context.Entry(varxUserInfo).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!xUserInfoExists(id))
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

        // POST: api/xUserInfo
        [HttpPost]
        //[AllowAnonymous]
        public async Task<IActionResult> PostxUserInfo([FromBody] xUserInfo varxUserInfo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.xUserInfo.Add(varxUserInfo);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetxUserInfo", new { id = varxUserInfo.xUserInfoId }, varxUserInfo);
        }

        // DELETE: api/xUserInfo/5
        [HttpDelete("{id}")]
        //[AllowAnonymous]
        public async Task<IActionResult> DeletexUserInfo([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varxUserInfo = await _context.xUserInfo.SingleOrDefaultAsync(m => m.xUserInfoId == id);
            if (varxUserInfo == null)
            {
                return NotFound();
            }

            _context.xUserInfo.Remove(varxUserInfo);
            await _context.SaveChangesAsync();

            return Ok(varxUserInfo);
        }

        private bool xUserInfoExists(Guid id)
        {
            return _context.xUserInfo.Any(e => e.xUserInfoId == id);
        }
    }
}
