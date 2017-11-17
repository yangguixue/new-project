// pages/container/circleDetail/index.js
var config = require('../../common/config.js');
Page({
  data: {
    circle: {},
    articleList: [],
    isLoadding: false,
  },

  onLoad: function (options) {
    var that = this;
    this.setData({ isLoading: true })
    wx.request({
      url: config.configUrl + '&m=Category&a=getCicleInfo',
      data: {
        cg_id: options.id
      },
      success: function(res) {
        that.setData({
          circle: res.data.result
        })
      }
    })
    wx.request({
      url: config.configUrl + '&m=info&a=getInfoList',
      data: {
        cg_id: options.id,
        type: true
      },
      success: function (res) {
        that.setData({
          articleList: res.data.result,
          isLoading: false
        })
      }
    })
  },

})