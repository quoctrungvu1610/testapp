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
  var tagval_show    = true;           // Show tag value (true = yes, false = no)
  
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
  };
  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //3. System code (Fixed for all project)
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
  
  // 2. Trigger config (Auto inserch each 5second - User can be defined)
  setInterval(() => sqlins_trigger = true,10000);
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
  //var sqlins_done = mysql.fn_sqlins(tableName, sqlins_trigger, Object.values(sqldata));
  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // 4. System code (Fixed for all project)
  var sqlins_done = mysql.fn_sqlins(tableName, sqlins_trigger, sqldata);
  if(sqlins_done == true) {sqlins_trigger = false};
  }
  setInterval(() => sqlinsert(),1000);
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