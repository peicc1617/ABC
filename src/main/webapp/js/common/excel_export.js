//导出当前table为excel的js
//----------开始----------
$(function(){
	console.log("ssl_export已加载！");
	$("#ssl_uploadexcel").click(function(){
		/*
		 * 1、先获取当前页面表格
		 * 2、先触发一个事件，在服务器本地新建excel,并将当前表格数据写入，返回excel下载地址；
		 * 3、将下载地址触发；
		 */
		//alert("前台");
		var ssl = 0;
		var stringStream = "";
//		var row_count = $('table.ssl_import th').size();
//		var atext=$('table.ssl_import th').eq(row_count-1).text();
//		atext=atext.substring(0,2);
//		//alert(atext);
//		if(atext=="编辑"){
//		    row_count=row_count-1;
//		}
		var row_count=5;
		for(var i=0;i<row_count-1;i++){		
			stringStream = stringStream + $('table.ssl_import th').eq(i).text() + "|";
		} 
		stringStream = stringStream + $('table.ssl_import th').eq(row_count-1).text() + "*";
		$('table.ssl_import tr').each(function(){
			if(ssl!=0){
				for(var j=0;j<row_count-1;j++){
					stringStream = stringStream + $(this).find('td').eq(j).text() + "|";
				} 
				stringStream = stringStream + $(this).find('td').eq(row_count-1).text() + "*";
			}
			ssl++;
		});
		var str = stringStream.split("||||");
		var ssss=str[0];
		//console.log(stringStream);
		var condition = "";
		var objname = "";
		objname = objname + $(".ssl_objname_text").html();
		condition = condition + $(".ssl_choose_text").text();
		console.log(objname + condition);
		$.post('vsm/epad_excel_load',{objname:objname,condition:condition,value:ssss}, function(data){
			console.log(data);
			if(data.list == "true"){
				window.location.href="files/ImportExcel/temp.xls"; 
			}else{
				alert("导出当前表格失败，请刷新页面重试！");
			};
			//window.location.href="files/ImportExcel/temp.xls"; 
		});
	});
});	
//----------结束----------