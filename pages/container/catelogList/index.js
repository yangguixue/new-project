// pages/container/catelogList/index.js
var util = require('../../../utils/util.js');
var app = getApp();
var epage = app.globalData.epage;
var page = 0;

var fetchInfoList = function (that, lastid, cg_id) {
  that.setData({ loadMore: true });

  util.req('&m=info&a=getInfoList', {
    lastid,
    epage,
    cg_id: cg_id,
    session3rd: app.globalData.token
  }, function (data) {
    var list = that.data.list;
    if (data.flag == 1) {
      var len = data.result.length;
      if (lastid == 0) {
        if (len == 0) {
          that.setData({ listStatus: '还没有人发布消息，立刻抢占先机！', loadMore: false });
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
        that.setData({ listStatus: '我可是有底线的' });
      }
    }
    that.setData({
      loadMore: false
    })
    wx.stopPullDownRefresh();
  })
}

Page({
  data: {
    menu: [],
    tabId: '',
    optionId: '',
    banners: [],
    loadMore: false, // 加载更多
    isShowLogin: false
  },

  onLoad: function (options) {
    var id = options.id;
    var that = this;
    this.setData({ optionId: id });

    // 获取banner
    util.getReq('&m=ad&a=getAdsList', { recommended: 1 }, function (data) {
      if (data.flag == 1) {
        that.setData({
          banners: data.result
        })
      } else {
        util.errorTips(data.msg)
      }
    })

    // 获取tab
    util.req('&m=category&a=getCgList', {
      type: 0,
      parent_id: id
    }, function(data) {
      if (data.flag == 1) {
        const menu = data.result;
        const cg_id = menu.length > 0 ? menu[0].cg_id : options.id;
        that.setData({
          menu: menu,
          tabId: cg_id,
        })

        // 获取信息
        fetchInfoList(that, 0, cg_id);
      }
    })
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    var that = this;
    var tabId = this.data.tabId;
    that.setData({ listStatus: '' });
    fetchInfoList(that, 0, tabId)
  },

  //滚动到底部触发事件  
  onReachBottom: function (event) {
    let that = this;
    var list = this.data.list;
    var tabId = this.data.tabId;
    var id = list[list.length - 1].id;
    this.setData({ lastid: id });
    if (this.data.listStatus) return; // 没有更多了
    if (this.data.loadMore) return; // 禁止重复请求

    fetchInfoList(that, id, tabId);
  }, 

  handleClickTab: function(event) {
    var id = event.target.dataset.id;
    var that = this;
    this.setData({
      tabId: id,
      listStatus: '',
      list: []
    })
    fetchInfoList(that, 0, id);
  },

  handleOpenLogin: function () {
    this.setData({ isShowLogin: true });
  },

  handleCloseLogin: function (event) {
    var that = this;
    var cg_id = this.data.tabId;
    this.setData({ isShowLogin: false });
    if (app.globalData.is_reg) {
      fetchInfoList(that, 0, cg_id);
    }
  },

  handlePublish: function(event) {
    var id = this.data.optionId;
    if (!app.globalData.is_reg) {
      this.handleOpenLogin();
      return;
    }

    wx.navigateTo({
      url: '../release/index?type={{0}}&id=' + id,
    })
  }
})