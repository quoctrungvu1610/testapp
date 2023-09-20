var tableID = "table_01";

var tachdautbheader = [
    "Thời gian",
    "Thanh_nhiet_dien_1_chay_phan_hoi",
    "Thanh_nhiet_dien_2_chay_phan_hoi",
    "Thanh_nhiet_dien_3_chay_phan_hoi",
    "Phan_hoi_van_hanh_bom_hoi_luu",
    "Van_dau_vao_tay_dau_mo_mo_full",
    "Van_dau_vao_tay_dau_mo_dong_full",
    "Thanh_nhiet_1_bao_loi",
    "Thanh_nhiet_2_bao_loi",
    "Thanh_nhiet_3_bao_loi",
    "Nhiet_do_be_tach_dau_nuoc",
    "Muc_chat_long_thuc_te_trong_vung_gia_nhiet",
    "Muc_chat_long_thuc_te_trong_vung_chat_long_sach",
    "Electric_heater_1_starts",
    "Electric_heater_1_stops",
    "Electric_heater_2_starts",
    "Electric_heater_2_stops",
    "Electric_heater_3_starts",
    "Electric_heater_3_stops",
    "The_return_pump_starts",
    "The_return_pump_stops",
    "The_degreasing_inlet_valve_opens",
    "The_degreasing_inlet_valve_is_closed",
    "Set_the_temperature_of_the_oil_water_separation_tank",
    "Emergency_stop_failure",
    "The_main_circuit_breaker_is_not_switched_on",
    "Fire_signal_failure",
    "Electric_heater_1_empty_fault",
    "Electric_heater_1_contactor_failure",
    "Electric_heater_2_empty_fault",
    "Electric_heater_2_contactor_failure",
    "Electric_heater_3_empty_fault",
    "Electric_heater_3_contactor_failure",
    "The_return_pump_is_empty",
    "Return_pump_contactor_failure",
    "Low_level_alarm_in_heating_zone",
    "Low_level_alarm_in_the_clear_liquid_area",
    "High_liquid_level_alarm_in_heating_zone",
    "High_liquid_level_alarm_in_the_clear_liquid_area",
    "Overtemperature_alarm_of_oil_water_separation_tank",
    "Heating_zone_level_gauge_channel_failure",
    "The_clear_liquid_zone_level_gauge_channel_failure",
    "Oil_water_separation_RTD_channel_failure",
]


function tachdau_fn_sql_col(column){
    var data = [
        column.date_time, 
        column.Thanh_nhiet_dien_1_chay_phan_hoi, 
        column.Thanh_nhiet_dien_2_chay_phan_hoi, 
        column.Thanh_nhiet_dien_3_chay_phan_hoi, 
        column.Phan_hoi_van_hanh_bom_hoi_luu, 
        column.Van_dau_vao_tay_dau_mo_mo_full, 
        column.Van_dau_vao_tay_dau_mo_dong_full,
        column.Thanh_nhiet_1_bao_loi,
        column.Thanh_nhiet_2_bao_loi,
        column.Thanh_nhiet_3_bao_loi,
        column.Nhiet_do_be_tach_dau_nuoc,
        column.Muc_chat_long_thuc_te_trong_vung_gia_nhiet,
        column.Muc_chat_long_thuc_te_trong_vung_chat_long_sach,
        column.Electric_heater_1_starts,
        column.Electric_heater_1_stops,
        column.Electric_heater_2_starts,
        column.Electric_heater_2_stops,
        column.Electric_heater_3_starts,
        column.Electric_heater_3_stops,
        column.The_return_pump_starts,
        column.The_return_pump_stops,
        column.The_degreasing_inlet_valve_opens,
        column.The_degreasing_inlet_valve_is_closed,
        column.Set_the_temperature_of_the_oil_water_separation_tank,
        column.Emergency_stop_failure,
        column.The_main_circuit_breaker_is_not_switched_on,
        column.Fire_signal_failure,
        column.Electric_heater_1_empty_fault,
        column.Electric_heater_1_contactor_failure,
        column.Electric_heater_2_empty_fault,
        column.Electric_heater_2_contactor_failure,
        column.Electric_heater_3_empty_fault,
        column.Electric_heater_3_contactor_failure,
        column.The_return_pump_is_empty,
        column.Return_pump_contactor_failure,
        column.Low_level_alarm_in_heating_zone,
        column.Low_level_alarm_in_the_clear_liquid_area,
        column.High_liquid_level_alarm_in_heating_zone,
        column.High_liquid_level_alarm_in_the_clear_liquid_area,
        column.Overtemperature_alarm_of_oil_water_separation_tank,
        column.Heating_zone_level_gauge_channel_failure,
        column.The_clear_liquid_zone_level_gauge_channel_failure,
        column.Oil_water_separation_RTD_channel_failure
    ];
    return data;
}

// Đưa header vào bảng
function tachdau_fn_tbheader_load(){
    var tbtxt = '<thead><tr>'
    for(var i=0;i<tachdautbheader.length;i++){
        tbtxt += '<th>' + tachdautbheader[i] + '</th>'
    }
    tbtxt += '</tr></thead>';
    var temptb = '#' + tableID;
    $(temptb).append(tbtxt);
}

// Đưa dữ liệu vào bảng
function tachdau_fn_table(data){
if(data){
    var datat = '#' + tableID + ' tbody';
    $(datat).empty();
    var txt = "<tbody>";
    if(data.length > 0){
        for(var i=0;i<data.length;i++){
            var sql_column = data[i];
            var sql_col = tachdau_fn_sql_col(sql_column);
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
function tachdau_fn_sqlSearch()
{
    var val = {
                timeS: document.getElementById('tachdau_dtpk_Search_Start').value,
                timeE: document.getElementById('tachdau_dtpk_Search_End').value,
                web_url: web_url
              };
    socket.emit('msg_tach_dau_sqlSearch', val);
}
// Kết quả trả về sau khi nhận
function tachdau_fn_sql_result(){
    socket.on('tach_dau_sqlSearch', function(data){
        tachdau_fn_table(data); // Show sdata
        console.log(data);
    });
}

// Hàm chức năng yêu cầu server xuất dữ liệu Excel
function tachdau_fn_excel_req(){
    socket.emit("tach_dau_msg_Excel_Report", true);
}
// Kết quả nhận về sau khi xuất excel
function tachdau_fn_excel_result(){
    socket.on('tach_dau_Excel_Report',function(data){
        linktext = data[0];
        bookname = data[1];
        var file = web_url +"/" + linktext;
        console.log(file)
        window.open(file, '_blank');
    }); 
}