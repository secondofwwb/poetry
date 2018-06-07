$('.alert').hide();
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
        return params;
    }else if (pattern3.test(searchstr)&&searchstr.length>=2) {
        params.search = searchstr.match(pattern3)[0]
        return params;
    }else{
        params.result = false;
        return params;
    }

}

//点击搜索栏
$("#searchb").click(function() {
    $("#searchb").unbind('click');
    $('.alert').hide();
    $('#myform').submit(function(e){
        e.preventDefault();
        var values = $("input[type=search]").val();
        var params = handleargs(values);
        if (!params.result){
            $('.alert').show();
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
