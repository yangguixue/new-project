// pages/container/circleDetail/index.js
var config = require('../../common/config.js');
var util = require('../../../utils/util.js');
var app = getApp();
var epage = app.globalData.epage;
var page = 0;

var fetchInfoList = function (that, lastid) {
  var circle = that.data.circle;
  that.setData({ loadMore: true });
  util.req('&m=info&a=getInfoList', {
    lastid,
    epage,
    cg_id: circle.cg_id,
    type: true,
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
      loadMore: false
    })
  })
}

Page({
  data: {
    circle: {},
    isLoadding: true,
    isShowLogin: false,
    scrollTop: 0,
    scrollHeight: 0,
    loadMore: false, // 加载更多
  },

  onLoad: function (options) {
    var that = this;
    fetchInfoList(that, 0);
    
    // 获取屏幕宽度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });

    //获取圈子列表
    util.req('&m=Category&a=getCicleInfo', {
      cg_id: options.id,
      "session3rd": app.globalData.token
    }, function(data) {
      if (data.flag == 1) {
        that.setData({
          circle: data.result
        })
      }
    })
  },

  handleOpenLogin: function(e) {
    this.setData({ isShowLogin: true })
  },

  handleCloseLogin: function(e) {
    this.setData({ isShowLogin: false });
    if (app.globalData.is_reg) {
      var lastid = this.data.lastid ? this.data.lastid : 0;
      fetchInfoList(that, lastid);
    }
  },
  
  searchScrollLower: function (event) {
    let that = this;
    var list = this.data.list;
    var id = list[list.length - 1].id;
    this.setData({ lastid: id });
    if (this.data.listStatus) return; // 没有更多了
    if (this.data.loadMore) return; // 禁止重复请求
    fetchInfoList(that, id);
  }

})