/**
 * Created by lenovo on 2016/4/2.
 * @author jackwang <wdmzjjm@163.com>
 */
/*
* 目前问题：IE低版本关于innerHTML的问题
* 目测解决方案：利用createElement，将添加放入判断中
* 关于删除按钮解决方案
* 可以利用DOM0的onclick传入函数传入数据
* */
/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};

//IE7-8中trim属性兼容
String.prototype.trim = function(){
    return this.replace(/(^\s*)|(\s*$)/g, "");
};

/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
    var judge = {
        city : {
            reg : /^[\u4e00-\u9fa5a-zA-Z]+$/,
            tip : '您输入的城市格式不正确'
        },
        value : {
            reg : /^[0-9]+$/,
            tip : '您输入的空气质量格式不正确'
        }
    };
    var city = document.getElementById('aqi-city-input').value.trim(),
        value = document.getElementById('aqi-value-input').value.trim(),
        cityJudge = judge.city.reg.test(city),
        valueJudge = judge.value.reg.test(value);
    if(cityJudge){
        if(valueJudge){
            aqiData[city] = value;
        }else{
            alert(judge.value.tip);
        }
    }else{
        alert(judge.city.tip);
    }
}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
    var list = document.getElementById('aqi-table'),
        aqiList = '',
        len = 0;   //缓存正确条目数量
    for(var property in aqiData){
        aqiList += '<tr><td>' + property + '</td><td>' + aqiData[property] + '</td><td><button>删除</button></td></tr>';
        len++;
    }
    if(len > 0){
        list.innerHTML = '<tr><th>城市</th><th>空气质量</th><th>操作</th></tr>' + aqiList;
        addBtnDel();
    }else{
        list.innerHTML = '';
    }

}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
    addAqiData();
    renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle(ele) {
    // do sth.
    var delCity = ele.parentNode.parentNode.firstChild.innerHTML;
    delete aqiData[delCity];
    renderAqiList();
}

function init() {
    // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
    var addBtn = document.getElementById('add-btn');
    bindEvent(addBtn, 'click', function(){addBtnHandle();});
}

function addBtnDel(){
    // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
    var deleteBtn = document.getElementById('aqi-table').getElementsByTagName('button'),
        len = deleteBtn.length;
    for(var i = 0; i < len; i++){
        bindEvent(deleteBtn[i], 'click',function(){delBtnHandle(this);});
    }

}
//事件绑定
function bindEvent(ele, event, func){
    if(window.addEventListener){
        ele.addEventListener(event, func ,false);

    }else if(window.attachEvent){
        ele.attachEvent('on' + event, func);
    }else{
        ele['on' + type] = func;
    }
}

init();
