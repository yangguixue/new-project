// pages/container/getPhone/index.js
var util = require('../../../utils/util.js');
var app = getApp();

function countdown(that) {
  var second = that.data.second;
  if (second == 0) {
    that.setData({
      isSending: false,
      second: 60,
    });
    return;
  }
  var time = setTimeout(function () {
    that.setData({
      second: second - 1
    });
    countdown(that);
  }
    , 1000)
}

Page({
  data: {
    second: 60,
    isSending: false,
    isLoading: false,
  },

  handleChange: function(e) {
    const phone = e.detail.value;
    this.setData({ phone });
  },

  getCode: function() {
    const phone = this.data.phone;
    const that = this;
    util.req('&m=member&a=sendSms', {
      session3rd: app.globalData.token,
      phone
    }, function(data) {
      if (data.flag == 1) {
        that.setData({ isSending: true });
        countdown(this);      
      } else {
        wx.showModal({
          title: data.msg,
        })
      }
    })
  },

  formSubmit: function(e) {
    const info = e.detail.value;
    info.session3rd = app.globalData.token;

    if (!info.phone) {
      wx.showModal({
        content: '请输入手机号',
      })
      return;
    }

    if (!info.validcode) {
      wx.showModal({
        content: '请输入验证码',
      })
      return;
    }

    this.setData({ isLoading: true });
    util.req('&m=member&a=checkVaild', info, function(data) {
      if (data.flag == 1) {
        wx.showToast({
          title: '绑定成功',
        })

        wx.navigateBack({
          delta: 1
        })
      } else {
        wx.showModal({
          content: data.msg,
        })
      }
      that.setData({ isLoading: false });
    })
  }
})