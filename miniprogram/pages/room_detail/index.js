const { getUserInfo, updateUserInfo } = require("../../utils/user")

const app = getApp()
const db = wx.cloud.database()
Page({
  data: {
    room_info: {},
    users: [],
    qrModalHidden: true,
    qrInfo: {},
    userInfo: {},
  },
  onLoad() {
    this.fetchUser().then(()=>{
      this.fetchRoom()
      this.fetchUsers()
      this.fetchQrcode()
    })
  },
  async fetchUser(){
    const userInfo=await getUserInfo()
    this.setData({
      userInfo
    })
  },
  modalShow() {
    this.setData({
      qrModalHidden: false
    })
  },
  modalHide() {
    this.setData({
      qrModalHidden: true
    })
  },
  async fetchRoom() {
    const res = await db.collection("room").doc(this.data.userInfo.roomID).get()
    this.setData({
      room_info: res.data
    })
  },
  async fetchUsers() {
    const res = await db.collection("user").where({
      roomID: this.data.userInfo.roomID
    }).get()
    this.setData({
      users: res.data
    })
  },
  async fetchQrcode() {
    const qrInfo = await wx.cloud.callFunction({
      name: 'room_qrcode',
      data: {
        id: this.data.userInfo.roomID
      }
    })
    this.setData({
      qrInfo: qrInfo.result
    })
  },
  async leaveRoom() {
    await db.collection("user").where({
      _openid: app.globalData.appid
    }).update({
      data: {
        roomID: null
      }
    })
    await updateUserInfo()
    wx.reLaunch({
      url: '/pages/entry/index',
    })
  },
  onLeave() {
    wx.showModal({
      title: 'Leave',
      content: 'are you sure?',
      success: (sm) => {
        if (sm.confirm) {
          this.leaveRoom()
        }
      }
    })
  }
})