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

namespace inv19.Controllers
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/invops_in")]
    public class invops_inController : Controller
    {
        private readonly MyContext _context;
        IWebHostEnvironment _appEnvironment;

        public invops_inController(MyContext context, IWebHostEnvironment appEnvironment)
        {
            _context = context;
            _appEnvironment = appEnvironment;
        }

       

        // POST: api/invops_in
        [HttpPost]
        //[AllowAnonymous]
        public async Task<IActionResult> Postinvops_in([FromBody] invops_in varinvops_in)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string result="";

            var uid = User.GetUserId();

            invp_data m= null;
            m = _context.invp_data.FirstOrDefault(z => z.RFID == varinvops_in.rfid);
            if (m == null)
            {
                result = "Запчасть не обнаружена. ";
            }

            invwh_cell c = null;
            c = _context.invwh_cell.FirstOrDefault(cc => cc.SHCODE == varinvops_in.shCode);
            if (c == null)
            {
                result += "Ячейка не найдена. ";
            }


            invd_op op = _context.invd_op.FirstOrDefault(op => op.name == "Приемка");
            if (op == null)
            {
                //result += "Нет операции 'Приемка' в справочнике. ";
                op = new invd_op();
                op.invd_opId = Guid.NewGuid();
                op.name = "Приемка";
                _context.invd_op.Add(op);
                await _context.SaveChangesAsync();
            }

            if(varinvops_in.quantity <= 0)
            {
                result += "Количество должно быть положительным числом. ";
            }




            if (m!=null && c !=null && varinvops_in.quantity > 0)
            {


                invwh_loc loc = null;
                loc = _context.invwh_loc.FirstOrDefault(l => l.invwh_locId == c.invwh_locId);

                // update store status
                invw_info e = null;
                e = _context.invw_info.FirstOrDefault(ex => ex.storepartid == m.invp_dataId && ex.cellid == c.invwh_cellId);
                if(e != null)
                {
                    e.Qty += varinvops_in.quantity;
                    _context.Entry(e).State = EntityState.Modified;
                   
                }
                else
                {
                    e = new invw_info();
                    e.invw_infoId = Guid.NewGuid();
                    e.Qty = varinvops_in.quantity;
                    e.storepartid = m.invp_dataId;
                    e.locationid = c.invwh_locId;
                    e.cellid = c.invwh_cellId;
                    e.RFID = varinvops_in.rfid;
                    if (loc != null)
                        e.theStore = loc.theStore;
                    _context.invw_info.Add(e);
                }

                // save history
                invm_info h = new invm_info();
                h.invm_infoId = Guid.NewGuid();
                h.fromcell = Guid.Empty;
                h.toCell = c.invwh_cellId;
                h.theUser = uid;
                h.theOP = op.invd_opId;
                h.optime = DateTime.Now;
                h.Qty = varinvops_in.quantity;
                h.storepartid = m.invp_dataId; // запчасть
                h.theDep = Guid.Empty;
                _context.invm_info.Add(h);

                // save operation for control only
                _context.invops_in.Add(varinvops_in);
                await _context.SaveChangesAsync();
                return CreatedAtAction("Getinvops_in", new { id = varinvops_in.invops_inId }, varinvops_in);

            }
            else
            {
                _context.invops_in.Add(varinvops_in);
                await _context.SaveChangesAsync();
                return BadRequest(result);

            }

            

            
        }

       
        private bool invops_inExists(Guid id)
        {
            return _context.invops_in.Any(e => e.invops_inId == id);
        }
    }
}
