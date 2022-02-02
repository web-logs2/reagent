import {kinds} from '../../constance/kind'
import { getUserInfo } from '../../utils/user'
const app = getApp()
const db = wx.cloud.database()
Page({
  data: {
    currentKind: 'reagent',
    kinds: kinds,
    items: []
  },
  onLoad() {
    this.checkUser()
  },
  async checkUser(){
    const userInfo=await getUserInfo()
    if (!userInfo.roomID) {
      wx.showModal({
        title: 'Welcome',
        content: 'It looks like you haven’t joined the lab yet',
        confirmText: 'Join one',
        cancelText: 'Later',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/room_select/index',
            })
          }
        }
      })
      return
    }
  },
  onItemTap(e) {
    const index = e.currentTarget.dataset.index
    const item = this.data.items[index]
    wx.navigateTo({
      url: `/pages/item_detail/index?id=${item._id}`,
    })
  },
  goSearch(e) {
    const {kind} = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/search_result/index?kind=${kind}`,
    })
  }
})