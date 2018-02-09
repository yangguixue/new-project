// pages/container/shopList/index.js
var util = require('../../../utils/util.js');
var app = getApp();
var token = app.globalData.token;
var epage = app.globalData.epage;
var page = 0;

var shopLoop;
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
        that.setData({ list: data.result, shopLoop: data.result });

        let i = 0;
        shopLoop = setInterval(() => {
          const shopName = data.result[i].shop_name;
        
          if (i == data.result.length - 1) {
            i = 0;
            that.setData({ shopName });
          } else {
            i++;
            that.setData({ shopName });
          }
        }, 2000);
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
    shopLoop: [], //需要循环的店铺
    categorys: [], //分类
    category: [],
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
    shopId: '',
    recommend: {}
  },

  onLoad: function (options) {
    var that = this;

    // 获取分类
    util.getReq('&m=category&a=getCgList', { type: 2 }, function (data) {
      if (data.flag == 1) {
        const categorys = data.result;
        const category = data.result.slice(0, 9);
        categorys.unshift({ cg_id: 0, name: '所有分类' });
        category.push({ cg_id: 0, name: '其他', icon: '../../images/shop-more.png' })
        that.setData({
          categorys,
          category
        })
      } else {
        util.errorTips(data.msg);
      }
    })
  },

  onShow: function() {
    const that = this;
    fetchShopList(that, 0);
    util.req('&m=shop&a=getRecomend', {}, function (data) {
      if (data.flag == 1) {
        that.setData({ recommend: data.result });
      } else {
        wx.showModal({
          content: data.msg,
        })
      }
    })
  },

  onHide: function() {
    clearInterval(shopLoop);
  },

  onUnload: function() {
    clearInterval(shopLoop);
  },

  shopLoop: function(that, i, stop) {
    const shops = that.data.shopLoop;
    var a = setTimeout(() => {
      const shopName = shops[i].shop_name;
      if (i == shops.length-1) {
        i = 0;
        that.setData({ shopName });
        that.shopLoop(that, i);
      } else {
        i++;
        that.setData({ shopName });
        that.shopLoop(that, i);
      }
    }, 2000);    
  },

  openDiscount: function() {
    wx.switchTab({
      url: '../../container/discountList/index'
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
      wx.navigateTo({
        url: '../creatShop/index',
      })
    }
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
      this.setData({ category, value: index, filters, listStatus: '' });
    }
    this.setData({ filters, listStatus: '' });
    this.handleHideMask();
    fetchShopList(that, 0);
  },

  handlePublish: function() {
    const shopId = this.data.shopId;
    if (!app.globalData.is_reg) {
      this.handleOpenLogin();
      return;
    }

    if (shopId) {
      wx.navigateTo({
        url: '../shopDetail/index?id=' + shopId,
      })
    } else {
      wx.navigateTo({
        url: '../creatShop/index',
      })
    }
    
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