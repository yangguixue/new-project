// pages/container/userPage/index.js
var config = require('../../common/config.js');

Page({
  data: {
    list: [],
    isLoading: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   var that = this;
   // 个人信息
   wx.request({
     url: config.configUrl + '&m=member&a=getMemberInfo',
     success: function (res) {
       that.setData({
         userInfo: res.data.result
       })
     }
   })
   // 个人文章列表
   wx.request({
     url: config.configUrl + '&m=info&a=getInfoList',
     data: {
       post: true,
       member_id: options.id
     },
     success: res => {
      that.setData({
        list: res.data.result
      })
     },
     complete: res => {
       that.setData({
         isLoading: false
       })
     }
   })
  },

  focus: function() {
    
  }
})