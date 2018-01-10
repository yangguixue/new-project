var util = require('../../../utils/util.js');
var app = getApp();

Component({
  properties: {
    content: Object,
    isDetail: Boolean,
    isShowLogin: Boolean
  },
  data: {
    // 这里是一些组件内部数据
    dn: false
  },

  methods: {
    openMap: function () {
      const info = this.data.content;
      var latitude = parseInt(info.lat);
      var longitude = parseInt(info.lng);
      wx.openLocation({
        latitude,
        longitude,
        scale: 28
      })
    },

    // 图片放大
    handleBigImage: function (event) {
      const data = event.currentTarget.dataset;
      const current = data.current;
      const urls = this.data.content.smeta;
      wx.previewImage({
        current,
        urls,
      })
    },
    
    handleCollection: function (event) {
      var that = this;
      const content = this.data.content; 
      if (!app.globalData.is_reg) {
        this.triggerEvent('openLogin');
        return;
      }
      app.handleCollection(content).then((content) => {
        this.setData({ content });
        this.triggerEvent('changeList', content);
      })
    },

    handleZan: function(event) {
      var content = this.data.content;
      if (!app.globalData.is_reg) {
        this.triggerEvent('openLogin');
        return;
      }
      app.handleZan(content).then((content) => {
        this.setData({ content });
        this.triggerEvent('changeList', content);
      });
    },

    handleDelete: function(event) {
      var that = this;
      var token = app.globalData.token;
      wx.showModal({
        title: '确定要删除吗？',
        success: function (res) {
          if (res.confirm) {
            util.req('&m=info&a=delInfo', {
              id: event.currentTarget.dataset.id,
              session3rd: token
            }, function (data) {
              if (data.flag == 1) {
                wx.showToast({
                  title: '删除成功',
                })
                that.setData({ dn: true }) // 删除成功， 只删除本组件（隐藏）
              }
            })
          }
        }
      })
    },

    // 举报
    handleReport: function(event) {
      const content = this.data.content;
      if (!app.globalData.is_reg) {
        this.triggerEvent('openLogin');
        return;
      }
      wx.navigateTo({
        url: '/pages/container/report/index?type=info&id=' + content.id
      })
    }
  }
})