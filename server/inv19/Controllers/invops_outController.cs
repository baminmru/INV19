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
    [Route("api/invops_out")]
    public class invops_outController : Controller
    {
        private readonly MyContext _context;
        IWebHostEnvironment _appEnvironment;

        public invops_outController(MyContext context, IWebHostEnvironment appEnvironment)
        {
            _context = context;
            _appEnvironment = appEnvironment;
        }

       

        // POST: api/invops_out
        [HttpPost]
        //[AllowAnonymous]
        public async Task<IActionResult> Postinvops_out([FromBody] invops_out varinvops_out)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }



            string result = "";

            var uid = User.GetUserId();

            invp_data m = null;
            m = _context.invp_data.FirstOrDefault(z => z.RFID == varinvops_out.rfid);
            if (m == null)
            {
                result = "Запчасть не обнаружена. ";
            }

            invwh_cell c = null;
            c = _context.invwh_cell.FirstOrDefault(cc => cc.SHCODE == varinvops_out.shCode);
            if (c== null)
            {
                result += "Ячейка не найдена. ";
            }

            invd_dep dep = null;

            dep = _context.invd_dep.FirstOrDefault(dd => dd.invd_depId == varinvops_out.theDept);
            if (dep == null)
            {
                result += "Отдел не найден. ";
            }



            invd_op op = _context.invd_op.FirstOrDefault(op => op.name == "Отгрузка");
            if (op == null)
            {
                op = new invd_op();
                op.invd_opId = Guid.NewGuid();
                op.name = "Отгрузка";
                _context.invd_op.Add(op);
                await _context.SaveChangesAsync();
            }

            if (varinvops_out.quantity <= 0)
            {
                result += "Количество должно быть положительным числом. ";
            }

           


            if (m != null && c != null &&  dep != null && varinvops_out.quantity > 0)
            {

                invwh_loc loc = null;
                loc = _context.invwh_loc.FirstOrDefault(l => l.invwh_locId == c.invwh_locId);

                // update store status
                invw_info e = null;
                e = _context.invw_info.FirstOrDefault(ex => ex.storepartid == m.invp_dataId && ex.cellid == c.invwh_cellId);
                if (e != null)
                {
                    if (e.Qty > varinvops_out.quantity)
                    {
                        e.Qty -= varinvops_out.quantity;
                        _context.Entry(e).State = EntityState.Modified;

                    }else if (e.Qty == varinvops_out.quantity)
                    {
                        _context.invw_info.Remove(e);

                    } else if (e.Qty < varinvops_out.quantity)
                    {
                        result += "Количество запчастей в ячейке не достаточно для списания. Всего: " +e.Qty.ToString();
                        _context.invops_out.Add(varinvops_out);
                        await _context.SaveChangesAsync();
                        return BadRequest(result);
                    }


                }
                else
                {
                    result += "Не найдена запчасть в ячейке. ";
                    _context.invops_out.Add(varinvops_out);
                    await _context.SaveChangesAsync();
                    return BadRequest(result);
                }


                // save history
                invm_info h = new invm_info();
                h.invm_infoId = Guid.NewGuid();
                h.fromcell = c.invwh_cellId;
                h.toCell = Guid.Empty;
                h.theUser = uid;
                h.theOP = op.invd_opId;
                h.optime = DateTime.Now;
                h.Qty = varinvops_out.quantity;
                h.storepartid = m.invp_dataId; // запчасть
                h.theDep = dep.invd_depId;
                _context.invm_info.Add(h);

                _context.invops_out.Add(varinvops_out);
                await _context.SaveChangesAsync();
                return CreatedAtAction("Getinvops_out", new { id = varinvops_out.invops_outId }, varinvops_out);

            }
            else
            {
                _context.invops_out.Add(varinvops_out);
                await _context.SaveChangesAsync();
                return BadRequest(result);

            }


            

           
        }

       
        private bool invops_outExists(Guid id)
        {
            return _context.invops_out.Any(e => e.invops_outId == id);
        }
    }
}
