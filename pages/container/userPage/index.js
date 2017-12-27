// pages/container/userPage/index.js
var util = require('../../../utils/util.js');
var app = getApp();
var epage = app.globalData.epage;
var page = 0;

var fetchInfoList = function (that, lastid) {
  that.setData({ loadMore: true });
  util.req('&m=info&a=getInfoList', {
    lastid,
    epage,
    session3rd: app.globalData.token,
    post: true,
    member_id: that.data.userId
  }, function (data) {
    var list = that.data.list;
    if (data.flag == 1) {
      var len = data.result.length;
      if (lastid == 0) {
        if (len == 0) {
          that.setData({ listStatus: '这里啥也没有' });
        } else {
          that.setData({ listStatus: '没有更多了' });
        }
        that.setData({ list: data.result, loadMore: false })
        return;
      } else {
        for (var i = 0; i < len; i++) {
          list.push(data.result[i]);
        }
        that.setData({
          list,
          listStatus: '没有更多了',
          loadMore: false
        })
        page++
      }
    }
    that.setData({
      loadMore: false
    })
  })
}

Page({
  data: {
    userInfo: {},
    userId: '',
    isShowLogin: false,
    scrollTop: 0,
    scrollHeight: 0,
    loadMore: false, // 加载更多
  },

  onLoad: function(options) {
    var that = this;
    var id = options.id;
    this.setData({ userId: id });

    // 获取文章列表
    fetchInfoList(that, 0);

    // 获取屏幕宽度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
  },

  onShow: function() {
    var that = this;
    // var lastid = this.data.lastid ? this.data.lastid : 0;
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
    // fetchInfoList(that, lastid);
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

  handleOpenLogin: function (event) {
    this.setData({ isShowLogin: true });
  },

  handleCloseLogin: function (event) {
    this.setData({ isShowLogin: false });
  },

  searchScrollLower: function (event) {
    let that = this;
    var list = this.data.list;
    var id = list[list.length - 1].id;
    this.setData({ lastid: id });
    if (this.data.listStatus) return; // 没有更多了
    if (this.data.loadMore) return; // 禁止重复请求

    fetchInfoList(that, id);
  } 
})