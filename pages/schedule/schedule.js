import model from '../../utils/model.js';
import _ from '../../utils/underscore.modified.js';
let app = getApp();
Page({
    data: {
        movie_list:[],
        schedules: [],
        scheduleShows: {},
        movieno: 0,
        cinemano: 0,
        movie: {},
        ishide: 1,
        hiddenLoading: true,
        loadTitle: '加载中...',
        scheduleIndex: 0,
        cinema: {}
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
                    movie_list = data.movies,
                    _index;
                let movie = _.find(movie_list, (item, index) => {
                    _index = index;
                    return item.movieno == e.movieno;
                })
                if(that.i == 0){
                    movie_list.splice(_index, 1);
                    movie_list.unshift(movie);
                }
                that.setData({
                    scheduleIndex: 0,
                    movieno: e.movieno,
                    schedules: data.sche,
                    scheduleShows: data.sche[0].shows,
                    movie_list: movie_list,
                    movie: movie,
                    cinemano: e.cinemano,
                    ishide: 0,
                    hiddenLoading: true,
                    cinema: data.cinema
                })
                wx.hideNavigationBarLoading();
                that.i++;
            });
            this.setData({hiddenLoading: false})
            wx.showNavigationBarLoading();
        } catch (e) {
          // Do something when catch error
        }
            
    },
    tapMovieItem: function(e) {
        let data = this.data,
            movieno = e.target.dataset.movieno,
            movie_list = this.data.movie_list;

        if (data.movieno != movieno) {
            data.movieno = movieno;
            data.movie = _.find(movie_list, (item) => {
                return item.movieno == movieno;
            })
            

            this.setData({
                movieno: data.movieno,
                movie: data.movie
            });
            this.loadData({ movieno: data.movie.movieno, cinemano: this.data.cinemano });
        }
    },
    gotoScheduleDate: function (e) {
        let data = e.currentTarget.dataset,
            index = data.index,
            shows = this.data.schedules[index].shows;
        shows = this.getSchedus(shows);
        this.setData({
            scheduleIndex: index,
            scheduleShows: shows
        })
    },
    getSchedus: function(_shows){
        let shows = _shows;
        _.map(shows, function(item, index){
            let hour = parseInt(item.time.slice(0,2));
            shows[index].hour = hour;
        })
        return shows;
    },
    selectseattap: function (e) {
        let data = e.currentTarget.dataset;
        wx.navigateTo({ url: '../select_seat/select_seat?scheduleno=' + data.scheduleno })
    },
    navigateToMovieData: function(){
        wx.navigateTo({url: '../movie_detail/movie_detail' })
    }
     
})