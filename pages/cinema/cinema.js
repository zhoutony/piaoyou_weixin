// pages/cinema/cinema.js

import _ from '../../utils/underscore.modified.js';
import model from '../../utils/model.js';
let app = getApp();
Page({
    data: {
        cinemas: [],
        movie: {},
        ishide: 1,
        hiddenLoading: true,
        loadTitle: '加载中...',
        city: {}
    },
    onLoad(e) {
        // console.log('onLoad:', e);
        this.options = e;
        app.getUserInfo(function(userInfo){
            console.log(userInfo)
        });
        this.loadData(e);
    },
    onShow(){
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
    },
    loadData(param) {
        let that = this,
            _url = String.format("/CinemaList.aspx?movieID={0}&locationID={1}&latitude={2}&longitude={3}",param.movieID,param.locationID,param.latitude,param.longitude);
            // _url = "/CinemaList.aspx",
            // _param ={"movieID":"727","locationID":"110100","latitude":"39.90403","longitude":"116.407526"}
        model.post(_url, {}, (result, msg)=> {
            let {data} = result;
            if (data){
                that.setData({
                    movie: data.movie,
                    cinemas: data.cinemas,
                    ishide: 0,
                    hiddenLoading: true
                })
            }
            wx.hideNavigationBarLoading();
        });
        this.setData({hiddenLoading: false})
        wx.showNavigationBarLoading();
    },
    
    scheduletap(e) {
        let data = e.currentTarget.dataset;
        wx.navigateTo({ url: '../schedule/schedule?movieno=' + this.data.movie.movieno + '&cinemano=' + data.cinemano })
    },
    //  movietap(e) {
    //     let data = e.currentTarget.dataset;
    //     wx.navigateTo({url: '../movie/movie?movieno=' + data.movieno})
    // },
    citytap(e){
       let data = e.currentTarget.dataset;
       wx.redirectTo({ url: '../city/city?channel=cinema&movieID=' + this.options.movieID + '&locationID=' + this.options.locationID + '&latitude=' + this.options.latitude + '&longitude=' + this.options.longitude });
    },
    bindKeyInput(e) {
        let value = e.detail.value,
            cinemas = this.data.cinemas,
            name, address;
        _.map(cinemas, function(cinema, index){
            name = cinema.cinemaName;
            address = cinema.cinemaAddress;
            if(name.indexOf(value) >= 0 || address.indexOf(value) >= 0){
                cinema.isHide = false;
                cinemas[index] = cinema;
            }else{
                cinema.isHide = true;
                cinemas[index] = cinema;
            }
        })
        // console.log(cinemas)
        this.setData({cinemas: cinemas})
        // cinemas = null;
    }
});