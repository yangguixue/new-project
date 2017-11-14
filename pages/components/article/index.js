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
      const content = this.data.content;
      const is_star = content.is_star;
      const title = content.is_star ? '取消收藏成功' : '收藏成功';      
      wx.request({
        url: 'http://localhost/index.php?g=qmcy&m=info&a=setStarStatus',
        header: { "content-type": "application/x-www-form-urlencoded" },
        method: "POST",
        data: {
          id: content.id,
          action: !content.is_star
        },
        dataType: "json",
        success: function(res) {
          if(res.data.flag === 1) {
            content['is_star'] = !is_star;
            wx.showToast({
              title: title,
              duration: 2000
            })
            that.setData({
              content: content
            })
          } else {
            wx.showToast({
              title: res.data.msg,
              duration: 2000
            })
          }
        }
      })

    },
    handleZan: function(event) {
      const content = this.data.content;
      const is_like = content.is_like;
      wx.request({
        url: 'http://localhost/index.php?g=qmcy&m=info&a=setLike',
        header: { "content-type": "application/x-www-form-urlencoded" },
        method: "POST",
        data: {
          id: content.id,
          action: !content.is_like
        },
        dataType: "json",
        success: function (res) {
          if (res.data.flag === 1) {
            content['is_like'] = !is_like;
            that.setData({
              content: content
            })
          } else {
            wx.showToast({
              title: res.data.msg,
              duration: 2000
            })
          }
        }
      })
    }
  }
})