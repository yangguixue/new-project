// pages/container/shopList/index.js
var util = require('../../../utils/util.js');

Page({
  data: {
    items: [],
    isLoading: true
  },

  onLoad: function (options) {
    var that = this;
    util.getReq('&m=shop&a=getShopList', {}, function (data) {
      that.setData({
        item: data.result,
        isLoading: false
      })
    })
  },

})