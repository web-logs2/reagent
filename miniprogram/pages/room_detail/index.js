import { request } from '../../utils/request'
Page({
    data: {
        room_info: {},
        users: [],
        qrModalHidden: true,
        userInfo: {},
    },
    onLoad() {
        this.setData({
            userInfo: getApp().globalData.user
        })
        this.fetchRoom()
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
        wx.showLoading({
          title: 'loading...',
        })
        const res = await request({
            url: `/room/${this.data.userInfo.roomID}`
        })
        wx.hideLoading()
        this.setData({
            room_info: res.room,
            users: res.users,
        })
    },
    async leaveRoom() {
        await request({
            url: "/user/set_room",
            method: "POST",
            data: {
                room_id: ""
            }
        })
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