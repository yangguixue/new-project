// pages/container/activity/ integration/index.js
var util = require('../../../../utils/util.js');
var app = getApp();
Page({
  data: {
    items: []
  },

  onLoad: function (options) {
    this.getWeeklySort();
  },

  getWeeklySort: function() {
    var that = this;
    util.req('&m=point&a=getWeeklySort', {
      session3rd: app.globalData.token
    }, function(data) {
      that.setData({
        items: data.result.list
      })
    })
  }

})