Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    content: Object,
    isDetail: Boolean,
  },
  data: {
    // 这里是一些组件内部数据
  },
  attached: function () {
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

    handleCollection: function () { 
      const content = this.data.content;
      const isCollection = this.data.content.isCollection;
      content['isCollection'] = !isCollection;
      this.setData({
        content: content
      })
    },
    handleZan: function() {
      const content = this.data.content;
      const isZan = this.data.content.isZan;
      content['isZan'] = !isZan;
      this.setData({
        content: content
      })
    }
  }
})