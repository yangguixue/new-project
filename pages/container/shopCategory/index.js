// pages/container/searchShop/index.js
var util = require('../../../utils/util.js');

Page({
  data: {
    categorys: []
  },

  onLoad: function(options) {
    const that = this;
    // 获取分类
    util.getReq('&m=category&a=getCgList', { type: 2 }, function (data) {
      if (data.flag == 1) {
        const categorys = data.result;
        categorys.unshift({ cg_id: 0, name: '所有分类' });
        that.setData({
          categorys
        })
      } else {
        util.errorTips(data.msg);
      }
    })
  }

})