var config = require('../pages/common/config.js');
var token = wx.getStorageSync('token');

function req(url, data, cb) {
  // data.token = token;
  wx.request({
    url: config.configUrl + url,
    data: data,
    method: 'post',
    header: { 'Content-Type': 'application/x-www-form-urlencoded' },
    success: function (res) {
      return typeof cb == "function" && cb(res.data)
    },
    fail: function (res) {
      this.errorTips(res.data.msg);
      return typeof cb == "function" && cb(false)
    }
  })
}

function getReq(url, data, cb) {
  // data.token = token;
  wx.request({
    url: config.configUrl + url,
    data: data,
    method: 'get',
    header: { 'Content-Type': 'application/x-www-form-urlencoded' },
    success: function (res) {
      return typeof cb == "function" && cb(res.data)
    },
    fail: function () {
      return typeof cb == "function" && cb(false)
    }
  })
}  

function errorTips(data) {
  wx.showModal({
    content: data,
    confirmText: '我知道了'
  })
}

// 加入、退出圈子
function handleJoin(item) {
  wx.request({
    url: config.configUrl + '&m=member&a=setCicleStatus',
    data: item,
    header: { "content-type": "application/x-www-form-urlencoded" },
    method: "POST",
    dataType: "json",
    success: function (res) {
      if (flag == 1) {
        wx.showToast({
          title: '加入成功',
        })
      }
    }
  })
}

// 关注、取消关注某个用户
function handleFocus(item, callback) {
  var that = this;
  var title = item.action ? '想关注我吗？' : '真的要取消关注吗？';
  var content = item.action ? '您真是太有眼光啦~' : '我辣么美~继续关注下噻~';
  var newItem = Object.assign({}, item);
  newItem.action = !newItem.action;
  wx.showModal({
    title: title,
    content: content,
    success: function (res) {
      if (res.confirm) {
        wx.request({
          url: config.configUrl + '&m=member&a=setRelationship',
          data: newItem,
          success: function (res) {
            wx.showToast({
              title: res.data.msg,
              icon: 'success',
              duration: 2000
            })
          },
          fail: function (res) {
            wx.showToast({
              title: res.data.msg,
              icon: 'success',
              duration: 2000
            })
          }
        })
      } else if (res.cancel) {

      }
    }
  })
}

// 文章点赞，取消赞
const handleZan = function(content) {
  const that = this;
  const is_like = content.is_like;
  return new Promise(function(resolve, reject) {
    wx.showLoading({
      title: '加载中',
    })

    that.req('&m=info&a=setLikeStatus', {
      id: content.id,
      action: !content.is_like,
      session3rd: token
    }, function (data) {
      console.log(111)
      if (data.flag == 1) {
        content['is_like'] = !is_like;
        if (!is_like) {
          content['post_like'] = content.post_like + 1;
        } else {
          content['post_like'] = content.post_like - 1;
        }
        // 回调函数
        resolve(content);
      } else {
        wx.showToast({
          title: data.msg,
          duration: 2000
        })
      }
      wx.hideLoading()
    })
  });
}

// 收藏、取消收藏文章
const handleCollection = function(content) {
  const that = this;
  const is_star = content.is_star;
  const title = content.is_star ? '取消收藏成功' : '收藏成功';
  return new Promise(function(resolve, reject) {
    wx.showLoading({
      title: '加载中',
    })
    that.req('&m=info&a=setStarStatus', {
      id: content.id,
      action: !content.is_star,
      session3rd: token
    }, function (data) {
      if (data.flag == 1) {
        content['is_star'] = !is_star;
        resolve(content);
      } else {
        wx.showToast({
          title: data.msg,
          duration: 2000
        })
      }
      wx.hideLoading()
    })
  })
}

module.exports = {
  req: req,
  getReq: getReq,
  errorTips: errorTips,
  handleJoin: handleJoin,
  handleFocus: handleFocus,
  handleZan: handleZan,
  handleCollection: handleCollection
}  