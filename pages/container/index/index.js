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
var fetchInfoList = function(that, lastid) {
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
          that.setData({ listStatus: '这里啥也没有' });
        } else {
          that.setData({ listStatus: '没有更多了' });
        }
        that.setData({ list: data.result, loadMore: false })
        return;
      } else {
        for (var i = 0; i < len; i++) {
          list.push(data.result[i]);
        }
        that.setData({
          list,
          listStatus: '没有更多了',
          loadMore: false
        })
        page++
      }
    }
    that.setData({
      isLoading: false,
      loadMore: false
    })
  })
}

Page({
  data: {
    category: [], // 分类
    banners: [], 
    address: '',  // 首页显示地址
    isLoading: false, // 是否正在加载
    isShowLogin: false,
    loadMore: false,
    scrollTop: 0,
    scrollHeight: 0,
  },
  onLoad: function (options) {
    var that = this;

    // 展示添加桌面气泡
    this.setData({
      isShowAddDesk: wx.getStorageSync('isShowAddDesk'),
    });

    // 登录成功之后再请求列表
    app.login().then((res) => {
      fetchInfoList(that, 0);
    })

    // 获取屏幕宽度
    wx.getSystemInfo({
      success:function(res) {
        that.setData({
          scrollHeight:res.windowHeight
        });
      }
    });
    
    // 获取地理位置
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log(333)
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

  onPullDownRefresh: function () {
    // do somthing
    var that = this;
    fetchInfoList(that, 0) 
    wx.startPullDownRefresh({
      success: function() {
        wx.stopPullDownRefresh()
      }
    })
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

  // handleDelete: function (event) {
  //   var that = this;
  //   var items = this.data.list;
  //   var id = event.target.dataset.id;
  //   var index = items.findIndex(item => item.id == id)
  //   items.splice(index, 1);
  //   this.setData({ list: items });
  // },

  //滚动到底部触发事件  
  searchScrollLower: function (event) {
    let that = this;
    var list = this.data.list;
    var id = list[list.length-1].id;
    this.setData({ lastid: id });
    if (this.data.listStatus) return; // 没有更多了
    if (this.data.loadMore) return; // 禁止重复请求
    fetchInfoList(that, id);
  },

  // 点赞或者收藏文章的回调
  changeList: function(event) {
    var list = this.data.list;
    var id = event.detail.id;
    var index = list.findIndex(item => item.id == id);
    list[index] = event.detail;
    console.log(list)
    this.setData({ list });
  },  

  // 隐藏添加到桌面
  hideAddDesk: function() {
    wx.removeStorageSync('isShowAddDesk')
    this.setData({
      isShowAddDesk: false
    });
  }
})
