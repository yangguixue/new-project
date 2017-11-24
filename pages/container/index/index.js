var util = require('../../../utils/util.js');
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;

qqmapsdk = new QQMapWX({
  key: 'AAOBZ-DK53W-TSBR3-ONY3L-474I3-CMFGU'
});

const app = getApp()

Page({
  data: {
    userInfo: {},
    category: [],
    banners: [],
    address: '',
    list: [],
    isLoading: true,
  },
  onLoad: function () {
    var that = this;
    
    // 获取地理位置
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (res) {
            that.setData({ address: res.result.address_component.district })
          },
          fail: function (res) {
          },
          complete: function (res) {
          }
        });
      }
    })

    // 请求banner
    util.getReq('&m=ad&a=getAdsList', { recommended: 1 }, function(data) {
      if (data.flag == 1) {
        that.setData({
          banners: data.result
        })
      } else {
        util.errorTips(data.msg)
      }
    })

    //请求分类
    util.getReq('&m=category&a=getCgList', { type: 0 }, function (data) {
      if (data.flag == 1) {
        that.setData({
          category: data.result
        })
      } else {
        util.errorTips(data.msg);
      }
    })
  },

  onShow: function() {
    var that = this;
    // 获取消息
    util.getReq('&m=info&a=getInfoList', {
      type: false,
      session3rd: wx.getStorageSync('token')
    }, function (data) {
      if (data.flag == 1) {
        that.setData({
          list: data.result
        })
      } else {
        util.errorTips(data.msg);
      }
      that.setData({ isLoading: false })
    })
  }

})
