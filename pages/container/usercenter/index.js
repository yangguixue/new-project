// pages/container/usercenter/index.js
var config = require('../../common/config.js');
const app = getApp()
Page({
  data: {
    userInfo: {},
    noCircle: false
  },

  onLoad: function () {
    var that = this;
    wx.request({
      url: config.configUrl + '&m=member&a=getMemberInfo',
      success: function(res) {
        console.log(res)
        that.setData({
          userInfo: res.data.result
        })
      }
    })
  }
})