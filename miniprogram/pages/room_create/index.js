import { request } from '../../utils/request'
Page({
    data: {

    },
    async onSubmit(e) {
        const user = getApp().globalData.user
        if (!user) {
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
        await request({
            url: "/room",
            method: "POST",
            data: {
                name
            }
        })
        wx.showToast({
            title: 'Create success',
        })
        wx.reLaunch({
            url: '/pages/entry/index',
        })
    }
})