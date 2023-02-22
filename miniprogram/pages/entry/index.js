import { checkLogin, refreshUser } from "../../utils/login"

Page({
    data: {

    },
    async onLoad(option) {
        await checkLogin()
        const user = await refreshUser()
        if (!user.roomID && option.room_id) {
            wx.navigateTo({
                url: `/pages/room_join/index?id=${option.room_id}`,
            })
        } else {
            wx.reLaunch({
                url: '/pages/main/index',
            })
        }
    }
})