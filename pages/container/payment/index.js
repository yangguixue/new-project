// pages/container/payment/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    price: [{
      id: 0,
      name: '18元/7天',
      price: 18
    }, {
      id: 1,
      name: '18元/7天',
      price: 45
    }, {
      id: 2,
      name: '18元/7天',
      price: 119
    }, {
      id: 3,
      name: '18元/7天',
      price: 199
    }, {
      id: 4,
      name: '18元/7天',
      price: 365,
      isJian: true,
      checked: true
    }],
    num: 365,
    type: 'bzj'
  },

  onLoad: function (options) {
    const type = options.type;
    this.setData({ type });
  },

  handleSelect: function(event) {
    const id = event.target.dataset.item.id;
    const num = event.target.dataset.item.price;
    const price = this.data.price;
    price[id].checked = true;
    for (var i=0; i < price.length; i++) {
      if (price[i].checked && i != id) {
        delete price[i].checked;
      }
    }
    
    this.setData({
      price,
      num,
    });
  },

  payment: function() {
    console.log(2)
    wx.requestPayment({
      'timeStamp': '',
      'nonceStr': '',
      'package': '',
      'signType': 'MD5',
      'paySign': '',
      'success': function (res) {
      },
      'fail': function (res) {
      }
    })
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