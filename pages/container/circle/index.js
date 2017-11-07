//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    list: [{
      id: 0,
      username: '昵称昵称',
      userhead: '../../images/userhead.jpg',
      address: '惠民市场',
      content: '我是文章我是文章我是文章我是文章我是文章我是文章我是文章我是文章我是文章我是文章我是文章我是文章',
      images: [
        '../../images/userhead.jpg',
        '../../images/userhead.jpg',
        '../../images/userhead.jpg',
      ],
      isCollection: true,
      isZan: true
    }, {
      id: 1,
      username: '昵称昵称222',
      userhead: '../../images/userhead.jpg',
      address: '惠民市场222',
      content: '我是文章我是文章我是文章我是文章我是文章我是文章我是文章我是文章我是文章我是文章我是文章我是文章',
      images: [
        '../../images/userhead.jpg',
        '../../images/userhead.jpg',
      ],
      isCollection: false,
      isZan: false
    }],
    circle: [{
      id: 0,
      name: '王者',
      focus: 80,
      img: '../../images/quanziImg.png',
    }, {
      id: 2,
      name: '跳舞',
      focus: 50,
      img: '../../images/quanziImg.png',
      }, {
        id: 3,
        name: '你好',
        focus: 90,
        img: '../../images/quanziImg.png',
      }],
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
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
  }
})
