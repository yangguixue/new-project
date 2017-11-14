// pages/container/release/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imagesList:[],
    isNull: true,
    item: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const item = options;
    this.setData({
      item: item
    })
  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  deleteImage: function(event) {
    var imagesList = this.data.imagesList;
    imagesList.splice(event.target.id, 1);
    this.setData({
      imagesList: imagesList
    })
  },

  chooseImage: function() {
    var that = this;
    wx.chooseImage({
      count: 6, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        var imagesList = that.data.imagesList;
        console.log(imagesList)
        if (imagesList.length > 0) {
          const newList = imagesList.concat(tempFilePaths)
          that.setData({
            imagesList: newList
          })
        } else {
          that.setData({
            imagesList: tempFilePaths
          })
        }
      }
    });
  },

  handleChange: function(e) {
    var length = e.detail.value.length;
    var item = this.data.item;
    item.post_content = e.detail.value;
    console.log(item)
    if (length > 0) {
      this.setData({
        isNull: false,
        item: item
      })
    } else {
      this.setData({
        isNull: true,
        item: item
      })
    }
  },

  handleSubmit: function() {
    var item = this.data.item;
    item.smeta = this.data.imagesList;
    item.post_addr = '景县惠民市场呵呵呵';
    console.log(item)
    wx.request({
      url: 'http://localhost/index.php?g=qmcy&m=info&a=addInfo',
      data: item,
      header: { "content-type": "application/x-www-form-urlencoded" },
      method: 'POST',
      dataType: "json",
      success:function(res) {
        wx.showToast({
          title: '发布成功',
          icon: 'success',
          duration: 2000
        });
        setTimeout(
          wx.switchTab({
            url: '../index/index'
          }), 2000)
      }
    })
  }
})