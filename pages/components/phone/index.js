// pages/components/phone/index.js
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

Component({

  properties: {
    isShowPhone: Boolean
  },

  data: {
    isSending: false,
    second: 60,
  },

  methods: {
    handleChange: function (e) {
      const phone = e.detail.value;
      this.setData({ phone });
    },

    getCode: function () {
      const phone = this.data.phone;
      const that = this;
      util.req('&m=member&a=sendSms', {
        session3rd: app.globalData.token,
        phone
      }, function (data) {
        if (data.flag == 1) {
          that.setData({ isSending: true });
          countdown(that);
        } else {
          wx.showToast({
            title: data.msg,
            image: '../../images/fail.svg'
          })
        }
      })
    },

    formSubmit: function (e) {
      const info = e.detail.value;
      const that = this;
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

      // that.triggerEvent('handleClosePhone');

      util.req('&m=member&a=checkVaild', info, function (data) {
        if (data.flag == 1) {
          wx.showToast({
            title: '绑定成功',
          })
          that.triggerEvent('handleSubmitPhone');
        } else {
          wx.showModal({
            content: data.msg,
          })
        }
      })
    },

  }
})
