import model from '../../utils/model.js';
import utils from '../../utils/util.js';
var app = getApp();
Page({
    data: {
        motto: 'Hello World',
        movie_list: [],
        city: {
            nameCN: '北京市',
            locationID: 110100
        }
    },
    loadData(e) {
        var that = this;
        var param = {
            cityid: that.data.city.locationID
        };
        model.post("/movieList.aspx", param, (result, msg)=> {
            let {data} = result;
            if (data)
                that.setData({
                    // cinema: data.cinema_info.data,
                    movies: data
                })
        });
    },
    onLoad(e) {
        // console.log('onLoad:', e);
        var _e = {
            'public_signal_short': 'jydy',
            'cinema_no': '1000088'
        };
        wx.setStorage({key: "publicSignal",data: _e.public_signal_short});
        wx.setStorage({key: "cinemano",data: _e.cinema_no});

        var publicSignal = app.getPublicSignal(); // publicSignal = "jydy"
        var cinemano = app.getCinemano();  // 1000088
        app.getUserInfo(function(userInfo){
            console.log(userInfo)
            /*
        avatarUrl:"http://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eorwiaJcRPxKMJ77lMqwpy8ib97kTOpMbVXNKy6lJLIIb6hTDR6HrrvUib45U74RwHLEtKq8u90dKcKg/0"
        city:"Changping"
        country:"CN"
        gender:1
        language:"zh_CN"
        nickName:"袁海雄"
        openid:"oRkEY0c2p-NfsEJA8o47oQdKSe14"
        province:"Beijing"
        session_key:"91VckOv82xYa7E/7nTclOw=="
            */
        });

        try {
          var city = wx.getStorageSync('city')
          if (city) {
              // Do something with return value
              if(city.locationID != this.data.city.locationID){
                this.getLocationMethod();
              }
          }
        } catch (e) {
          // Do something when catch error
        }


        this.loadData(_e);
        
    },
    onShow(e){
        
    },
    getLocationMethod: function(){
        var that = this;
        utils.getLocationMethod(function(res){
            console.log('城市定位：',res);
            let citys = res[0];
            wx.showModal({
              title: '提示',
              content: '定位城市是' + citys.nameCN + ',是否要切换',
              success: function(res) {
                if (res.confirm) {
                  // console.log('用户点击确定')
                  that.setData({
                      city: citys
                  })
                  wx.setStorage({
                        key:"city",
                        data:citys
                  })
                  that.loadData()
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
              }
            })
        })
    },
    scheduletap(e) {
        let data = e.currentTarget.dataset;
        wx.navigateTo({ url: '../cinema/cinema?movieno=' + data.movieno })
    },
   citytap(e){
       let data = e.currentTarget.dataset;
       wx.navigateTo({ url: '../city/city' });
   }
});