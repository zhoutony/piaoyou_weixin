/**
 * Created by vincentyan on 2016/9/28.
 */
// var base = "https://smart.wepiao.com/apiProxy";
var base = "https://moviefan.com.cn/miniprogramapi";
module.exports = {
    isOk: function (res) {
        return res.errMsg == "request:ok";
    },
    getMsg: function (res) {
        return {statusCode: res.statusCode, errMsg: res.errMsg};
    },
    request: function (options) {
        var that = this,
            url = base + options.url,
            method = options.method ? options.method : "post";

        var param = {
            url: url,
            method: method,
            data: options.data,
            success: function (res) {
                if (that.isOk(res)) {
                    var data = res.data;
                    var msg = that.getMsg(res);

                    if (options.success) options.success(data, msg);
                }
                else {
                    console.log("request:error");
                }
            },
            fail: function (res) {
                console.log("request:fail");
            },
            complete: function (res) {
                console.log("request:complete");
            }
        }
        wx.request(param);
    },
    post: function (url, data, success, fail, complete) {
        var that = this,
            url = base + url,
            method = "POST";

        var param = {
            url: url,
            method: method,
            data: data,
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                if (that.isOk(res)) {
                    var data = res.data;
                    var msg = that.getMsg(res);
                    // console.clear();
                    if (success)success(data, msg);
                }
                else {
                    console.log("request:error");
                }
            },
            fail: function (res) {
                console.log("request:fail");
            },
            complete: function (res) {
                console.log("request:complete");
            }
        }
        wx.request(param);
    }
}