import { getUserInfo, updateUserInfo } from "../../utils/user"

const db = wx.cloud.database()
const app = getApp()

Page({
  data: {
    roomInfo: {}
  },
  onLoad(option) {
    this.id = option.id
    if (!option.id) {
      this.onError()
      return
    }
    this.fetchRoom()
  },
  onError(){
    wx.showToast({
      title: 'Invalid room captcha',
      icon: "none"
    })
    wx.reLaunch({
      url: '/pages/entry/index',
    })
  },
  async fetchRoom() {
    const res = await db.collection("room").doc(this.id).get()
    if (!res.data) {
      this.onError()
      return
    }
    this.setData({
      roomInfo: res.data
    })
  },
  async onTap() {
    const userInfo = await getUserInfo()
    if (!userInfo.nickName) {
      wx.navigateTo({
        url: '/pages/auth/index',
      })
      return
    }
    await db.collection("user").where({
      _openid: app.globalData.appid
    }).update({
      data: {
        roomID: this.id
      }
    })
    wx.showToast({
      title: 'Join success',
      icon: "none"
    })
    await updateUserInfo()
    wx.reLaunch({
      url: '/pages/main/index',
    })
  }
})