// pages/container/fans/index.js
var util = require('../../../utils/util.js');
var app = getApp();

Page({
  data: {
    items: [],
    url: '',
    isLoading: true,
  },

  onLoad: function (options) {
    var that = this;
    var token = app.globalData.token;
    var url = options.url == 'focus' ? '&m=member&a=getFollows' : '&m=member&a=getFans';
    util.req(url, { session3rd: token }, function(data) {
      if(data.flag == 1) {
        that.setData({ items: data.result })
      }
      that.setData({ isLoading: false })
    })
  },

  handleFocus: function(event) {
    var that = this;
    var item = event.currentTarget.dataset.item;

    app.handleFocus(item).then((data) => {
      console.log(data);
    });
  },

})