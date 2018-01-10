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
  // attached: function () {
  //   const item = this.data.item;
  //   console.log(item)
  //   qqmapsdk.calculateDistance({
  //     to: [{
  //       latitude: item.lat,
  //       longitude: item.lng
  //     }],
  //     success: function (res) {
  //       console.log(res);
  //     },
  //     fail: function (res) {
  //       console.log(res);
  //     },
  //     complete: function (res) {
  //       console.log(res);
  //     }
  //   });
  // },

  methods: {
  }
})