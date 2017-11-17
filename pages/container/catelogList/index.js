// pages/container/catelogList/index.js
var config = require('../../common/config.js');
Page({
  data: {
    menu: [],
    tabId: '',
    banners: [{
        id: 0,
        smeta: '../../images/banner01.jpg',
        link: 'www'
      }, {
        id: 1,
        smeta: '../../images/banner02.jpg',
        link: 'www'
    }],
    list: [],
    isLoading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    var that = this;
    this.setData({ isLoading: true })
    // 获取tab
    wx.request({
      url: config.configUrl + '&m=category&a=getCgList',
      data: {
        type: 0,
        parent_id: id
      },
      success: function (res) {
        const menu = res.data.result;
        const cg_id = menu.length > 0 ? menu[0].cg_id : options.id;
        if(menu.length > 0) {
          // 有二级分类
          that.setData({
            tabId: cg_id,
          })
        }
        that.setData({
          menu: menu,
        })
        wx.request({
          url: config.configUrl + '&m=info&a=getInfoList',
          data: {
            cg_id: cg_id
          },
          success: function (res) {
            that.setData({
              list: res.data.result,
              isLoading: false
            })
          }
        })
      }
    });
    // 获取信息

  },

  handleClickTab: function(event) {
    var id = event.target.dataset.id;
    var that = this;
    this.setData({
      tabId: id
    })
    wx.request({
      url: config.configUrl + '&m=info&a=getInfoList',
      data: {
        cg_id: id
      },
      success: function (res) {
        that.setData({
          list: res.data.result
        })
      }
    })
  }
})