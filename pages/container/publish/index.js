// pages/container/publish/index.js
var util = require('../../../utils/util.js');
var app =  getApp();
Page({
  data: {
    items: [],
    isShowLogin: false,
    info: {},
  },

  onLoad: function (options) {
    var that = this;
    util.req('&m=Category&a=getCgList', {
      type: '0',
      session3rd: app.globalData.token
    }, function(res) {
      if(res.flag == 1) {
        that.setData({
          items: res.result
        })
      }
    })
  },

  handleOpenLogin: function () {
    this.setData({ isShowLogin: true });
  },

  handleCloseLogin: function (event) {
    this.setData({ isShowLogin: false });
    this.getPoint();
  },

  handleNavigateTo: function (event) {
    var is_reg = app.globalData.is_reg;
    if (is_reg) {
      wx.navigateTo({
        url: event.currentTarget.dataset.url
      })
    } else {
      this.handleOpenLogin();
    }
  }

})