// pages/container/fans/index.js
var config = require('../../common/config.js');
Page({
  data: {
    items: [],
    url: '',
    isLoading: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var url = options.url == 'focus' ? config.configUrl + '&m=member&a=getFollows' : config.configUrl + '&m=member&a=getFans';
    wx.request({
      url: url,
      success: function(res) {
        that.setData({
          items: res.data.result,
        })
      },
      fail: function(res) {},
      complete: function(res) {
        that.setData({
          isLoading: false
        })
      },
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
            url: config.configUrl + '&m=member&a=setRelationship',
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
  }
})