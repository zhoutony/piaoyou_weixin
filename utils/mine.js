/**
 * Created by ydk on 2017/01/18.
 */
module.exports = {
    changePage: function (tag) {
        if(tag == 1){
            this.goOrders();
        } else if(tag == 2){
            this.goSuits();
        } else if(tag == 3){
            this.goVouchers();
        } else {
            this.goCards()
        }
    },
    goOrders: function () {
        wx.redirectTo({url: '../orders/orders'})
    },
    goSuits: function () {
        wx.redirectTo({url: '../suit/suit'})
    },
    goVouchers: function () {
        wx.redirectTo({url: '../vouchers/vouchers'})
    },
    goCards: function () {
        wx.redirectTo({url: '../cards/cards'})
    }
}