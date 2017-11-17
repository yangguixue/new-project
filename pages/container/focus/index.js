// pages/container/focus/index.js
var config = require('../../common/config.js');
Page({
  data: {
    items: [],
    isLoading: true
  },

  onLoad: function (options) {
    var that = this;
    wx.request({
      url: config.configUrl + '&m=member&a=getFollows',
      success: function(res) {
        that.setData({
          items: res.data
        })
      },
      complete: function() {
        that.setData({
          isLoading: false
        })
      }
    })
  }
})