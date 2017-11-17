// pages/container/activity/myIntegration/index.js
var config = require('../../common/config.js');
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
    }]
  },

  onLoad: function (options) {
    var that = this;
    wx.request({
      url: config.configUrl + '&m=point&a=getDailyDetail', 
      success:function(res) {
        that.setData({
          dayItems: res.data.result
        })
      }
    });
    wx.request({
      url: config.configUrl + '&m=point&a=getWeeklyDetail',
      success: function (res) {
        that.setData({
          weekItems: res.data.result
        })
      }
    })
  },

  handleClickTab: function (event) {
    var dayItems = this.data.dayItems;
    var weekItems = this.data.weekItems;
    var items = event.target.dataset.id === '0' ? dayItems : weekItems;
    this.setData({
      tabId: event.target.dataset.id,
      items: items
    })
  }
})