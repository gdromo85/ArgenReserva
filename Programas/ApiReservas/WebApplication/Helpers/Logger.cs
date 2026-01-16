
//using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Web.Hosting;

namespace WebApplication.Helpers
{
  public class Logger
  {
        
    private readonly IConfiguration _configuration;
    private readonly IHostEnvironment _webHostEnvironment;

    public Logger()
    {
      
    }

    public void Write(string tipo, string logMessage)
    {

        //var contentRootPath = Directory.GetCurrentDirectory();
        //var contentRootPath = "c:\\Micam\\LMX";
        string contentRootPath = HostingEnvironment.ApplicationPhysicalPath;
        //string contentRootPath = ((IHostEnvironment)this._webHostEnvironment).ContentRootPath;
        Directory.CreateDirectory(contentRootPath + "/Logs");
        try
        {
            using (StreamWriter txtWriter = File.AppendText(contentRootPath + "/Logs/log_" + DateTime.Now.ToString("ddMMyyyy") + ".txt"))
                this.Log(logMessage, (TextWriter)txtWriter, tipo);
        }
        catch
        {
        }
    }

    private void Log(string logMessage, TextWriter txtWriter, string adicional)
    {
        try
        {
            txtWriter.Write("\r\nLog Entry : ");
            TextWriter textWriter = txtWriter;
            DateTime utcNow = DateTime.UtcNow;
            string str = utcNow.ToString("dd/MM/yyyy HH:mm:ss.fff");
            utcNow = DateTime.UtcNow;
            string longDateString = utcNow.ToLongDateString();
            textWriter.WriteLine("{0} {1}", (object)str, (object)longDateString);
            txtWriter.WriteLine("  {0}:{1}", (object)adicional, (object)logMessage);
            txtWriter.WriteLine("-------------------------------");
        }
        catch
        {
        }
    }

    public void RecordErrorFile<T>(List<T> records, string folderName, string fileName)
    {
        //string contentRootPath = ((IHostEnvironment) this._webHostEnvironment).ContentRootPath;
        //var contentRootPath = Directory.GetCurrentDirectory();
        //var contentRootPath = "c:\\Micam\\LMX";
        string contentRootPath = HostingEnvironment.ApplicationPhysicalPath;
        Directory.CreateDirectory(contentRootPath + "/" + folderName);
        try
        {
            using (StreamWriter streamWriter = File.AppendText(contentRootPath + "/" + folderName + "/" + fileName + "_" + DateTime.Now.ToString("ddMMyyyy") + ".json"))
            {
                foreach (T record in records)
                {
                    string str = JsonConvert.SerializeObject((object)record);
                    ((TextWriter)streamWriter).WriteLine(str + ",");
                }
            }
        }
        catch
        {
        }
    }
  }
}
