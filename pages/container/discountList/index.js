// pages/container/discountList/index.js
var util = require('../../../utils/util.js');
var app = getApp();
var epage = 3;
var page = 0;

const fetchAdList = function(that, lastid) {
  that.setData({ loadMore: true });
  util.getReq('&m=ad&a=getAdsList', {
    lastid,
    epage,
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
    } else {
      wx.showModal({
        title: data.msg
      })
    }
    that.setData({
      loadMore: false
    })
  })
}

Page({
  data: {
    loadMore: false, // 加载更多
  },

  onLoad: function (options) {
    var that = this;
    fetchAdList(that, 0);
  },

  onPullDownRefresh: function () {
    const that = this;
    that.setData({ listStatus: '' });
    fetchAdList(that, 0);
  },

  //滚动到底部触发事件
  onReachBottom: function () {
    let that = this;
    var list = this.data.list;
    var id = list[list.length - 1].id;
    this.setData({ lastid: id });
    if (this.data.listStatus) return; // 没有更多了
    if (this.data.loadMore) return; // 禁止重复请求
    fetchAdList(that, id);
  },

})