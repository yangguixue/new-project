var common = require('../../common/common.js');
var config = require('../../common/config.js');

const app = getApp()

Page({
  data: {
    userInfo: {},
    category: [],
    banners: [],
    address: '',
    list: [],
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
    var that = this;
    // 获取地址

    this.setData({
      address: common.getAddress()
    })

    // 请求banner
    wx.request({
      url: config.configUrl + '&m=ad&a=getAdsList',
      data: {
        recommended: 1
      },
      success: function (res) {
        that.setData({
          banners: res.data.result
        })
      }
    })

    //请求分类
    wx.request({
      url: config.configUrl + '&m=category&a=getCgList', 
      data: {
        type: 0
      },
      success: function (res) {
        that.setData({
          category: res.data.result
        })
      }
    })

    // 获取消息
    wx.request({
      url: config.configUrl + '&m=info&a=getInfoList',
      data: {
        type: false
      },
      success: function(res) {
        that.setData({
          list: res.data.result
        })
      }
    })

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
