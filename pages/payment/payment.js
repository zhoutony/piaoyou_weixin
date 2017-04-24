import model from '../../utils/model.js';
import _ from '../../utils/underscore.modified.js';
let app = getApp();
Page({
    data: {
      movie: {},
      seatNames: [],
      ishide: 1,
      mobile: '',
      price: 0,
      paybtnDisabled: false,
      payContent: '微信支付'
    },
    onLoad: function(e){
        try {
          this.sTempOrderID = e.sTempOrderID;
          let that = this,
              movie = wx.getStorageSync('movie'),
              mobile = wx.getStorageSync('mobile'),
              seatNames = wx.getStorageSync('seatNames');
          
          app.getUserInfo(function(userInfo){
            that.userInfo = userInfo;
          })
          this.setData({
            movie: movie,
            mobile: mobile,
            seatNames: seatNames,
            ishide: 0,
            price: parseInt(movie.price) * seatNames.length / 100
          })
        } catch (e) { console.log(e) }
    },
    onShow: function(){
        
    },
    tapPayment: function (e) {
        let that = this,
            data = e.currentTarget.dataset;
        try {
            let _url = String.format("/QueryWeiXinAppPay.aspx?openID={0}&orderID={1}",this.userInfo.openid,this.sTempOrderID);
            that.setData({
              paybtnDisabled: true,
              payContent: '正在支付...'
            });
            model.post(_url, {}, (result, msg) => {
                if(result.ret == 0 && result.sub == 0){
                  let data = result.data;
                  wx.requestPayment({
                    'timeStamp': data.timeStamp,
                    'nonceStr': data.nonceStr,
                    'package': data.package,
                    'signType': 'MD5',
                    'paySign': data.paySign,
                    'success':function(res){
                      console.log('支付成功:', res)
                      wx.removeStorage({
                        key: 'sTempOrderID',
                        success: function(res) {
                          console.log(res.data)
                        } 
                      })
                      
                      wx.redirectTo({
                        url: '../orderdraw/orderdraw?orderid=' + that.sTempOrderID
                      })
                    },
                    'fail':function(res){
                      console.log('支付失败:', res)
                      wx.showModal({
                          title: '提示',
                          content: '支付失败，请重试。',
                          showCancel: false,
                          success: function(res) {
                              if (res.confirm) {
                                  console.log('用户点击确定')
                              } else if (res.cancel) {
                                  console.log('用户点击取消')
                              }
                              that.setData({
                                paybtnDisabled: false,
                                payContent: '微信支付'
                              });
                          }
                      })
                    }
                  })
                }
                
            });
        } catch (e) {
            console.log(e)
        }
        
    },
    reselect: function(e){
      wx.navigateBack();
    }
})