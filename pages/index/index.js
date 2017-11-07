//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    category: [{
      id: 0,
      name: '热门推荐',
      icon: '../images/menu.png'
    }, {
      id: 1,
      name: '热门招聘',
      icon: '../images/menu.png'
    }, {
      id: 2,
      name: '热门招聘',
      icon: '../images/menu.png'
    }, {
      id: 3,
      name: '热门招聘',
      icon: '../images/menu.png'
    }, {
      id: 4,
      name: '热门招聘',
      icon: '../images/menu.png'
    }, {
      id: 5,
      name: '热门招聘',
      icon: '../images/menu.png'
    }, {
      id: 6,
      name: '热门招聘',
      icon: '../images/menu.png'
    }, {
      id: 7,
      name: '热门招聘',
      icon: '../images/menu.png'
    }, {
      id: 8,
      name: '热门招聘',
      icon: '../images/menu.png'
    }, {
      id: 9,
      name: '热门招聘',
      icon: '../images/menu.png'
    }],
    banners: {
      url: [{
        id: 0,
        url: '../images/banner01.jpg',
        link: 'www'
      }, {
        id: 1,
        url: '../images/banner02.jpg',
        link: 'www'
      }],
      indicatorDots: true,
      autoplay: true,
      interval: 5000,
      duration: 1000
    },
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
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
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
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
