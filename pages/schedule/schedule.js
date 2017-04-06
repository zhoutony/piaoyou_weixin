var model = require('../../utils/model.js');

Page({
    data: {
        movie_list:[],
        schedules: []
    },
    onLoad: function(e){
        this.i = 0;
        let that = this,
            _url = String.format("/MovieSchedule.aspx?movieid={0}&cinemaid={1}",e.movieno,e.cinemano);
        model.post(_url, {}, function (result, msg) {
            var data = result.data;
            that.setData({
                schedules: data.sche
            })
            wx.hideNavigationBarLoading();
        });
        wx.showNavigationBarLoading();
    },
    onShow: function(){
        
    },
    
    selectseattap: function (e) {
        let data = e.currentTarget.dataset;
        wx.navigateTo({ url: '../select_seat/select_seat?scheduleno=' + data.scheduleno })
    },
    navigateToMovieData: function(){
        wx.navigateTo({url: '../movie_detail/movie_detail' })
    }
     
})