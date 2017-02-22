var app = getApp();
var publicSignal = app.publicSignal;
var openid = app.openid;

Page({
  data: {
    text: "Page select_seat",
    scrollClassName: ""
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示

  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  chooseSeat: function (event) {
    let { seats, selected, choosed, checkouting } = this.data
    let { row, col, id } = event.target.dataset
    console.log('%c row', 'background:red;', row)
    console.log('%c col', 'background:red;', col)
    console.log('%c event.target', 'background:red;', event.target)

    // if (checkouting) {
    //   // checking seats, disabled seat select
    //   return;
    // }
    // console.log('%c seats', 'background:red;', seats)
    // let seatRow = seats.filter(r => r.desc == row)[0]
    // let seat = seatRow.detail.filter(function(c) {
    //   return c.n == col
    // })[0]
    // console.log('%c seat', 'background:red;', seat)
    // console.log('%c seatRow', 'background:red;', seatRow)

    // if (!seat.isSeat || seat.status === 'locked') {
    //   return
    // }

    // // select available seat, exceed maximum seat count
    // if (Object.keys(selected).length >= 4 && seat.status == 'available') {
    //   wx.showModal({
    //     content: '最多只能选 4 张票',
    //     showCancel: false,
    //   })
    //   // this.modal.show({
    //   //   message: '最多只能选 4 张票',
    //   //   confirmText: '确定',
    //   //   change: function(isOk) {
    //   //     console.log(isOk);
    //   //     this.modal.hide()
    //   //   }
    //   // })
    //   return
    // }


    // if (SeatChecker.check(event.target.dataset, this)) {
    //   this.toggleSeat(row, col, event.target, id);
    // }
  },
  catchTouchStart: function (event) {
    console.log('event_start', event)

    // if (event.touches.length === 2) {
    //   this.setData({
    //     touchPoint2: event,
    //     twoPoint: true,
    //   })
    // }

  },
  catchTouchMove: function (event) {
    var that = this
    // console.log('event_move', event)
    // console.log('event.touches.length', event.touches.length)
    // wx.showToast({
    //   title: JSON.stringify(event.touches),
    //   icon: 'success',
    //   duration: 10000
    // })

    // setTimeout(function(){
    //   wx.hideToast()
    // },5000)

    // wx.showModal({
    //   title: '提示',
    //   content: JSON.stringify(event.touches),
    //   success: function (res) {
    //     if (res.confirm) {
    //       console.log('用户点击确定')
    //     }
    //   }
    // })

  },
  catchTouchEnd: function (event) {
    // console.log('this.data.moveScaled:', this.data.moveScaled)
    // console.log('this.data.twoPoint:', this.data.twoPoint)
    console.log('event:', event)

  },
  gotopage: function () {
    wx.setStorage({
      key: "movieScheduleInfo-" + publicSignal,
      data: { "name": "铁道飞虎", "roomname": "群丽婚纱4号厅", "type": "3D", "lagu": "国语", "date": "20161229", "time": "16:30", "displayDate": "今天  12-29 " }
    });
    wx.setStorage({
      key: "sTempOrder-" + publicSignal,
      data: { "sTempOrderID": "16122915182739672", "iLockValidTime": 10, "sSeatLable": "01:1:5", "iTotalFee": 3300, "iUnitPrice": 3300, "iPayNum": 1, "fee": 300 }
    });
    wx.setStorage({
      key: "show_service_fe-" + publicSignal,
      data: '1|2'
    });
    wx.setStorage({
      key: "cinemano",
      data: '100233'
    });
    wx.setStorage({
      key: "cinemaname",
      data: '金逸电影大悦城店'
    });
    /*
    cookie...... show_service_fee-1003421 = '1|2'
    */
    wx.navigateTo({ url: '../payment/payment?mpid=52270213&sTempOrderID=16121417220532822&movieno=6917' })
  }
})