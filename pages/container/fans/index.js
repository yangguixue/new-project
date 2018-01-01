// pages/container/fans/index.js
var util = require('../../../utils/util.js');
var app = getApp();

Page({
  data: {
    url: '',
    isLoading: true,
  },

  onLoad: function (options) {
    var that = this;
    var token = app.globalData.token;
    var url = options.url == 'focus' ? '&m=member&a=getFollows' : '&m=member&a=getFans';
    util.req(url, { session3rd: token }, function(data) {
      if(data.flag == 1) {
        that.setData({ list: data.result })
      }
      that.setData({ isLoading: false, url: options.url })
    })
  },

  handleFocus: function(event) {
    var that = this;
    var item = event.currentTarget.dataset.item;
    item.member_id = item.id;

    app.handleFocus(item).then((data) => {
      var that = this;
      var list = this.data.list;
      var id = item.id;
      var index = list.findIndex(item => item.id == id)

      if (this.data.url == 'focus') {
        list.splice(index, 1);
      } else {
        list[index].is_follow = !list[index].is_follow;
      }
      this.setData({ list });
    });
  },

})