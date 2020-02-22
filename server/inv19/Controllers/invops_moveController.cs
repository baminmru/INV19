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
    [Route("api/invops_move")]
    public class invops_moveController : Controller
    {
        private readonly MyContext _context;
        IWebHostEnvironment _appEnvironment;

        public invops_moveController(MyContext context, IWebHostEnvironment appEnvironment)
        {
            _context = context;
            _appEnvironment = appEnvironment;
        }

        

        // POST: api/invops_move
        [HttpPost]
        //[AllowAnonymous]
        public async Task<IActionResult> Postinvops_move([FromBody] invops_move varinvops_move)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }


            string result = "";

            var uid = User.GetUserId();

            invp_data m = null;
            m = _context.invp_data.FirstOrDefault(z => z.RFID == varinvops_move.rfid);
            if (m == null)
            {
                result = "Запчасть не обнаружена. ";
            }

            invwh_cell c = null;
            c = _context.invwh_cell.FirstOrDefault(cc => cc.SHCODE == varinvops_move.shCodeFrom);
            if (c == null)
            {
                result += "Исходная ячейка не найдена. ";
            }


            invwh_cell cTo = null;
            cTo = _context.invwh_cell.FirstOrDefault(cc => cc.SHCODE == varinvops_move.shCodeTo);
            if (cTo == null)
            {
                result += "Целевая ячейка не найдена. ";
            }

            invd_op op = _context.invd_op.FirstOrDefault(op => op.name == "Перемещение");
            if (op == null)
            {
                op = new invd_op();
                op.invd_opId = Guid.NewGuid();
                op.name = "Перемещение";
                _context.invd_op.Add(op);
                await _context.SaveChangesAsync();
            }

            if (varinvops_move.quantity <= 0)
            {
                result += "Количество должно быть положительным числом. ";
            }

            


            if (m != null && c != null && cTo != null && varinvops_move.quantity > 0)
            {

                invwh_loc loc = null;
                loc = _context.invwh_loc.FirstOrDefault(l => l.invwh_locId == c.invwh_locId);

                invwh_loc locTo = null;
                locTo = _context.invwh_loc.FirstOrDefault(l => l.invwh_locId == cTo.invwh_locId);

                // update source cell  status
                invw_info e = null;
                e = _context.invw_info.FirstOrDefault(ex => ex.storepartid == m.invp_dataId && ex.cellid == c.invwh_cellId);
                if (e != null)
                {
                    if (e.Qty > varinvops_move.quantity)
                    {
                        e.Qty -= varinvops_move.quantity;
                        _context.Entry(e).State = EntityState.Modified;
                    } else  if (e.Qty == varinvops_move.quantity)
                    {
                        _context.invw_info.Remove(e);
                    } else if (e.Qty < varinvops_move.quantity)
                    {
                        result += "Количество запчастей в ячейке не достаточно для перемещения. Всего: " + e.Qty.ToString();
                        _context.invops_move.Add(varinvops_move);
                        await _context.SaveChangesAsync();
                        return BadRequest(result);
                    }
                }
                else
                {
                    result += "Не найдена запчасть в исходной ячейке. ";
                    _context.invops_move.Add(varinvops_move);
                    await _context.SaveChangesAsync();
                    return BadRequest(result);
                }


                // update goal cell  status
                invw_info eTo = null;
                eTo = _context.invw_info.FirstOrDefault(ex => ex.storepartid == m.invp_dataId && ex.cellid == cTo.invwh_cellId);
                if (eTo != null)
                {
                    eTo.Qty += varinvops_move.quantity;
                    _context.Entry(eTo).State = EntityState.Modified;

                }
                else
                {
                    eTo = new invw_info();
                    eTo.invw_infoId = Guid.NewGuid();
                    eTo.Qty = varinvops_move.quantity;
                    eTo.storepartid = m.invp_dataId;
                    eTo.locationid = cTo.invwh_locId;
                    eTo.cellid = cTo.invwh_cellId;
                    eTo.RFID = varinvops_move.rfid;
                    if (locTo != null)
                        eTo.theStore = locTo.theStore;
                    _context.invw_info.Add(eTo);
                }

                // save history
                invm_info h = new invm_info();
                h.invm_infoId = Guid.NewGuid();
                h.fromcell = c.invwh_cellId;
                h.toCell = cTo.invwh_cellId;
                h.theUser = uid;
                h.theOP = op.invd_opId;
                h.optime = DateTime.Now;
                h.Qty = varinvops_move.quantity;
                h.storepartid = m.invp_dataId; // запчасть
                h.theDep = Guid.Empty;
                _context.invm_info.Add(h);

                // save operation for control only
                _context.invops_move.Add(varinvops_move);
                await _context.SaveChangesAsync();
                return CreatedAtAction("Getinvops_move", new { id = varinvops_move.invops_moveId }, varinvops_move);

            }
            else
            {
                _context.invops_move.Add(varinvops_move);
                await _context.SaveChangesAsync();
                return BadRequest(result);

            }

        }

       

        private bool invops_moveExists(Guid id)
        {
            return _context.invops_move.Any(e => e.invops_moveId == id);
        }
    }
}
