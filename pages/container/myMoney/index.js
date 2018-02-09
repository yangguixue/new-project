// pages/container/myMoney/index.js
const util = require('../../../utils/util.js');
const app = getApp();

const fetchWallet = function(that) {
  util.req('&m=member&a=getWallet', {
    session3rd: app.globalData.token
  }, function (data) {
    if (data.flag == 1) {
      that.setData({ money: data.result, list: data.result.ly_list });
    } else {
      wx.showModal({
        content: data.msg,
      })
    }
  })
}

Page({
  data: {
    tabId: 0,
    money: {}
  },

  handleTab: function(event) {
    const tabId = event.target.dataset.id;
    const money = this.data.money;
    const list = tabId == 0 ? money.ly_list : money.tx_list;
    this.setData({ tabId, list })
  },

  handleGetMoney: function() {
    const that = this;
    util.req('&m=payment&a=enchashment', {
      session3rd: app.globalData.token
    }, function(data) {
      if (data.flag == 1) {
        wx.showModal({
          title: '提现成功',
          content: '提现金额将会在1~3个工作日内打到您的微信零钱包，请注意查收!'
        })
        fetchWallet(that);
      } else {
        wx.showModal({
          content: data.msg
        })
      }
    })
  },

  onShow: function () {
    const that = this;
    fetchWallet(that);
  }
})