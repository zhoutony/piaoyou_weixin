var model = require('../../utils/model.js');

Page({
    data: {
        movie_list:[],
        animationData: {},
        animationData1: {},
        animation: 'animationData',
        scroll_left: 0,
        toView: 'green0'
    },
    onLoad: function(){
        this.i = 0;
        var that = this;
        var param = {
            movie_list: 'public_signal_short=bgdyy&cinema_no=1000088'
        };
        model.post("/batch/api", param, function (result, msg) {
            var data = result.data;
            that.setData({
                movie_list: data.movie_list.data,
            })
        });
    },
    onShow: function(){
        var animation = wx.createAnimation({
        duration: 1000,
            timingFunction: 'ease',
        })

        this.animation = animation;
        this.animation.scale(.6, .6).step();
        this.setData({
            animationData: this.animation.export()
        })
        this.animation.scale(.7, .7).step();
        this.setData({
            animationData1: this.animation.export()
        })
        setTimeout(function(){
            this.setData({
                scroll_left: 64
            })
        }.bind(this), 200)
        // setTimeout(function() {
        //     this.animation.scale(.6, .6).step()
        //     this.setData({
        //         animationData1: this.animation.export()
        //     })
        // }.bind(this), 100)
        // setTimeout(function() {
        //     this.animation.scale(.7, .7).step()
        //     this.setData({
        //         animationData1: this.animation.export()
        //     })
        // }.bind(this), 500)

        wx.getSystemInfo({
            success: function(res) {
                console.log(res.model)
                console.log(res.pixelRatio)
                console.log(res.windowWidth)
                console.log(res.windowHeight)
                console.log(res.language)
                console.log(res.version)
                console.log(res.platform)
            }
        })
    },
    tapMovieItem: function(event){
        var _type = event.target.dataset.type;
        this.animation.scale(1, 1).step()
        this.setData({
            animationData1: this.animation.export()
        })
    },
    scroll: function(event){
        console.log(event);
        this.i += 1; 
        this.setData({
            toView: 'green'+this.i
        })
    },
    navigateToSeat: function () {
        wx.navigateTo({ url: '../select_seat/select_seat' })
    },
    navigateToMovieData: function(){
        wx.navigateTo({url: '../movie_detail/movie_detail' })
    }
})