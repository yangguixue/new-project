// pages/container/discountDetail/index.js
var util = require('../../../utils/util.js');
var WxParse = require('../../../wxParse/wxParse.js');
var app = getApp();

Page({
  data: {
    discountDetail:　{},
    isLoading: true,
  },

  onLoad: function (options) {
    var that = this;
    util.getReq('&m=ad&a=getAdInfo', {id: options.id }, function(res) {
      that.setData({
        discountDetail: res.result,
        isLoading: false
      })
      WxParse.wxParse('post_content', 'html', res.result.post_content, that, 5);
    })

  },

  goIndex: function() {
    wx.switchTab({
      url: '../index/index',
    })
  },
  
  handleCall: function() {
    wx.makePhoneCall({
      phoneNumber: this.data.discountDetail.store_phone
    })
  },

  onShareAppMessage: function (options) {
    const info = this.data.discountDetail;
    const id = info.id;
    return {
      title: info.post_title,
      path: '/pages/container/discountDetail/index?id=' + id + '&userId=' + app.globalData.token,
      success(e) {
        wx.showShareMenu({
          // 要求小程序返回分享目标信息
          withShareTicket: true
        });
      },
      fail(e) {
      },
      complete() { }
    }
  }
})