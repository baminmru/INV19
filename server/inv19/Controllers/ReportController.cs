using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ClosedXML.Excel;
using System.Data;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Authorization;
using inv19.models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace inv19.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ReportController : ControllerBase
    {


        private readonly MyContext _context;
        IWebHostEnvironment _appEnvironment;
        private readonly ILogger _logger;
        public ReportController(MyContext context, IWebHostEnvironment appEnvironment)
        {
            _context = context;
            _appEnvironment = appEnvironment;
           
        }


        [HttpGet("inventory/{InvID}")]
        public  FileResult ExportReport([FromRoute ] Guid InvID)
        {

            inva_info info;

            info = _context.inva_info.FirstOrDefault(i => i.inva_infoId == InvID);
            if(! (info == null))
            {
                DataTable dt = new DataTable("INV");
                dt =_context.DoQuery("select invDate as Дата,invReason as Причина, isFinished_name as Завершена from v_inva_info where inva_infoid='" + InvID.ToString() + "'");
                using (XLWorkbook wb = new XLWorkbook())
                {
                    // localhost:63706/api/report/inventory/D724D127-586B-4FC8-E52B-08D7BDF41736
                    var ws = wb.Worksheets.Add("Инвентаризация");
                    ws.Cell(1, 1).Value = "Инвентаризация";
                    ws.Cell(1, 1).AsRange().AddToNamed("Titles");
                    ws.Cell(2, 1).InsertTable(dt);


                    dt = _context.DoQuery("select storepartid_name as Деталь, qty as Количество, locationid_name as Стеллаж, cellid_name as Ячейка, theStore_name as Склад, RFID  from V_inva_real  where inva_infoid = '" + InvID.ToString() + "'   order by  theStore_name, locationid_name, cellid_name");
                    ws.Cell(4, 1).Value = "Наличие";
                    ws.Cell(4, 1).AsRange().AddToNamed("Titles");
                    ws.Cell(5, 1).InsertTable(dt);
                    ws.Columns().AdjustToContents();
                    

                    dt = _context.DoQuery("select storepartid_name as Деталь, sum(qty) as Количество from V_inva_absnt where inva_infoid = '" + InvID.ToString() + "' group by storepartid_name order by storepartid_name");
                    ws = wb.Worksheets.Add("Недостача");
                    ws.Cell(1, 1).Value = "Недостача";
                    ws.Cell(1, 1).AsRange().AddToNamed("Titles");
                    ws.Cell(2, 1).InsertTable(dt);
                    ws.Columns().AdjustToContents();


                    dt = _context.DoQuery("select storepartid_name as Деталь, qty as Количество, locationid_name as Стеллаж, cellid_name as Ячейка,  RFID from V_inva_extra  where inva_infoid = '" + InvID.ToString() + "' order by   locationid_name, cellid_name");
                    ws = wb.Worksheets.Add( "Излишки");
                    ws.Cell(1, 1).Value = "Излишки";
                    ws.Cell(1, 1).AsRange().AddToNamed("Titles");
                    ws.Cell(2, 1).InsertTable(dt);
                    ws.Columns().AdjustToContents();


                    var titlesStyle = wb.Style;
                    titlesStyle.Font.Bold = true;
                    titlesStyle.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                    titlesStyle.Fill.BackgroundColor = XLColor.Cyan;

                    // Format all titles in one shot
                    wb.NamedRanges.NamedRange("Titles").Ranges.Style = titlesStyle;

                    using (MemoryStream stream = new MemoryStream())
                    {
                        wb.SaveAs(stream);

                        // return File(stream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Inventory.xlsx");
                        return File(stream.ToArray(), "application/octet-stream", "Inventory.xlsx");
                        //return  stream.ToArray();
                    }
                }
            }
            return null;
        }



        [HttpGet("losttags")]
        public FileResult NewTagsReport()
        {

           
                DataTable dt = new DataTable("LOSTTAGS");
                dt = _context.DoQuery(@"select dbo.invp_data_brief_f(invp_data.invp_dataid,null) Деталь, invp_tag.RFID Метка from invp_data
               join invp_tag on invp_tag.invp_dataID = invp_data.invp_dataID
                where rfid not in (SELECT[rFID]  FROM [invw_info])");
                
                using (XLWorkbook wb = new XLWorkbook())
                {
                    var ws = wb.Worksheets.Add("Новые метки");
                    ws.Cell(1, 1).Value = "Метки, которые не приняты на склад";
                    ws.Cell(1, 1).AsRange().AddToNamed("Titles");
                    ws.Cell(2, 1).InsertTable(dt);
                    ws.Columns().AdjustToContents();

                    var titlesStyle = wb.Style;
                    titlesStyle.Font.Bold = true;
                    titlesStyle.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                    titlesStyle.Fill.BackgroundColor = XLColor.Cyan;

                    // Format all titles in one shot
                    wb.NamedRanges.NamedRange("Titles").Ranges.Style = titlesStyle;

                    using (MemoryStream stream = new MemoryStream())
                    {
                        wb.SaveAs(stream);
                        return File(stream.ToArray(), "application/octet-stream", "LostTags.xlsx");
                    }
                }
           
         
        }



    }
}