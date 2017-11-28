// pages/container/activity/myIntegration/index.js
var util = require('../../../../utils/util.js');
var app = getApp();

Page({
  data: {
    dayItems: [],
    weekItems: [],
    items:[],
    tabId: '0',
    tabs: [{
      id: 0,
      name: '今日明细'
    }, {
      id: 1,
      name: '本周明细'
    }],
    points: {}
  },

  onLoad: function (options) {
    var that = this;
    this.getDailyDetail().then((res) => {
      this.setData({
        items: res
      })
    });
    this.getWeeklyDetail();
    this.getPointsOverview();
  },

  getDailyDetail: function() {
    var that = this;
    return new Promise(function(resolve, reject) {
      util.req('&m=point&a=getDailyDetail', {
        session3rd: app.globalData.token
      }, function (data) {
        that.setData({
          dayItems: data.result
        })
        resolve(data.result);
      })
    })
  },

  getWeeklyDetail: function() {
    var that = this;
    util.req('&m=point&a=getWeeklyDetail', {
      session3rd: app.globalData.token
    }, function (data) {
      that.setData({
        weekItems: data.result
      })
    })
  },

  getPointsOverview: function() {
    var that = this;
    util.req('&m=point&a=getPointsOverview', {
      session3rd: app.globalData.token
    }, function (data) {
      console.log(data)
      that.setData({
        points: data.result
      })
    })
  },

  handleClickTab: function (event) {
    var dayItems = this.data.dayItems;
    var weekItems = this.data.weekItems;
    var items = event.target.dataset.id === 0 ? dayItems : weekItems;
    this.setData({
      tabId: event.target.dataset.id,
      items: items
    })
  }
})