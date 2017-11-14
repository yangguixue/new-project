// pages/container/activity/myIntegration/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dayItems: [],
    weekItems: [],
    items:[],
    tabId: '0',
    tabs: [{
      id: 0,
      name: '今日明细'
    }, {
      id: 1,
      name: '本周明细'
    }]
  },

  /** 
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: 'http://localhost/index.php?g=qmcy&m=point&a=getDailyDetail', 
      success:function(res) {
        that.setData({
          dayItems: res.data.result
        })
      }
    });
    wx.request({
      url: 'http://localhost/index.php?g=qmcy&m=point&a=getWeeklyDetail',
      success: function (res) {
        that.setData({
          weekItems: res.data.result
        })
      }
    })
  },

  handleClickTab: function (event) {
    var dayItems = this.data.dayItems;
    var weekItems = this.data.weekItems;
    var items = event.target.dataset.id === '0' ? dayItems : weekItems;
    this.setData({
      tabId: event.target.dataset.id,
      items: items
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
  
  }


})