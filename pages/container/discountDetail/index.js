// pages/container/discountDetail/index.js
var util = require('../../../utils/util.js');
Page({
  data: {
    discountDetail:　{},
    isLoading: true,
  },

  onLoad: function (options) {
    var that = this;
    util.getReq('&m=ad&a=getAdInfo', {id: options.id }, function(res) {
      that.setData({
        discountDetail: res.result,
        isLoading: false
      })
    })
  },
  
  handleCall: function() {
    wx.makePhoneCall({
      phoneNumber: this.data.discountDetail.store_phone
    })
  }
})