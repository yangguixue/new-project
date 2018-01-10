// pages/container/circleList/index.js
const util = require('../../../utils/util.js');
const app = getApp();

const fetchCgList = function(that) {
  util.req('&m=Category&a=getCgList', {
    type: 1,
    session3rd: app.globalData.token
  }, function (data) {
    that.setData({
      items: data.result,
      isLoading: false
    })
  })
}

Page({
  data: {
    isLoading: true
  },

  onLoad: function (options) {
    var that = this;
    fetchCgList(that);
  },

})