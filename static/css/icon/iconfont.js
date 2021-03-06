;(function(window) {

  var svgSprite = '<svg>' +
    '' +
    '<symbol id="icon-icon" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M127.941927 255.903298l0-29.760814c0-54.56985 44.237527-98.806353 98.806353-98.806353l29.115108 0L255.863389 64.021106l-46.455031 0c-80.316234 0-145.426137 65.109903-145.426137 145.426137l0 46.455031L127.941927 255.902274z"  ></path>' +
    '' +
    '<path d="M767.54821 127.335107l29.114085 0c54.56985 0 98.806353 44.237527 98.806353 98.806353l0 29.760814 63.960731 0 0-46.455031c0-80.317257-65.109903-145.426137-145.426137-145.426137l-46.455031 0L767.54821 127.335107z"  ></path>' +
    '' +
    '<path d="M255.863389 892.931872l-29.115108 0c-54.56985 0-98.806353-44.237527-98.806353-98.806353l0-26.5374L63.981197 767.588119l0 46.455031c0 80.317257 65.109903 145.426137 145.426137 145.426137l46.455031 0L255.862365 892.931872z"  ></path>' +
    '' +
    '<path d="M895.469672 767.588119l0 26.5374c0 54.56985-44.237527 98.806353-98.806353 98.806353l-29.115108 0 0 66.538439 46.455031 0c80.317257 0 145.426137-65.109903 145.426137-145.426137l0-46.455031L895.469672 767.589143z"  ></path>' +
    '' +
    '<path d="M63.981197 511.745197l895.449205 0 0 63.960731-895.449205 0 0-63.960731Z"  ></path>' +
    '' +
    '<path d="M191.902658 255.903298l63.960731 0 0 191.882192-63.960731 0 0-191.882192Z"  ></path>' +
    '' +
    '<path d="M383.78485 255.903298l63.960731 0 0 191.882192-63.960731 0 0-191.882192Z"  ></path>' +
    '' +
    '<path d="M511.706311 255.903298l63.960731 0 0 191.882192-63.960731 0 0-191.882192Z"  ></path>' +
    '' +
    '<path d="M639.627772 255.903298l63.960731 0 0 191.882192-63.960731 0 0-191.882192Z"  ></path>' +
    '' +
    '<path d="M767.54821 255.903298l63.960731 0 0 191.882192-63.960731 0 0-191.882192Z"  ></path>' +
    '' +
    '<path d="M191.902658 639.666658l63.960731 0 0 191.882192-63.960731 0 0-191.882192Z"  ></path>' +
    '' +
    '<path d="M383.78485 639.666658l63.960731 0 0 191.882192-63.960731 0 0-191.882192Z"  ></path>' +
    '' +
    '<path d="M511.706311 639.666658l63.960731 0 0 191.882192-63.960731 0 0-191.882192Z"  ></path>' +
    '' +
    '<path d="M639.627772 639.666658l63.960731 0 0 191.882192-63.960731 0 0-191.882192Z"  ></path>' +
    '' +
    '<path d="M767.54821 639.666658l63.960731 0 0 191.882192-63.960731 0 0-191.882192Z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-wode" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M582.3952 516.099269 413.265278 516.099269c-144.737676 0-262.159072 120.34535-262.159072 268.699502l0 17.313142c0 60.634394 117.344456 60.711334 262.159072 60.711334l169.129922 0c144.737612 0 262.159072-2.231479 262.159072-60.711334l0-17.313142C844.554208 636.444603 727.132812 516.099269 582.3952 516.099269zM292.996788 279.717472c0 113.126388 91.707039 204.833443 204.833443 204.833443s204.833443-91.707039 204.833443-204.833443S610.956587 74.884061 497.830215 74.884061 292.996788 166.591099 292.996788 279.717472z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-shouyeshouye" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M936.741146 462.413652c-0.412392-14.641465-3.319605-25.442462-13.707187-40.293705-1.973958-3.010567-319.019801-341.836459-319.019801-341.836459-22.017456-23.469528-51.064003-34.71157-80.242556-34.738176L523.771603 45.311998c-0.418532-0.025583-0.938372 0.130983-1.457188 0.130983s-1.037632-0.156566-1.557472-0.130983l0 0.233314c-29.076222 0.025583-58.151421 11.268648-80.272231 34.738176 0 0-316.939419 338.825892-318.912353 341.836459-10.384511 14.851243-13.291724 25.65224-13.70821 40.293705 0 0 0 5.088902 0 5.504364 0 46.210461 37.488823 83.755566 83.70133 83.755566l20.041452 0 0 300.375162c0 48.91199 43.925419 88.529289 98.032734 88.529289 54.105269 0 97.927333-39.616276 97.927333-88.529289L407.566998 551.672558l113.190969 0 3.01466 0 113.162316 0 0 300.375162c0 48.91199 43.929512 88.529289 98.03478 88.529289s97.924263-39.616276 97.924263-88.529289L832.893986 551.672558l20.045545 0c46.314839 0 83.802638-37.543058 83.802638-83.755566 0-0.416486-0.102331-0.830925-0.102331-1.245364L936.741146 462.413652zM811.918255 159.621441l0.520863 0.649799 63.035662 66.618257c8.930393 9.397021 23.679305 9.813506 33.023114 0.933255 0.103354-0.051165 0.103354-0.155543 0.314155-0.258896l0.827855-0.778736c2.802836-2.90619 4.466732-5.502317 5.506411-10.488889 0.206708-0.934279 0.310062-1.973958 0.411369-2.959402 0.207731-1.090844 0.414439-2.128477 0.51984-3.428076l7.272637-123.629715c0.518816-9.009188-2.804882-17.029862-8.306176-22.949688l0-0.052189c-0.107447-0.077771-0.211824-0.181125-0.316202-0.258896-0.104377-0.104377-0.205685-0.207731-0.312108-0.338714l0 0.025583c-5.605671-5.865591-13.397125-9.605775-22.428825-9.578146l-123.889635 0.311085c-1.348718 0.052189-2.284019 0.130983-3.427052 0.234337-1.041726 0.076748-1.977028 0.104377-2.908236 0.284479-5.088902 0.75213-7.788383 2.232854-10.905374 4.958942l-0.831948 0.831948c0 0.051165-0.207731 0.128937-0.207731 0.181125-9.340739 8.905834-9.762341 23.651676-0.936325 33.04972L811.918255 159.621441z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '</svg>'
  var script = function() {
    var scripts = document.getElementsByTagName('script')
    return scripts[scripts.length - 1]
  }()
  var shouldInjectCss = script.getAttribute("data-injectcss")

  /**
   * document ready
   */
  var ready = function(fn) {
    if (document.addEventListener) {
      if (~["complete", "loaded", "interactive"].indexOf(document.readyState)) {
        setTimeout(fn, 0)
      } else {
        var loadFn = function() {
          document.removeEventListener("DOMContentLoaded", loadFn, false)
          fn()
        }
        document.addEventListener("DOMContentLoaded", loadFn, false)
      }
    } else if (document.attachEvent) {
      IEContentLoaded(window, fn)
    }

    function IEContentLoaded(w, fn) {
      var d = w.document,
        done = false,
        // only fire once
        init = function() {
          if (!done) {
            done = true
            fn()
          }
        }
        // polling for no errors
      var polling = function() {
        try {
          // throws errors until after ondocumentready
          d.documentElement.doScroll('left')
        } catch (e) {
          setTimeout(polling, 50)
          return
        }
        // no errors, fire

        init()
      };

      polling()
        // trying to always fire before onload
      d.onreadystatechange = function() {
        if (d.readyState == 'complete') {
          d.onreadystatechange = null
          init()
        }
      }
    }
  }

  /**
   * Insert el before target
   *
   * @param {Element} el
   * @param {Element} target
   */

  var before = function(el, target) {
    target.parentNode.insertBefore(el, target)
  }

  /**
   * Prepend el to target
   *
   * @param {Element} el
   * @param {Element} target
   */

  var prepend = function(el, target) {
    if (target.firstChild) {
      before(el, target.firstChild)
    } else {
      target.appendChild(el)
    }
  }

  function appendSvg() {
    var div, svg

    div = document.createElement('div')
    div.innerHTML = svgSprite
    svgSprite = null
    svg = div.getElementsByTagName('svg')[0]
    if (svg) {
      svg.setAttribute('aria-hidden', 'true')
      svg.style.position = 'absolute'
      svg.style.width = 0
      svg.style.height = 0
      svg.style.overflow = 'hidden'
      prepend(svg, document.body)
    }
  }

  if (shouldInjectCss && !window.__iconfont__svg__cssinject__) {
    window.__iconfont__svg__cssinject__ = true
    try {
      document.write("<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>");
    } catch (e) {
      console && console.log(e)
    }
  }

  ready(appendSvg)


})(window)