import {
    kinds
} from '../../constance/kind'
import { request } from '../../utils/request'

Page({
    data: {
        info: {},
        propsList: [],
        title: "",
        kind: null
    },
    onLoad(option) {
        this.id = option.id
        this.fetchInfo()
    },
    getKindName(kindType) {
        const kind = kinds.find(it => it.type == kindType)
        if (kind) {
            return kind.text
        }
        return ''
    },
    onEdit() {
        wx.navigateTo({
            url: `/pages/item_edit/index?type=${this.data.kind}&id=${this.id}`,
        })
    },
    onDelete() {
        wx.showModal({
            title: 'Delete',
            content: 'Confirm delete?',
            confirmText: 'Yes',
            cancelText: 'Cancel',
            success: async (res) => {
                if (res.confirm) {
                    wx.showLoading({
                        title: 'loading...',
                    })
                    await request({
                        url: `/item/${this.id}`,
                        method: "DELETE"
                    })
                    wx.showToast({
                        title: 'delete success',
                    })
                    wx.hideLoading()
                    const pages = getCurrentPages()
                    pages[pages.length - 2].refresh()
                    wx.navigateBack()
                }
            }
        })
    },
    async fetchInfo() {
        wx.showLoading({
            title: 'loading...',
        })
        const res = await request({
            url: `/item/${this.id}`
        })
        wx.hideLoading()
        const {
            thumbnail,
            chinese_name,
            english_name,
            state,
            size,
            ...props
        } = res.info
        const propsList = Object.keys(props).map(k => ({
            k,
            v: props[k]
        }))
        this.setData({
            info: res.info || {},
            propsList,
            kind: res.type,
            title: this.getKindName(res.type)
        })
    }
})