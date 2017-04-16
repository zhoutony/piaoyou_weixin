// pages/city/city.js
import model from '../../utils/model.js';
import utils from '../../utils/util.js';
import _ from '../../utils/underscore.modified.js';
Page({
  data:{
    movie: {},
    seatNames: [],
    ishide: 1,
    orderStatus: 0
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    let that = this,
        movie = wx.getStorageSync('movie'),
        mobile = wx.getStorageSync('mobile'),
        seatNames = wx.getStorageSync('seatNames');
    this.orderId = options.orderid;
    this.setData({movie: movie, seatNames: seatNames})
    this.index = 0;
    this.loadData();
  },
  loadData() {
    if(this.index < 20){
      let that = this;
      model.post("/QueryTicketResult.aspx?orderID=" + this.orderId, {}, (result, msg)=> {
          let {data} = result;
          if (result.success){
              if(data.externalOrderStatus == 30){
                that.setData({orderStatus: 30});
              }else if(data.externalOrderStatus == 40){
                that.setData({orderStatus: 40});
              }else{
                //轮循出票接口
                setTimeout(that.loadData, 2000);
              }
          }else{
            //轮循出票接口
            setTimeout(that.loadData, 2000);
          }
          that.index++;
      });
    }
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
  gotoMethod: function(){
    let orderStatus = this.data.orderStatus;
    if(orderStatus == 30){
      wx.switchTab({
        url: '../my/my'
      })
    }else if(orderStatus == 40){
      wx.switchTab({
        url: '../index/index'
      })
    }
  }
})