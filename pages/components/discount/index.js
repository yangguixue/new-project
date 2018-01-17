Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    info: Object,
    isDetail: Boolean
  },
  data: {
    // 这里是一些组件内部数据

  },
  methods: {
    // 这里是一个自定义方法
    handleDetail: function() {
      const info = this.data.info;
      if (this.data.isDetail) {
        return;
      }
      wx.navigateTo({
        url: '../discountDetail/index?id=' + info.id,
      })
    },

    handleOpenImg: function(event) {
      const urls = this.data.info.altas;
      console.log(event);
      wx.previewImage({
        current: event.currentTarget.dataset, // 当前显示图片的http链接
        urls // 需要预览的图片http链接列表
      })
    }
  }
})