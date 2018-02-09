var util = require('../../../utils/util.js');
var app = getApp();
var qqmapsdk = app.globalData.qqmapsdk;

Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
   item: Object,
   detail: Boolean,
  },
  data: {
    // 这里是一些组件内部数据
  },

  methods: {
    openLogo: function () {
      const item = this.data.item;
      const urls = [];
      if (!this.data.detail) {
        return;
      }
      urls.push(item.shop_logo_show);
      wx.previewImage({
        current: item.shop_logo_show, // 当前显示图片的http链接
        urls
      })
    },
  }
})