const db = wx.cloud.database()
const app = getApp()

export function getUserInfo(param) {
    return new Promise((resolve, reject) => {
        wx.getSetting({
            success(res) {
                if (!res.authSetting["scope.userInfo"]) {
                    wx.authorize({
                        scope: 'scope.userInfo',
                        success() {
                            wx.getUserInfo({
                                ...param,
                                success: res => {
                                    resolve(res.userInfo)
                                },
                                fail: reject
                            })
                        },
                        fail: reject
                    })
                } else {
                    wx.getUserInfo({
                        ...param,
                        success: res => {
                            resolve(res.userInfo)
                        },
                        fail: reject
                    })
                }
            },
            fail: reject
        })

    })
}

export async function login() {
    let userInfo
    const metaInfo = await wx.cloud.callFunction({
        name: 'login'
    })
    const { openid, appid } = metaInfo.result
    app.globalData.openid = openid
    app.globalData.appid = appid
    const userReq = await db.collection("user").where({
        _openid: openid,
    }).get()
    if (userReq.data && userReq.data[0]) {
        userInfo = userReq.data[0]
    }
    if (!userInfo) {
        userInfo = await getUserInfo()
        await db.collection("user").add({
            data: {
                ...userInfo
            }
        })
    }
    app.globalData.userInfo = userInfo
    if (userInfo.roomID) {
        wx.redirectTo({
            url: '/pages/main/index',
        })
    } else {
        wx.redirectTo({
            url: '/pages/room_select/index',
        })
    }
}