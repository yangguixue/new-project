// pages/container/usercenter/index.js
var util = require('../../../utils/util.js');
const app = getApp();
Page({
  data: {
    userInfo: {},
    isShowLogin: false,
    entry: [{
      id: 3,
      url: 'message',
      name: '消息'
    }, {
      id: 4,
      url: 'activity/myIntegration',
      name: '积分'
    }, {
      id: 5,
      url: 'focus',
      name: '收藏'
    }]
  },

  onShow: function () {
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

  handleShop: function(event) {
    var id = event.currentTarget.dataset.shopid;
    if (id) {
      wx.navigateTo({
        url: '../shopDetail/index?id=' + id,
      })
    } else {
      wx.showModal({
        content: '您还没有店铺，现在要添加吗？',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../creatShop/index'
            })
          }
        }
      })
    }
  }
})

