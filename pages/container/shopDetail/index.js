// pages/container/shopDetail/index.js
var config = require('../../common/config.js');

Page({
  data: {
    item: {}
  },

  onLoad: function (options) {
    var that = this;
    wx.request({
      url: config.configUrl + '&m=shop&a=getShopDetail',
      data: {
        id: options.id
      },
      success: function (res) {
        that.setData({
          item: res.data.result
        })
      }
    })
  },

  handleCall: function() {
    wx.makePhoneCall({
      phoneNumber: this.data.item.shop_phone
    })
  }
})