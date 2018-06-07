var ctx1 = $('#myChart1');
var ctx2 =$('#myChart2');
var ctx3 =$('#myChart3');

$(document).ready(function(){
    getkeyword();
    getauthorcount();
});



function getkeyword(){
    $.ajax({
        url:'../api/searchkey/',
        type:'GET',
        dataType: 'json',
        success:function(result){
            var chartob = {};
            chartob.data = [];
            chartob.labels = [];
            var max_re = 1 + result[0].fields.count;
            $.each(result,function(index,content){
                chartob.labels.push(content.fields.keyword);
                chartob.data.push(content.fields.count);
            });
            var myChart1 = new Chart(ctx1, {
                type: 'horizontalBar',
                data: {
                    labels: chartob.labels,
                    datasets: [{
			label:'数量', 
                        data: chartob.data,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255,99,132,1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    title: {
                        display: true,
                        text: '关键字搜索排行前五',
                        fontSize:17,
                        fontColor:'#4f3566',
                    },
                    scales: {
                        xAxes: [{
                            ticks: {
                                stepSize:1,
                                max: max_re,
                                beginAtZero:true
                            }
                        }]
                    }
                }
            });
        },
        error:function(err) {
            console.log('err');
        }
    })
};

function getauthorcount(){
    $.ajax({
        url:'../api/authorcount/',
        type:'GET',
        dataType: 'json',
        success:function(result){
            var chartob = {};
            chartob.data = [];
            chartob.labels = [];
            var max_re = 1 + result[0].fields.clickcount;
            $.each(result,function(index,content){
                chartob.labels.push(content.fields.name);
                chartob.data.push(content.fields.clickcount);
            });
            var myChart2 = new Chart(ctx2, {
                type: 'doughnut',
                data: {
                    labels: chartob.labels,
                    datasets: [{
                        data: chartob.data,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255,99,132,1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options:{
                    title: {
                        display: true,
                        text: '作者搜索排行前五',
                        fontSize:17,
                        fontColor:'#4f3566',
                    },
                }
            });
        },
        error:function(err) {
            console.log('err');
        }
    })
}


var scatterChart = new Chart(ctx3, {
    type: 'polarArea',
    data: {
        labels: ['劉克莊', '楊萬里', '趙蕃', '白居易', '梅堯臣', '方回', '蘇軾', '韓淲', '張耒', '黄庭堅'],
        datasets: [{
            label: '搜索数量',
            data: [4557, 4284, 3737, 3009, 2933, 2859, 2824, 2624, 2268, 2204],
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(75, 192, 192)',
                'rgb(255, 205, 86)',
                'rgb(201, 203, 207)',
                'rgb(54, 162, 235)',
                'rgb(255, 99, 132)',
                'rgb(75, 192, 192)',
                'rgb(255, 205, 86)',
                'rgb(201, 203, 207)',
                'rgb(54, 162, 235)',
            ],
            borderColor: [
                'rgb(255, 99, 132)',
                'rgb(75, 192, 192)',
                'rgb(255, 205, 86)',
                'rgb(201, 203, 207)',
                'rgb(54, 162, 235)',
                'rgb(255, 99, 132)',
                'rgb(75, 192, 192)',
                'rgb(255, 205, 86)',
                'rgb(201, 203, 207)',
                'rgb(54, 162, 235)',
            ],
        }],
    },
    options:{
        title: {
            display: true,
            text: '产量top10的作者',
            fontSize:17,
            fontColor:'#4f3566',
        },
    }

});
