var util = require('../../../utils/util.js');
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
var app = getApp();
var page = 0;
var epage = app.globalData.epage;

qqmapsdk = new QQMapWX({
  key: 'AAOBZ-DK53W-TSBR3-ONY3L-474I3-CMFGU'
});

// 获取消息
var fetchInfoList = function (that, lastid) {
  that.setData({ loadMore: true });
  util.req('&m=info&a=getInfoList', {
    lastid,
    epage,
    type: false,
    session3rd: app.globalData.token
  }, function (data) {
    var list = that.data.list;
    if (data.flag == 1) {
      var len = data.result.length;
      if (lastid == 0) {
        if (len == 0) {
          that.setData({ listStatus: '这里啥也没有', loadMore: false });
          return;
        }
        that.setData({ list: data.result })
      } else {
        for (var i = 0; i < len; i++) {
          list.push(data.result[i]);
        }
        that.setData({ list })
        page++
      }
      if (len < epage) {
        that.setData({ listStatus: '我是有底线的' });
      }
    }
    that.setData({
      loadMore: false
    })
    wx.stopPullDownRefresh();
  })
};

var fetchBanner = function(that) {
  util.getReq('&m=ad&a=getAdsList', { recommended: 1 }, function (data) {
    if (data.flag == 1) {
      that.setData({
        banners: data.result
      })
    } else {
      util.errorTips(data.msg)
    }
  })
  wx.stopPullDownRefresh();
}

var fetchMoney = function (that, session3rd) {
  // 请求是否领过红包
  util.getReq('&m=member&a=isRedp', { session3rd }, function (data) {
    if (data.flag == 1) {
      that.setData({
        isRedp: data.result,
        HideHongbaoMask:  data.result
      })
    } else {
      util.errorTips(data.msg);
    }
  })
}

Page({
  data: {
    category: [], // 分类
    banners: [], 
    address: '正在定位...',  // 首页显示地址
    isLoading: false, // 是否正在加载
    isShowLogin: false,
    loadMore: false,
    shops: [],
    list: [],
    isRedp: true, //是否获取过红包
    HideHongbaoMask: true,
    showHongbao: false, //拆红包展示
    closeBigHonebao: false,
    money: ''
  },
  onLoad: function (options) {
    var that = this;

    // 展示添加桌面气泡
    this.setData({
      isShowAddDesk: wx.getStorageSync('isShowAddDesk')
    })

    app.isUnreadReadyCallback = res => {
      that.setData({ hasUnread: res });
    }

    if (app.globalData.token) {
      fetchInfoList(that, 0, app.globalData.token);
      fetchMoney(that, app.globalData.token);
    } else {
      app.userInfoReadyCallback = res => {
        fetchInfoList(that, 0, res.reset.session3rd);
        fetchMoney(that, res.reset.session3rd);
      }
    }

    if (app.globalData.address) {
      const address = app.globalData.address == '获取地理位置失败' ? '获取地理位置失败' : app.globalData.address.address_component.district;
      that.setData({ address });
    } else {
      app.isAddressReadyCallback = res => {
        const address = res == '获取地理位置失败' ? '获取地理位置失败' : res.address_component.district;
        that.setData({ address });
      }
    }

    // 请求banner
    fetchBanner(that);

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

    // 获取店铺
    util.req('&m=shop&a=getShopList', {}, function (data) {
      const array = data.result;
      const shops = array.slice(0, 3);
      that.setData({ shops });
    })
  },

  onShow: function() {
    var that = this;
    if (app.globalData.token) {
      util.req('&m=member&a=isUnread', {
        session3rd: app.globalData.token
      }, function (data) {
        if (data.flag == 1 && data.unread_num > 0) {
          app.globalData.hasUnread = true;
          that.setData({ hasUnread: true });
        } else {
          app.globalData.hasUnread = false;
          that.setData({ hasUnread: false });
        }
      })
    }
  }, 

  chooseLocation: function () {
    const address = this.data.address;
    const that = this;
    wx.chooseLocation({
      success: function (res) {
        wx.showLoading({
          title: '正在更新地址...',
        })
        // 重新选择地址
        app.getLocation(that, res.latitude, res.longitude).then((addr) => {
          that.setData({
            address: addr.result.ad_info.district
          })
          wx.hideLoading();
        })
      }
    })
  },


  openMap: function () {
    const that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              that.chooseLocation()
            },
            fail() {
              wx.showModal({
                cancelText: '知道了',
                confirmText: '去设置',
                content: '手动设置地理位置',
                success: function (res) {
                  if (res.confirm) {
                    wx.openSetting({
                      success: (res) => {
                        res.authSetting = {
                          "scope.userLocation": true
                        }
                        that.chooseLocation();
                      }
                    })
                  }
                }
              })
            }
          })
        } else {
          that.chooseLocation();
        }
      }
    })
  },

  getMoney:  function() {
    var that = this;
    util.req('&m=member&a=redPacket', { session3rd: app.globalData.token }, function (data) {
      const money = data.result;
      that.setData({ money, isRedp: true, showHongbao: true });
    })
  },

  onPullDownRefresh: function () {
    var that = this;
    that.setData({ listStatus: '' });
    fetchInfoList(that, 0);
    fetchBanner(that); 
    util.req('&m=shop&a=getShopList', {}, function (data) {
      const array = data.result;
      const shops = array.slice(0, 3);
      that.setData({ shops });
    })
    wx.stopPullDownRefresh();
  },


  //滚动到底部触发事件  
  onReachBottom: function (event) {
    let that = this;
    var list = this.data.list;
    if (list.length != 0) {
      var id = list[list.length - 1].id;
      this.setData({ lastid: id });
    }
    
    if (this.data.listStatus) return; // 没有更多了
    if (this.data.loadMore) return; // 禁止重复请求
    fetchInfoList(that, id);
  },

  handleOpenLogin: function () {
    this.setData({ isShowLogin: true });
  },

  handleCloseLogin: function (event) {
    var that = this;
    this.setData({ isShowLogin: false });
    if (app.globalData.is_reg) {
      fetchInfoList(that, 0);
    }
  },

  handleMore: function(event) {
    wx.switchTab({
      url: '../shopList/index',
    })
  },

  // 开店
  creatShop: function() {
    const that = this;
    wx.showLoading({
      title: '请稍等...',
    })
    if (!app.globalData.is_reg) {
      that.handleOpenLogin();
      wx.hideLoading();
      return;
    }

    util.req('&m=shop&a=getShopId', {
      session3rd: app.globalData.token
    }, function (data) {
      if (data.flag == 1) {
        if (data.result) {
          wx.navigateTo({
            url: '../shopDetail/index?id=' + data.result,
          })
        } else {
          wx.navigateTo({
            url: '../creatShop/index',
          })
        }
      } else {
        wx.showModal({
          content: data.msg
        })
      }
      wx.hideLoading();
    })
  },

  // 点赞或者收藏文章的回调
  changeList: function(event) {
    var list = this.data.list;
    var id = event.detail.id;
    var index = list.findIndex(item => item.id == id);
    list[index] = event.detail;
    this.setData({ list });
  },  

  // 隐藏添加到桌面
  hideAddDesk: function() {
    wx.removeStorageSync('isShowAddDesk')
    this.setData({
      isShowAddDesk: false
    });
  },

  onShareAppMessage: function (res) {
    return {
      title: '2018更智能的便民信息发布平台，面向全城，推广神器',
      path: '/pages/container/index/index?userId=' + app.globalData.token,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  //开启红包
  openHongbao: function () {
    this.setData({ HideHongbaoMask: false })
  },

  //关掉红包
  closeHongbao: function() {
    this.setData({ HideHongbaoMask: true })
  }
})
