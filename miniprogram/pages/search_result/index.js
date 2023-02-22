import {
    kinds
} from '../../constance/kind'
import {
    debounce,
} from '../../utils/utils'
import { request } from '../../utils/request'
import querystring from 'qs'

Page({
    data: {
        currentKind: null,
        currentKindText: 'Search',
        items: [],
        loading: false,
        end: false
    },
    getKindName(kindType) {
        const kind = kinds.find(it => it.type == kindType)
        if (kind) {
            return kind.text
        }
        return 'Search'
    },
    onLoad(option) {
        const kindType = option.kind
        if (kindType) {
            this.setData({
                currentKind: kindType,
                currentKindText: this.getKindName(kindType)
            }, () => {
                this.fetchItems()
            })
        } else {
            this.fetchItems()
        }
    },
    async fetchItems() {
        if (this.data.end || this.data.loading) {
            return
        }
        const type = this.data.currentKind
        const userInfo = getApp().globalData.user
        const search = this.search || ''
        this.setData({
            loading: true
        })
        const query = querystring.stringify({
            search,
            limit: 5,
            skip: this.data.items.length,
            [`sort.updateTime`]: -1,
            [`filter.roomID`]: userInfo.roomID || 'test',
            [`filter.type`]: type || undefined,
        })
        const res = await request({
            url: `/item?${query}`
        })
        if (res.length == 0) {
            this.setData({
                end: true,
                loading: false
            })
            return
        }
        this.setData({
            items: [...this.data.items, ...res],
            loading: false
        })
    },
    onPageScroll: async function (e) {
        const isBottom = await this.checkIsBottom(e)
        if (isBottom) {
            this.fetchItems()
        }
    },
    checkIsBottom(e) {
        return new Promise(resolve => {
            const query = wx.createSelectorQuery();
            query.select('.wrapper').boundingClientRect(rect => {
                if (!rect) {
                    return
                }
                const isBottom = e.scrollTop + wx.getSystemInfoSync().windowHeight > rect.height - 20
                resolve(isBottom)
            }).exec();
        })
    },
    onItemTap(e) {
        const index = e.currentTarget.dataset.index
        const item = this.data.items[index]
        wx.navigateTo({
            url: `/pages/item_detail/index?id=${item._id}`,
        })
    },
    onSearch: debounce(function (e) {
        this.search = e.detail.value
        this.refresh()
    }, 250),
    refresh() {
        this.setData({
            items: [],
            end: false
        }, () => {
            this.fetchItems()
        })
    }
})