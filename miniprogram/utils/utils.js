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
