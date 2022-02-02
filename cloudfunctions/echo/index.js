const cloud = require('wx-server-sdk')
cloud.init()
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.wxacode.get({
      path: 'page/main/index?a=1',
      width: 430
    })
      result.img=`data:${result.contentType};base64,${result.buffer.toString('base64')}`
    return result
  } catch (err) {
    return err
  }
}