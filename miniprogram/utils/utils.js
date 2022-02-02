export function debounce(fn, wait) {
  let callback = fn;
  let timerId = null;

  function debounced() {
    let context = this;
    let args = arguments;

    clearTimeout(timerId);
    timerId = setTimeout(function () {
      callback.apply(context, args);
    }, wait);
  }
  return debounced;
}

export function getThumb(src,width,height){
  const matched=src.match(/\.([\w-]+)\/(.*)/)
  return `https://${matched[1]}.tcb.qcloud.la/${matched[2]}?imageMogr2/thumbnail/${width||100}x${height||100}`
}