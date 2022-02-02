const cloud = require('wx-server-sdk')
cloud.init()
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.wxacode.get({
      path: `/pages/entry/index?room_id=${event.id}`,
      width: 430
    })
    result.img=`data:${result.contentType};base64,${result.buffer.toString('base64')}`
    delete result.buffer
    return result
  } catch (err) {
    return err
  }
}