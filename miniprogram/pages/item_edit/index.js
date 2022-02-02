import {
  reagent_edit_info,
  instrument_edit_info,
  material_edit_info
} from '../../constance/item_info'
import {
  getUserInfo
} from '../../utils/user'

const edit_info_map = {
  reagent: reagent_edit_info,
  instrument: instrument_edit_info,
  material: material_edit_info
}
const db = wx.cloud.database()
const app = getApp()
Page({
  data: {
    edit_info: reagent_edit_info,
    formData: {},
    title: ''
  },
  onLoad(option) {
    this.type = option.type
    this.id = option.id
    if (option.type && edit_info_map[option.type]) {
      this.setData({
        edit_info: edit_info_map[option.type],
        title: this.id ? `Edit ${this.type}` : `Create ${this.type}`
      })
    }
    if (this.id) {
      this.fetchInfo()
    }
  },
  formInputChange(e) {
    const {
      field
    } = e.currentTarget.dataset
    this.setData({
      [`formData.${field}`]: e.detail.value
    })
  },
  onImageUpload(e) {
    const {
      field
    } = e.currentTarget.dataset
    wx.chooseImage({
      count: 1,
      success: (res) => {
        const tempFilePaths = res.tempFilePaths
        const imgName = `${Math.random().toString(36).substring(2)}.png`
        wx.showLoading()
        wx.cloud.uploadFile({
          cloudPath: imgName,
          filePath: tempFilePaths[0],
          success: (res) => {
            wx.hideLoading()
            this.setData({
              [`formData.${field}`]: res.fileID
            })
          }
        })
      }
    })
  },
  async onSubmit(e) {
    const userInfo = await getUserInfo()
    const formData = this.data.formData
    const info_map = edit_info_map[this.type]
    info_map.forEach(it => {
      if (it.type == 'checkbox' && !formData[it.name]) {
        formData[it.name] = it.values[0]
      }
    })
    if (this.id) {
      await db.collection("item").doc(this.id).update({
        data: {
          info: formData,
          updateTime: new Date(),
        }
      })
    } else {
      await db.collection("item").add({
        data: {
          info: formData,
          type: this.type,
          roomID: userInfo.roomID || 'test',
          createTime: new Date(),
          updateTime: new Date(),
        }
      })
    }
    wx.showToast({
      title: 'Success',
    })
    if (this.id) {
      const pages = getCurrentPages()
      pages[pages.length - 2].fetchInfo()
      pages[pages.length - 3].refresh()
      wx.navigateBack()
    } else {
      wx.reLaunch({
        url: '/pages/main/index',
      })
    }
  },
  async fetchInfo() {
    wx.showLoading()
    const res = await db.collection("item").doc(this.id).get()
    this.setData({
      formData: res.data.info || {},
    })
    wx.hideLoading()
  }
})