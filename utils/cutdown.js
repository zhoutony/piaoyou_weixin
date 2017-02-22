
//临时变量
var sTempOrderID, callback, remainSecs, intervalID;

//开始倒计时
function countDownFUNC(oid, cb) { //订单idid，回调函数
    sTempOrderID = oid;
    callback = cb;
    //计算出剩余应该倒计时的时间
    remainSecs = calculRemainSec();
    setTimehtml();
    //开始倒计时操作
    countdownDo();
    intervalID = setInterval(countdownDo, 1000);
}

//设置倒计时时间html
function setTimehtml() {
    var m = parseInt(remainSecs / 60);
    var s = remainSecs % 60;
    var sec = (m < 10 ? '0' + m : m) + '分' + (s < 10 ? '0' + s : s) + '秒';
    callback && callback(sec);
}

function countdownCallback() {
    wx.showToast({
        title: '你未在10分钟内完成支付，所选座位已取消',
        icon: 'loading',
        duration: 4000
    })
    setTimeout(function () {
        wx.hideToast();
        wx.navigateTo({ url: '../index/index' })
    }, 4000)
}

//开始倒计时
function countdownDo() {
    if (remainSecs > 0) {
        remainSecs--;
        setTimehtml();
    } else {
        intervalID && intervalStop();
    }
}

//循环终止
function intervalStop() {
    clearInterval(intervalID);
    countdownCallback && countdownCallback();
}

//根据后台返回的服务器时间，计算还剩余的倒计时时间
function calculRemainSec() {
    var returnTimeSpan = 0;
    var oTime = '20'; //订单时间
    var num = 0; //记录循环了几次   用来判断是拼接 ‘-’‘ ’‘:’ 用
    for (var i = 0; i < sTempOrderID.length; i++) {
        if (i >= 12)
            break;

        if (num == 0)
            oTime += sTempOrderID.substr(i, 2);
        else if (num == 1 || num == 2)
            oTime += '-' + sTempOrderID.substr(i, 2);
        else if (num == 3)
            oTime += 'T' + sTempOrderID.substr(i, 2);
        else if (num == 4 || num == 5)
            oTime += ':' + sTempOrderID.substr(i, 2);

        i++;
        num++;
    }

    oTime = new Date(oTime.toString()) * 1;

    var date = new Date();
    var _month = date.getMonth() + 1,
        _date = date.getDate(),
        _hours = date.getHours(),
        _min = date.getMinutes(),
        _sec = date.getSeconds();
    if (_month >= 1 && _month <= 9)
        _month = "0" + _month;
    if (_date >= 0 && _date <= 9)
        _date = "0" + _date;
    if (_hours >= 0 && _hours <= 9)
        _hours = "0" + _hours;
    if (_min >= 0 && _min <= 9)
        _min = "0" + _min;
    if (_sec >= 0 && _sec <= 9)
        _sec = "0" + _sec;
    var currentdate = date.getFullYear() + '-' + _month + '-' + _date + "T" + _hours + ':' + _min + ':' + _sec;
    var sTime = new Date(currentdate.toString()) * 1;

    //相差的秒数
    var timeSpan_seconds = (sTime - oTime) / 1000;
    if (timeSpan_seconds < 600) { //还未到10分钟
        returnTimeSpan = 600 - timeSpan_seconds;
    }
    return returnTimeSpan;
}

module.exports = {
    countDownFUNC: countDownFUNC
}