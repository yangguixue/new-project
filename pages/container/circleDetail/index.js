// pages/container/circleDetail/index.js
var config = require('../../common/config.js');
var util = require('../../../utils/util.js');
const app = getApp();
Page({
  data: {
    circle: {},
    articleList: [],
    isLoadding: true,
    isShowLogin: false,
  },

  onLoad: function (options) {
    var that = this;
    util.req('&m=Category&a=getCicleInfo', {
      cg_id: options.id,
      "session3rd": app.globalData.token
    }, function(data) {
      if (data.flag == 1) {
        that.setData({
          circle: data.result
        })
      }
    })
  },

  onShow: function() {
    var that = this;
    var circle = this.data.circle;
    util.req('&m=info&a=getInfoList', {
      cg_id: circle.cg_id,
      type: true,
      "session3rd": app.globalData.token
    }, function (data) {
      if (data.flag == 1) {
        that.setData({
          articleList: data.result,
          isLoading: false
        })
      }
    })
  },

  handleShowLogin: function(e) {
    this.setData({ isShowLogin: true })
  },

  handleCloseLogin: function(e) {
    this.setData({ isShowLogin: false })
  },

})