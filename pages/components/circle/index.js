var util = require('../../../utils/util.js');
var app = getApp();

Component({
  properties: {
    item: Object,
    hasAdd: Boolean
  },
  data: {
    showLogin: false
  },
  methods: {
    handleJoinCircle: function(event) {
      var that = this;
      var item = event.target.dataset.item;
      var is_reg = app.globalData.is_reg;

      if (is_reg) {
        app.joinCircle(item).then((item) => {
          that.setData({ item: item })
        })
      } else {
        this.triggerEvent('handleShowLogin')
      }
    },

    handleAdd: function (event) {
      var that = this;
      var item = event.currentTarget.dataset.item;
      var is_reg = app.globalData.is_reg;

      if (!is_reg) {
        this.triggerEvent('handleShowLogin');
        return;
      }

      if (!item.status) {
        wx.showModal({
          content: '加入圈子才可以发表动态哦~',
        })
        return;
      } else {
        wx.navigateTo({
          url: '../release/index?type=' + 1 + '&id=' + item.cg_id
        })
      }
    }
  },

  
})