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
    [Route("api/invg_subgrp")]
    public class invg_subgrpController : Controller
    {
        private readonly MyContext _context;
        IHostingEnvironment _appEnvironment;

        public invg_subgrpController(MyContext context, IHostingEnvironment appEnvironment)
        {
            _context = context;
            _appEnvironment = appEnvironment;
        }

        // GET: api/invg_subgrp
        [HttpGet]
        [AllowAnonymous]
        public IActionResult Getinvg_subgrp()
        {
            return Json (_context.invg_subgrp, _context.serializerSettings());
        }

        [HttpGet("combo")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetCombo()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT invg_subgrpId id, ( [dbo].[invg_subgrp_BRIEF_F](invg_subgrpId,null)  ) name
                         FROM            
                          invg_subgrp 
                            order by name ";
            return _context.GetRaw(sql);
        }
        
        [HttpGet("byparent/{id}")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetByBarent([FromRoute] Guid id)
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT * FROM V_invg_subgrp where invg_grpID='" + id.ToString() + "'";
            return _context.GetRaw(sql);
        }
        
        // GET: api/invg_subgrp/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> Getinvg_subgrp([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varinvg_subgrp = await _context.invg_subgrp.SingleOrDefaultAsync(m => m.invg_subgrpId == id);

            if (varinvg_subgrp == null)
            {
                return NotFound();
            }

            return Ok(varinvg_subgrp);
        }

        // PUT: api/invg_subgrp/5
        [HttpPut("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> Putinvg_subgrp([FromRoute] Guid id, [FromBody] invg_subgrp varinvg_subgrp)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != varinvg_subgrp.invg_subgrpId)
            {
                return BadRequest();
            }

            _context.Entry(varinvg_subgrp).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!invg_subgrpExists(id))
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

        // POST: api/invg_subgrp
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Postinvg_subgrp([FromBody] invg_subgrp varinvg_subgrp)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.invg_subgrp.Add(varinvg_subgrp);
            await _context.SaveChangesAsync();

            return CreatedAtAction("Getinvg_subgrp", new { id = varinvg_subgrp.invg_subgrpId }, varinvg_subgrp);
        }

        // DELETE: api/invg_subgrp/5
        [HttpDelete("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> Deleteinvg_subgrp([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varinvg_subgrp = await _context.invg_subgrp.SingleOrDefaultAsync(m => m.invg_subgrpId == id);
            if (varinvg_subgrp == null)
            {
                return NotFound();
            }

            _context.invg_subgrp.Remove(varinvg_subgrp);
            await _context.SaveChangesAsync();

            return Ok(varinvg_subgrp);
        }

        private bool invg_subgrpExists(Guid id)
        {
            return _context.invg_subgrp.Any(e => e.invg_subgrpId == id);
        }
    }
}
