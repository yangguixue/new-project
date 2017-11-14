// pages/container/fans/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [],
    url: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var url = options.url == 'focus' ? 'http://localhost/index.php?g=qmcy&m=member&a=getFollows' : 'http://localhost/index.php?g=qmcy&m=member&a=getFans';
    console.log(url)
    wx.request({
      url: url,
      success: function(res) {
        that.setData({
          items: res.data.result,
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  handleFocus: function(event) {
    var that = this;
    var item = event.target.dataset.item;
    var title = item.action ? '想关注我吗？' : '真的要取消关注吗？';
    var content = item.action ? '您真是太有眼光啦~' : '我辣么美~继续关注下噻~';
    var newItem = Object.assign({}, item);
    newItem.action = !newItem.action;
    wx.showModal({
      title: title,
      content: content,
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: 'http://localhost/index.php?g=qmcy&m=member&a=setRelationship',
            data: newItem,
            success: function(res) {
              wx.showToast({
                title: res.data.msg,
                icon: 'success',
                duration: 2000
              })
            },
            fail: function(res) {
              wx.showToast({
                title: res.data.msg,
                icon: 'success',
                duration: 2000
              })
            }
          })
        } else if (res.cancel) {
          
        }
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})