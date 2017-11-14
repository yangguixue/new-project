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
    items: [],
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  onLoad: function () {
    var that = this;
    wx.request({
      url: 'http://localhost/index.php?g=qmcy&m=Category&a=getCgList', 
      data: {
        type: 1
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          items: res.data.result
        })
      }
    })
  }
})
