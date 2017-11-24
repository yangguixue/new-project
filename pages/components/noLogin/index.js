var app = getApp();

Component({
  properties: {
    isHide: Boolean,
  },
  data: {
  },

  methods: {
    handleGetUserInfo: function (event) {
      var that = this;
      if (event.detail.errMsg == 'getUserInfo:ok') {
        // 授权
        if (!app.globalData.is_reg) {
          console.log(1)
          var callback = that.hide;  
          app.registerUser(callback);
        }
      } else {
        //取消
        wx.showModal({
          content: '登录失败，您还不可以操作哦',
        })
        that.hide(false);
      }
    },

   hide: function(reg) {
     var that = this;
     var is_reg = { is_reg: reg };
     that.triggerEvent('handleCloseLogin', is_reg);
   },

  }
})