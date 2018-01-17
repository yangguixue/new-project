// pages/container/shopList/index.js
var util = require('../../../utils/util.js');
var app = getApp();
var token = app.globalData.token;
var epage = app.globalData.epage;
var page = 0;

var fetchShopList = function (that, lastid) {
  that.setData({ loadMore: true });
  const filters = that.data.filters;
  filters.lastid = lastid;
  filters.epage = epage;
  util.req('&m=shop&a=getShopList', filters, function (data) {
    var list = that.data.list;
    if (data.flag == 1) {
      var len = data.result.length;
      if (lastid == 0) {
        if (len == 0) {
          that.setData({ listStatus: '该行业稀缺，抓住时机，马上入驻，别人看到的就是你', loadMore: false, list: data.result });
          return;
        }
        that.setData({ list: data.result });
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
      loadMore: false,
      filters
    })
    wx.stopPullDownRefresh();
  })
}

Page({
  data: {
    isShowCate: false, //是否展示所有分类
    isShowFilter: false, 
    category: [], //分类
    value: 0,
    loadMore: false,
    showMask: false,
    searchValue: '', //搜索商家
    filters: {
      is_sale: false,
      is_recruit: false,
      is_deposit: false
    },
    isShowLogin: false,
    checkbox: [], //多选框
  },

  onLoad: function (options) {
    var that = this;
    fetchShopList(that, 0);

    // 获取分类
    util.getReq('&m=category&a=getCgList', { type: 2 }, function (data) {
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

  handleHideMask: function(event) {
    this.setData({
      showMask: false,
      isShowFilter: false,
      isShowCate: false,
    })
  },

  handleOpenLogin: function () {
    this.setData({ isShowLogin: true });
  },

  handleCloseLogin: function (event) {
    this.setData({ isShowLogin: false });
    if (app.globalData.is_reg) {
      fetchShopList(that, 0);
    }
  },


  // 搜索商家
  handleChange: function(event) {
    const searchValue = event.detail.value;
    this.setData({ searchValue });
  },

  handleSearch: function(event) {
    var that = this;
    var kword = this.data.searchValue;
    wx.showLoading({ title: '加载中' });
    util.req('&m=shop&a=searchShopList', {
      kword,
      lastid: 0,
      epage
    }, function(data) {
      if (data.flag == 1) {
        that.setData({
          list: data.result,
          filters: {
            is_sale: false,
            is_recruit: false,
          },  
        });
      }
      wx.hideLoading()
    })
  },

  checkboxChange: function(event) {
    const checkbox = event.detail.value;
    this.setData({ checkbox });
  },

  handleFilter: function(event) {
    const isShowCate = this.data.isShowCate;
    const isShowFilter = this.data.isShowFilter;
    const id = event.target.dataset.id;
    this.setData({ showMask: true });
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
    const id = event.target.dataset.id;
    const filters = this.data.filters;
    filters.is_sale = false;
    filters.is_recruit = false;
    filters.is_deposit = false;

    const checkbox = this.data.checkbox;
    filters.session3rd = app.globalData.token;
    checkbox.map((data) => {
      filters[data] = true;
    })

    if (id == 0) { //选择分类
      const category = this.data.category;
      const item = event.target.dataset.item;
      const index = event.target.dataset.index;
      for (let i = 0; i < category.length; i++) {
        if (category[i].selected) {
          delete category[i].selected;
        }
      }
      item.selected = true;
      category[index] = item;
      filters.cg_id = item.cg_id;
      this.setData({ category, value: index, filters });
    }
    this.setData({ filters });
    this.handleHideMask();
    fetchShopList(that, 0);
  },

  handlePublish: function() {
    if (!app.globalData.is_reg) {
      this.handleOpenLogin();
      return;
    }
    wx.navigateTo({
      url: '../creatShop/index',
    })
  },


  onPullDownRefresh: function () {
    const that = this;
    this.setData({ listStatus: '' });
    fetchShopList(that, 0);
  },


  onReachBottom: function (event) {
    let that = this;
    var list = this.data.list;
    var id = list[list.length - 1].id;
    this.setData({ lastid: id });
    if (this.data.listStatus) return; // 没有更多了
    if (this.data.loadMore) return; // 禁止重复请求

    fetchShopList(that, id);
  }
})                                                                                                                                                                                                                                                                                                                                        