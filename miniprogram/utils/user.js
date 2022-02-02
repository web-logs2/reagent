const db = wx.cloud.database()
const app = getApp()

export function getUserInfoFromWX(param) {
    return new Promise((resolve, reject) => {
        wx.getSetting({
            success(res) {
                if (!res.authSetting["scope.userInfo"]) {
                    reject("no scope.userInfo")
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

let openid, appid, userInfo

export async function getMetaInfo() {
    if (!openid || !appid) {
        const metaInfo = await wx.cloud.callFunction({
            name: 'login'
        })
        openid = metaInfo.result.openid
        appid = metaInfo.result.appid
    }
    return {
        openid,
        appid
    }
}

export async function updateUserInfo() {
    const userReq = await db.collection("user").where({
        _openid: openid,
    }).get()
    if (userReq.data && userReq.data[0]) {
        userInfo = userReq.data[0]
    }
}

export async function getUserInfo() {
    await getMetaInfo()
    if (!userInfo) {
        await updateUserInfo()
    }
    if (!userInfo) {
        try {
            userInfo = await getUserInfoFromWX()
        } catch (err) {

        }
        if (userInfo) {
            await db.collection("user").add({
                data: {
                    ...userInfo
                }
            })
        }
    } else if (!userInfo.nickName) {
        let _userInfo
        try {
            _userInfo = await getUserInfoFromWX()
        } catch (err) {}
        if (_userInfo) {
            await db.collection("user").where({
                _openid: appid
            }).update({
                data: {
                    ..._userInfo
                }
            })
            userInfo = {
                ...userInfo,
                ..._userInfo
            }
        }
    }
    return {
        openid,
        appid,
        ...userInfo
    }
}