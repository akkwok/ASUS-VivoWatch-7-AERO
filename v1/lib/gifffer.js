;(function webpackUniversalModuleDefinition(root, factory) {
  if (typeof exports === 'object' && typeof module === 'object')
    module.exports = factory()
  else if (typeof define === 'function' && define.amd)
    define('Gifffer', [], factory)
  else if (typeof exports === 'object') exports['Gifffer'] = factory()
  else root['Gifffer'] = factory()
})(this, function() {
  // 檢查是否在客戶端執行
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return
  }
  var d = document
  var playSize = 60

  var Gifffer = function(options) {
    var images,
      i = 0,
      gifs = []

    images = d.querySelectorAll('[data-gifffer]')
    for (; i < images.length; ++i) process(images[i], gifs, options)
    // 回傳每個 GIF 容器，以便以程式方式使用
    return gifs
  }

  function formatUnit(v) {
    return v + (v.toString().indexOf('%') > 0 ? '' : 'px')
  }

  function parseStyles(styles) {
    var stylesStr = ''
    for (prop in styles) stylesStr += prop + ':' + styles[prop] + ';'
    return stylesStr
  }

  function createContainer(w, h, el, altText, opts) {
    var alt
    var con = d.createElement('BUTTON')
    var cls = el.getAttribute('class')
    var id = el.getAttribute('id')
    var playButtonStyles =
      opts && opts.playButtonStyles
        ? parseStyles(opts.playButtonStyles)
        : [
            'width:' + playSize + 'px',
            'height:' + playSize + 'px',
            'border-radius:' + playSize / 2 + 'px',
            'background:rgba(0, 0, 0, 0.3)',
            'position:absolute',
            'top:50%',
            'left:50%',
            'margin:-' + playSize / 2 + 'px'
          ].join(';')
    var playButtonIconStyles =
      opts && opts.playButtonIconStyles
        ? parseStyles(opts.playButtonIconStyles)
        : [
            'width: 0',
            'height: 0',
            'border-top: 14px solid transparent',
            'border-bottom: 14px solid transparent',
            'border-left: 14px solid rgba(0, 0, 0, 0.5)',
            'position: absolute',
            'left: 26px',
            'top: 16px'
          ].join(';')

    cls ? con.setAttribute('class', el.getAttribute('class')) : null
    id ? con.setAttribute('id', el.getAttribute('id')) : null
    con.setAttribute(
      'style',
      'position:relative;cursor:pointer;background:none;border:none;padding:0;'
    )
    con.setAttribute('tabindex', '0') // 添加 tabindex 屬性
    con.setAttribute('aria-label', '播放和暫停')

    // 創建播放按鈕
    var play = d.createElement('DIV')
    play.setAttribute('class', 'gifffer-play-button')
    play.setAttribute('style', playButtonStyles)

    var trngl = d.createElement('DIV')
    trngl.setAttribute('style', playButtonIconStyles)
    play.appendChild(trngl)

    // 創建停止按鈕
    var stop = d.createElement('DIV')
    stop.setAttribute('class', 'gifffer-stop-button')
    stop.setAttribute('style', playButtonStyles)

    var trnglStop = d.createElement('DIV')
    trnglStop.setAttribute('style', playButtonIconStyles)
    stop.appendChild(trnglStop)

    // 創建 alt 文字（如果有提供的話）
    if (altText) {
      alt = d.createElement('p')
      alt.setAttribute('class', 'gifffer-alt')
      alt.setAttribute(
        'style',
        'border:0;clip:rect(0 0 0 0);height:1px;overflow:hidden;padding:0;position:absolute;width:1px;'
      )
      alt.innerText = altText + '，影像'
    }

    // 將元素加入 DOM
    con.appendChild(play)
    el.parentNode.replaceChild(con, el)
    altText ? con.parentNode.insertBefore(alt, con.nextSibling) : null
    return { c: con, p: play, s: stop } // 回傳播放和停止按鈕
  }

  function calculatePercentageDim(el, w, h, wOrig, hOrig) {
    var parentDimW = el.parentNode.offsetWidth
    var parentDimH = el.parentNode.offsetHeight
    var ratio = wOrig / hOrig

    if (w.toString().indexOf('%') > 0) {
      w = parseInt(w.toString().replace('%', ''))
      w = (w / 100) * parentDimW
      h = w / ratio
    } else if (h.toString().indexOf('%') > 0) {
      h = parseInt(h.toString().replace('%', ''))
      h = (h / 100) * parentDimW
      w = h * ratio
    }

    return { w: w, h: h }
  }

  function process(el, gifs, options) {
    var url,
      con,
      c,
      w,
      h,
      duration,
      play,
      stop,
      gif,
      playing = false,
      cc,
      isC,
      durationTimeout,
      dims,
      altText

    url = el.getAttribute('data-gifffer')
    w = el.getAttribute('data-gifffer-width')
    h = el.getAttribute('data-gifffer-height')
    duration = el.getAttribute('data-gifffer-duration')
    altText = el.getAttribute('data-gifffer-alt')
    el.style.display = 'block'

    // 創建 canvas
    c = document.createElement('canvas')
    isC = !!(c.getContext && c.getContext('2d'))
    if (w && h && isC) cc = createContainer(w, h, el, altText, options)

    // 等待影像載入
    el.onload = function() {
      if (!isC) return

      w = w || el.width
      h = h || el.height

      // 創建容器
      if (!cc) cc = createContainer(w, h, el, altText, options)
      con = cc.c
      play = cc.p
      stop = cc.s // 獲得停止按鈕
      dims = calculatePercentageDim(con, w, h, el.width, el.height)

      // 將容器加入 GIF 陣列中
      gifs.push(con)

      // 監聽影像容器的點擊事件
      con.addEventListener('click', function() {
        clearTimeout(durationTimeout)
        if (!playing) {
          playing = true
          gif = document.createElement('IMG')
          gif.setAttribute('style', 'width:100%;height:100%;')
          gif.setAttribute('data-uri', Math.floor(Math.random() * 100000) + 1)
          setTimeout(function() {
            gif.src = url
          }, 0)
          con.removeChild(play)
          con.appendChild(stop) // 顯示停止按鈕
          con.removeChild(c)
          con.appendChild(gif)
          if (parseInt(duration) > 0) {
            durationTimeout = setTimeout(function() {
              playing = false
              con.appendChild(play)
              con.removeChild(gif)
              con.appendChild(c)
              gif = null
            }, duration)
          }
        } else {
          playing = false
          con.appendChild(play)
          con.removeChild(gif)
          con.appendChild(c)
          gif = null
          con.removeChild(stop) // 隱藏停止按鈕
        }
      })

      // 設置 canvas 尺寸
      c.width = dims.w
      c.height = dims.h
      c.getContext('2d').drawImage(el, 0, 0, dims.w, dims.h)
      con.appendChild(c)

      // 設置實際影像大小
      con.setAttribute(
        'style',
        'position:relative;cursor:pointer;width:' +
          dims.w +
          'px;height:' +
          dims.h +
          'px;background:none;border:none;padding:0;'
      )

      c.style.width = '100%'
      c.style.height = '100%'

      if (w.toString().indexOf('%') > 0 && h.toString().indexOf('%') > 0) {
        con.style.width = w
        con.style.height = h
      } else if (w.toString().indexOf('%') > 0) {
        con.style.width = w
        con.style.height = 'inherit'
      } else if (h.toString().indexOf('%') > 0) {
        con.style.width = 'inherit'
        con.style.height = h
      } else {
        con.style.width = dims.w + 'px'
        con.style.height = dims.h + 'px'
      }
    }
    el.src = url
  }

  return Gifffer
})