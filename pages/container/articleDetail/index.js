var config = require('../../common/config.js');
var util = require('../../../utils/util.js');
var app = getApp();

Page({
  data: {
    content: {},
    comment: '',
    isLoading: true, 
    is_red: false, //发布红色字
    isShowLogin: false,
    to_member: {},
    focus: false, // 评论聚焦
  },

  onLoad: function (options) {
    this.getArticle(options.id);
  },

  getArticle: function(id) {
    var that = this;
    util.req('&m=info&a=getInfo', {
      id: id,
      session3rd: app.globalData.token
    }, function (data) {
      if (data.flag) {
        that.setData({
          content: data.result
        })
      }
      that.setData({
        isLoading: false
      })
    })
  },

  handleOpenLogin: function () {
    var that = this;
    that.setData({ isShowLogin: true });
  },

  handleCloseLogin: function (event) {
    this.setData({ isShowLogin: false });
  },

  handleCollection: function (event) {
    var that = this;
    const content = this.data.content; 
    if (!app.globalData.is_reg) {
      this.handleOpenLogin();
      return;
    }
    app.handleCollection(content).then((content) => {
      this.setData({ content });
    })
  },

  handleZan: function (event) {
    var content = this.data.content;
    if (!app.globalData.is_reg) {
      this.handleOpenLogin();
      return;
    }
    app.handleZan(content).then((content) => {
      this.setData({ content });
    });
  },

  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: '我是内容内容',
      imageUrl: '../../images/banner01.jpg',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  handleFocusInput: function(event) {
    var to_member = event.target.dataset.item;
    if (!app.globalData.is_reg) {
      this.handleOpenLogin();
      return;
    }

    // 回复别人
    if (to_member) {
      this.setData({ to_member });
    }

    this.setData({
      focus: true
    });
  },

  handleBlurInput: function(event) {
    setTimeout(() => {
      this.setData({ focus: false, is_red: false });
    }, 100);
  },

  handleChange: function(event) {
    var comment = event.detail.value;
    if (comment.length > 0) {
      this.setData({ is_red: true })
    } else {
      this.setData({ is_red: false })
    }
    this.setData({ comment });
  },

  handleSend: function() {
    var that = this;
    var to_member = this.data.to_member;
    var item = {};
    item.id = this.data.content.id;
    item.content = this.data.comment;
    item.session3rd = app.globalData.token;

    if (to_member) {
      item.to_mid = to_member.from_mid;
      item.to_name = to_member.from_name;
      item.to_userphoto = to_member.from_userphoto;
    }

    wx.showLoading({
      title: '稍等..',
    })

    util.req('&m=info&a=setComment', item, function(data) {
      wx.hideLoading();
      if (data.flag == 1) {
        wx.showToast({
          title: '评论成功',
        })
        that.handleBlurInput();
        that.getArticle(item.id);
      } else {
        wx.showModal({
          content: data.msg,
        })
      }
    })
  },

  handleDelete: function(event) {
    var that = this;
    var id = event.target.dataset.item.id;
    var content = this.data.content;
    var comments = content.comments;
    wx.showModal({
      content: '确定要删除吗?',
      success: function() {
        util.req('&m=info&a=delComment', {
          id,
          session3rd: app.globalData.token
        }, function (data) {
          if (data.flag == 1) {
            var index = comments.findIndex(item => item.id == id);
            comments.splice(index, 1);
            content.comments = comments;
            that.setData({ content: content });
            wx.showToast({
              title: '删除成功',
            })
          }
        })
      },
    })
  }
})