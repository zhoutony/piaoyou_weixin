// pages/my/my.js
var app = getApp();
Page({
  data:{
    userInfo: {}
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.getUinfo()
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  //获取用户数据
  getUinfo: function () {
    var that = this;
    app.getUserInfo(function (userInfo) {
      //更新用户数据
      that.setData({
        userInfo: userInfo
      })
    })
  },
})