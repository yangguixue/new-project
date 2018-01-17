//index.js
//获取应用实例
var util = require('../../../utils/util.js');
var app = getApp();
var epage = app.globalData.epage;
var page = 0;

var fetchInfoList = function (that, lastid) {
  that.setData({ loadMore: true });
  util.req('&m=info&a=getInfoList', {
    lastid,
    epage,
    type: true,
    session3rd: app.globalData.token
  }, function (data) {
    var list = that.data.list;
    if (data.flag == 1) {
      var len = data.result.length;
      
      if (lastid == 0) { //首次加载或者顶部刷新lastid为0
        if (len == 0) { // 第一次加载数组为空
          that.setData({ listStatus: '这里啥也没有', loadMore: false });
          return;
        }
        that.setData({ list: data.result })
      } else { // lastid不为空时
        for (var i = 0; i < len; i++) {
          list.push(data.result[i]);
        }
        that.setData({ list })
        
        page++
      }
      if (len < epage) {
        that.setData({ listStatus: '我可是有底线的' });
      }
    }
    that.setData({
      loadMore: false
    })
    wx.stopPullDownRefresh()
  })
}

var fetchShopList = function(that) {
  util.req('&m=Category&a=getCgList', { type: 1 }, function (data) {
    if (data.flag == 1) {
      that.setData({
        items: data.result,
      })
    } else {
      wx.showToast({
        title: data.msg,
        image: '../../imgaes/fail.svg'
      })
    }
  })
  wx.stopPullDownRefresh();
}

Page({
  data: {
    items: [], // 圈子列表
    isShowLogin: false,
    loadMore: false, // 加载更多
  },

  onLoad: function () {
    var that = this;
    fetchInfoList(that, 0);    
    
    // 获取圈子分类
    fetchShopList(that)
  },

  onPullDownRefresh: function () {
    const that = this;
    that.setData({ listStatus: '' });
    fetchInfoList(that, 0);
    fetchShopList(that);
  },

  //滚动到底部触发事件
  onReachBottom: function () {
    let that = this;
    var list = this.data.list;
    var id = list[list.length - 1].id;
    this.setData({ lastid: id });
    if (this.data.listStatus) return; // 没有更多了
    if (this.data.loadMore) return; // 禁止重复请求
    fetchInfoList(that, id);
  },

  handleOpenLogin: function (event) {
    this.setData({ isShowLogin: true });
  },

  handleCloseLogin: function (event) {
    this.setData({ isShowLogin: false });
  },

})
