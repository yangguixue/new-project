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
    menu: [],
    tabId: '',
    banners: [],
    isLoading: true,
    scrollTop: 0,
    scrollHeight: 0,
    loadMore: false, // 加载更多
  },

  onLoad: function (options) {
    var id = options.id;
    var that = this;

    // 获取屏幕宽度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });

    // 获取banner
    util.req('&m=ad&a=getAdsList', {
      cg_id: id,
      istop: 1
    }, function(data) {
      if (data.flag == 1) {
        that.setData({ banners: data.result })
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
        var lastid = that.data.lastid ? that.data.lastid : 0;
        fetchInfoList(that, lastid, cg_id);
      }
    })
  },

  handleClickTab: function(event) {
    var id = event.target.dataset.id;
    var that = this;
    this.setData({
      tabId: id,
      isLoading: true
    })
    fetchInfoList(that, 0, id);
  },

  //滚动到底部触发事件  
  searchScrollLower: function (event) {
    let that = this;
    var list = this.data.list;
    var tabId = this.data.tabId;
    var id = list[list.length - 1].id;
    this.setData({ lastid: id });
    if (this.data.listStatus) return; // 没有更多了
    if (this.data.loadMore) return; // 禁止重复请求

    fetchInfoList(that, id, tabId);
  } 
})