// pages/container/discountList/index.js
var config = require('../../common/config.js');
Page({
  data: {
    discount: [],
    isLoading: true
  },

  onLoad: function (options) {
    var that = this;
    wx.request({
      url: config.configUrl + '&m=ad&a=getAdsList',
      success: function (res) {
        if (res.data.flag == 1) {
          that.setData({
            discount: res.data.result,
            isLoading: false
          })
        } else {
          wx.showModal({
            title: res.data.msg
          })
          that.setData({
            isLoading: false
          })
        }
      }
    })
  },

})