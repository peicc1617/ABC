$(function() {
    // 用于上传时显示提示
    var opts = {
        lines : 12, // 花瓣数目
        length : 10, // 花瓣长度
        width : 5, // 花瓣宽度
        radius : 10, // 花瓣距中心半径
        corners : 1, // 花瓣圆滑度 (0-1)
        rotate : 0, // 花瓣旋转角度
        direction : 1, // 花瓣旋转方向 1: 顺时针, -1: 逆时针
        color : '#6fb3e0', // 花瓣颜色
        speed : 1, // 花瓣旋转速度
        trail : 60, // 花瓣旋转时的拖影(百分比)
        shadow : false, // 花瓣是否显示阴影
        hwaccel : false, // spinner 是否启用硬件加速及高速旋转
        className : 'spinner', // spinner css 样式名称
        zIndex : 2e9, // spinner的z轴 (默认是2000000000)
        top : 'auto', // spinner 相对父容器Top定位 单位 px
        left : 'auto', // spinner 相对父容器Left定位 单位 px
        position : 'relative', // element position
        progress : true, // show progress tracker
        progressTop : 0, // offset top for progress tracker
        progressLeft : 0
        // offset left for progress tracker
    };
    spinner = new Spinner(opts);
});
function help() {
    $("#help").modal();
}
var timers;
var spinner;
// 添加时 弹出上传提示
function openwin() {
    //alert(idss+"我执行了");
    if ($("#pq-excel").val() != "") {
        var target = $("#spindiv").get(0);
        spinner.spin(target);
        timers = setInterval("excelfource()", 3000);
    } else {
        alert("请选择文件！");
    }
}
function excelfource() {
    var re =$("#iframeInfo").contents().find("pre").html();;
    if(re!=""){
        $("#iframeInfo").contents().find("pre").html("");
        spinner.spin();// 关闭spinner
        clearInterval(timers);
//	window.location.reload();
        $('#addselectfilemodal').modal('hide');
        if(re!="[]"){
            addExcelData(autoCom(re));
        }else{
            alert("导入文件出错，请检查文件格式是否与文件模板一致！");
        }
    }
}
function addExcelData(data){
    $('#myBootstrapTtable').bootstrapTable('removeAll');
    var json = eval(data);
    for (var i=0;i<json.length;i++) {
        var datanum = $('#myBootstrapTtable').bootstrapTable('getData').length;
        var rowdata= {
            procedureIdForDelete : datanum + 1,
            //procedureId:(i+1),
            productionName : json[i].productionName,
            quantity : json[i].quantity,
            sum:json[i].sum,
            accumQ:json[i].accumQ,
            percent:json[i].percent,
            accumPercent:json[i].accumPercent
        };
        $('#myBootstrapTtable').bootstrapTable('append', rowdata);
    }
}
function autoCom(data){
    var json = eval(data);
    json.sort(compareTwo("quantity"));
    console.log(json);
    var sum=0;
    var accumQ=[];
    for(var i = 0; i < json.length; i++){
        sum+=parseInt(json[i].quantity);
        accumQ.push(sum);
    }
    datalist=[];
    for (var i = 0; i < json.length; i++) {
        dataForTab=new Object();
        dataForTab.productionName=json[i].productionName;
        dataForTab.quantity=json[i].quantity;
        dataForTab.sum=sum;
        dataForTab.accumQ=accumQ[i];
        dataForTab.percent=(json[i].quantity/sum*100).toFixed(2)+"%";
        dataForTab.accumPercent=(accumQ[i]/sum*100).toFixed(2)+"%";
        datalist.push(dataForTab);
    }
    console.log(datalist);
    return datalist;
}
// 导出标准excel表格
function downloadexcel() {
    window.location.href = "files/excel/temp_pq.xls";
}
//校验选择文件是否符合上传规范
function checkfile() {
    var filesuffix = $("#process-excel").val();
    filesuffix = filesuffix.substring(filesuffix.lastIndexOf("."));
    if (filesuffix == ".xls" || filesuffix == ".XLS") {
        //import_tip();
        return true;
    } else {
        alert("文件格式暂不支持，\n\n请将文件转为“Excel 97-2003 工作簿（*.xls或||*.XLS）”，再上传！");
        return false;
    }
}

// 显示帕累托图，显示累计百分比前20%的产品型号
function pqAnalysis() {
    var xData=[];
    var yData=[];
    var yPercent=[];
    var maxP=0;
    var json=$('#myBootstrapTtable').bootstrapTable('getData');
    console.log(json);
    var sum=0;
    var accumQ=[];
    for(var i = 0; i < json.length; i++){
        sum+=parseInt(json[i].quantity);
        accumQ.push(sum);
    }
    maxP=json[0].quantity;
    for (var i = 0; i < json.length; i++) {
        xData.push(json[i].productionName);
        yData.push(json[i].quantity);
        yPercent.push((accumQ[i]/sum*100).toFixed(2));
    }
    showPareto(xData,yData,yPercent,maxP);
}
var picInfo;
function showPareto(xAxisData,yAxisData,yPercent,maxData) {
//    alert(maxData);
    // 路径配置
    require.config({
        paths: {
            echarts: 'js/common/echarts/build/dist'
        }
    });
    // 使用
    alert("使用图表");
    require(
        [
            'echarts',
            'echarts/chart/bar', // 使用柱状图就加载bar模块，按需加载
            'echarts/chart/line'
        ],
        function (ec) {
            // 基于准备好的dom，初始化echarts图表
            var myChart = ec.init(document.getElementById('pqCharts'));
            option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        crossStyle: {
                            color: '#999'
                        }
                    }
                },
                toolbox: {
                    feature: {
                        dataView: {show: true, readOnly: false},
                        magicType: {show: true, type: ['line', 'bar']},
                        restore: {show: true},
                        saveAsImage: {show: true}
                    }
                },
                grid: {
//        		left: '10%',  
//        		bottom:'45%',
                    x2: 130,
                    y2: 125
                },
                legend: {
                    data:['产量','累计百分比']
                },
                xAxis: [
                    {
                        type: 'category',
                        data: xAxisData,
                        axisPointer: {
                            type: 'shadow'
                        },
                        axisLabel:{
                            show:true,
                            interval: 'auto',
                            rotate: -30
//                                formatter:function(val){
//                                    return val.split("").join("\n"); //横轴信息文字竖直显示
//                               }
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '产量',
                        min: 0,
                        max: maxData,
                        interval: 50,
                        axisLabel: {
                            formatter: '{value} 台'
                        }
                    },
                    {
                        type: 'value',
                        name: '累计百分比',
                        min: 0,
                        max: 100,
                        interval: 5,
                        axisLabel: {
                            formatter: '{value} %'
                        }
                    }
                ],
                series: [
                    {
                        name:'产量',
                        type:'bar',
                        data:yAxisData
                    },
                    {
                        name:'累计百分比',
                        type:'line',
                        yAxisIndex: 1,
                        data:yPercent
                    }
                ],
                animation : false
            };
            // 为echarts对象加载数据 
            myChart.setOption(option);
            picInfo = myChart.getDataURL();
            //cutDiv(picInfo);
            //自适应
            window.addEventListener('resize', function () {
                myChart.resize();
            });
        }
    );
}
function saveFig(){
    if(picInfo){
        cutDiv(picInfo);
    }else{
        alert("请点击P-Q分析按钮，进行产品产品产量分析！");
    }
}
function cutDiv(picInfo) {
    //var picInfo = picInfo.slice(22);
    var filename = 'PQanalysis'+new Date().format("yyyy-MM-dd hh:mm:ss");
    saveFile(picInfo, filename);
}
function saveFile(data, filename) {
    var link = document.createElement('a');
    link.href = data;
    link.download = filename;
    var event = document.createEvent('MouseEvents');
    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    link.dispatchEvent(event);
}
var compareTwo = function (prop) {//数组对象排序/由大到小
    return function (obj1, obj2) {
        var val1 = obj1[prop];
        var val2 = obj2[prop];
        if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
            val1 = Number(val1);
            val2 = Number(val2);
        }
        if (val1 > val2) {
            return -1;
        } else if (val1 < val2) {
            return 1;
        } else {
            return 0;
        }
    }
}
function addItem() {
    var datanum = $('#myBootstrapTtable').bootstrapTable('getData').length;
    var rowdata= {
        procedureIdForDelete:datanum+1,
        productionName:$("#indexName_a").val(),
        quantity:$("#indexValue_a").val()
    };
    $('#myBootstrapTtable').bootstrapTable('append', rowdata);
    var jsonss=getTabdata();
    $('#myBootstrapTtable').bootstrapTable('removeAll');
    addExcelData(autoCom(jsonss));
}
function actionFormatter(value, row, index) {
    return [
        '<a class="edit ml10" href="javascript:void(0)" title="Edit">',
        '<i class="glyphicon glyphicon-edit"></i> 编辑',
        '</a>'
    ].join('');
}
var updateindex = 1;

window.actionEvents = {
    'click .edit': function (e, value, row, index) {
        $('#updatedatainfo').modal('show');
        $("#indexName_u").val(row.productionName);
        $("#indexValue_u").val(row.quantity);
        $("#procedureId_u").val(row.procedureId); //不可见，不能改
        updateindex = index;
        // console.log(row);
    }
};
function editItem() {
    $('#updatedatainfo').modal('hide');
    ////更改表格数据
    var rowdata= {
        productionName:$("#indexName_u").val(),
        quantity:$("#indexValue_u").val(),
    };
    $('#myBootstrapTtable').bootstrapTable('updateRow',{index: updateindex, row: rowdata});
    var jsonss=getTabdata();
    $('#myBootstrapTtable').bootstrapTable('removeAll');
    addExcelData(autoCom(jsonss));
}
function deleterow() {
    //遍历数组中的每个元素，并按照return中的计算方式 形成一个新的元素，放入返回的数组中
    var ids = $.map($('#myBootstrapTtable').bootstrapTable('getSelections'), function (row) {
        return row.procedureIdForDelete;
    });
    $('#myBootstrapTtable').bootstrapTable('remove', {field: 'procedureIdForDelete', values: ids});
    var jsonss=getTabdata();
    $('#myBootstrapTtable').bootstrapTable('removeAll');
    addExcelData(autoCom(jsonss));
}
function generateId(value,row,index) {
    return index+1;
}
//function addData(){
//	$('#adddatainfo').modal('show');
//}
function getTabdata(){
    var json=$('#myBootstrapTtable').bootstrapTable('getData');
    datalist=[];
    for (var i = 0; i < json.length; i++) {
        dataForTab=new Object();
        dataForTab.productionName=json[i].productionName;
        dataForTab.quantity=json[i].quantity;
        datalist.push(dataForTab);
    }
    console.log(datalist);
    return datalist;
}
function saveResultInfo(){
    if(projectId==0){
        alert("请新建项目，再保存数据！");
    }else{
        var datas=$('#myBootstrapTtable').bootstrapTable('getData');
        //先生成word内容，然后保存
        $.ajax({
            url:"/projectManager/api/v1/project",
            type:"put",
            //群组ID
            data:{
                id:projectId,
                projectName:projectName,
                memo:'',
                appResult:'',
                tempProjectID:"",
                appContent:JSON.stringify(datas),
                reservation:""
            },
            success:function(result){
                if(result.state){
                    //请求正确
                    alert("保存成功！");
                    console.log(result.content)
                }else{
                    //请求错误
                    console.log(result.error)
                }
            }
        })
    }
}
Date.prototype.format = function(fmt) {
    var o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt)) {
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    for(var k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
}  