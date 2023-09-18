// Khai báo tên table
var tableID = "table_01"; // ID của bảng
// Khai báo Header table
var tbheader = [
    "Thời gian",
    "Shaft_seal_pressure_value",
    "Shaft_seal_pressure__normal_set",
    "Transfer_pressure_Value",
    "Transfer_pressure__normal_set",
    "CIP_Temperature_value",
    "CIP_Temperature__normal_set",
]
// Khai báo cột dữ liệu sql
function fn_sql_col(column){
    var data = [
        column.date_time, 
        column.Shaft_seal_pressure_value, 
        column.Shaft_seal_pressure__normal_set, 
        column.Transfer_pressure_Value, 
        column.Transfer_pressure__normal_set, 
        column.CIP_Temperature_value, 
        column.CIP_Temperature__normal_set,
    ];
    return data;
}

// ////////////////////////////////SYSTEM CODE////////////////////////////////////
// Đưa header vào bảng
function fn_tbheader_load(){
    var tbtxt = '<thead><tr>'
    for(var i=0;i<tbheader.length;i++){
        tbtxt += '<th>' + tbheader[i] + '</th>'
    }
    tbtxt += '</tr></thead>';
    var temptb = '#' + tableID;
    $(temptb).append(tbtxt);
}

// Đưa dữ liệu vào bảng
function fn_table(data){
if(data){
    var datat = '#' + tableID + ' tbody';
    $(datat).empty();
    var txt = "<tbody>";
    if(data.length > 0){
        for(var i=0;i<data.length;i++){
            var sql_column = data[i];
            var sql_col = fn_sql_col(sql_column);
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
function fn_sqlSearch()
{
    var val = {
                timeS: document.getElementById('dtpk_Search_Start').value,
                timeE: document.getElementById('dtpk_Search_End').value,
                web_url: web_url
              };
    socket.emit('msg_uf_sqlSearch`', val);
}
// Kết quả trả về sau khi nhận
function fn_sql_result(){
    socket.on('uf_sqlSearch', function(data){
        fn_table(data); // Show sdata
        console.log(data);
    });
}

// Hàm chức năng yêu cầu server xuất dữ liệu Excel
function fn_excel_req(){
    socket.emit("msg_Excel_Report", true);
}
// Kết quả nhận về sau khi xuất excel
function fn_excel_result(){
    socket.on('Excel_Report',function(data){
        linktext = data[0];
        bookname = data[1];
        var file = web_url +"/" + linktext;
        console.log(file)
        window.open(file, '_blank');
    }); 
}
///////////////////////////////////////////////////////////////////////////////
