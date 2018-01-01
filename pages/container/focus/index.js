// pages/container/focus/index.js
var util = require('../../../utils/util.js');
var app = getApp();

Page({
  data: {
    isLoading: true
  },

  onLoad: function (options) {
    var that = this;
    util.req('&m=info&a=getInfoList', {
      star: true,
      session3rd: app.globalData.token
    }, function(data) {
      if (data.flag == 1) {
        that.setData({
          items: data.result
        })
      }
      that.setData({
        isLoading: false
      })
    })
  }
})