var util = require('../../../utils/util.js');
var app = getApp();

Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    content: Object,
    isDetail: Boolean,
  },
  data: {
    // 这里是一些组件内部数据
  },

  methods: {
    // 这里是一个自定义方法
    // 图片放大
    handleBigImage: function () {
      wx.previewImage({
        current: '../../images/userhead.jpg',
        urls: [
          '../../images/userhead.jpg',
          '../../images/userhead.jpg',
          '../../images/userhead.jpg',] // 需要预览的图片http链接列表
      })
    },

    handleCollection: function (event) {
      var that = this;
      const content = this.data.content; //
      util.handleCollection(content).then((content) => {
        this.setData({ content });
      })
    },

    handleZan: function(event) {
      var content = this.data.content;
      util.handleZan(content).then((content) => {
        this.setData({ content });
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
                that.triggerEvent('delete')
              }
            })
          }
        }
      })
    }
  }
})