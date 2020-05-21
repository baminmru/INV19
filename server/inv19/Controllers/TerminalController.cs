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
using MySys.Common.Extensions;
using inv19.Services;
using Microsoft.Extensions.Logging;


namespace inv19.Controllers
{

    public class TerminalMessage
    {
        public string message { get; set; }
    }

    [Route("api/terminal")]
    [Produces("application/json")]
    public class TerminalController : ControllerBase
    {
        private readonly MyContext _context;
        IWebHostEnvironment _appEnvironment;
        private readonly TerminalService _terminalService;
        private readonly ILogger _logger;
        public TerminalController(MyContext context, IWebHostEnvironment appEnvironment, TerminalService terminalService)
        {
            _context = context;
            _appEnvironment = appEnvironment;
            _terminalService = terminalService;
        }



        [HttpPost("opout/{uid}")]
        [AllowAnonymous]
        public async Task<IActionResult> OpOut([FromRoute] Guid uid, [FromBody] invops_out varinvops_out)
        {

            TerminalMessage result = new TerminalMessage();
            result.message = await _terminalService.Operation_out(uid, varinvops_out);
            return Ok(result);
            

        }


        [HttpPost("opmove/{uid}")]
        [AllowAnonymous]
        public async Task<IActionResult> OpMove([FromRoute] Guid uid, [FromBody] invops_move varinvops_move)
        {
            TerminalMessage result = new TerminalMessage();
            result.message = await _terminalService.Operaion_move(uid, varinvops_move);
            return Ok(result);
            
        }

        [HttpPost("register/{uid}")]
        [AllowAnonymous]
        public async Task<IActionResult> OpIn([FromRoute] Guid uid, [FromBody] invops_register varinvops_reg)
        {
            TerminalMessage result = new TerminalMessage();
            result.message = await _terminalService.Operation_register(uid, varinvops_reg);
            return Ok(result);
        }


        [HttpPost("clearcell/{uid}")]
        [AllowAnonymous]
        public async Task<IActionResult> OpClear([FromRoute] Guid uid, [FromBody] invops_clearcell varinvops_inv)
        {
            TerminalMessage result = new TerminalMessage();
            result.message = await _terminalService.Operation_clearcell(uid, varinvops_inv);
            return Ok(result);
        }



        [HttpPost("inventory/{uid}")]
        [AllowAnonymous]
        public async Task<IActionResult> OpInventory([FromRoute] Guid uid, [FromBody] invops_inventory varinvops_inv)
        {
            TerminalMessage result = new TerminalMessage();
            result.message = await _terminalService.Operation_inventory(uid,varinvops_inv);
            return Ok(result);
        }


        [HttpGet("stopinventory/{uid}/{invid}")]
        [AllowAnonymous]
        public async Task<IActionResult> OpStopInventory([FromRoute] Guid uid, [FromRoute] Guid invID)
        {
            TerminalMessage result = new TerminalMessage();
            result.message = await _terminalService.Operation_stopinventory(uid,invID);
            return Ok(result);
        }

        // POST: api/invops_move
        [HttpPost("opin/{uid}")]
        [AllowAnonymous]
        public async Task<IActionResult> OpIn([FromRoute] Guid uid, [FromBody] invops_in varinvops_in)
        {
            TerminalMessage result = new TerminalMessage();
            result.message = await _terminalService.Operation_in(uid, varinvops_in);
            return Ok(result);
        }


        [HttpGet("dept")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetDept()
        {
            string sql = @"SELECT invd_depId id, ( [dbo].[invd_dep_BRIEF_F](invd_depId,null)  ) name
                         FROM            
                          invd_dep 
                            order by name ";
            return _context.GetRaw(sql);
        }


        [HttpGet("part")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetParts()
        {
            string sql = @"SELECT invp_dataId id, ( [dbo].[invp_data_BRIEF_F](invp_dataId,null)  ) name
                         FROM            
                          invp_data
                            order by name ";
            return _context.GetRaw(sql);
        }


        //[HttpGet("partbytag/{t}")]
        //[AllowAnonymous]
        //public List<Dictionary<string, object>> GetPartByTag([FromRoute] string t)
        //{
        //    string sql = @"SELECT invp_data.invp_dataId id, ( [dbo].[invp_data_BRIEF_F](invp_data.invp_dataId,null)  ) name
        //                 FROM            
        //                  invp_data join invp_tag t on t.invp_dataID=invp_data.invp_dataid
						  //where t.RFID='" + t.Replace("'","''") + "' ";
        //    return _context.GetRaw(sql);
        //}


       


        [HttpGet("tag/{t}")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetTagInfo([FromRoute] string t)
        {
            string sql = @"select case when qty >1 then '*' else '1' end  id , rfid name from invw_info where rFID='" + t.Replace("'", "''") + "' ";
            return _context.GetRaw(sql);
        }


        [HttpGet("inventory")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetInv()
        {
    
            string sql = @"SELECT inva_infoId id, ( [dbo].[inva_info_BRIEF_F](inva_infoId,null)  ) name
                         FROM            
                          inva_info where isFinished=0
                            order by name ";
            return _context.GetRaw(sql);
        }





        [HttpGet("item/{rfid}")]
        [AllowAnonymous]
        public IActionResult GetItem( [FromRoute] string rfid )
        {
            TerminalMessage result = new TerminalMessage();
            invp_data m = null;
            invp_tag t = null;
            t = _context.invp_tag.FirstOrDefault(z => z.RFID == rfid);
            if (t != null)
            {
                m = _context.invp_data.FirstOrDefault(z => z.invp_dataId == t.invp_dataId);
                if (m == null)
                {
                    result.message = "Ошибка. Запчасть не обнаружена";
                }
                else
                {
                    result.message = m.name;
                }
            }
            else
            {
                result.message = "Ошибка. Метка не зарегистрирована";
            }
            return Ok(result);

        }

        [HttpGet("cell/{code}")]
        [AllowAnonymous]
        public IActionResult GetCell([FromRoute] string code)
        {
            TerminalMessage result = new TerminalMessage();
            invwh_cell c = null;
            c = _context.invwh_cell.FirstOrDefault(cc => cc.SHCODE == code);
            if (c == null)
            {
                result.message = "Ошибка. Ячейка не обнаружена";
            }
            else
            {
                result.message = c.name +" (" + c.SHCODE + ")";
            }

            return Ok(result);

        }

    }

}