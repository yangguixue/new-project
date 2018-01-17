// pages/container/activity/ integration/index.js
var util = require('../../../../utils/util.js');
var app = getApp();
Page({
  data: {
    items: [],
    isShowLogin: false,
    nodes: ''
  },

  onLoad: function (options) {
    this.getWeeklySort();
    const that = this;
    util.req('&m=ad&a=getIll', { name: 'jfzb' }, function (data) {
      if (data.flag == 1) {
        that.setData({ nodes: data.result.content });
      } else {
        wx.showModal({
          title: data.msg,
        })
      }
    })
  },

  getWeeklySort: function() {
    var that = this;
    util.req('&m=point&a=getWeeklySort', {
      session3rd: app.globalData.token
    }, function(data) {
      that.setData({
        items: data.result.list
      })
    })
  },

  myPoint: function() {
    if (!app.globalData.is_reg) {
      this.handleOpenLogin();
      return;
    }
    wx.navigateTo({
      url: '../myIntegration/index',
    })
  },

  handleSend: function() {
    wx.switchTab({
      url: '../../index/index',
    })
  },

  handleOpenLogin: function () {
    this.setData({ isShowLogin: true });
  },

  handleCloseLogin: function (event) {
    var that = this;
    this.setData({ isShowLogin: false });
    this.myPoint();
  },

  onShareAppMessage: function (res) {
    return {
      title: '年底发钱啦！发布便民信息还给钱！这家平台疯了！',
      path: '/pages/container/activity/integration/index?userId=' + app.globalData.token,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

})