var projectId = 0;//项目Id
var projectName;//项目名
var appResult = null;//word报告
var appNameChinese = 'ABC分类法';//app中文名（必填）
var USER_NAME = '';//当前登录用户名

// 添加项目后，自定义操作
function addSelfDefine(result) {
    //上一层函数查看basicAction.js中addProject()函数
    /*
    * your code.....
    **/
    console.log("add project successful");
    window.location.reload();
}

// 查看项目后，自定义操作
function checkSelfDefine(node, result) {
    // 上一层函数查看basicAction.js中checkProject()函数
    /*
    * your code.....
    **/
	$('#myBootstrapTtable').bootstrapTable('removeAll');
	console.log(result);
    console.log("check project successful");
    var json = eval(result.content.appContent);
    console.log(json);
	for (var i=0;i<json.length;i++) {
		var datanum = $('#myBootstrapTtable').bootstrapTable('getData').length;
		var rowdata= {
				procedureIdForDelete : datanum + 1,
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

//删除项目后，自定义操作
function removeSelfDefine(result) {
    // 上一层函数查看basicAction.js中removeProject()函数
    /*
    * your code.....
    **/
    console.log("remove project successful");
}

//定制初始化内容
function setCustomContext() {
    var imageInstance = new Image();
    imageInstance.src=image;
    var customText = {//word编辑区自定义文本内容
        'title': "<h2>ABC分析App结果 </h2>",
        'chap1': "<h3>导入产品数量数据分析如下图所示：</h3>",
        'img1': imageInstance,
        'chap2': "<h3>其中A类如图中灰色区域所示，B类如图中紫色区域所示，C如图中粉色区域所示。</h3>"
    };
    for (var variable in customText) {//遍历自定义文本对象
        $("#WYeditor").append(customText[variable]);//插入元素
    }
}
function saveAsProject() {
	var makeJson=$('#myBootstrapTtable').bootstrapTable('getData');
    var saveProjectNameArr = [];//获取所有项目
    // 获取输入框中的内容
    var projectName = $('#saveAsProjectNameModal')[0].value;//获取项目名
    var createDate = new Date().toLocaleDateString() + ',' + new Date().getHours() + ':' + new Date().getMinutes();//获取项目创建时间
    var memo = $('#saveAsProjectRemarkModal')[0].value;//获取备注
    var data = {
    		id:projectId,
	        projectName:projectName,
	        memo:'',
	        appResult:'',
	        tempProjectID:"",
	        appContent:JSON.stringify(makeJson),
	        reservation:""
    };
//获取数据库所有项目名
    $.ajax({
        url: "/projectManager/api/v1/project",
        type: "get",
        data: {
            "appName": "PQanalysis"
        },
        async: false,
        dataType: "json",
        success: function (result) {
            saveProjectNameArr.length = 0;//数组清零
            result.content.forEach(function (element, index, array) {
                saveProjectNameArr.push(element.projectName);
            })
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {//打印错误信息
            console.log("XMLHttpRequest请求状态码：" + XMLHttpRequest.status);
            console.log("XMLHttpRequest状态码：" + XMLHttpRequest.readyState);
            console.log("textStatus是：" + textStatus);
            console.log("errorThrown是：" + errorThrown);
        }
    });
    //表格添加数据
    if (projectName === '') {
        alert("请输入项目名！！！");
    } else if (saveProjectNameArr.indexOf(projectName) !== -1) {
        alert("项目已经存在，请重新输入项目名！！！");
    } else {
        // 添加数据库
        $.ajax({
            type: "post",
            url: "/projectManager/api/v1/project",
            data: data,
            success: function (result) {
                if (result.state) {
                	$('.selectList').prepend('<li class="">\n' +
                            '\t\t\t\t\t<a>\n' +
                            '\t\t\t\t\t\t<div>\n' +
                            '\t\t\t\t\t\t\t<div class="sideProjectLi" onmouseover="this.title = this.innerHTML;" onclick="sideCheck(' + result.content.id + ',this)">\n' +
                            '\t\t\t\t\t\t\t\t' + result.content.projectName + '\n' +
                            '\t\t\t\t\t\t\t</div>\n' +
                            '\t\t\t\t\t\t\t<div style="position:absolute;bottom:6px;right:5px;">\n' +
                            '\t\t\t\t\t\t\t\t<i class="ace-icon fa fa-pencil align-top bigger-125 purple" id="checkSideLi" onclick="checkProject(' + result.content.id + ')" data-toggle="modal" data-target="#basicInfo"></i>\n' +
                            '\t\t\t\t\t\t\t\t<i class="ace-icon fa fa-trash-o bigger-120 red" id="deleteSideLi" onclick="removeProject(' + result.content.id + ')"></i>\n' +
                            '\t\t\t\t\t\t\t</div>\n' +
                            '\t\t\t\t\t\t</div>\n' +
                            '\t\t\t\t\t</a>\n' +
                            '\t\t\t\t</li>');
                    //侧边栏高度适应
                    var height = $(window).get(0).innerHeight;//获取屏幕高度
                    if ($('#cityList').children('li').length * 36 < height - 310) {
                        $('.selectList').css('height', $('#cityList').children('li').length * 36);
                    } else {
                        $('.selectList').css('height', height - 310);
                    }
                    $('#dynamic-table').DataTable().row.add(data).draw(false);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {//打印错误信息
                console.log("XMLHttpRequest请求状态码：" + XMLHttpRequest.status);
                console.log("XMLHttpRequest状态码：" + XMLHttpRequest.readyState);
                console.log("textStatus是：" + textStatus);
                console.log("errorThrown是：" + errorThrown);
            }
        });
        $('#saveAsModal').modal('hide');//隐藏模态框
        // 在前台添加表格
    }
}
//保存项目
function saveProject() {
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
                    console.log("保存成功");
                    console.log(result.content);
                }else{
                    //请求错误
                    console.log(result.error)
                }
            }
        })
    }
}