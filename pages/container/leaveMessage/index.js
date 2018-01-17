// pages/container/leaveMessage/index.js
var util = require('../../../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  formSubmit: function (e) {
    const info = e.detail.value;
    info.session3rd = app.globalData.token;
    if (!app.globalData.token) {
      wx.showModal({
        content: '请登录后操作',
      })
      return;
    }

    if (!info.info) {
      wx.showModal({
        content: '请输入信息'
      })
      return;
    }

    util.req('&m=feedback&a=addFeedback', info, function(data) {
      if (data.flag == 1) {
        wx.showModal({
          title: '提交成功',
          content: '谢谢您的反馈，被采纳建议将会收到红包哦~',
          success: function(res) {
            wx.navigateBack({
              delta: 1
            })
          }
        })
      } else {
        wx.showModal({
          content: data.msg
        })
      }
    })
  },

})