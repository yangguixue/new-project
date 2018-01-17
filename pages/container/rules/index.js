// pages/container/rules/index.js
var util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nodes: '',
    name: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const name = options.name;
    const that = this;
    this.setData({ name });
    if (options.hasPay) { //是否支付过
      this.setData({ hasPay: options.hasPay });
    }

    if (options.is_owner) {
      this.setData({ is_owner: options.is_owner });
    }

    util.req('&m=ad&a=getIll', { name }, function(data) {
      if (data.flag == 1) {
        that.setData({ nodes: data.result.content });
      } else {
        wx.showModal({
          title: data.msg,
        })
      }
    })
  },

  handlePayment: function(event) {
    const hasPay = this.data.hasPay;
    console.log(hasPay)
    wx.navigateTo({
      url: '../payment/index?type=保证金&action=' + hasPay,
    })
  }
})