// pages/container/circleList/index.js
var config = require('../../common/config.js');
Page({
  data: {
    items: [],
    isLoading: true
  },

  onLoad: function (options) {
    var that = this;
    wx.request({
      url: config.configUrl + '&m=Category&a=getCgList',
      data: {
        type: 1,
      },
      success: function(res) {
        that.setData({
          items: res.data.result,
          isLoading: false
        })
      }
    })
  },

})