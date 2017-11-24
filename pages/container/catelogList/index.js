// pages/container/catelogList/index.js
var util = require('../../../utils/util.js');

Page({
  data: {
    menu: [],
    tabId: '',
    banners: [],
    list: [],
    isLoading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    var that = this;

    // 获取banner
    util.req('&m=ad&a=getAdsList', {
      cg_id: id,
      istop: 1
    }, function(data) {
      if (data.flag == 1) {
        that.setData({ banners: data.result })
      }
    })

    // 获取tab
    util.req('&m=category&a=getCgList', {
      type: 0,
      parent_id: id
    }, function(data) {
      if (data.flag == 1) {
        const menu = data.result;
        const cg_id = menu.length > 0 ? menu[0].cg_id : options.id;
        if (menu.length > 0) {
          // 有二级分类
          that.setData({
            tabId: cg_id,
          })
        }
        that.setData({
          menu: menu,
        })

        // 获取信息
        util.req('&m=info&a=getInfoList', { cg_id: cg_id }, function(info){
          that.setData({
            list: info.result,
            isLoading: false
          })
        })
      }
    })
  },

  handleClickTab: function(event) {
    var id = event.target.dataset.id;
    var that = this;
    this.setData({
      tabId: id,
      isLoading: true
    })
    util.req('&m=info&a=getInfoList', { cg_id: id }, function(res){
      that.setData({
        list: res.result,
        isLoading: false
      })
    })
  }
})