// pages/container/publish/index.js
var util = require('../../../utils/util.js');
var app =  getApp();
Page({
  data: {
    items: [],
    isShowLogin: false
  },

  onLoad: function (options) {
    var that = this;
    util.req('&m=Category&a=getCgList', { type: '0' }, function(res) {
      if(res.flag == 1) {
        that.setData({
          items: res.result
        })
      }
    })
  },

  handleOpenLogin: function () {
    console.log(333)
    this.setData({ isShowLogin: true });
  },

  handleCloseLogin: function (event) {
    this.setData({ isShowLogin: false });
    if (event.detail.is_reg) {
      app.globalData.is_reg = 1
    }
  },

  handleNavigateTo: function (event) {
    var is_reg = app.globalData.is_reg;
    console.log(is_reg)
    if (is_reg) {
      wx.navigateTo({
        url: event.currentTarget.dataset.url
      })
    } else {
      this.handleOpenLogin();
    }
  }

})