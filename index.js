///////////////////RESOURCE COPPYRIGHT INFORMATION//////////////////////
var coppyright = {
    resource_by:  'NgocAutomation',
    hot_line:     '+84904701605',
    facebook:     'https://fb.com/ngocplc',
    mail:         'ngocautomation.info@gmal.com',
    whatsapp:     '+84946463905',
    telegram:     '+84946463905'
  }
  /////////////////////////////////////////////////////////////////////////
                    // CONNECT REPORT SERVER TO PLC //
  /////////////////////////////////////////////////////////////////////////
  // 1. PLC parameter setting
  var PLC_IP      = '192.168.0.1';     // PLC IP address
  var Slot_ID     = 1;                 // S71200/1500 = 1, S7300/400 = 2
  var scanTime    = 1;                 // Scan time (second)

  var plc_tag     = "";                // Variable save PLC tags value
  var uf_plc_tag  = "";

  var tagval_show    = true;           // Show tag value (true = yes, false = no)
  var uf_tagval_show = true;


  //2. PLC tag defined
  var config_tag = {
    Raw_Water_Conductivity: 'DB11,REAL0',     
    Pure_Water_Conductivity: 'DB11,REAL4',     
    Concentrated_Water_Discharge: 'DB11,REAL8',     
    Raw_Water_Tank_Level_Low: 'DB8,X1.1',     
    Raw_tank_median: 'DB2,X12.6',     
    The_raw_water_tank_is_high: 'DB2,X12.5',     
    Pure_tank_median: 'DB2,X13.1',     
    The_pure_water_tank_is_high: 'DB2,X13.0',     
    Shaft_seal_pressure_value: 'DB19,REAL12',     
    Shaft_seal_pressure__normal_set: 'DB19,REAL8',     
    Transfer_pressure_Value: 'DB19,REAL28',     
    Transfer_pressure__normal_set: 'DB19,REAL24',     
    CIP_Temperature_value: 'DB19,REAL58',     
    CIP_Temperature__normal_set: 'DB19,REAL54',
    //Report_Trigger: 'DB11,X26.0' 

    //Thêm các tag của UF trong này nhé em
    //Ví dụ 
    // Shaft_seal_pressure_value: 'DB19,REAL12',     
    // Shaft_seal_pressure__normal_set: 'DB19,REAL8',     
    // Transfer_pressure_Value: 'DB19,REAL28',     
    // Transfer_pressure__normal_set: 'DB19,REAL24',     
    // CIP_Temperature_value: 'DB19,REAL58',     
    // CIP_Temperature__normal_set: 'DB19,REAL54',
  };

  var s7plc = require('nodes7/ngocautores/s7plc.js');


  s7plc.resource(coppyright); 
  s7plc.val_Setup(PLC_IP, Slot_ID, config_tag, tagval_show);
  s7plc.para_Load();
  setInterval(() => plc_tag = s7plc.tag_read(),scanTime*1000);


  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  /////////////////////////////////////////////////////////////////////////
                        // MYSQL CONFIGURATION //
  /////////////////////////////////////////////////////////////////////////
  // 1 - Database parameter setting
  var host_IP     = "localhost";
  var user        = "root";
  var password    = "123456";
  var DBname      = "sql_plc1";
  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // 2. System code (Fixed for all project)
  const mysql = require('nodes7/ngocautores/mysqlconfig.js');
  mysql.basiccofig(host_IP, user, password, DBname);
  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // 1. Table define and trigger define


  var tableName = "plc_data"; // Table Name
  var sqlins_trigger = false; // Trigger define 

  //UF 
  var uftableName = "uf_plc_data";
  var sqlins_trigger_uf = false;
  
  // 2. Trigger config (Auto inserch each 5second - User can be defined)
  setInterval(() => sqlins_trigger = true,10000);
  //UF
  setInterval(() => sqlins_trigger_uf = true,10000);
  //sqlins_trigger = plc_tag.Report_Trigger;
  //sqlins_trigger = plc_tag.Report_Trigger
  // 3. Table data configuration
  function sqlinsert(){
  var sqldata = {
    Raw_Water_Conductivity:      plc_tag.Raw_Water_Conductivity,
    Pure_Water_Conductivity:     plc_tag.Pure_Water_Conductivity,
    Concentrated_Water_Discharge:plc_tag.Concentrated_Water_Discharge,
    Raw_Water_Tank_Level_Low:    plc_tag.Raw_Water_Tank_Level_Low,
    Raw_tank_median:             plc_tag.Raw_tank_median,
    The_raw_water_tank_is_high:  plc_tag.The_raw_water_tank_is_high,
    Pure_tank_median:            plc_tag.Pure_tank_median,
    The_pure_water_tank_is_high: plc_tag.The_pure_water_tank_is_high,
    Shaft_seal_pressure_value:   plc_tag.Shaft_seal_pressure_value,
    Shaft_seal_pressure__normal_set: plc_tag.Shaft_seal_pressure__normal_set,
    Transfer_pressure_Value:     plc_tag.Transfer_pressure_Value,
    Transfer_pressure__normal_set:plc_tag.Transfer_pressure__normal_set,
    CIP_Temperature_value:       plc_tag.CIP_Temperature_value,
    CIP_Temperature__normal_set: plc_tag.CIP_Temperature__normal_set
    
  };
  // 4. System code (Fixed for all project)
  var sqlins_done = mysql.fn_sqlins(tableName, sqlins_trigger, sqldata);
  if(sqlins_done == true) {sqlins_trigger = false};
  }
  setInterval(() => sqlinsert(),1000);

  //UF
  function ufsqlinsert(){
    var sqldata = {
      // Shaft_seal_pressure_value: plc_tag.abc,     
      // Shaft_seal_pressure__normal_set: plc_tag.abc,     
      // Transfer_pressure_Value: plc_tag.abc,     
      // Transfer_pressure__normal_set: plc_tag.abc,     
      // CIP_Temperature_value: plc_tag.abc,     
      // CIP_Temperature__normal_set: plc_tag.abc,
      
    };
    // 4. System code (Fixed for all project)
    var sqlins_done = mysql.fn_sqlins(uf, sqlins_trigger_uf, sqldata);
    if(sqlins_done == true) {sqlins_trigger_uf = false};
    }
    setInterval(() => ufsqlinsert(),1000);


  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  /////////////////////////////////////////////////////////////////////////
                 // READ SQL DATA AND SEND TO BORROW //
  /////////////////////////////////////////////////////////////////////////
  const websocketmodule = require('nodes7/ngocautores/websocket.js');
  var io = websocketmodule.webinnit();

  io.on("connection", function(socket){
    socket.on("msg_sqlSearch", function(data){
      var timeS = data.timeS; // Time bắt đầu
      var timeE = data.timeE; // Time kết thúc
      mysql.sqlRead('plc_data', timeS, timeE);
  ////////////////////////SYSTEM CODE////////////////////////
      var webUrl = data.web_url;
      setTimeout(function() {fn_webexecute(webUrl)}, 300);
    });
  ///////////////////////////////////////////////////////////
  function fn_webexecute(webUrl){
    var SQL_Result = mysql.sqlResult;
    socket.emit('sqlSearch', SQL_Result);
    fn_Excel_Report(SQL_Result,webUrl);
  }
  });

  io.on("connection", function(socket){
    socket.on("msg_sqlSearch", function(data){
      var timeS = data.timeS; // Time bắt đầu
      var timeE = data.timeE; // Time kết thúc
      mysql.sqlRead('plc_data', timeS, timeE);
  ////////////////////////SYSTEM CODE////////////////////////
      var webUrl = data.web_url;
      setTimeout(function() {fn_webexecute(webUrl)}, 300);
    });
  ///////////////////////////////////////////////////////////
  function fn_webexecute(webUrl){
    var SQL_Result = mysql.sqlResult;
    socket.emit('sqlSearch', SQL_Result);
    fn_Excel_Report(SQL_Result,webUrl);
  }
  });

  /////////////////////////////////////////////////////////////////////////
                            // EXCEL REPORT //
/////////////////////////////////////////////////////////////////////////
const exjs = require('nodes7/ngocautores/exceljs.js');
//1. cài đặt thông số chung
var tabname     = 'BÁO CÁO DỮ LIỆU VẬN HÀNH HỆ THỐNG DI';
var pagestyle   = 'portrait';
var companyname = 'Công Ty CP Tập đoàn Trường Hải (THACO)';
var add         = 'Địa chỉ:  Trung Tâm R&D';
var phonenumber = 'Hotline: +84904701605';

var reportname             = "BÁO CÁO DỮ LIỆU VẬN HÀNH HỆ THỐNG DI";
var reportname_rowpos      = 5; // Vị trí hàng tên báo cáo
var header_list            = ["STT","Thời gian","Mức thấp nước chưa qua xử lý","Mức vừa nước chưa qua xử lý","Mức cao nước chưa qua xử lý","Độ dẫn điện nước đã xử lý","Áp suất nước tại bể xả","Độ dẫn điện nước chưa xử lý","Ghi chú"]
var header_rowpos          = 8;  // Vị trí hàng header
var header_height          = 50; // Độ cao hàng header
var header_width           = [12,20,15,15,15,15,15,15,20] // Độ rộng các cột

//2. Cài đặt dữ liệu đọc lên từ SQL
var key = [
    {key: 'STT'},
    {key: 'date_time'},
    {key: 'Raw_Water_Tank_Level_Low'},
    {key: 'Raw_tank_median'},
    {key: 'Product_Count'},
    {key: 'Flow_In'},
    {key: 'Flow_Total'},
    {key: 'Tank_Level'},
  ]

//3. Cài đặt hàng tổng cộng//////////////////////////////////
var total_row_enable = true; // có hiện hàng tổng cộng không? (true = có, false = không).
var totalrow = ['Tổng/TB:','','first','last','avg','avg','avg','sum','']; // sum, avg, first, last
var totalrow_color = 'FFFF00'; // FFFF00 = Mã màu vàng
//4. Cài đặt chữ ký
var offset         = 2; // Ofset hàng ngày tháng
var signname      = ['Người in biểu', 'Trưởng ca', 'Giám đốc'];
var signname_pos  = ['I', 'E', 'B'];

//5. Cài đặt đường dẫn lưu file
var report_dir = "C:/Report";
var report_name = "Report";

////////////////////////SYSTEM CODE////////////////////////
exjs.pageSetup(tabname,pagestyle,companyname,add,phonenumber);
exjs.setupheader(reportname,reportname_rowpos,header_list,header_rowpos,header_height,header_width);
exjs.totalrowcal(total_row_enable,totalrow,totalrow_color);
exjs.signrow(offset, signname, signname_pos);
exjs.reportFile(report_dir, report_name);
///////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
            // EXCEL EXPORT BUTTON SQL READ AND EXPORT //
/////////////////////////////////////////////////////////////////////////
var exsave;
io.on("connection", function(socket){
socket.on("msg_Excel_Report", function(data)
{
  socket.emit('Excel_Report', exsave);
})});

// Excel export function
function fn_Excel_Report(data,webUrl){
  if (data.length != 0){
    exjs.exceldata(data,key,webUrl);
    exjs.fn_exceljs();
    exsave =  exjs.exfilesave();
  }
}