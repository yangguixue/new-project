// pages/container/message/index.js
const util = require('../../../utils/util.js');
const app = getApp();

const fetchMessage = function(that) {
  that.setData({ loadMore: true });
  util.req('&m=member&a=getMessages', {
    session3rd: app.globalData.token
  }, function (data) {
    if (data.flag == 1) {
      that.setData({
        list: data.result
      })
    } else {
      wx.showModal({
        title: data.msg,
      })
    }
    that.setData({ loadMore: false });
  })
};

Page({
  data: {
    
  },

  onLoad: function (options) {
    const that = this;
    fetchMessage(that);
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
    const that = this;
    fetchMessage(that);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },
})