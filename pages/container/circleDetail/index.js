// pages/container/circleDetail/index.js
var config = require('../../common/config.js');
const app = getApp();
Page({
  data: {
    circle: {},
    articleList: [],
    isLoadding: false,
    showLogin: false,
  },

  onLoad: function (options) {
    var that = this;
    this.setData({ isLoading: true })
    wx.request({
      url: config.configUrl + '&m=Category&a=getCicleInfo',
      data: {
        cg_id: options.id,
        "session3rd": wx.getStorageSync('token')
      },
      success: function(res) {
        that.setData({
          circle: res.data.result
        })
      },
      fail: function(res) {
        app.login();
      }
    })
    wx.request({
      url: config.configUrl + '&m=info&a=getInfoList',
      data: {
        cg_id: options.id,
        type: true,
        "session3rd": wx.getStorageSync('token')
      },
      success: function (res) {
        that.setData({
          articleList: res.data.result,
          isLoading: false
        })
      },
      fail: function(res) {
        app.login();
      }
    })
  },

  handleShowLogin: function(e) {
    this.setData({ showLogin: true })
  },

  handleCloseLogin: function(e) {
    console.log('我到重点了')
    this.setData({ showLogin: false })
  }

})