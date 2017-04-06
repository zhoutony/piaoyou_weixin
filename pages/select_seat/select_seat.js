import model from '../../utils/model.js';
import _ from '../../utils/underscore.modified.js';

Page({
    data: {
      movie: {},
      seats: [],
      ishide: 0
    },
    onLoad: function(e){
        this.i = 0;
        let that = this,
            _url = String.format("/ShowSeats.aspx?schedule_id={0}",e.scheduleno);
        model.post(_url, {}, function (result, msg) {
            let data = result.data,
                seats = that.setSeats(data.seats),
                movie = {
                  "movieName": data.movieName,
                  "cinemaName": data.cinemaName,
                  "version": data.version,
                  "ticketStartTime": data.ticketStartTime,
                  "hallID": data.hallID,
                  "hallName": data.hallName,
                  "showtimeID": data.showtimeID,
                  "price": data.price
                };
            that.setData({
                seats: seats,
                movie: movie,
                ishide: 1
            })
            wx.setStorage({key: "movie",data: movie});
            wx.hideNavigationBarLoading();
        });
        wx.showNavigationBarLoading();
    },
    onShow: function(){
        
    },
    tapSeat: function (e) {
        let data = e.currentTarget.dataset;
        // wx.navigateTo({ url: '../select_seat/select_seat?scheduleno=' + data.scheduleno })
    },
    tapOrder: function(){
        wx.navigateTo({url: '../payment/payment' })
    },
    setSeats: function(seats){
        var _seats = [], _seats1 = [];
        var _seat0, _seat1;
        _.map(seats, function(_seat, idx){
            if(!_seats[_seat.xCoord]){
                _seats[_seat.xCoord] = [];
            }
            _seats[_seat.xCoord][_seat.yCoord] = _seat;
        })
        return _seats;
    }
})