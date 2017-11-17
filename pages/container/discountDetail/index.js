// pages/container/discountDetail/index.js
var config = require('../../common/config.js');
Page({
  data: {
    discountDetail:　{},
  },

  onLoad: function (options) {
    var that = this;
    wx.request({
      url: config.configUrl + '&m=ad&a=getAdInfo',
      data: {
        id: options.id
      },
      success: function (res) {
        that.setData({
          discountDetail: res.data.result
        })
      }
    })
  },
  
  handleCall: function() {
    wx.makePhoneCall({
      phoneNumber: this.data.discountDetail.store_phone
    })
  }
})