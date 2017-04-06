// pages/cinema/cinema.js


import model from '../../utils/model.js';
let app = getApp();
Page({
    data: {
        cinemas: [],
        movie: {}
    },
    loadData(param) {
        let that = this,
            _url = String.format("/CinemaList.aspx?movieID={0}&locationID={1}&latitude={2}&longitude={3}",param.movieID,param.locationID,param.latitude,param.longitude);
        model.post(_url, {}, (result, msg)=> {
            let {data} = result;
            if (data){
                that.setData({
                    movie: data.movie,
                    cinemas: data.cinemas
                })
            }
            wx.hideNavigationBarLoading();
        });
        wx.showNavigationBarLoading();
    },
    onLoad(e) {
        // console.log('onLoad:', e);

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


        this.loadData(e);
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
       wx.navigateTo({ url: '../city/city' });
    }
});