// pages/container/focus/index.js
var util = require('../../../utils/util.js');
var app = getApp();

// 获取文章列表
const fetchInfoList = function(that) {
  util.req('&m=info&a=getInfoList', {
    star: true,
    session3rd: app.globalData.token
  }, function (data) {
    if (data.flag == 1) {
      that.setData({
        items: data.result
      })
    }
    that.setData({
      isLoading: false
    })
  })
}

// 获取店铺列表
const fetchShopList = function(that) {
  util.req('&m=shop&a=getShopList', {
    session3rd: app.globalData.token
  }, function (data) {
    if (data.flag == 1) {
      that.setData({
        items: data.result
      })
    }
    that.setData({
      isLoading: false
    })
  })
}

Page({
  data: {
    isLoading: true,
    menu: [{
      id: 0,
      name: '文章收藏'
    }, {
      id: 1,
      name: '店铺收藏'
    }],
    tabId: 0
  },

  onLoad: function (options) {
    var that = this;
    fetchInfoList(that);
  },

  handleClickTab: function(event) {
    const that = this;
    const id = event.target.dataset.id;
    that.setData({ items: null, isLoading: true });
    if (id == 0) {
      fetchInfoList(that);
    } else {
      fetchShopList(that);
    }
    this.setData({ tabId: id });    
  }
})