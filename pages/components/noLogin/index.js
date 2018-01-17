var app = getApp();

Component({
  properties: {
    isHide: Boolean,
  },
  data: {
    isLoading: false
  },

  methods: {
    handleGetUserInfo: function (event) {
      var _this = this;
      this.setData({ isLoading: true });
      if (event.detail.errMsg == 'getUserInfo:ok') {
        // 授权
        if (!app.globalData.is_reg) {
          app.registerUser(event.detail).then((code) => {
            app.login().then(() => {
              this.setData({ isLoading: false });
              _this.hide(true); //注册成功之后的回调
            })
          });
        }
      } else {
        //取消
        wx.showModal({
          content: '登录失败，您还不可以操作哦',
        })
        _this.hide(false); //注册成功之后的回调
      }
    },

   hide: function(reg) {
     var that = this;
     var is_reg = { is_reg: reg };
     this.setData({ isLoading: false });
     that.triggerEvent('handleCloseLogin', is_reg);
   },

  }
})