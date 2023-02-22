import { request } from './request'

export async function checkLogin() {
    let token = getApp().globalData.token
    if (!token) {
        token = wx.getStorageSync('token')
    }
    if (!token) {
        await login()
    } else {
        getApp().globalData.token = token;
    }
}

export async function login() {
    const code = await new Promise((resolve, reject) => {
        wx.login({
            success(res) {
                if (res.code) {
                    resolve(res.code)
                } else {
                    reject('登录失败！' + res.errMsg)
                }
            }
        });
    })
    const token = await request({
        url: "/user/login",
        method: "POST",
        data: {
            wechat_code: code
        }
    })
    wx.setStorageSync('token', token)
    getApp().globalData.token = token
}

export function getUserInfoFromWX() {
    return new Promise((resolve, reject) => {
        wx.getSetting({
            success(res) {
                if (!res.authSetting["scope.userInfo"]) {
                    reject("no scope.userInfo")
                } else {
                    wx.getUserInfo({
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

export async function refreshUser(){
    const user = await request({
        url: "/user/info"
    })
    getApp().globalData.user = user;
    return user
}