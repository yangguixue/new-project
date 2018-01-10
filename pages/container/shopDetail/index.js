// pages/container/shopDetail/index.js
var util = require('../../../utils/util.js');
var app = getApp();

Page({
  data: {
    info: {},
    showEditJob: false, //是否添加招聘信息
    jobInfo: {}, // 编辑招聘信息
    isLoading: true,
    moreActive: false,
    isShowLogin: false,
    isShowHaoHua: false,
    isAddActive: false
  },

  onLoad: function (options) {
    var that = this;
    this.setData({
      isShowZan: wx.getStorageSync('isShowZan'),
      shopId: options.id,
    });

    // 获取规则
    util.req('&m=ad&a=getIll', { name: 'haohua' }, function (data) {
      if (data.flag == 1) {
        that.setData({ nodes: data.result.content });
      } else {
        wx.showToast({
          title: data.msg,
        })
      }
    })
  },

  onShow: function() {
    const that = this;
    const id = this.data.shopId;
    this.fetchDetail(that, id);
  },

  fetchDetail: function(that, id) {
    util.getReq('&m=shop&a=getShopDetail', {
      id,
      session3rd: app.globalData.token
    }, function (data) {
      that.setData({
        info: data.result,
        isLoading: false
      })
    })
  },

  openMap: function() {
    const info = this.data.info;
    var latitude = parseInt(info.lat);
    var longitude = parseInt(info.lng);
    wx.openLocation({
      latitude,
      longitude,
      scale: 28
    })
  },

  // 隐藏赞的提示
  hideZan: function () {
    wx.removeStorageSync('isShowZan')
    this.setData({
      isShowZan: false
    });
  },

  handleCall: function() {
    wx.makePhoneCall({
      phoneNumber: this.data.info.shop_phone
    })
  },

  handleShowHaoHua: function() {
    this.setData({ isShowHaoHua: true });
  },

  handleHideHaoHua: function () {
    this.setData({ isShowHaoHua: false });
  },

  handleShowActive: function() {
    this.setData({ isAddActive: true });
  },

  handleHideActive: function () {
    this.setData({ isAddActive: false });
  }, 

  // 赞店铺
  handleZan: function(event) {
    const that = this;
    const shop_id = this.data.info.id;
    const action = !this.data.info.is_star;
    this.setData({ isLoading: true })
    util.req('&m=shop&a=thumbUp', {
      shop_id,
      action,
      session3rd: app.globalData.token
    }, function(data) {
      if (data.flag == 1) {
        wx.showToast({
          title: '赞 +1',
        })
        that.fetchDetail(that, shop_id);
      } else {
        wx.showToast({
          title: data.msg,
        })
      }
      that.setData({ isLoading: false });
    })
  },

  showImage: function(event) {
    const data = event.currentTarget.dataset;
    const current = data.current;
    const urls = this.data.info.shop_pic_show;
    wx.previewImage({
      current,
      urls,
    })
  },

  // 查看更多活动
  showMoreActive: function() {
    this.setData({ moreActive: true });
  },

  showMoreJobs: function() {
    this.setData({ moreJobs: true });
  },

  getFree: function(event) {
    var id = this.data.info.id;
    var session3rd = app.globalData.token;
    var that = this;
    that.setData({ isLoading: true });
    util.req('&m=shop&a=setLevel', {
      id,
      session3rd
    }, function(data) {
      if (data.flag == 1) {
        wx.showToast({
          title: '领取成功',
        })
        that.handleHideHaoHua();
        that.fetchDetail(that, id);
      } else {
        wx.showModal({
          title: '领取失败',
        })
      }
      that.setData({ isLoading: false });
    })
  },

  // 添加招聘
  handleShowEditJob: function(event) {
    const jobInfo = event.target.dataset.item;
    if (jobInfo) {
      this.setData({ showEditJob: true, jobInfo });
    } else {
      this.setData({ showEditJob: true });
    }
  },

  handleHideEditJob: function () {
    this.setData({ showEditJob: false, jobInfo: {} })
  }, 

  submitJob: function(event) {
    const that = this;
    const recruit = event.detail.value;
    const jobInfo = this.data.jobInfo;
    const url = jobInfo.id ? '&m=shop&a=editRecruit' : '&m=shop&a=addRecruit';
    const toast = jobInfo.id ? '修改成功' : '添加成功';
    if (jobInfo.id) {
      recruit.id = jobInfo.id;
    } else {
      recruit.shop_id = this.data.info.id;
    }
    recruit.session3rd = app.globalData.token;

    this.setData({ submitJob: true });
    util.req(url, recruit, function(data) {
      if (data.flag == 1) {
        wx.showToast({
          title: toast,
        })
        that.setData({ showEditJob: false });
        that.fetchDetail(that, that.data.info.id);
      } else {
        wx.showToast({
          title: data.msg,
        })
      }
      that.setData({ submitJob: false });
    })
  },

  handleDeleteJob: function(event) {
    const id = event.target.dataset.id;
    const that = this;
    wx.showModal({
      title: '确定要删除吗？',
      success: function(res) {
        util.req('&m=shop&a=delRecruit', {
          id,
          session3rd: app.globalData.token
        }, function (data) {
          if (data.flag == 1) {
            wx.showToast({
              title: '删除成功',
            })
            that.fetchDetail(that, that.data.info.id);
          } else {
            wx.showToast({
              title: data.msg,
            })
          }
        })
      }
    })
  },

  handleOpenLogin: function () {
    this.setData({ isShowLogin: true });
  },

  handleCloseLogin: function (event) {
    var that = this;
    var id = this.data.info.id;
    this.setData({ isShowLogin: false });
    if (app.globalData.is_reg) {
      fetchDetail(that, id);
    }
  },

  // 收藏店铺
  handleCollection: function(event) {
    const that = this;
    const info = this.data.info;
    const shop_id = info.id;
    const action = !info.is_star;
    const text = info.is_star ? '取消收藏成功' : '收藏成功';
    that.setData({ isLoading: true });
    util.req('&m=shop&a=setRelationship', {
      shop_id,
      action,
      session3rd: app.globalData.token,
    }, function(data) {
      if (data.flag == 1) {
        wx.showToast({
          title: text,
        });
        info.is_star = !info.is_star;
        that.setData({ info });
      } else {
        wx.showToast({
          title: data.msg,
        })
      }
      that.setData({ isLoading: false });
    })
  },

  // 我要开店
  handleOpenShop: function(event) {
    const info = this.data.info;
    const that = this;
    that.setData({ isLoading: true });
    // 没登录
    if (!app.globalData.is_reg) {
      this.handleOpenLogin();
      that.setData({ isLoading: false });
      return;
    }

    if (info.is_owner) {
      wx.navigateTo({
        url: "../creatShop/index?id=" + info.id,
      })
      that.setData({ isLoading: false });
      return;
    }
    // 有店铺
    util.req('&m=shop&a=getShopId', {
      session3rd: app.globalData.token
    }, function(data) {
      if (data.flag == 1) {
        if (data.result) {
          that.fetchDetail(that, data.result);
        } else {
          wx.navigateTo({
            url: '../creatShop/index',
          })
        }
      } else {
        wx.showToast({
          title: data.msg,
        })
      }
      that.setData({ isLoading: false });
    })
  },

  onShareAppMessage: function(options) {
    const id = this.data.info.id;
    return {
      title: '我家店铺上网啦~你的店铺也可以哦~',
      path: '/pages/container/shopDetail/index?id=' + id + '&userId=' + app.globalData.session3rd,
      success(e) {
        wx.showShareMenu({
          // 要求小程序返回分享目标信息
          withShareTicket: true
        });
      },
      fail(e) {
      },
      complete() { }
    }
  }
})