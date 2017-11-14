// pages/container/catelogList/index.js
Page({
  /**
   * 页面的初始数据
   */
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    var that = this;
    // 获取tab
    wx.request({
      url: 'http://localhost/index.php?g=qmcy&m=category&a=getCgList',
      data: {
        type: 0,
        parent_id: id
      },
      success: function (res) {
        const menu = res.data.result;
        if(menu.length > 0) {
          that.setData({
            menu: menu,
            tabId: menu[0].cg_id
          })
        } else {
          that.setData({
            menu: menu,
          })
        }
      }
    });
    // 获取信息
    wx.request({
      url: 'http://localhost/index.php?g=qmcy&m=info&a=getInfoList',
      data: {
        cg_id: id
      },
      success:function(res) {
        console.log(res)
        that.setData({
          list: res.data.result
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  handleClickTab: function(event) {
    this.setData({
      tabId: event.target.dataset.id
    })
  }
})