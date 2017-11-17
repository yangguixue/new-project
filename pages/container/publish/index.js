// pages/container/publish/index.js
var config = require('../../common/config.js');
Page({
  data: {
    items: []
  },

  onLoad: function (options) {
    var that = this;
    wx.request({
      url: config.configUrl + '&m=Category&a=getCgList',
      data: {
        type: '0'
      },
      success: function(res){
        that.setData({
          items: res.data.result
        })
      }
    })
  },

})