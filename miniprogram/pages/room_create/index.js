const { updateUserInfo,getUserInfo } = require("../../utils/user")

//index.js
const app = getApp()
const db = wx.cloud.database()
Page({
  data: {

  },
  async onSubmit(e) {
    const userInfo = await getUserInfo()
    if (!userInfo.nickName) {
      wx.navigateTo({
        url: '/pages/auth/index',
      })
      return
    }
    const {
      name
    } = e.detail.value
    if (!name) {
      wx.showToast({
        title: 'Please input name',
        icon: "none"
      })
      return
    }
    const res = await db.collection("room").add({
      data: {
        name,
      }
    })
    await db.collection("user").where({
      _openid: app.globalData.appid
    }).update({
      data: {
        roomID: res._id
      }
    })
    wx.showToast({
      title: 'Create success',
    })
    await updateUserInfo()
    wx.reLaunch({
      url: '/pages/main/index',
    })
  }
})