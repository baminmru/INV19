using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Data;
using Microsoft.Data.SqlClient ;
using Newtonsoft.Json;

namespace inv19.models
{
   public class MyContext: DbContext
    {
        public MyContext(DbContextOptions<MyContext> options)
             : base(options)
        {
            //Database.EnsureCreated();
            _serializerSettings = new JsonSerializerSettings()
            {
                TypeNameHandling = TypeNameHandling.None
            };
        }

        private JsonSerializerSettings _serializerSettings;

        public JsonSerializerSettings serializerSettings()
        {

            return _serializerSettings;
        }

        // retrivedata from raw sql select
        public List<Dictionary<string, object>> GetRaw(string SQL)
        {
            List<Dictionary<string, object>> rows = new List<Dictionary<string, object>>();
            Dictionary<string, object> row;
            DataTable dt;
            SqlDataAdapter da;
            SqlCommand cmd = new SqlCommand(SQL, (SqlConnection)Database.GetDbConnection());
            cmd.CommandType = CommandType.Text;
            dt = new DataTable();
            da = new SqlDataAdapter(cmd);
            try
            {

                // retrive data from db
                da.Fill(dt);

                foreach (DataRow dr in dt.Rows)
                {
                    row = new Dictionary<string, object>();
                    foreach (DataColumn col in dt.Columns)
                    {
                        if (dr[col] != DBNull.Value)
                            row.Add(col.ColumnName, dr[col]);
                        else
                            row.Add(col.ColumnName, null);
                    }
                    rows.Add(row);
                }


            }
            catch (System.Exception ex)
            {
                System.Diagnostics.Debug.Print(ex.Message);
            }
            finally
            {
                dt.Dispose();
                da.Dispose();
                cmd.Dispose();
            }

            return rows;
        }

        public DataTable DoQuery(string SQL)
        {
            DataTable dt;
            SqlDataAdapter da;
            SqlCommand cmd = new SqlCommand(SQL, (SqlConnection)Database.GetDbConnection());
            cmd.CommandType = CommandType.Text;
            dt = new DataTable();
            da = new SqlDataAdapter(cmd);
            try
            {

                // retrive data from db
                da.Fill(dt);

            }
            catch (System.Exception ex)
            {
                System.Diagnostics.Debug.Print(ex.Message);
            }
            finally
            {

                da.Dispose();
                cmd.Dispose();
            }

            return dt;
        }


        public string DoExec(string SQL)
        {

            SqlCommand cmd = new SqlCommand(SQL, (SqlConnection)Database.GetDbConnection());
            cmd.CommandType = CommandType.Text;
            System.Diagnostics.Debug.Print("Exec: " + SQL);
            Boolean my_open = false;
            try
            {
                if (cmd.Connection.State != ConnectionState.Open) { cmd.Connection.Open(); my_open = true; }
                cmd.ExecuteNonQuery();

            }
            catch (System.Exception ex)
            {
                System.Diagnostics.Debug.Print(ex.Message);
                return ex.Message;
            }
            finally
            {
                if (my_open && cmd.Connection.State == ConnectionState.Open) cmd.Connection.Close();
                cmd.Dispose();
            }
            return "";
        }


        public DbSet<inv19.models.invg_grp> invg_grp { get; set; }
        public DbSet<inv19.models.invg_subgrp> invg_subgrp { get; set; }
        public DbSet<inv19.models.invp_data> invp_data { get; set; }
        public DbSet<inv19.models.inva_info> inva_info { get; set; }
        public DbSet<inv19.models.inva_real> inva_real { get; set; }
        public DbSet<inv19.models.inva_absnt> inva_absnt { get; set; }
        public DbSet<inv19.models.inva_extra> inva_extra { get; set; }
        public DbSet<inv19.models.invm_info> invm_info { get; set; }
        public DbSet<inv19.models.invw_info> invw_info { get; set; }
        public DbSet<inv19.models.xUserInfo> xUserInfo { get; set; }
        public DbSet<inv19.models.invd_dep> invd_dep { get; set; }
        public DbSet<inv19.models.invd_machine> invd_machine { get; set; }
        public DbSet<inv19.models.invd_op> invd_op { get; set; }
        public DbSet<inv19.models.invd_store> invd_store { get; set; }
        public DbSet<inv19.models.invd_zone> invd_zone { get; set; }
        public DbSet<inv19.models.invwh_loc> invwh_loc { get; set; }
        public DbSet<inv19.models.invwh_cell> invwh_cell { get; set; }
        public DbSet<inv19.models.invops_in> invops_in { get; set; }
        public DbSet<inv19.models.invops_move> invops_move { get; set; }
        public DbSet<inv19.models.invops_out> invops_out { get; set; }




    }
}
