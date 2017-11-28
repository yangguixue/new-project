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
    var item = { session3rd: token };
    if (this.data.userId) {
      item.member_id = this.data.userId;
    }
    
    // 获取用户信息
    util.req('&m=member&a=getMemberInfo', item, function(data) {
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

  handleFocus: function(event) {
    var item = event.currentTarget.dataset.item;
    if (!app.globalData.is_reg) {
      this.handleOpenLogin();
      return;
    }

    app.handleFocus(item).then((data) => {
      this.setData({ userInfo: data })
    })
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