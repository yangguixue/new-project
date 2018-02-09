// pages/container/shopList/index.js
var util = require('../../../utils/util.js');
var app = getApp();
var token = app.globalData.token;
var epage = app.globalData.epage;
var page = 0;

var fetchShopList = function (that, lastid) {
  that.setData({ loadMore: true });
  const name = that.data.name;
  const filters = that.data.filters;
  if (name == 'job') {
    filters.is_recruit = true;
  } else {
    filters.is_new = true;
  }
  filters.lastid = lastid;
  filters.epage = epage;
  util.req('&m=shop&a=getShopList', filters, function (data) {
    var list = that.data.list;
    if (data.flag == 1) {
      var len = data.result.length;
      if (lastid == 0) {
        if (len == 0) {
          that.setData({ listStatus: '该行业稀缺，抓住时机，马上入驻，别人看到的就是你', loadMore: false, list: data.result });
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
      loadMore: false,
      filters
    })
    wx.stopPullDownRefresh();
  })
}

Page({
  data: {
    loadMore: false,
    listStatus: '',
    name: '',
    filters: {}
  },

  onLoad: function (options) {
    var name = options.name;
    this.setData({ name });
  },

  onShow: function() {
    var that = this;
    fetchShopList(that, 0);
  },

  openDiscount: function () {
    wx.switchTab({
      url: '../../container/discountList/index'
    })
  },

  onPullDownRefresh: function () {
    const that = this;
    this.setData({ listStatus: '' });
    fetchShopList(that, 0);
  },


  onReachBottom: function (event) {
    let that = this;
    var list = this.data.list;
    var id = list[list.length - 1].id;
    this.setData({ lastid: id });
    if (this.data.listStatus) return; // 没有更多了
    if (this.data.loadMore) return; // 禁止重复请求

    fetchShopList(that, id);
  }
})                                                                                                                                                                                                                                                                                                                                        