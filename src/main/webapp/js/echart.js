//利用echarts图表进行可视化显示
//目前只显示了价值系数(为什么不显示功能和成本？不想显示，就是为了留坑)
var image;//保存截图
function show() {
    //获取绘图所需数据
    getData();
    if (x_A.length==0||x_B.length==0||x_C.length==0) {
        alert("数据有误，请修改重试！");
        document.getElementById("abc").innerHTML="";
        return;
    }
    var dom = document.getElementById("abc");
    var myChart = echarts.init(dom);
    var app = {};
    option = null;
    option = {
        title: {

        },
        tooltip: {
            trigger: 'axis'
        },
        toolbox: {
            show: true,
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                dataView: {readOnly: false},
                magicType: {type: ['line', 'bar']},
                restore: {},
                saveAsImage: {}
            }
        },
        xAxis:  {
            type: 'category',
            boundaryGap: false,
            interval:1,
            data:xData,// X轴数据,
            axisLabel:{
                show:true,
                interval: 'auto',
                rotate: -30,

            }

        },
        grid:{
            bottom:'35%'
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value}% '
            },
            interval:10
        },
        series: [
            //价值系数系列
            {
                name:'数量',
                type:'line',
                data:y1Data,
                markLine: {
                    data: [
                        {yAxis:80 , name: '平均值'}
                    ]
                },
                markArea:{
                    data:[
                        [
                            {
                                name:"A类",
                                xAxis:x_A[0],
                                yAxis:0,
                                itemStyle:{
                                    normal: {
                                        color: 'rgba(100,100,100,0.5)'
                                    }
                                }
                            },
                            {
                                xAxis:x_B[0],
                                yAxis:100
                            }
                        ],
                        [
                            {
                                name:"B类",
                                xAxis:x_B[0],
                                yAxis:0,
                                itemStyle:{
                                    normal: {
                                        color: 'rgba(100,0,100,0.5)'
                                    }
                                }
                            },
                            {
                                xAxis:x_C[0],
                                yAxis:100
                            }
                        ],
                        [
                            {
                                name:'C类',
                                xAxis:x_C[0],
                                yAxis:0,
                                itemStyle:{
                                    normal: {
                                        color: 'rgba(255,100,100,0.5)'
                                    }
                                }
                            },
                            {
                                xAxis:x_C[x_C.length-1],
                                yAxis:100
                            }
                        ]
                    ],

                }
            }
        ]
    };
    ;
    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
    setTimeout( function(){image = myChart.getDataURL();},2000 );
}
//X轴坐标
var xData=[];
//Y轴功能得分系数
var yFunction=[];
//Y轴成本系数
var yCost=[];
//Y轴价值系数
var yValue=[];
//第一个Y轴数据
var y0Data=[];
//第二个Y轴数值
var y1Data=[];
var x_A=[];//X轴A类
var x_B=[];//X轴B类
var x_C=[];//X轴C类

function getData() {
    var data=$('#myBootstrapTtable').bootstrapTable('getData');//获取结果数据
    //数组清空
    x_A=[];//X轴A类
    x_B=[];//X轴B类
    x_C=[];//X轴C类
    //X轴坐标
    xData=[];
    y1Data=[];
    for (var i=0;i<data.length;i++) {
        /*//X轴数据
        xData.push(data[i].name_parameter);
        //Y轴数据
        yFunction.push(data[i].function_parameter);
        yCost.push(data[i].cost_parameter);
        yValue.push(data[i].value_parameter);*/
        xData.push(data[i].productionName);
        y0Data.push(data[i].quantity);
        var accumPercent=(100*data[i].accumQ/data[i].sum).toFixed(2);
        y1Data.push(accumPercent);
        if(accumPercent<=80){
            x_A.push(data[i].productionName);
        }else if(accumPercent<=90){
            x_B.push(data[i].productionName);
        }else {
            x_C.push(data[i].productionName);
        }
    }
}
