//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getUserInfo: function (cb) {
    var that = this;
    // wx.clearStorage()
    try {
      var userInfo = wx.getStorageSync('userInfo')
      if (userInfo) {
        typeof cb == "function" && cb(userInfo);
      } else {
        //调用登录接口
        wx.login({
          success: function (res) {
            //openid
            wx.request({
              url: 'https://api.weixin.qq.com/sns/jscode2session', //仅为示例，并非真实的接口地址
              data: {
                appid: 'wxfed82c22a9f920e3',
                secret: '0ed6153be63b696365c12ba8dbf80282',
                js_code: res.code,
                grant_type: 'authorization_code'
              },
              header: {
                'content-type': 'application/json'
              },
              success: function (res) {
                var data = res.data;
                wx.getUserInfo({
                  success: function (res) {
                    that.globalData.userInfo = res.userInfo;
                    that.globalData.userInfo.openid = data.openid;
                    that.globalData.userInfo.session_key = data.session_key;
                    typeof cb == "function" && cb(that.globalData.userInfo)
                    wx.setStorage({
                      key: "userInfo",
                      data: that.globalData.userInfo
                    })
                  }
                })
              }
            })
          }
        })
      }
    } catch (e) {
      console.log(e)
    }
  },
  getPublicSignal: function () {
    try {
      var publicSignal = wx.getStorageSync('publicSignal');
      return publicSignal;
    } catch (e) { console.log(e) }
  },
  getCinemano: function () {
    try {
      var cinemano = wx.getStorageSync('cinemano');
      return cinemano;
    } catch (e) { console.log(e) }
  },
  globalData: {
    userInfo: null
  },
  isGetLocation: false
})