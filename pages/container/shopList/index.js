// pages/container/shopList/index.js
var util = require('../../../utils/util.js');
var app = getApp();
var token = app.globalData.token;
var epage = app.globalData.epage;
var page = 0;

var fetchShopList = function (that, lastid) {
  that.setData({ loadMore: true });
  util.req('&m=shop&a=getShopList', {
    lastid,
    epage,
  }, function (data) {
    var list = that.data.list;
    if (data.flag == 1) {
      var len = data.result.length;
      if (lastid == 0) {
        var len = data.result.length;
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
    isShowCate: false, //是否展示所有分类
    isShowFilter: false, 
    category: [], //分类
    isLoading: true,
    scrollTop: 0,
    scrollHeight: 0,
    loadMore: false,
    searchValue: '', //搜索商家
    filter: {},
    filter1: {},
    filters: {}, // 需要提交的筛选条件
    category2: [{
      id: 0,
      name: '所有'
    }, {
      id: 1,
      name: '有活动'
    }, {
      id: 2,
      name: '有招聘'
    }]
  },

  onLoad: function (options) {
    var that = this;
    fetchShopList(that, 0);

    // 获取屏幕宽度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });

    // 获取分类
    util.getReq('&m=category&a=getCgList', { type: 0 }, function (data) {
      if (data.flag == 1) {
        const category = data.result;
        category.unshift({ cg_id: 0, name: '所有分类' });
        that.setData({
          category
        })
      } else {
        util.errorTips(data.msg);
      }
    })
    
  },

  // 搜索商家
  handleChange: function(event) {
    const searchValue = event.detail.value;
    this.setData({ searchValue });
  },

  handleSearch: function(event) {
    var that = this;
    wx.showLoading({ title: '加载中' });
    util.req('&m=shop&a=searchShopList', {
      kword: this.data.searchValue,
      lastid: 0,
      epage
    }, function(data) {
      if (data.flag == 1) {
        that.setData({ list: data.result });
      }
      wx.hideLoading()
    })
  },

  searchScrollLower: function (event) {
    let that = this;
    var list = this.data.list;
    var id = list[list.length - 1].id;
    this.setData({ lastid: id });
    if (this.data.listStatus) return; // 没有更多了
    if (this.data.loadMore) return; // 禁止重复请求

    fetchShopList(that, id);
  },

  handleFilter: function(event) {
    const isShowCate = this.data.isShowCate;
    const isShowFilter = this.data.isShowFilter;
    const id = event.target.dataset.id;
    if (id == 0) {
      if (isShowFilter) {
        this.setData({ isShowFilter: !isShowFilter });
      }
      this.setData({ isShowCate: !isShowCate });
    } else {
      if (isShowCate) {
        this.setData({ isShowCate: !isShowCate });
      }
      this.setData({ isShowFilter: !isShowFilter });
    }
    
  },

  handleFilterSearch: function(event) {
    const that = this;
    const item = event.target.dataset.item;
    const id = event.target.dataset.id;
    const filters = this.data.filters;

    if (id == 0) {
      const filter = this.data.filter;
      filters.cg_id = filter.cg_id;
      this.setData({ filter: item }); //下拉框改变文字
    } else {
      const filter1 = this.data.filter1;      
      this.setData({ filter1: item }); //下拉框改变文字
    }

    that.handleFilter(event);

    return;
    
    util.req('&m=shop&a=getShopList', {
      session3rd: app.globalData.token,
      cg_id: item.cg_id
    }, function(data) {
      if (data.flag == 1) {
        that.setData({ list: data.result });
      }
    })
  }
})                                                                                                                                                                                                                                                                                                                                        