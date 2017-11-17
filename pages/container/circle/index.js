//index.js
//获取应用实例
var config = require('../../common/config.js');
const app = getApp()

Page({
  data: {
    items: [],
    articlelist: [],
    isLoading: true,
  },

  onLoad: function () {
    var that = this;
    wx.request({
      url: config.configUrl + '&m=Category&a=getCgList', 
      data: {
        type: 1
      },
      success: function (res) {
        that.setData({
          items: res.data.result,
        })
      }
    })

    wx.request({
      url: config.configUrl + '&m=info&a=getInfoList',
      data: {
        type: true
      },
      success: function(res) {
        that.setData({
          articleList: res.data.result,
          isLoading: false
        })
      }
    })
  }
  
})
