// pages/container/usercenter/index.js
var util = require('../../../utils/util.js');
const app = getApp();
Page({
  data: {
    userInfo: {},
    isShowLogin: false,
  },

  onLoad: function () {
    this.getUserInfo();
  },

  getUserInfo: function() {
    var that = this;
    var token = app.globalData.token;
    util.req('&m=member&a=getMemberInfo', { session3rd: token }, function (data) {
      if (data.flag == 1) {
        that.setData({
          userInfo: data.result
        })
      }
    })
  },

  handleOpenLogin: function() {
    this.setData({ isShowLogin: true });
  },

  handleCloseLogin: function (event) {
    this.setData({ isShowLogin: false });
    if (event.detail.is_reg) {
      this.getUserInfo();
    }
  },

  handleNavigateTo: function(event) {
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

