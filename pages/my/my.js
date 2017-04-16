// pages/my/my.js
import model from '../../utils/model.js';
import utils from '../../utils/util.js';
import _ from '../../utils/underscore.modified.js';
var app = getApp();
Page({
  data:{
    userInfo: {},
    orders: []
  },
  onLoad:function(options){
    
    var that = this;
    // 页面初始化 options为页面跳转所带来的参数
    that.getUinfo(function(userInfo){
      that.setData({userInfo: userInfo})
        // var url = {
        //     openID: 'oPKIKuPtNIvWGWKeI37-Sb0jk9Y0'//userInfo.openid
        // };
        
        model.post("/queryOrder.aspx?openID=" + userInfo.openid, {}, (result, msg)=> {
         
            let {data} = result,
              orders = [],time1, time2;
            _.map(data.orders, function(order, index){
              time1 = new Date(order.showTime) * 1;
              time2 = new Date() * 1;
              if(time2 <= time1){
                order.isShowtime = false;
              }else{
                order.isShowtime = true;
              }
              orders.push(order)
            })
            if (data)
                that.setData({
                    // cinema: data.cinema_info.data,
                    orders: orders,
                    hiddenLoading: true
                })
            wx.hideNavigationBarLoading();
        });
        this.setData({hiddenLoading: false})
        wx.showNavigationBarLoading();
    })
  },
  onReady:function( ){
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
  getUinfo: function (callback) {
    var that = this;
    app.getUserInfo(function (userInfo) {
      //更新用户数据
      callback && callback(userInfo)
    })
  },
})