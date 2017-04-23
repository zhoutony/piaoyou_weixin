// pages/city/city.js
import model from '../../utils/model.js';
import utils from '../../utils/util.js';
import _ from '../../utils/underscore.modified.js';
Page({
  data:{
    citys:{},
    hotCitys: [],
    //定位城市
    loccationCity:{},
    // 搜索城市
    searchCitys: [],
    showType: 1
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.options = options;
    this.channel = options.channel;
    this.loadData();
  },
  loadData(e) {
      var that = this;
      console.log(_)
      var param = {};
      var citys = {}, firstPY = '', _citys;
      model.post("/CityList.aspx", param, (result, msg)=> {
          let {data} = result,
            hotCitys = [];
          if (data){
              that.cityData = data;
              _citys = _.sortBy(data, 'namePinyin');
              _.map(_citys, function(val, key){
                firstPY = val.namePinyin[0];
                if(!citys[firstPY]){
                  citys[firstPY] = []
                }
                citys[firstPY].push(val);
                if(val.isHot)
                  hotCitys.push(val);
              })
              
              that.setData({
                  citys: citys,
                  hotCitys: hotCitys
              })
          }
      });
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
    try {
        var value = wx.getStorageSync('loccationCity');
        if (value) {
            this.setData({
              loccationCity: value
            })
        }
    } catch (e) {
        // Do something when catch error
    }
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
        if(this.channel == 'index'){
          wx.switchTab({ url: '../index/index' });
        }else if(this.channel == 'cinema'){
          wx.redirectTo({ url: '../cinema/cinema?movieID=' + this.options.movieID + '&locationID=' + this.options.locationID + '&latitude=' + this.options.latitude + '&longitude=' + this.options.longitude });
        }
      } catch (e) {
        // Do something when catch error
      }
  },
  bindKeyInput(e) {
        let value = e.detail.value,
            citys = this.cityData,
            nameCN, nameEN, namePinyin,
            searchCitys = [];
        if(value != ''){
          _.map(citys, function(city, index){
              nameCN = city.nameCN;
              nameEN = city.nameEN ? city.nameEN.toLocaleLowerCase() : '',
              namePinyin = city.namePinyin ? city.namePinyin.toLocaleLowerCase() : '';
              if(nameCN.indexOf(value) >= 0 || nameEN.indexOf(value) >= 0 || namePinyin.indexOf(value) >= 0){
                  searchCitys.push(city)
              }
          })
          this.setData({searchCitys: searchCitys, showType: searchCitys.length > 0  ? 2 : 0})
        }else{
          this.setData({showType: 1})
        }
        
    }
})