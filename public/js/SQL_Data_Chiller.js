
var tableID = "table_01";

var chillertbheader = [
    "Thời gian",
    "Chilled_water_pump_1_running_feedback_1",
    "Cooling__pump_1_fault_summary",
    "Chilled_water_pump_2_running_feedback_1",
    "Cooling__pump_2_fault_summary",
    "Chilled_water_pump_1_running_feedback",
    "Chilled_pump_1_fault_summary",
    "Chilled_water_pump_2_running_feedback",
    "Chiller_Tower_fan_running_feedback",
    "Cooling_Tower_fault_summary",
    "Chiller_run_indicate",
    "Chiller_running_fault_signal",
    "Cooling__pump_1_run_allowed",
    "Cooling__pump_2_run_allowed",
    "Chilled_pump_1_run_allowed",
    "Chilled_pump_2_run_allowed",
]


function chiller_fn_sql_col(column){
    var data = [
        column.date_time, 
        column.Chilled_water_pump_1_running_feedback_1, 
        column.Cooling__pump_1_fault_summary, 
        column.Chilled_water_pump_2_running_feedback_1, 
        column.Cooling__pump_2_fault_summary, 
        column.Chilled_water_pump_1_running_feedback, 
        column.Chilled_pump_1_fault_summary,
        column.Chilled_water_pump_2_running_feedback,
        column.Chiller_Tower_fan_running_feedback,
        column.Cooling_Tower_fault_summary,
        column.Chiller_run_indicate,
        column.Chiller_running_fault_signal,
        column.Cooling__pump_1_run_allowed,
        column.Cooling__pump_2_run_allowed,
        column.Chilled_pump_1_run_allowed,
        column.Chilled_pump_2_run_allowed,
    ];
    return data;
}

// Đưa header vào bảng
function chiller_fn_tbheader_load(){
    var tbtxt = '<thead><tr>'
    for(var i=0;i<chillertbheader.length;i++){
        tbtxt += '<th>' + chillertbheader[i] + '</th>'
    }
    tbtxt += '</tr></thead>';
    var temptb = '#' + tableID;
    $(temptb).append(tbtxt);
}

// Đưa dữ liệu vào bảng
function chiller_fn_table(data){
if(data){
    var datat = '#' + tableID + ' tbody';
    $(datat).empty();
    var txt = "<tbody>";
    if(data.length > 0){
        for(var i=0;i<data.length;i++){
            var sql_column = data[i];
            var sql_col = chiller_fn_sql_col(sql_column);
            console.log(sql_col)
            txt += '<tr>'
            for(var k=0;k<sql_col.length;k++){
                txt += "<td>" + sql_col[k] + "</td>"; 
            }
            txt += "</tr>";
        }
    if(txt != ""){
    txt +="</tbody>"; 
    console.log(txt)
    var temptb = '#' + tableID;
    $(temptb).append(txt);
}}}};

// Tìm kiếm SQL
function chiller_fn_sqlSearch()
{
    var val = {
                timeS: document.getElementById('chiller_dtpk_Search_Start').value,
                timeE: document.getElementById('chiller_dtpk_Search_End').value,
                web_url: web_url
              };
    socket.emit('msg_chiller_sqlSearch', val);
}
// Kết quả trả về sau khi nhận
function chiller_fn_sql_result(){
    socket.on('chiller_sqlSearch', function(data){
        chiller_fn_table(data); // Show sdata
        console.log(data);
    });
}

// Hàm chức năng yêu cầu server xuất dữ liệu Excel
function chiller_fn_excel_req(){
    socket.emit("chiller_msg_Excel_Report", true);
}
// Kết quả nhận về sau khi xuất excel
function chiller_fn_excel_result(){
    socket.on('chiller_Excel_Report',function(data){
        linktext = data[0];
        bookname = data[1];
        var file = web_url +"/" + linktext;
        console.log(file)
        window.open(file, '_blank');
    }); 
}
