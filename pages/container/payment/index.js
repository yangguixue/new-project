// pages/container/payment/index.js
var util = require('../../../utils/util.js');
var app = getApp();
Page({
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
    type: '',
  },

  onLoad: function (options) {
    const type = options.type;
    const that = this;
    this.setData({ type });
    if (options.type == '保证金') {
      this.setData({ num: 100 });
    }

    util.req('&m=member&a=getMemberInfo', {
      session3rd: app.globalData.token
    }, function(data) {
      if (data.flag == 1) {
        that.setData({ shop_id: data.result.shop_id});
      }
    })
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
    const item = {};
    const that = this;
    const shop_id = this.data.shop_id;
    item.total_fee = 1;
    item.session3rd = app.globalData.token;
    item.body = '息壤小镇-' + this.data.type;
    util.req('&m=payment&a=pay', item, function(data) {
      if (data.flag == 1) {
        wx.requestPayment({
          'timeStamp': data.result.timeStamp,
          'nonceStr': data.result.nonceStr,
          'package': data.result.package,
          'signType': data.result.signType,
          'paySign': data.result.paySign,
          'success': function (res) {
            wx.showToast({
              title: '支付成功',
            })

            setTimeout(() => {
              wx.navigateTo({
                url: '../shopDetail/index?id=' + shop_id,
              })
            }, 2000)
          },
          'fail': function (res) {
            wx.showToast({
              title: '支付失败',
            })
          }
        })
      } else {
        wx.showToast({
          title: data.msg,
        })
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