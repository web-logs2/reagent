const { login } = require("../../utils/user")

//index.js
const app = getApp()
const db = wx.cloud.database()
Page({
  data: {

  },
  async onSubmit(e) {
    const { name } = e.detail.value
    if (!name) {
      wx.showToast({
        title: '请输入名称',
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
      data:{
        roomID:res._id
      }
    })
    wx.showToast({
      title: '创建成功',
    })
    login()
  }
})