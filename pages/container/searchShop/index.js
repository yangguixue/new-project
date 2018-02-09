// pages/container/searchShop/index.js
var util = require('../../../utils/util.js');
var app = getApp();
var epage = app.globalData.epage;
var page = 0;

var fetchShopList = function (that, lastid) {
  that.setData({ loadMore: true });
  const filters = that.data.filters;
  filters.kword = that.data.searchValue;
  filters.lastid = lastid;
  filters.epage = epage;
  util.req('&m=shop&a=searchShopList', filters, function (data) {
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
        that.setData({ listStatus: '没有更多了' });
      }
    }
    that.setData({
      loadMore: false,
      filters
    })
  })
}

Page({
  data: {
    list: [],
    searchValue: '', //要搜索的内容
    loadMore: false,
    filters: {},
    listStatus: '——— 请输入要查询的店家或者商品 ———'
  },

  // 搜索商家
  handleChange: function (event) {
    const searchValue = event.detail.value;
    this.setData({ searchValue });
  },

  handleSearch: function (event) {
    var that = this;
    var kword = this.data.searchValue;
    fetchShopList(that, 0);
  },

  onReachBottom: function (event) {
    let that = this;
    var list = this.data.list;
    var id = list[list.length - 1].id;
    this.setData({ lastid: id });
    if (this.data.listStatus == '没有更多了') return; // 没有更多了
    if (this.data.loadMore) return; // 禁止重复请求

    fetchShopList(that, id);
  }
})