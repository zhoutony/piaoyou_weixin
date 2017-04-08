import model from '../../utils/model.js';
import _ from '../../utils/underscore.modified.js';
let app = getApp();
Page({
    data: {
        movie_list:[],
        schedules: [],
        movieno: 0,
        cinemano: 0,
        movie: {}
    },
    onLoad: function(e){
        this.i = 0;
        this.loadData(e);
    },
    onShow: function(){
        
    },
    loadData: function(e){
        try {
          let that = this,
                _url = String.format("/MovieSchedule.aspx?movieid={0}&cinemaid={1}",e.movieno,e.cinemano);
            model.post(_url, {}, function (result, msg) {
                let data = result.data,
                    movie_list = data.movies
                let movie = _.find(movie_list, (item) => {
                    return item.movieno = e.movieno;
                })
                that.setData({
                    movieno: e.movieno,
                    schedules: data.sche,
                    movie_list: data.movies,
                    movie: movie,
                    cinemano: e.cinemano
                })
                wx.hideNavigationBarLoading();
            });
            wx.showNavigationBarLoading();
        } catch (e) {
          // Do something when catch error
        }
            
    },
    tapMovieItem: function(e) {
        let data = this.data,
            movieno = e.target.dataset.movieno;

        if (data.movieno != movieno) {
            data.movieno = movieno;
            data.movie = _.find(movie_list, (item) => {
                return item.movieno = e.movieno;
            })
            

            this.setData(data);
            this.loadData({ movieno: data.movie.movieno, cinemano: this.data.cinemano });
        }
        // this.animation.scale(1, 1).step()
        // this.setData({
        //     animationData1: this.animation.export()
        // })
    },
    selectseattap: function (e) {
        let data = e.currentTarget.dataset;
        wx.navigateTo({ url: '../select_seat/select_seat?scheduleno=' + data.scheduleno })
    },
    navigateToMovieData: function(){
        wx.navigateTo({url: '../movie_detail/movie_detail' })
    }
     
})