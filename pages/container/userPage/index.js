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
          that.setData({ listStatus: '这里啥也没有', loadMore: false });
          return;
        }
        that.setData({ list: data.result });
      } else {
        for (var i = 0; i < len; i++) {
          list.push(data.result[i]);
        }
        that.setData({ list })
        page++
      }
      if (len < epage) {
        that.setData({ listStatus: '我是有底线的' });        
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
    fetchInfoList(that, 0);
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

  onPullDownRefresh: function () {
    const that = this;
    that.setData({ listStatus: '' });
    fetchInfoList(that, 0);
  },

  onReachBottom: function (event) {
    let that = this;
    var list = this.data.list;
    var id = list[list.length - 1].id;
    this.setData({ lastid: id });
    if (this.data.listStatus) return; // 没有更多了
    if (this.data.loadMore) return; // 禁止重复请求

    fetchInfoList(that, id);
  } 
})