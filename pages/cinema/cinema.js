// pages/cinema/cinema.js


import model from '../../utils/model.js';
var app = getApp();
Page({
    data: {
        motto: 'Hello World',
        movie_list: []
    },
    loadData(e) {
        var that = this;
        var param = {
            cinema_info: String.format('public_signal_short={0}&cinema_no={1}',e.public_signal_short,e.cinema_no),
            movie_list: String.format('public_signal_short={0}&cinema_no={1}',e.public_signal_short,e.cinema_no)
        };
        model.post("/batch/api", param, (result, msg)=> {
            let {data} = result;
            if (data)
                that.setData({
                    cinema: data.cinema_info.data,
                    movies: data.movie_list.data,
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


        this.loadData(_e);
    },
    scheduletap(e) {
        let data = e.currentTarget.dataset;
        wx.navigateTo({ url: '../schedule/schedule?movieno=' + data.movieno + '&cinemano=' + data.cinemano })
    }
});