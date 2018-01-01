// pages/container/circleList/index.js
const util = require('../../../utils/util.js');
const app = getApp();

Page({
  data: {
    items: [],
    isLoading: true
  },

  onLoad: function (options) {
    var that = this;
    util.req('&m=Category&a=getCgList', {
      type: 1,
      session3rd: app.globalData.token
    }, function(data) {
      that.setData({
        items: data.result,
        isLoading: false
      })
    })
  },

})