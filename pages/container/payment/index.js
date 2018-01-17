// pages/container/payment/index.js
var util = require('../../../utils/util.js');
var app = getApp();
Page({
  data: {
    price: [{
      id: 0,
      name: '168元/3个月',
      price: 16800
    }, {
      id: 1,
      name: '258元/半年',
      price: 25800
    }, {
      id: 2,
      name: '365元/年',
      price: 36500,
      isJian: true,
      checked: true
    }],
    num: 36500,
    type: '',
    action: '',
  },

  onLoad: function (options) {
    const type = options.type;
    const that = this;
    this.setData({ type });
    if (options.type == '保证金') {
      const action = options.action;
      this.setData({ num: 19800, action });
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
            wx.showModal({
              title: '支付失败',
            })
          }
        })
      } else {
        wx.showModal({
          title: data.msg,
        })
      }
      
    })
  },

  refund: function() {
    const shop_id = this.data.shop_id;
    wx.showModal({
      title: '确定要退回保证金吗？',
      content: '退回保证金您的店铺将被归类为无平台保障店铺，可能影响您店铺的口碑',
      success: function(res) {
        if (res.confirm) {
          util.req('&m=payment&a=refund', {
            session3rd: app.globalData.token
          }, function (data) {
            if (data.flag == 1) {
              wx.showModal({
                title: '退回成功',
                content: '您将会在1-3个工作日内收到退款，请耐心查收',
                success: function(res) {
                  wx.navigateTo({
                    url: '../shopDetail/index?id=' + shop_id,
                  })
                }
              })
            } else {
              wx.showModal({
                content: '退款失败'
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  },
})