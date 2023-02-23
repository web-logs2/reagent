
const API_ENDPOINT = "https://reagent.city-servicer.com/api"

export interface RequestOptions {
    url: string,
    method?: WechatMiniprogram.RequestOption["method"],
    data?: WechatMiniprogram.RequestOption["data"],
}

export function request(opts: RequestOptions) {
    let token = getApp().globalData.token
    return new Promise((resolve, reject) => {
        wx.request({
            url: `${API_ENDPOINT}${opts.url}`,
            method: opts.method,
            data: opts.data,
            header: {
                'content-type': 'application/json',
                'Authorization': token,
            },
            success: (res) => {
                if (res.statusCode == 401) {
                    wx.setStorageSync('token', null)
                    getApp().globalData.token = null
                    setTimeout(() => {
                        wx.reLaunch({
                            url: '/pages/entry/index',
                        })
                    }, 1000)
                    return;
                }
                if (res.statusCode != 200) {
                    wx.showToast({
                        icon:"none",
                        title: res.data.toString()
                    })
                    reject(res.data)
                } else {
                    resolve(res.data)
                }
            },
            fail: (err) => {
                wx.showToast({
                    icon:"none",
                    title: err.errMsg
                })
                reject(err)
            }
        })
    })
}

export function upload(filePath: string) {
    return new Promise((resolve, reject) => {
        wx.uploadFile({
            url: `${API_ENDPOINT}/upload`,
            filePath,
            name: "file",
            formData: {},
            header: {
                "Content-Type": "multipart/form-data"
            },
            success: function (res) {
                if (res.statusCode != 200) {
                    wx.showToast({
                        icon:"none",
                        title: res.data.toString()
                    })
                    reject(res.data)
                } else {
                    resolve(res.data)
                }
            },
            fail: function (e) {
                reject(e)
            }
        })
    })
}