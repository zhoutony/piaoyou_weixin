import model from '../../utils/model.js';
import _ from '../../utils/underscore.modified.js';
import SeatChecker from './seat-rule.js';
let app = getApp();
Page({
    data: {
      movie: {},
      seats: [],
      ishide: 1,
      mobile: '',
      hiddenLoading: true,
      loadTitle: '加载中...',
      price: 0,
      selectSeats: [],
      seatsAnimation: {},
      touchPoint2: {},
      twoPoint: true,
      moveScaled: false,
    },
    onLoad: function(e){
        this.scheduleno = e.scheduleno;
        this.systemInfo = app.globalData.systemInfo;
        this.animation = wx.createAnimation({
            duration: 300,
            timingFuction: 'ease',
            transformOrigin: '0 0',
        })
    },
    
    onShow: function(){ 
        try {
            this.i = 0;
            this.selectSeats = {
                seatIDs: [],
                seatNames: []
            };
            let that = this;
            wx.showNavigationBarLoading();
            this.setData({
                hiddenLoading: false,
                loadTitle: '加载中...'
            })
            var mobile = wx.getStorageSync('mobile');
            var sTempOrderID = wx.getStorageSync('sTempOrderID');
            if (mobile && sTempOrderID) {
                app.getUserInfo(function(userInfo){
                  wx.removeStorage({
                    key: 'sTempOrderID',
                    success: function(res) {
                      console.log(res.data)
                    } 
                  })
                  var lockUrl = String.format("/SeatUnlock.aspx?mobile={0}&openID={1}&orderID={2}",mobile, userInfo.openid, sTempOrderID);
                  model.post(lockUrl, {}, function (result, msg) {
                    setTimeout(function(){
                      that.initShowSeats()
                    }, 2000)
                      
                  })
                })
            }else{
                that.initShowSeats()
            }
            this.setData({
              mobile: mobile ? mobile : '',
              selectSeats: []
            })
        } catch (e) {
          // Do something when catch error
        }
    },
    initShowSeats: function(){
        let that = this,
            _url = String.format("/ShowSeats.aspx?schedule_id={0}", this.scheduleno);
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
            let seatsAnimation = that.scaleSeats(seats);
            that.setData({
                seats: seats,
                movie: movie,
                ishide: 0,
                hiddenLoading: true,
                seatsAnimation: seatsAnimation
            })
            wx.setStorage({key: "movie",data: movie});
            wx.hideNavigationBarLoading();
        });
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
            if (SeatChecker.check(e.currentTarget.dataset, this, xCoord, yCoord)) {
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
                        if (that.selectSeats.seatIDs.length >= 4) {
                            wx.showModal({
                                content: '最多只能选 4 张票',
                                showCancel: false,
                            })
                            return;
                        }
                        _seat.classStatus = 3;
                        that.selectSeats.seatIDs.push(seatid);
                        that.selectSeats.seatNames.push(seatName);
                    }
                 }
             });

            let price = parseInt(that.data.movie.price) * that.selectSeats.seatIDs.length / 100;
            if(that.selectSeats.seatIDs.length == 0){
                this.animation.scale(1).step();
                this.setData({
                    seatsAnimation: that.animation.export()
                })
            }
            
            this.setData({
                seats: seats, 
                price: price,
                selectSeats: that.selectSeats.seatNames
            })
            
            this.toggleSeat(e.currentTarget);
            }
            
        }
        // wx.navigateTo({ url: '../select_seat/select_seat?scheduleno=' + data.scheduleno })
    },
    tapOrder: function(){
        try {
            let that = this,
                schedule_id = this.scheduleno,
                selectSeatsLen = this.selectSeats.seatIDs.length;
            if(selectSeatsLen <= 0){ return; }
            var tel = that.data.mobile;
                if(/^1[23456789]\d{9}$/.test(tel)){
                    wx.setStorage({key: "mobile",data: that.data.mobile});
                    
                }else{
                    wx.showModal({
                       content: '手机号不正确，请再试',
                       showCancel: false,
                    })
                    return;
                }
            
            wx.setStorage({key: "seatNames",data: that.selectSeats.seatNames});
            app.getUserInfo(function(userInfo){
                let seatIDs = that.selectSeats.seatIDs.join(','),
                    seatNames = that.selectSeats.seatNames.join(','),
                    _url = String.format("/SeatLock.aspx?schedule_id={0}&openId={1}&seatIDs={2}&seatNames={3}&mobile={4}",schedule_id,userInfo.openid,seatIDs,seatNames, that.data.mobile);
                that.setData({hiddenLoading: false, loadTitle: '锁座中...'})
                model.post(_url, {}, (result, msg) => {
                    let data = result.data;
                    if(result.ret == 0 && result.sub == 0 && data.sTempOrderID){
                        wx.setStorage({key: "sTempOrderID",data: data.sTempOrderID});
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
        var _seats0_index = Math.round(_seats[0].length / 2);
        _.map(_seats, function(_seat,index){
            _seats[index][_seats0_index].isLine = true;
        })
        
        return _seats;
    },
    rechooseSche(e) {
        wx.navigateBack();
    },
    catchTouchStart(event){
        console.log('event_start', event)

        if (event.touches.length === 2) {
          this.setData({
            touchPoint2: event,
            twoPoint: true
          })
        }
    },
    catchTouchMove(event){
        var that = this
        // console.log('event_move', event)
        // console.log('event.touches.length', event.touches.length)


        if (!that.data.moveScaled && event.touches.length === 2 && that.data.touchPoint2) {


          // if (that.data.touchPoint2.keys.length > 1) {
          // console.log('event_move', event)
          const point1 = that.data.touchPoint2
          const point2 = that.data.touchPoint2
          const startLength = Math.abs(point1.touches[0].clientX - point2.touches[1].clientX) + Math.abs(point1.touches[0].clientY - point2.touches[1].clientY)
          const moveLength = Math.abs(event.touches[0].clientX - event.touches[1].clientX) + Math.abs(event.touches[0].clientY - event.touches[1].clientY)
          // console.log('startLength', startLength)
          // console.log('endLength', moveLength)
          if ((startLength - moveLength) > 6) {
            that.expandScaleSeat(that.data.ratio)
            that.setData({
              moveScaled: true,
              touchPoint2: {},
              touchPointEnd1: {},
              room_height: 50,

            })
          } else if ((startLength - moveLength) < -6) {
            that.expandScaleSeat(1)
            that.setData({
              moveScaled: true,
              touchPoint2: {},
              touchPointEnd1: {},
              room_height: that.data.seatsHeight,
            })
          }
          // }
        }
    },
    catchTouchEnd(event){
        // console.log('this.data.moveScaled', this.data.moveScaled)
        // console.log('this.data.twoPoint', this.data.twoPoint)
        if (!this.data.moveScaled && this.data.twoPoint) {
          const point1 = this.data.touchPoint2
          const point2 = this.data.touchPoint2
          const pointend1 = this.data.touchPointEnd1

          // console.log('event_end', event)
          if (pointend1 && event.touches.length === 0 && pointend1.type === "touchend") {

          // console.log('point1.touches[0].clientX', point1.touches[0].clientX)
          // console.log('point1.touches[0].clientX', Math.abs(point1.touches[0].clientX - point2.touches[1].clientX))

            const startLength = Math.abs(point1.touches[0].clientX - point2.touches[1].clientX) + Math.abs(point1.touches[0].clientY - point2.touches[1].clientY)
            const endLength = Math.abs(pointend1.changedTouches[0].clientX - event.changedTouches[0].clientX) + Math.abs(pointend1.changedTouches[0].clientY - event.changedTouches[0].clientY)
            console.log('startLength', startLength)
            console.log('endLength', endLength)
            if ((startLength - endLength) > 6) {
              this.expandScaleSeat(this.data.ratio)
            // this.setData({
            //   scroll_y: false,
            // })
              this.setData({
                room_height: 50,

              })
            } else if ((startLength - endLength) < -6) {
              this.expandScaleSeat(1)
            // this.setData({
            //   scroll_y: true,
            // })
              this.setData({
                room_height: this.data.seatsHeight,

              })
            }
            this.setData({
              touchPoint2: {},
              touchPointEnd1: {},
              twoPoint: false,
            })
          } else if (event.touches.length === 1) {
            this.setData({
              touchPointEnd1: event,
            })
          }

        } else {
          this.setData({
            moveScaled: false,
          })
        }
    },
    expandScaleSeat: function(scale) {
        var that = this
        let result = {}
        result.seatsAnimation = that.scaleSeats(
          null,
          {
            left: 0,
            top: 0,
          },
        scale)
        that.setData(result)
        that.setData({
          scaled: false,
        })
    },
    toggleSeat(detail, id) {
      // console.log('%c detail.dataset.col * 80', 'background:#456123;', detail.dataset.col * 80)
      // console.log('%c detail.offsetTop', 'background:#456123;', detail.offsetTop)
      // console.log('%c detail.offsetLeft', 'background:#456123;', detail.offsetLeft)
      let seatsAnimation = this.scaleSeats(null, {
        left: detail.dataset.ycoord * 72 * app.globalData.rpx,
        top: detail.dataset.xcoord * 72 * app.globalData.rpx,
      })

      this.setData({seatsAnimation: seatsAnimation})
    },
    scaleSeats(seats, scroll, scales = 1) {
        let that = this,
            systemInfo = this.systemInfo;
        if (!seats) {
          that.animation.scale(scales).step()
          if(!that.isSelectSeat){
            that.isSelectSeat = true;
            setTimeout(function() {
              console.log('%c scroll.top', 'background:#456123;', Math.ceil(scroll.top))
              console.log('%c that.ratio', 'background:#456123;', Math.ceil(that.ratio))
              console.log('%c top', 'background:#456123;', Math.ceil(scroll.top / that.ratio / 4))
              console.log('%c left', 'background:#456123;', Math.ceil(scroll.left / that.ratio / 4))
              that.setData({
                scroll: {
                  top: Math.ceil(scroll.top / that.ratio / 4),
                  left: Math.ceil(scroll.left / that.ratio / 4),
                }
              })
            }, 450)
          }
          return that.animation.export()
        } else {
            if (systemInfo) {
                const { windowHeight, windowWidth } = systemInfo;
                const seatRowLen = seats[0].length;
                const seatsWidth = seatRowLen * 72 * app.globalData.rpx;
                const seatsHeight = seats.length * 72 * app.globalData.rpx;
                const ratio = (windowWidth - 20) / seatsWidth;
                that.setData({
                    ratio,
                })
                that.ratio = ratio
                that.setData({
                    room_width: seatsWidth,
                    seatsHeight,
                })
                if (ratio < 1) {
                    that.animation.scale(ratio).step()
                }

                return that.animation.export()
            }
        }
    },
    bindKeyInput(e) {
        let value = e.detail.value;
        this.data.mobile = value;
    }
})