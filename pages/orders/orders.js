//index.js
//获取应用实例
var dateFormat = require('../../utils/data.js');
var model = require('../../utils/model.js');
var orderData = require('../../data/orderdata.js');
// var QRCode = require('../../utils/qrcode.js');
var app = getApp();
var publicSignal = app.getPublicSignal();

Page({
  data: {
    userInfo: {},
    orderList: [],
    publicSignal: publicSignal,
    bisTitles: [],
    viewParam: {
      mineTag: 1,
      isEcoupon: true,
      membercardType: 1,
      virtualcardType: 1
    },
    isPopShow: 'm-hide',
    orderDetail: {}
  },
  onLoad: function () {
    //获取订单列表
    this.getData();

    //获取用户头像等基本信息
    this.getUinfo();
  },

  //获取订单列表
  getData: function () {
    var that = this;
    app.getUserInfo(function (result) {
      model.request({
        url: '/my/order',
        data: {
          public_signal_short: publicSignal,
          openid: result.openid,
          page: 1,
          page_num: 10
        },
        success: function (res, msg) {
          if (res.err == null && msg.statusCode == 200) {
            var data = res.data;
            var count = data.count;
            var list = that.formatOrder(data.data);
            that.setData({
              orderList: list,
              bisTitles: list.length == 0 ? [] : that.setbisTitle(list[0].bisId)
            });
          }
        }
      });
    });
  },

  //获取订单列表
  formatOrder: function (list) {
    var result = [];

    for (var i = 0; i < list.length; i++) {
      var order = list[i];

      var boxClass = '';
      //- 时间差
      var _time = order.show_date == '' ? 9999 : (new Date() * 1 - new Date(order.show_date) * 1);
      //- (3-已发码 5-已退款)
      var isShown = order.status == 3 && _time > 0;
      var isDisable = order.status == 5 || isShown;
      var _class = isDisable ? "disable" : "";
      //- 中环一家增加“一键取票”
      var isCopyCode = (!isDisable) && this.data.publicSignal == 'myzh';

      if (isDisable)
        boxClass = "refund"
      if (isShown)
        boxClass = "shown";

      order.boxClass = boxClass;
      order._class = _class;
      order.isCopyCode = isCopyCode;
      order.codes = order.ticket_code.split('|');

      //处理订单日期字段
      order.displayDate = order.date ? dateFormat.formateDate(order.date) : "";

      order.dateCn = order.date ? order.date.substr(4, 2) + '月' + order.date.substr(6, 2) + '日' : "";
      //订单状态
      order.statusCn = order.status_des;
      //订单是否过期
      order.expired = dateFormat.orderExpired(order.show_date);

      if (order.status == 3) { //已发码
        if (order.expired === 0)
          order.statusCn = '已使用';
      }

      // fillSuitsHtml( order );

      result.push(order);
    }

    return result;
  },

  //获取用户数据
  getUinfo: function () {
    var that = this;
    app.getUserInfo(function (userInfo) {
      //更新用户数据
      that.setData({
        userInfo: userInfo
      })
    })
  },

  // 设置系统商title
  setbisTitle: function (bisId) {
    var titles = [];
    switch (bisId) {
      // 金逸 （双码）
      case '5382dbb7d7ae6f1d48cf2db2':
        titles = ['订单号', '验证码'];
        break;
      // 火凤凰  （单码）
      case '5382dbb8d7ae6f1d48cf2db4':
        titles = ['兑票码', '验证码'];
        break;
      // 满天星 （双码）
      case '545893212bc3abad3154fcb0':
        titles = ['订单号', '验证码'];
        break;
      // 鼎新 （双码）
      case '545893212bc3abad3154fcb3':
        titles = ['序列号', '验证码'];
        break;
      // 万达 （单码）
      case '545893212bc3abad3154fcb6':
        titles = ['取票码', '验证码'];
        break;
      // 幸福蓝海 （单码）
      case '545893212bc3abad3154fcb9':
        titles = ['兑票码', '验证码'];
        break;
      // 大地 （单码）
      case '545893212bc3abad3154fcbc':
        titles = ['手机号', '兑票码'];
        break;
      // 天下票仓 （单码）
      case '545893212bc3abad3154fcbf':
        titles = ['兑票码', '验证码'];
        break;
      // 辰星 （双码）
      case '545893212bc3abad3154fcc2':
        titles = ['手机号', '兑票码'];
        break;
      // VISTA （单码）
      case '545893212bc3abad3154fcc5':
        titles = ['订位号码', '验证码'];
        break;
      // 卢米埃 （单码）
      case '545893212bc3abad3154fcc8':
        titles = ['订位号码', '验证码'];
        break;
      // 星美 （双码）
      case '545893212bc3abad3154fcc9':
        titles = ['序列号', '验证码'];
        break;
      // 美嘉 （单码）
      case '545893212bc3abad3154fcca':
        titles = ['取票码', '验证码'];
        break;
      // 易得 （双码）
      case '545893212bc3abad3154fccb':
        titles = ['取票码', '订单号'];
        break;
      // 1905 （单码）
      case '545893212bc3abad3154fccc':
        titles = ['兑票码', '验证码'];
        break;
      // 中影  （无）
      case '545893547bc3abad3154fcd1':
        titles = ['订单号', '验证码'];
        break;
      // 深圳UL（双码）
      case '545893547bc3abad3154fcd2':
        titles = ['订单号', '验证码'];
        break;
      // 传奇时代（双码）
      case '545893547bc3abad3154fcd3':
        titles = ['序列号', '验证码'];
        break;
      // 幸福蓝海V1 （单码/双码）
      case '545893547bc3abad3154fcd4':
        titles = ['兑票码', '验证码'];
        break;
      default:
        titles = ['兑票码', '验证码'];
    }
    return titles;
  },

  //订单详情
  showDetail: function (e) {
    var oid = e.currentTarget.id.split('_')[1];
    var orderDetail = null;
    for (var i = 0; i < this.data.orderList.length; i++) {
      if (this.data.orderList[i].order_id == oid) {
        orderDetail = this.data.orderList[i];
        break;
      }
    }
    // var qrcode = new QRCode('ico-2code', {
    //   text: orderDetail.ticket_code,
    //   width: 100,
    //   height: 100
    // });
    if (orderDetail != null) {
      orderDetail.codes = orderDetail.ticket_code.split('|');
      this.setData({
        isPopShow: 'm-show',
        orderDetail: orderDetail
      });
    }
  },

  //关闭弹窗
  closeDlg: function () {
    this.setData({
      isPopShow: 'm-hide'
    });
  }
})