// pages/container/activity/ integration/index.js
var config = require('../../common/config.js');
Page({
  data: {
    items: []
  },

  onLoad: function (options) {
    var that = this;
    wx.request({
      url: config.configUrl + '&m=point&a=getWeeklySort',
      success: function(res) {
        that.setData({
          items: res.data.result
        })
      }
    })
  }
})