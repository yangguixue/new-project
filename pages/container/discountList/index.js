// pages/container/discountList/index.js
var util = require('../../../utils/util.js');
Page({
  data: {
    discount: [],
    isLoading: true
  },

  onLoad: function (options) {
    var that = this;
    util.getReq('&m=ad&a=getAdsList', {}, function(data) {
      if (data.flag == 1) {
        that.setData({
          discount: data.result,
          isLoading: false
        })
      } else {
        wx.showModal({
          title: data.msg
        })
        that.setData({
          isLoading: false
        })
      }
    })
  },

})