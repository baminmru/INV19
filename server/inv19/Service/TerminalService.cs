using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using MySys.Identity.Models;
using MySys.Common.Service;
using MySys.Common.User;
using inv19.Services.Users.Data;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using inv19.models;
using Microsoft.AspNetCore.Mvc;


namespace inv19.Services
{
    public class TerminalService
    {


        public MyContext _context { get; set; }
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<MyIdentityRole> _roleManager;
        private readonly ILogger _logger;
     
        public TerminalService(MyContext ctx,
            UserManager<ApplicationUser> userManager,
            RoleManager<MyIdentityRole> roleManager,
            ILogger<TerminalService> logger
            )
        {
            _context = ctx;
            _userManager = userManager;
            _roleManager = roleManager;
            _logger = logger;
            
        }


        public async Task<string> Operation_register(Guid uid, invops_register varinvops_reg)
        {
            string result = "";

            invp_data m = null;
            m = _context.invp_data.FirstOrDefault(z => z.invp_dataId == varinvops_reg.thePart);
            if (m == null)
            {
                result = "Запчасть не обнаружена. ";
            }

            if (m != null )
            {
                invp_tag t = new invp_tag();
                t.invp_dataId = m.invp_dataId;
                t.RFID = varinvops_reg.rfid;
                _context.invp_tag.Add(t);
                
                await _context.SaveChangesAsync();
                return "OK";

            }
            else
            {
                return result;

            }
        }



        public async Task<string> Operation_in(Guid uid, invops_in varinvops_in)
        {
            string result = "";

            invp_data m = null;
            invp_tag t;
            t = _context.invp_tag.FirstOrDefault(t => t.RFID == varinvops_in.rfid);
            if(t== null)
            {
                // result = "Метка не зарегистрирована. ";
            }

            if (t != null)
            {
                m = _context.invp_data.FirstOrDefault(z => z.invp_dataId == t.invp_dataId);
                if (m == null)
                {
                    result += "Запчасть не обнаружена. ";
                }
            }
            else
            {
                m = _context.invp_data.FirstOrDefault(z => z.invp_dataId == varinvops_in.thePart);
                if (m == null)
                {
                    result = "Запчасть не обнаружена. ";
                }
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

            if (varinvops_in.quantity <= 0)
            {
                result += "Количество должно быть положительным числом. ";
            }

            if ( m != null && c != null && varinvops_in.quantity > 0)
            {
                if (t == null)
                {
                    t = new invp_tag();
                    t.invp_dataId = m.invp_dataId;
                    t.RFID = varinvops_in.rfid;
                    _context.invp_tag.Add(t);
                }

                invwh_loc loc = null;
                loc = _context.invwh_loc.FirstOrDefault(l => l.invwh_locId == c.invwh_locId);

                invw_info e = null;
            
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
                return "OK";

            }
            else
            {
                _context.invops_in.Add(varinvops_in);
                await _context.SaveChangesAsync();
                return result;

            }
        }


        public async Task<string> Operation_clearcell(Guid uid, invops_clearcell varinvops_in)
        {
            string result = "";

            
            invwh_cell c = null;
            c = _context.invwh_cell.FirstOrDefault(cc => cc.SHCODE == varinvops_in.shCode);
            if (c == null)
            {
                result += "Ячейка не найдена. ";
            }

            if(c != null) { 
                string qDelete = "delete from inva_real where  cellid='" + c.invwh_cellId.ToString() + "' and  inva_infoID ='" + varinvops_in.InventoryID.ToString() + @"' ";
                _context.DoExec(qDelete);
                return "OK";
            }
            else
            {
                await _context.SaveChangesAsync();
                return result;

            }
        }


        public async Task<string> Operation_inventory(Guid uid, invops_inventory varinvops_in)
        {
            string result = "";

            invp_data m = null;
            invp_tag t;
            t = _context.invp_tag.FirstOrDefault(t => t.RFID == varinvops_in.rfid);
            if (t == null)
            {
                 result = "Метка не зарегистрирована. ";
            }

            if (t != null)
            {
                m = _context.invp_data.FirstOrDefault(z => z.invp_dataId == t.invp_dataId);
                if (m == null)
                {
                    result += "Запчасть не обнаружена. ";
                }
            }
            
            invwh_cell c = null;
            c = _context.invwh_cell.FirstOrDefault(cc => cc.SHCODE == varinvops_in.shCode);
            if (c == null)
            {
                result += "Ячейка не найдена. ";
            }

            

            if (varinvops_in.quantity <= 0)
            {
                result += "Количество должно быть положительным числом. ";
            }

            if (t != null && m != null && c != null && varinvops_in.quantity > 0)
            {
                
                invwh_loc loc = null;
                loc = _context.invwh_loc.FirstOrDefault(l => l.invwh_locId == c.invwh_locId);

                inva_real  e = null;

                {
                    e = new inva_real();
                    e.inva_realId = Guid.NewGuid();
                    e.inva_infoId = varinvops_in.InventoryID;
                    e.Qty = varinvops_in.quantity;
                    e.storepartid = m.invp_dataId;
                    e.locationid = c.invwh_locId;
                    e.cellid = c.invwh_cellId;
                    e.RFID = varinvops_in.rfid;
                    if (loc != null)
                        e.theStore = loc.theStore;
                    _context.inva_real.Add(e);
                }

                await _context.SaveChangesAsync();
                return "OK";

            }
            else
            {
                await _context.SaveChangesAsync();
                return result;

            }
        }



        public async Task<string> Operation_stopinventory(Guid uid, Guid InventoryID)
        {
            string result = "";


            inva_info ia = _context.inva_info.FirstOrDefault(i => i.inva_infoId == InventoryID);

            if(ia == null)
            {
                result = "Не найдена инвентаризация. ";
            }

            string q1 = @"INSERT INTO [dbo].[inva_extra]
                   ([inva_extraid]
                   ,[inva_infoID]
                   ,[storepartid]
                   ,[Qty]
                   ,[locationid]
                   ,[cellid]
                   ,[RFID])

                   select
		           NEWID()
                   ,'" + InventoryID.ToString() + @"'
		           ,r.storepartid
                   ,r.Qty-w.Qty
                   ,r.locationid
                   ,r.cellid
                   ,r.RFID
		           from inva_real r join invw_info w on 
		           r.storepartid = w.storepartid and 
                   r.locationid =w.locationid and
                   r.cellid=w.cellid and
                   r.theStore =w.theStore and
                   r.RFID = w.rFID
		           and r.Qty > w.Qty  where 
		           r.inva_infoID ='" + InventoryID.ToString() + @"' ";

            _context.DoExec(q1);

            string q2 = 
           @"INSERT INTO [dbo].[inva_extra]
           ([inva_extraid]
           ,[inva_infoID]
           ,[storepartid]
           ,[Qty]
           ,[locationid]
           ,[cellid]
           ,[RFID])
           select
		   NEWID()
           ,'" + InventoryID.ToString() + @"'
		   ,r.storepartid
           ,r.Qty
           ,r.locationid
           ,r.cellid
           ,r.RFID
		   from inva_real r   where 
		   r.inva_infoID ='" + InventoryID.ToString() + @"' and
		   concat(
			   CONVERT(nvarchar(40),storepartid),
			   CONVERT(nvarchar(40),cellid),
			   RFID
		   )
		    not in (
			select 
			concat(
			   CONVERT(nvarchar(40),storepartid),
			   CONVERT(nvarchar(40),cellid),
			   RFID
		    )
		   from invw_info 
		   )";
           
            _context.DoExec(q2);

            string q3 = 
           @"INSERT INTO [dbo].[inva_absnt]
           ([inva_absntid]
           ,[inva_infoID]
           ,[storepartid]
           ,[Qty])
           select
		   NEWID()
           ,'" + InventoryID.ToString() + @"'
		   ,r.storepartid
           ,sum(w.Qty-r.Qty)
		   from inva_real r join invw_info w on 
		   r.storepartid = w.storepartid and 
           r.locationid =w.locationid and
           r.cellid=w.cellid and
           r.theStore =w.theStore and
           r.RFID = w.rFID
		   and r.Qty < w.Qty
           where 
		   r.inva_infoID ='" + InventoryID.ToString() + @"' 
		   group by  r.storepartid ";
            _context.DoExec(q3);


            string q4 = @"INSERT INTO [dbo].[inva_absnt]
           ([inva_absntid]
           ,[inva_infoID]
           ,[storepartid]
           ,[Qty])
     select
		   NEWID()
           ,'" + InventoryID.ToString() + @"'
		   ,r.storepartid
           ,sum(r.Qty)
		    from invw_info r  where 
			   concat(
				   CONVERT(nvarchar(40),storepartid),
				   CONVERT(nvarchar(40),cellid),
				   RFID
			   )
		    not in (
			select 
			concat(
			   CONVERT(nvarchar(40),storepartid),
			   CONVERT(nvarchar(40),cellid),
			   RFID
		    )
		   from inva_real
		   where 
		   inva_infoID ='" + InventoryID.ToString() + @"' 
		   )
		   group by storepartid";
           _context.DoExec(q4);

            if (ia != null)
            {
                ia.isFinished = enum_YesNo.YesNo_Da;
                await _context.SaveChangesAsync();
                return "OK";

            }
            else
            {
                await _context.SaveChangesAsync();
                return result;

            }
        }



        public async Task<string> Operaion_move(Guid uid, invops_move varinvops_move)
        {
            string result = "";
            invp_data m = null;
            invp_tag t = null;
            t = _context.invp_tag.FirstOrDefault(z => z.RFID == varinvops_move.rfid);
            if (t != null)
            {
                m = _context.invp_data.FirstOrDefault(z => z.invp_dataId == t.invp_dataId);
                if (m == null)
                {
                    result = "Ошибка. Запчасть не обнаружена";
                }
                else
                {
                    result = m.name;
                }
            }
            else
            {
                result = "Ошибка. Запчасть не обнаружена";
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

            //if (varinvops_move.quantity <= 0)
            //{
            //    result += "Количество должно быть положительным числом. ";
            //}

            if (m != null && c != null && cTo != null ) //&& varinvops_move.quantity > 0)
            {

                invwh_loc loc = null;
                loc = _context.invwh_loc.FirstOrDefault(l => l.invwh_locId == c.invwh_locId);

                invwh_loc locTo = null;
                locTo = _context.invwh_loc.FirstOrDefault(l => l.invwh_locId == cTo.invwh_locId);

                // update source cell  status
                invw_info e = null;
                //e = _context.invw_info.FirstOrDefault(ex => ex.storepartid == m.invp_dataId && ex.cellid == c.invwh_cellId);
                e = _context.invw_info.FirstOrDefault(ex => ex.RFID == t.RFID && ex.cellid == c.invwh_cellId);
                int Qty=0;
                if (e != null)
                {
                    //if (e.Qty > varinvops_move.quantity)
                    //{
                    //    e.Qty -= varinvops_move.quantity;
                    //    _context.Entry(e).State = EntityState.Modified;
                    //}
                    //else if (e.Qty == varinvops_move.quantity)
                    {
                        Qty = (int) e.Qty;
                        _context.invw_info.Remove(e);
                    }
                    //else if (e.Qty < varinvops_move.quantity)
                    //{
                    //    result += "Количество запчастей в ячейке не достаточно для перемещения. Всего: " + e.Qty.ToString();
                    //    _context.invops_move.Add(varinvops_move);
                    //    await _context.SaveChangesAsync();
                    //    return result;
                    //}
                }
                else
                {
                    result += "Не найдена запчасть в исходной ячейке. ";
                    _context.invops_move.Add(varinvops_move);
                    await _context.SaveChangesAsync();
                    return result;
                }


                // update goal cell  status
                invw_info eTo = null;
                //eTo = _context.invw_info.FirstOrDefault(ex => ex.storepartid == m.invp_dataId && ex.cellid == cTo.invwh_cellId);
                //if (eTo != null)
                //{
                //    eTo.Qty += varinvops_move.quantity;
                //    _context.Entry(eTo).State = EntityState.Modified;

                //}
                //else
                {
                    eTo = new invw_info();
                    eTo.invw_infoId = Guid.NewGuid();
                    //eTo.Qty = varinvops_move.quantity;
                    eTo.Qty = Qty;  // при перемещении количество не меняем
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
                //h.Qty = varinvops_move.quantity;
                h.Qty = Qty;
                h.storepartid = m.invp_dataId; // запчасть
                h.theDep = Guid.Empty;
                _context.invm_info.Add(h);

                // save operation for control only
                _context.invops_move.Add(varinvops_move);
                await _context.SaveChangesAsync();
                return "OK";
            }
            else
            {
                _context.invops_move.Add(varinvops_move);
                await _context.SaveChangesAsync();
                return result;
            }

        }


        public async Task<string> Operation_out(Guid uid, invops_out varinvops_out)
        {
            string result = "";
            invp_data m = null;
            invp_tag t = null;
            t = _context.invp_tag.FirstOrDefault(z => z.RFID == varinvops_out.rfid);
            if (t != null)
            {
                m = _context.invp_data.FirstOrDefault(z => z.invp_dataId == t.invp_dataId);
                if (m == null)
                {
                    result = "Ошибка. Запчасть не обнаружена";
                }
                else
                {
                    result = m.name;
                }
            }
            else
            {
                result = "Ошибка. Запчасть не обнаружена";
            }

            invwh_cell c = null;
            c = _context.invwh_cell.FirstOrDefault(cc => cc.SHCODE == varinvops_out.shCode);
            if (c == null)
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




            if (m != null && c != null && dep != null && varinvops_out.quantity > 0)
            {

                invwh_loc loc = null;
                loc = _context.invwh_loc.FirstOrDefault(l => l.invwh_locId == c.invwh_locId);

                // update store status
                invw_info e = null;
                e = _context.invw_info.FirstOrDefault(ex => ex.RFID == t.RFID && ex.cellid == c.invwh_cellId);
                if (e != null)
                {
                    if (e.Qty > varinvops_out.quantity)
                    {
                        e.Qty -= varinvops_out.quantity;
                        _context.Entry(e).State = EntityState.Modified;

                    }
                    else if (e.Qty == varinvops_out.quantity)
                    {
                        _context.invw_info.Remove(e);

                    }
                    else if (e.Qty < varinvops_out.quantity)
                    {
                        result += "Количество запчастей в ячейке не достаточно для списания. Всего: " + e.Qty.ToString();
                        _context.invops_out.Add(varinvops_out);
                        await _context.SaveChangesAsync();
                        return result;
                    }


                }
                else
                {
                    result += "Не найдена запчасть в ячейке. ";
                    _context.invops_out.Add(varinvops_out);
                    await _context.SaveChangesAsync();
                    return result;
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
                return "OK";

            }
            else
            {
                _context.invops_out.Add(varinvops_out);
                await _context.SaveChangesAsync();
                return result;

            }
        }


    }
}
