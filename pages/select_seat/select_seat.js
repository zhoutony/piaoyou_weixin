import model from '../../utils/model.js';
import _ from '../../utils/underscore.modified.js';
let app = getApp();
Page({
    data: {
      movie: {},
      seats: [],
      ishide: 1,
      mobile: '13567549087',
      hiddenLoading: true,
      loadTitle: '加载中...',
      price: 0,
      selectSeats: []
    },
    onLoad: function(e){
        this.scheduleno = e.scheduleno
    },
    onShow: function(){
        this.i = 0;
        this.selectSeats = {
            seatIDs: [],
            seatNames: []
        };
        
        let that = this,
            _url = String.format("/ShowSeats.aspx?schedule_id={0}",this.scheduleno);
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
                ishide: 0,
                hiddenLoading: true
            })
            wx.setStorage({key: "movie",data: movie});
            wx.hideNavigationBarLoading();
        });
        wx.showNavigationBarLoading();
        this.setData({
            hiddenLoading: false,
            loadTitle: '加载中...'
        })
    },
    tapSeat: function (e) {
        let that = this,
            data = e.currentTarget.dataset;
        
        if(data.status == 1){
            let xCoord = data.xcoord,
                yCoord = data.ycoord,
                seatid = data.seatid,
                seatName = data.seatname,
                seats = this.data.seats;
             _.map(seats[xCoord], function(_seat, idx){
                 if(_seat.yCoord == yCoord){
                    if(_seat.classStatus == 3){
                        _seat.classStatus = 1;
                        let _index;
                        _.find(that.selectSeats.seatIDs, function(item, index){
                            _index = index;
                            return item == seatid;
                        })
                        that.selectSeats.seatIDs.splice(_index,1);
                        that.selectSeats.seatNames.splice(_index,1);
                    }else{
                        _seat.classStatus = 3;
                        that.selectSeats.seatIDs.push(seatid);
                        that.selectSeats.seatNames.push(seatName);
                    }
                 }
             });
             let price = parseInt(that.data.movie.price) * that.selectSeats.seatIDs.length / 100
            this.setData({seats: seats, price: price, selectSeats: that.selectSeats.seatNames})
        }
        // wx.navigateTo({ url: '../select_seat/select_seat?scheduleno=' + data.scheduleno })
    },
    tapOrder: function(){
        try {
            let that = this,
                schedule_id = this.scheduleno;
            wx.setStorage({key: "mobile",data: that.data.mobile});
            wx.setStorage({key: "seatNames",data: that.selectSeats.seatNames});
            app.getUserInfo(function(userInfo){
                let seatIDs = that.selectSeats.seatIDs.join(','),
                    seatNames = that.selectSeats.seatNames.join(','),
                    _url = String.format("/SeatLock.aspx?schedule_id={0}&openId={1}&seatIDs={2}&seatNames={3}&mobile={4}",schedule_id,userInfo.openid,seatIDs,seatNames, that.data.mobile);
                that.setData({hiddenLoading: false, loadTitle: '锁座中...'})
                model.post(_url, {}, (result, msg) => {
                    let data = result.data;
                    if(result.ret == 0 && result.sub == 0 && data.sTempOrderID){
                        wx.navigateTo({url: '../payment/payment?sTempOrderID=' + data.sTempOrderID })
                        that.setData({hiddenLoading: true})
                    }
                    
                });
            });
        } catch (e) {
            console.log(e)
        }

        
    },
    setSeats: function(seats){
        var _seats = [], _seats1 = [];
        var _seat0, _seat1;
        _.map(seats, function(_seat, idx){
            if(!_seats[_seat.xCoord]){
                _seats[_seat.xCoord] = [];
            }
            _seat.classStatus = _seat.status;
            _seats[_seat.xCoord][_seat.yCoord] = _seat;
        })
        return _seats;
    }
})