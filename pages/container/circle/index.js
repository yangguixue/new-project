//index.js
//获取应用实例
var util = require('../../../utils/util.js');
const app = getApp()

Page({
  data: {
    items: [],
    articlelist: [],
    isLoading: true,
  },

  onLoad: function () {
    var that = this;
    util.req('&m=Category&a=getCgList', { type: 1 }, function(data){
      if (data.flag == 1) {
        that.setData({
          items: data.result,
        })
      } else {
        wx.showToast({
          title: data.msg,
          duration: 2000
        })
      }
    })
  },

  onShow: function() {
    var that = this;
    var token = app.globalData.token;
    util.req('&m=info&a=getInfoList', { type: true, session3rd: token }, function (data) {
      if (data.flag == 1) {
        that.setData({
          articleList: data.result,
        })
      } else {
        wx.showToast({
          title: data.msg,
          duration: 2000
        })
      }
      that.setData({
        isLoading: false,
      })
    })
  }
  
})
