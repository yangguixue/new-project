// pages/container/shopDetail/index.js
var util = require('../../../utils/util.js');

Page({
  data: {
    item: {},
    isLoading: true,
  },

  onLoad: function (options) {
    var that = this;
    util.getReq('&m=shop&a=getShopDetail', { id: options.id }, function(data) {
      that.setData({
        item: data.result,
        isLoading: false
      })
    })
  },

  handleCall: function() {
    wx.makePhoneCall({
      phoneNumber: this.data.item.shop_phone
    })
  }
})