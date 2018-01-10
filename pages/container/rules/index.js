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
      console.log(options.hasPay)
      this.setData({ hasPay: options.hasPay });
    }

    if (options.is_owner) {
      this.setData({ is_owner: options.is_owner });
    }

    util.req('&m=ad&a=getIll', { name }, function(data) {
      if (data.flag == 1) {
        that.setData({ nodes: data.result.content });
      } else {
        wx.showToast({
          title: data.msg,
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },
})