// pages/city/city.js
import model from '../../utils/model.js';
import utils from '../../utils/util.js';
import _ from '../../utils/underscore.modified.js';
Page({
  data:{
    citys:{}
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.loadData();
  },
  loadData(e) {
      var that = this;
      console.log(_)
      var param = {};
      var citys = {}, firstPY = '', _citys;
      model.post("/CityList.aspx", param, (result, msg)=> {
          let {data} = result;
          if (data){
              _citys = _.sortBy(data, 'namePinyin');
              _.map(_citys, function(val, key){
                firstPY = val.namePinyin[0];
                if(!citys[firstPY]){
                  citys[firstPY] = []
                }
                citys[firstPY].push(val);
              })
              
              that.setData({
                  // cinema: data.cinema_info.data,
                  citys: citys
              })
          }
      });
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
  bindViewTap: function(e){
    console.log(e)
    let city = e.target.dataset;
    try {
        let _city = wx.getStorageSync('city')
        if (city) {
            if(city.locationID != city.locationid){
              wx.setStorage({
                  key:"city",
                  data:{
                    locationID:city.locationid,
                    nameCN: city.namecn
                  }
              })
            }
        }
        wx.switchTab({
          url: '../index/index'
        })
      } catch (e) {
        // Do something when catch error
      }
  }
})