// pages/container/report/index.js
var util = require('../../../utils/util.js');
var app = getApp();

Page({
  data: {
    item: {}
  },

  onLoad: function(options) {
    const item = this.data.item;
    item.type = options.type;
    item.id = options.id;
    this.setData({ item });
  },

  formSubmit: function (event) {
    const content = event.detail.value.content;
    const item = this.data.item;
    item.session3rd = app.globalData.token;
    item.content = content;
    if (!content) {
      wx.showModal({
        content: '请输入举报原因',
      })
      return;
    }
    util.req('&m=member&a=tipOff', item, function (data) {
      if (data.flag == 1) {
        wx.showToast({
          title: '举报成功',
        })
        wx.navigateBack({
          delta: 1
        })
      } else {
        wx.showModal({
          content: data.msg,
        })
      }
    })
  }
})