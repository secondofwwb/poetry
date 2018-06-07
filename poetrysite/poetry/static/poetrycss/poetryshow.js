//此函数提取出URL中的参数，例如输入http://xx.xx.com?name=xxx&id=xxx
//返回{name:xxx,id:xxx}
function geturlargs(localurl){
    var pattern = /[a-z]+=[a-z0-9\u4e00-\u9fa5]+/g;
    var matches = localurl.match(pattern);
    var jsonarg = {};
    $.each(matches,function(index,data) {
        var pattern1 = /[a-z0-9\u4e00-\u9fa5]+/g;
        var matches1 = data.match(pattern1);
        jsonarg[matches1[0]] = matches1[1];
    });
    return jsonarg;
}

$(document).ready(function(){
    var poetryjsontemp = geturlargs(window.location.href);
    var poetryjson = JSON.parse(sessionStorage.getItem(poetryjsontemp.id));
    var pattern = /[\\|\s\r]/g;
    if(poetryjson.type=='poetry'||poetryjson.type=='poems'){
        $("#title").text(poetryjson.title);
        $("#author").text(poetryjson.author);
        $("#paragraphs").html(poetryjson.content.replace(pattern,"<br>"));
        $("#author_s").text(poetryjson.author);
        $("#dyna").text(poetryjson.dynasty);
        $("#yunlv").html(poetryjson.yunlv_rule.replace(pattern,"<br>"));
        $.ajax({
            url:'../../api/name',
            data:{'name':poetryjson.author,},
            dataType:'json',
            type:'GET',
            async:false,
            success:function(results){
                var content = results.results[0];
                console.log(content);
                if(content==null){
                    $('#intro').text('sorry,没有找到此人的介绍');
                }else{
                    if(content.type == 'poetry_author'){
                        $('#intro').text(content.intro);
                    }else{
                        $('#intro').text(content.intro_l);
                    }
                }
            }
        });
    }else if(poetryjson.type =='poetry_author'){
        $("#title").text(poetryjson.name);
        $("#dyna").text(poetryjson.dynasty);
        $("#paragraphs").text(poetryjson.intro);
    }else if (poetryjson.type =='poems_author') {
        $("#title").text(poetryjson.name);
        $("#dyna").text(poetryjson.dynasty);
        $("#paragraphs").text(poetryjson.intro_l);
    }
});

//参数提取
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

//点击搜索栏
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
                window.open('../?search='+params.search);
            }else{
                window.open('../?search='+params.search+'&name='+params.name);
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
