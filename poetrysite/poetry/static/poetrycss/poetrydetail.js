var pageurl = '../api'; //查询地址
//此函数提取出URL中的参数，例如输入http://xx.xx.com?name=xxx&id=xxx
//返回{name:xxx,id:xxx}
function geturlargs(localurl){
    var pattern = /[a-z]+=[a-z0-9\u4e00-\u9fa5]+/g;
    var matches =decodeURI(localurl).match(pattern);
    var jsonarg = {};
    $.each(matches,function(index,data) {
        var pattern1 = /[a-z0-9\u4e00-\u9fa5]+/g;
        var matches1 = data.match(pattern1);
        jsonarg[matches1[0]] = matches1[1];
    });
    return jsonarg;
}

$(document).ready(function(){
    var params = geturlargs(window.location.href);
    var pagenum = showcontent(pageurl,params); //页面总数
    pagenat(pagenum,1);//首次形成初始页面,初始页码设置为1
});

//处理json中的一些问题
function jsonhandle(jsonob,params){
    var content = jsonob
    //处理朝代不显示的问题
    if(content.type=='poetry_author'||content.type=='poetry'){
        if(content.dynasty == null||content.dynasty=='T'){
            content.dynasty ='唐';
        }else if(content.dynasty =='S'){
            content.dynasty ='宋';
        };

        if(content.intro){
            var intro_bak = JSON.stringify(content.intro);
            if(intro_bak.length>300){
                content.intro_bak = intro_bak.slice(0,299)+'......';
            }else {
                content.intro_bak = intro_bak;
            };
        };
    };
    if(content.type=='poems_author'||content.type=='poems'){
        content.dynasty = '宋';
        if(content.intro_s){
            var intro_bak = JSON.stringify(content.intro_s);
            if(intro_bak.length>300){
                content.intro_bak = intro_bak.slice(0,299)+'......';
            }else {
                content.intro_bak = intro_bak;
            };

        };
    };
    //搜索内容中文字加变红,简繁转换有点问题
    if(content.content!=null){
        var re = /[\\|\s\r]/g;
        var content_bak = content.content.replace(re,'').replace(params.search,"<b style='color:red;'>"+params.search+"</b>");
        if(content_bak.length>=300){
            content_bak = content_bak.slice(0,299)+'.....';
        }
        content.content_bak = content_bak;
    };
    if(content.name!=null){
        var name_bak = content.name.replace(params.search,"<b style='color:red;'>"+params.search+"</b>");
        content.name_bak = name_bak;
    };
    if(content.title!=null){
        var title_bak = content.title.replace(params.search,"<b style='color:red;'>"+params.search+"</b>");
        content.title_bak = title_bak;
    };
    return content;
};

//从服务器加载内容
function showcontent(pageurl,params) {
    if($("div#con").children().length != 0){
        $("div#con").empty();
        sessionStorage.clear();
    };
    var pagenum
    $.ajax({
        url: pageurl,
        data: params,
        async: false,
        type: 'GET',
        dataType: 'json',
        success: function(respon){
            if(respon.highest_count==0){
                var template_n = $.templates("#notfind");
                htmlOutput_n = template_n.render();
                $("#con").append(htmlOutput_n);
                pagenum = 0;
            }else{
                pagenum = Math.ceil(respon.highest_count/5);
                var result = respon.results;
                $.each(result,function(index,content){
                    content.id_bak = "content"+index;
                    content.buttonid = index;
                    var htmlOutput;
                    if(content.type=='poems'||content.type=='poetry'){
                        var template = $.templates("#poetrycontent");
                        content = jsonhandle(content,params);
                        htmlOutput = template.render(content);
                    }else if(content.type=='poems_author'||content.type=='poetry_author'){
                        var template = $.templates("#authorcontent");
                        content = jsonhandle(content,params);
                        htmlOutput = template.render(content);
                    };
                    sessionStorage.setItem('poetryjson'+index, JSON.stringify(content));
                    $("#con").append(htmlOutput);
                });
            };
        }
    });
    return pagenum;
};

//点击按钮查看详情跳转页面
function showdetail(arg) {
    window.open("poetryshow/?id=poetryjson"+arg);
    // var posturl = '../api/changecount/';
    var poetryjsontemp = 'poetryjson'+arg;
    var item  = JSON.parse(sessionStorage.getItem(poetryjsontemp));
    var params = {};
    params.id = JSON.stringify(item.id);
    params.clickcount = 1;
    params.type = JSON.stringify(item.type).replace(/\"/g,'');
    var csrftoken = Cookies.get('csrftoken');
    function csrfSafeMethod(method) {
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
    // 发送统计数据
    $.ajax({
        url: '../api/changecount/',
        data: params,
        type: 'POST',
        dataType: 'json',
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain)
            {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });
};

//返回页首
function pageScroll() {
    window.scrollBy(0,-50);
    if($(window).scrollTop()!=0){
        scrolldelay = setTimeout('pageScroll()',2);
    };
}
//形成初始分页栏
function pagenat(pagenum,pageid) {
    if(pagenum==0){
        $('#pagination').hide();
    }else{
        var template = $.templates("#navtemp");
        var content = new Object;
        var itemnum = 5;
        if($(window).width()<500){
            itemnum = 3;
        }
        if(pagenum>5){
            for (var i = 1; i <= itemnum; i++) {
                content.pageitemid = i;
                content.pageitemnum_id = pagenum + "_" + i;
                var htmlOutput = template.render(content);
                $("#pagenav").append(htmlOutput);
            };
            }else {
                for(var j=1; j<=pagenum;j++){
                    content.pageitemid = j;
                    content.pageitemnum_id = pagenum + "_" + j;
                    var htmlOutput = template.render(content);
                    $("#pagenav").append(htmlOutput);
                };
            };
        $("li#"+pagenum + "_" + pageid).addClass('active');
    }
};

//格式化pageid
function fomatpageid(pageid) {
    var pattern1 = /[0-9]+_/g;
    var pattern2 = /_[0-9]+/g;
    var matches1 = pageid.match(pattern1);
    var matches2 = pageid.match(pattern2);
    var pagenum = parseInt(matches1[0].replace('_',''));
    var page = parseInt(matches2[0].replace('_',''));
    var pageob = {};
    pageob.pagenum = pagenum;
    pageob.page = page;
    return pageob
};

//点击更改分页样式
function pagechange(pageid) {
    pagere = fomatpageid(pageid);
    var pagenum = pagere.pagenum;
    var page = pagere.page;
    var params = geturlargs(window.location.href);
    params.page = (page-1)*5;//加入偏移量；
    showcontent(pageurl,params);//从初始加载页面的链接请求数据,使用全局pageurl
    var itemid = 5; //设置默认分页项数为5
    var widthnow = $(window).width(); //当前页面宽度
    if(widthnow<500){  //移动设备分页项数改变为3
        itemid = 3;
    };
    //分页样式更改
    if (pagenum<=itemid) {
        $("li[class='page-item active']").removeClass("active");
    }else if (pagenum>itemid) {
        $("#pagenav").empty();
        var template = $.templates("#navtemp");
        var content = new Object;
        if(widthnow>=500){ //页面宽度大于500，分页项数为5
            if (pagenum-page > 1 && page>3) {
                for(var i=page-2; i<=page+2;i++){
                    content.pageitemid = i;
                    content.pageitemnum_id = pagenum + "_" + i;
                    var htmlOutput = template.render(content);
                    $("#pagenav").append(htmlOutput);
                };
            }else if (pagenum-page<2 && page>3) {
                for(var i=pagenum-4; i<=pagenum;i++){
                    content.pageitemid = i;
                    content.pageitemnum_id = pagenum + "_" + i;
                    var htmlOutput = template.render(content);
                    $("#pagenav").append(htmlOutput);
                };
            }else if (page<=3) {
                for(var i=1; i<=5;i++){
                    content.pageitemid = i;
                    content.pageitemnum_id = pagenum + "_" + i;
                    var htmlOutput = template.render(content);
                    $("#pagenav").append(htmlOutput);
                };
            };
        }else if(widthnow<500) { //页面宽度小于500，分页项数为3
            if (pagenum-page > 1 && page > 1) {
                for(var i=page-1; i<=page+1;i++){
                    content.pageitemid = i;
                    content.pageitemnum_id = pagenum + "_" + i;
                    var htmlOutput = template.render(content);
                    $("#pagenav").append(htmlOutput);
                };
            }else if (pagenum-page<2 && page>2) {
                for(var i=pagenum-2; i<=pagenum;i++){
                    content.pageitemid = i;
                    content.pageitemnum_id = pagenum + "_" + i;
                    var htmlOutput = template.render(content);
                    $("#pagenav").append(htmlOutput);
                };
            }else if (page<=2) {
                for(var i=1; i<=3;i++){
                    content.pageitemid = i;
                    content.pageitemnum_id = pagenum + "_" + i;
                    var htmlOutput = template.render(content);
                    $("#pagenav").append(htmlOutput);
                };
            };
        };
    };
    pageScroll();
    console.log('page');
    $("li#"+pageid).addClass('active');
};
//上一页，下一页点击函数
function pagelf(itemid) {
    var pageid = $("li[class='page-item active']").attr('id')
    pagere = fomatpageid(pageid);
    var pagenum = pagere.pagenum;
    var page = pagere.page;
    if(itemid == 'page-iteml'){
        if(page==pagenum){
            $("#modalmes").modal();
        }else {
            pagechange(pagenum+'_'+(page+1));
        };
    }else if (itemid == 'page-itemf') {
        if(page==1){
            $("#modalmes").modal();
        }else {
            pagechange(pagenum+'_'+(page-1));
        };
    };
}

function searchname(name){
    window.open("../poetrydetail/?name="+name);
}

// 字符检测
function handleargs(searchstr){
    var pattern = /[\u4e00-\u9fa5]+\s+[\u4e00-\u9fa5]+/g;
    var params = {}
    var pattern1 = /[\u4e00-\u9fa5]+\s/g;
    var pattern2 = /\s+[\u4e00-\u9fa5]+/g;
    var pattern3 = /[\u4e00-\u9fa5]+/g;
    params.result = true;
    if (pattern.test(searchstr)){
        params.name = searchstr.match(pattern1)[0].replace(' ','');
        params.search = searchstr.match(pattern2)[0].replace(' ','');
    }else if (pattern3.test(searchstr)&&searchstr.length>=2) {
        params.search = searchstr.match(pattern3)[0]
    }else{
        params.result = false;
    }
    return params;
}

//搜索界面
$("#searchb").click(function() {
    $("#searchb").unbind('click');
    $('#myform').submit(function(e){
        e.preventDefault();
        var values = $("input[type=search]").val();
        var params = handleargs(values)
        if (!params.result){
            $("#searchvaild").modal();
        }else{
            var csrftoken = Cookies.get('csrftoken');
            function csrfSafeMethod(method) {
                return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
            }
            if(params.name == null){
                window.open('../poetrydetail/?search='+params.search);
            }else{
                window.open('../poetrydetail/?search='+params.search+'&name='+params.name);
            }
            $.ajax({
                url:'../api/searchcount/',
                data:{'keyword':params.search,'count':1},
                dataType:'json',
                type:'POST',
                beforeSend: function(xhr, settings) {
                    if (!csrfSafeMethod(settings.type) && !this.crossDomain)
                    {
                        xhr.setRequestHeader("X-CSRFToken", csrftoken);
                    }
                }
            });
        };
    });
});

//数据分析界面
//$("#dataan").click(function() {
//    $("#dataan").unbind('click');
//    $("#dataanmodal").modal();
//});
