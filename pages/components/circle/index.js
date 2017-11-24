var util = require('../../../utils/util.js');
var app = getApp();

Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    item: Object,
  },
  data: {
    showLogin: false
  },
  methods: {
    // 这里是一个自定义方法
    handleJoinCircle: function(event) {
      var item = event.target.dataset.item;
      var token = wx.getStorageSync('token');
      var newItem = {
        status: !item.status,
        cg_id: item.cg_id,
        cg_name: item.name,
        session3rd: token,
      };
      if (token) {
        console.log('已登录')
        util.handleJoin(newItem)
      } else {
        this.triggerEvent('handleShowLogin')
      }
    }
  }
})