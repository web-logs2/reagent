import {
    reagent_edit_info,
    instrument_edit_info,
    material_edit_info
} from '../../constance/item_info'
import { request, upload } from '../../utils/request'

const edit_info_map = {
    reagent: reagent_edit_info,
    instrument: instrument_edit_info,
    material: material_edit_info
}

Page({
    data: {
        edit_info: reagent_edit_info,
        formData: {},
        title: '',
        item: {}
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
    async onImageUpload(e) {
        const {
            field
        } = e.currentTarget.dataset
        const filePath = await new Promise((resolve, reject) => {
            wx.chooseMedia({
                count: 1,
                mediaType: ['image'],
                success: (res) => {
                    resolve(res.tempFiles[0].tempFilePath)
                },
                fail(e) {
                    reject(e)
                }
            })
        });
        wx.showLoading()
        const fileUrl = await upload(filePath)
        wx.hideLoading()
        this.setData({
            [`formData.${field}`]: fileUrl
        })
    },
    async onSubmit(e) {
        wx.showLoading({
          title: 'loading...',
        })
        const userInfo = getApp().globalData.user
        const formData = this.data.formData
        const info_map = edit_info_map[this.type]
        info_map.forEach(it => {
            if (it.type == 'checkbox' && !formData[it.name]) {
                formData[it.name] = it.values[0]
            }
        })
        if (this.id) {
            await request({
                url: `/item/${this.id}`,
                method: "POST",
                data: {
                    ...this.data.item,
                    info: formData,
                }
            })
        } else {
            await request({
                url: "/item",
                method: "POST",
                data: {
                    _id: "",
                    roomID: userInfo.roomID || 'test',
                    info: formData,
                    type: this.type,
                }
            })
        }
        wx.hideLoading()
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
        const res = await request({
            url: `/item/${this.id}`
        })
        this.setData({
            formData: res.info || {},
            item: res
        })
        wx.hideLoading()
    }
})