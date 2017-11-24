// pages/container/userPage/index.js
var util = require('../../../utils/util.js');
var app = getApp();

Page({
  data: {
    list: [],
    userInfo: {},
    userId: '',
    isLoading: true,
    isShowLogin: false
  },

  onLoad: function(options) {
    var id = options.id;
    this.setData({ userId: id })
  },

  onShow: function() {
    var that = this;
    var token = app.globalData.token;
    
    // 获取用户信息
    util.req('&m=member&a=getMemberInfo', { session3rd: token }, function(data) {
      if (data.flag == 1) {
        that.setData({
          userInfo: data.result
        })
      } else {
        qpp.login();
      }
    });
    // 获取文章
    util.req('&m=info&a=getInfoList', {
      session3rd: token,
      post: true,
      member_id: that.data.userId
    }, function (data) {
      if (data.flag == 1) {
        that.setData({
          list: data.result,
          isLoading: false
        })
      }
    });
  },

  focus: function(event) {
    if (!is_reg) {
      this.handleOpenLogin();
    }
  },

  handleOpenLogin: function () {
    this.setData({ isShowLogin: true });
  },

  handleCloseLogin: function (event) {
    this.setData({ isShowLogin: false });
    if (event.detail.is_reg) {
      this.getUserInfo();
    }
  },

  handleDelete: function(event) {
    var that = this;
    var items = this.data.list;
    var id = event.target.dataset.id;
    var index = items.findIndex(item => item.id == id)
    items.splice(index, 1);
    this.setData({ list: items });
  }
})