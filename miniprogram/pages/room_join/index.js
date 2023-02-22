import { request } from '../../utils/request'

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
    onError() {
        wx.showToast({
            title: 'Invalid room captcha',
            icon: "none"
        })
        wx.reLaunch({
            url: '/pages/entry/index',
        })
    },
    async fetchRoom() {
        const res = await request({
            url: `/room/${this.id}`
        })
        this.setData({
            roomInfo: res.room
        })
    },
    async onTap() {
        const userInfo = getApp().globalData.user
        if (!userInfo.nickName) {
            wx.navigateTo({
                url: '/pages/auth/index',
            })
            return
        }
        await request({
            url: "/user/set_room",
            method: "POST",
            data: {
                room_id: this.id
            }
        })
        wx.showToast({
            title: 'Join success',
            icon: "none"
        })
        wx.reLaunch({
            url: '/pages/entry/index',
        })
    }
})