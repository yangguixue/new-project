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
  },

  onLoad: function (options) {
    var that = this;
    this.fetchDetail(that, options.id);
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

  handleCall: function() {
    wx.makePhoneCall({
      phoneNumber: this.data.info.shop_phone
    })
  },

  showImage: function(event) {
    const data = event.currentTarget.dataset;
    const current = data.current;
    const urls = data.urls;
    wx.previewImage({
      current,
      urls: ['../../images/userhead.jpg'],
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
    util.req('&m=shop&a=setLevel', {
      id,
      session3rd
    }, function(data) {
      console.log(data);
      if (data.flag == 1) {
        wx.showToast({
          title: '领取成功',
        })
        that.fetchDetail(that, id);
      } else {
        wx.showModal({
          title: '领取失败',
        })
      }
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
  }
})