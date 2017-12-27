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
    // 获取积分
    if (app.globalData.is_reg) {
      this.getPoint();
    }
  },

  onShow: function() {
    this.getPoint();
  },

  getPoint: function() {
    var _this = this;
    util.getReq('&m=point&a=checkPoint', {
      session3rd: app.globalData.token
    }, function (data) {
      if (data.flag == 1) {
        _this.setData({
          info: data.result
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