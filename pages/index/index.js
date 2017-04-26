import model from '../../utils/model.js';
import utils from '../../utils/util.js';
var app = getApp();
Page({
    data: {
        motto: 'Hello World',
        movie_list: [],
        city: {
            nameCN: '北京市',
            locationID: 110100,
            latitude: 39.92999,
            longitude: 116.3956
        },
        advertisements: {},
        ishide: 1
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
                    movies: data,
                    ishide: 0,
                    hiddenLoading: true
                })
            that.getLocationMethod();
            wx.hideNavigationBarLoading();
        });
        this.setData({hiddenLoading: false})
        wx.showNavigationBarLoading();
    },
    onLoad(e) {
        
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
        });
        this.gitAdvertisements();
        
        wx.getSystemInfo({
            success: function(res) {
                app.globalData.systemInfo = res;
                app.globalData.rpx = res.screenWidth / 750;
            }
        })


    },
    onShow: function(e){
        try {
          var city = wx.getStorageSync('city')
          if (city) {
              // Do something with return value
              this.setData({
                  city: city
              })
          }
        } catch (e) {
          // Do something when catch error
        }
        this.loadData(e);
    },
    gitAdvertisements: function(){
        try {
            let that = this;
            model.post("/queryAdvertisements.aspx?type=4", {}, (result, msg) => {
                let advertisements = result.data.advertisements;
                that.setData({
                    advertisements: advertisements
                })
            });
        } catch (e) {
            console.log(e)
        }
    },
    getLocationMethod: function(){
        var that = this;
        if(!app.isGetLocation){
            app.isGetLocation = true;
            utils.getLocationMethod(function(res){
                console.log('城市定位：',res);
                let citys = res[0];
                // wx.setStorage({key:"city",data:citys})
                if(that.data.city.locationID != citys.locationID){
                    wx.showModal({
                    title: '提示',
                    content: '定位城市是' + citys.nameCN + ',是否要切换',
                    success: function(res) {
                        if (res.confirm) {
                                that.setData({
                                    city: citys
                                })
                                wx.setStorage({
                                        key:"location_city",
                                        data:citys
                                })
                                wx.setStorage({key:"city",data:citys})
                                that.loadData();
                            } else if (res.cancel) {
                                console.log('用户点击取消')
                            }
                        }
                    })
                }
            })
        }
    },
    scheduletap(e) {
        let data = e.currentTarget.dataset,
            longitude = '', latitude = '';

        // try {
        //     let location = wx.getStorageSync('city')
        //     if (location) {
        //         longitude = location.longitude;
        //         latitude = location.latitude;
        //     }
        // } catch (e) {
        //   // Do something when catch error
        // }
        wx.navigateTo({ url: '../cinema/cinema?movieID=' + data.movieno + '&locationID=' + this.data.city.locationID + '&latitude=' + this.data.city.latitude + '&longitude=' + this.data.city.longitude })
    },
   citytap(e){
       let data = e.currentTarget.dataset;
       wx.navigateTo({ url: '../city/city?channel=index' });
   },
   onShareAppMessage: function () {
        return {
            title: '电影票友，选座快捷更优惠',
            path: 'pages/index/index'
        }
    }
});