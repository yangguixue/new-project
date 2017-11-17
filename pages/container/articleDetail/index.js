var config = require('../../common/config.js');
Page({
  data: {
    item: {}
  },

  onLoad: function (options) {
    var that = this;
    wx.request({
      url: config.configUrl + '&m=info&a=getInfo',
      data: {
        id: options.id
      },
      success: function(res) {
        console.log(res)
        that.setData({
          item: res.data.result
        })
      }
    })
  },
  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '我是内容内容',
      imageUrl: '../../images/banner01.jpg',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },


})