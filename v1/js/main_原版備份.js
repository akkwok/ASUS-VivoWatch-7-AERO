!(function () {
  "use strict";
  function e(n) {
    return "undefined" == typeof this ||
      Object.getPrototypeOf(this) !== e.prototype
      ? new e(n)
      : ((O = this),
        (O.version = "3.3.1"),
        (O.tools = new E()),
        O.isSupported()
          ? (O.tools.extend(O.defaults, n || {}),
            t(O.defaults),
            (O.store = { elements: {}, containers: [] }),
            (O.sequences = {}),
            (O.history = []),
            (O.uid = 0),
            (O.initialized = !1))
          : "undefined" != typeof console && null !== console,
        O);
  }
  function t(e) {
    if (e && e.container) {
      if ("string" == typeof e.container)
        return window.document.documentElement.querySelector(e.container);
      if (O.tools.isNode(e.container)) return e.container;
    }
    return O.defaults.container;
  }
  function n(e, t) {
    return "string" == typeof e
      ? Array.prototype.slice.call(t.querySelectorAll(e))
      : O.tools.isNode(e)
      ? [e]
      : O.tools.isNodeList(e)
      ? Array.prototype.slice.call(e)
      : [];
  }
  function i() {
    return ++O.uid;
  }
  function o(e, t, n) {
    t.container && (t.container = n),
      e.config
        ? (e.config = O.tools.extendClone(e.config, t))
        : (e.config = O.tools.extendClone(O.defaults, t)),
      "top" === e.config.origin || "bottom" === e.config.origin
        ? (e.config.axis = "Y")
        : (e.config.axis = "X");
  }
  function r(e) {
    var t = window.getComputedStyle(e.domEl);
    e.styles ||
      ((e.styles = { transition: {}, transform: {}, computed: {} }),
      (e.styles.inline = e.domEl.getAttribute("style") || ""),
      (e.styles.inline += "; visibility: visible; "),
      (e.styles.computed.opacity = t.opacity),
      t.transition && "all 0s ease 0s" !== t.transition
        ? (e.styles.computed.transition = t.transition + ", ")
        : (e.styles.computed.transition = "")),
      (e.styles.transition.instant = s(e, 0)),
      (e.styles.transition.delayed = s(e, e.config.delay)),
      (e.styles.transform.initial = " -webkit-transform:"),
      (e.styles.transform.target = " -webkit-transform:"),
      a(e),
      (e.styles.transform.initial += "transform:"),
      (e.styles.transform.target += "transform:"),
      a(e);
  }
  function s(e, t) {
    var n = e.config;
    return (
      "-webkit-transition: " +
      e.styles.computed.transition +
      "-webkit-transform " +
      n.duration / 1e3 +
      "s " +
      n.easing +
      " " +
      t / 1e3 +
      "s, opacity " +
      n.duration / 1e3 +
      "s " +
      n.easing +
      " " +
      t / 1e3 +
      "s; transition: " +
      e.styles.computed.transition +
      "transform " +
      n.duration / 1e3 +
      "s " +
      n.easing +
      " " +
      t / 1e3 +
      "s, opacity " +
      n.duration / 1e3 +
      "s " +
      n.easing +
      " " +
      t / 1e3 +
      "s; "
    );
  }
  function a(e) {
    var t,
      n = e.config,
      i = e.styles.transform;
    (t =
      "top" === n.origin || "left" === n.origin
        ? /^-/.test(n.distance)
          ? n.distance.substr(1)
          : "-" + n.distance
        : n.distance),
      parseInt(n.distance) &&
        ((i.initial += " translate" + n.axis + "(" + t + ")"),
        (i.target += " translate" + n.axis + "(0)")),
      n.scale &&
        ((i.initial += " scale(" + n.scale + ")"), (i.target += " scale(1)")),
      n.rotate.x &&
        ((i.initial += " rotateX(" + n.rotate.x + "deg)"),
        (i.target += " rotateX(0)")),
      n.rotate.y &&
        ((i.initial += " rotateY(" + n.rotate.y + "deg)"),
        (i.target += " rotateY(0)")),
      n.rotate.z &&
        ((i.initial += " rotateZ(" + n.rotate.z + "deg)"),
        (i.target += " rotateZ(0)")),
      (i.initial += "; opacity: " + n.opacity + ";"),
      (i.target += "; opacity: " + e.styles.computed.opacity + ";");
  }
  function l(e) {
    var t = e.config.container;
    t &&
      O.store.containers.indexOf(t) === -1 &&
      O.store.containers.push(e.config.container),
      (O.store.elements[e.id] = e);
  }
  function c(e, t, n) {
    var i = { target: e, config: t, interval: n };
    O.history.push(i);
  }
  function f() {
    if (O.isSupported()) {
      y();
      for (var e = 0; e < O.store.containers.length; e++)
        O.store.containers[e].addEventListener("scroll", d),
          O.store.containers[e].addEventListener("resize", d);
      O.initialized ||
        (window.addEventListener("scroll", d),
        window.addEventListener("resize", d),
        (O.initialized = !0));
    }
    return O;
  }
  function d() {
    T(y);
  }
  function u() {
    var e, t, n, i;
    O.tools.forOwn(O.sequences, function (o) {
      (i = O.sequences[o]), (e = !1);
      for (var r = 0; r < i.elemIds.length; r++)
        (n = i.elemIds[r]), (t = O.store.elements[n]), q(t) && !e && (e = !0);
      i.active = e;
    });
  }
  function y() {
    var e, t;
    u(),
      O.tools.forOwn(O.store.elements, function (n) {
        (t = O.store.elements[n]),
          (e = w(t)),
          g(t)
            ? (t.config.beforeReveal(t.domEl),
              e
                ? t.domEl.setAttribute(
                    "style",
                    t.styles.inline +
                      t.styles.transform.target +
                      t.styles.transition.delayed
                  )
                : t.domEl.setAttribute(
                    "style",
                    t.styles.inline +
                      t.styles.transform.target +
                      t.styles.transition.instant
                  ),
              p("reveal", t, e),
              (t.revealing = !0),
              (t.seen = !0),
              t.sequence && m(t, e))
            : v(t) &&
              (t.config.beforeReset(t.domEl),
              t.domEl.setAttribute(
                "style",
                t.styles.inline +
                  t.styles.transform.initial +
                  t.styles.transition.instant
              ),
              p("reset", t),
              (t.revealing = !1));
      });
  }
  function m(e, t) {
    var n = 0,
      i = 0,
      o = O.sequences[e.sequence.id];
    (o.blocked = !0),
      t && "onload" === e.config.useDelay && (i = e.config.delay),
      e.sequence.timer &&
        ((n = Math.abs(e.sequence.timer.started - new Date())),
        window.clearTimeout(e.sequence.timer)),
      (e.sequence.timer = { started: new Date() }),
      (e.sequence.timer.clock = window.setTimeout(function () {
        (o.blocked = !1), (e.sequence.timer = null), d();
      }, Math.abs(o.interval) + i - n));
  }
  function p(e, t, n) {
    var i = 0,
      o = 0,
      r = "after";
    switch (e) {
      case "reveal":
        (o = t.config.duration), n && (o += t.config.delay), (r += "Reveal");
        break;
      case "reset":
        (o = t.config.duration), (r += "Reset");
    }
    t.timer &&
      ((i = Math.abs(t.timer.started - new Date())),
      window.clearTimeout(t.timer.clock)),
      (t.timer = { started: new Date() }),
      (t.timer.clock = window.setTimeout(function () {
        t.config[r](t.domEl), (t.timer = null);
      }, o - i));
  }
  function g(e) {
    if (e.sequence) {
      var t = O.sequences[e.sequence.id];
      return t.active && !t.blocked && !e.revealing && !e.disabled;
    }
    return q(e) && !e.revealing && !e.disabled;
  }
  function w(e) {
    var t = e.config.useDelay;
    return (
      "always" === t ||
      ("onload" === t && !O.initialized) ||
      ("once" === t && !e.seen)
    );
  }
  function v(e) {
    if (e.sequence) {
      var t = O.sequences[e.sequence.id];
      return !t.active && e.config.reset && e.revealing && !e.disabled;
    }
    return !q(e) && e.config.reset && e.revealing && !e.disabled;
  }
  function b(e) {
    return { width: e.clientWidth, height: e.clientHeight };
  }
  function h(e) {
    if (e && e !== window.document.documentElement) {
      var t = x(e);
      return { x: e.scrollLeft + t.left, y: e.scrollTop + t.top };
    }
    return { x: window.pageXOffset, y: window.pageYOffset };
  }
  function x(e) {
    var t = 0,
      n = 0,
      i = e.offsetHeight,
      o = e.offsetWidth;
    do
      isNaN(e.offsetTop) || (t += e.offsetTop),
        isNaN(e.offsetLeft) || (n += e.offsetLeft),
        (e = e.offsetParent);
    while (e);
    return { top: t, left: n, height: i, width: o };
  }
  function q(e) {
    function t() {
      var t = c + a * s,
        n = f + l * s,
        i = d - a * s,
        y = u - l * s,
        m = r.y + e.config.viewOffset.top,
        p = r.x + e.config.viewOffset.left,
        g = r.y - e.config.viewOffset.bottom + o.height,
        w = r.x - e.config.viewOffset.right + o.width;
      return t < g && i > m && n > p && y < w;
    }
    function n() {
      return "fixed" === window.getComputedStyle(e.domEl).position;
    }
    var i = x(e.domEl),
      o = b(e.config.container),
      r = h(e.config.container),
      s = e.config.viewFactor,
      a = i.height,
      l = i.width,
      c = i.top,
      f = i.left,
      d = c + a,
      u = f + l;
    return t() || n();
  }
  function E() {}
  var O, T;
  (e.prototype.defaults = {
    origin: "bottom",
    distance: "20px",
    duration: 500,
    delay: 0,
    rotate: { x: 0, y: 0, z: 0 },
    opacity: 0,
    scale: 0.9,
    easing: "cubic-bezier(0.6, 0.2, 0.1, 1)",
    container: window.document.documentElement,
    mobile: !0,
    reset: !1,
    useDelay: "always",
    viewFactor: 0.2,
    viewOffset: { top: 0, right: 0, bottom: 0, left: 0 },
    beforeReveal: function (e) {},
    afterReveal: function (e) {},
    beforeReset: function (e) {},
    afterReset: function (e) {}
  }),
    (e.prototype.isSupported = function () {
      var e = document.documentElement.style;
      return (
        ("WebkitTransition" in e && "WebkitTransform" in e) ||
        ("transition" in e && "transform" in e)
      );
    }),
    (e.prototype.reveal = function (e, s, a, d) {
      var u, y, m, p, g, w;
      if (
        (void 0 !== s && "number" == typeof s
          ? ((a = s), (s = {}))
          : (void 0 !== s && null !== s) || (s = {}),
        (u = t(s)),
        (y = n(e, u)),
        !y.length)
      )
        return O;
      a &&
        "number" == typeof a &&
        ((w = i()),
        (g = O.sequences[w] = { id: w, interval: a, elemIds: [], active: !1 }));
      for (var v = 0; v < y.length; v++)
        (p = y[v].getAttribute("data-sr-id")),
          p
            ? (m = O.store.elements[p])
            : ((m = { id: i(), domEl: y[v], seen: !1, revealing: !1 }),
              m.domEl.setAttribute("data-sr-id", m.id)),
          g &&
            ((m.sequence = { id: g.id, index: g.elemIds.length }),
            g.elemIds.push(m.id)),
          o(m, s, u),
          r(m),
          l(m),
          (O.tools.isMobile() && !m.config.mobile) || !O.isSupported()
            ? (m.domEl.setAttribute("style", m.styles.inline),
              (m.disabled = !0))
            : m.revealing ||
              m.domEl.setAttribute(
                "style",
                m.styles.inline + m.styles.transform.initial
              );
      return (
        !d &&
          O.isSupported() &&
          (c(e, s, a),
          O.initTimeout && window.clearTimeout(O.initTimeout),
          (O.initTimeout = window.setTimeout(f, 0))),
        O
      );
    }),
    (e.prototype.sync = function () {
      if (O.history.length && O.isSupported()) {
        for (var e = 0; e < O.history.length; e++) {
          var t = O.history[e];
          O.reveal(t.target, t.config, t.interval, !0);
        }
        f();
      }
      return O;
    }),
    (E.prototype.isObject = function (e) {
      return null !== e && "object" == typeof e && e.constructor === Object;
    }),
    (E.prototype.isNode = function (e) {
      return "object" == typeof window.Node
        ? e instanceof window.Node
        : e &&
            "object" == typeof e &&
            "number" == typeof e.nodeType &&
            "string" == typeof e.nodeName;
    }),
    (E.prototype.isNodeList = function (e) {
      var t = Object.prototype.toString.call(e),
        n = /^\[object (HTMLCollection|NodeList|Object)\]$/;
      return "object" == typeof window.NodeList
        ? e instanceof window.NodeList
        : e &&
            "object" == typeof e &&
            n.test(t) &&
            "number" == typeof e.length &&
            (0 === e.length || this.isNode(e[0]));
    }),
    (E.prototype.forOwn = function (e, t) {
      if (!this.isObject(e))
        throw new TypeError(
          'Expected "object", but received "' + typeof e + '".'
        );
      for (var n in e) e.hasOwnProperty(n) && t(n);
    }),
    (E.prototype.extend = function (e, t) {
      return (
        this.forOwn(
          t,
          function (n) {
            this.isObject(t[n])
              ? ((e[n] && this.isObject(e[n])) || (e[n] = {}),
                this.extend(e[n], t[n]))
              : (e[n] = t[n]);
          }.bind(this)
        ),
        e
      );
    }),
    (E.prototype.extendClone = function (e, t) {
      return this.extend(this.extend({}, e), t);
    }),
    (E.prototype.isMobile = function () {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    }),
    (T =
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      function (e) {
        window.setTimeout(e, 1e3 / 60);
      }),
    "function" == typeof define && "object" == typeof define.amd && define.amd
      ? define(function () {
          return e;
        })
      : "undefined" != typeof module && module.exports
      ? (module.exports = e)
      : (window.ScrollReveal = e);
})();

$(function () {
    !(function (t) {
        t.on("keydown", function (t) {
            var e = t.keyCode ? t.keyCode : t.which;
            if (e === 32) {
                t.preventDefault();
            }
            if (e === 13 || e === 32) {
                $(this).click();
            }
        });
    })($('a, [role="button"], [tabindex="0"], .lightbox .trigger-close')),
    
    $('a[href*="#"]:not([href="#"])').click(function () {
        if (
            location.pathname.replace(/^\//, "") ==
            this.pathname.replace(/^\//, "") &&
            location.hostname == this.hostname
        ) {
            var t = $(this.hash);
            if ((t = t.length ? t : $("[name=" + this.hash.slice(1) + "]")).length)
            return (
                $("html, body")
                .stop(0, 1)
                .animate({ scrollTop: t.offset().top }, 1e3),
                !1
            );
        }
    }),

    $(window)
        .scroll(function () {
            var t = $(window).scrollTop();
            t >= 50
            ? $("#hd section:not(.sec-awards)").each(function (e) {
                $(this).offset().top <= t + 120 &&
                    ($("#hd .main-nav > li a.hd-active").removeClass("hd-active"),
                    $("#hd .main-nav > li").eq(e).find("a").addClass("hd-active"));
            })
            : ($("#hd .main-nav > li a.hd-active").removeClass("hd-active"),
                $("#hd .main-nav > li").eq(0).children("a").addClass("hd-active"));
        })
        .scroll(),
    
    (window.sr = ScrollReveal({
        reset: !1,
        mobile: !0,
        duration: 800,
        origin: "bottom",
        distance: "30px",
        opacity: 0,
        scale: 1,
        viewFactor: 0.5,
        easing: "cubic-bezier(.14,.8,.48,.99)"
    })),
    sr.reveal("#hd .reveal-nav", {
        reset: !0,
        duration: 800,
        opacity: 1,
        distance: 0,
        scale: 0,
        easing: "ease-out",
        viewFactor: 0.1,
        beforeReveal: function (t) {
            $(".hd-nav").addClass("hd-active");
        },
        beforeReset: function (t) {
            $(".hd-nav").removeClass("hd-active");
        }
    });
    
    var t = $(".hd-nav .sub-nav a");
    $(".title-tab li");
    t.on("click", function () {
        var t = $(this).attr("aria-controls"),
            e = $('.title-tab [aria-controls="' + t + '"]'),
            a = $("#" + t);
        e.trigger("click"),
        $("html, body")
            .stop(0, 1)
            .animate({ scrollTop: a.parents("section").offset().top }, 1000);
    });

    t.on("keydown", function (a) {
        var i = a.keyCode ? a.keyCode : a.which;
        if (i === 13) {
            $(this).click();
            var t = $(this).attr("aria-controls");
            var e = $("#" + t);
            scrollToElement(e);
        }
    });

    $(".title-tab").each(function () {
        var t = $(this).find("li:not(.hd-link)"),
            e = 0;
        t.on("click", function () {
            var e = $(this).index(),
            a = $(this).attr("aria-controls"),
            i = $("#" + a);
            !(function (t, e, a) {
                t
                .eq(a)
                .addClass("hd-active")
                .attr("aria-selected", !0)
                .siblings()
                .removeClass("hd-active")
                .attr("aria-selected", !1),
                e
                .addClass("hd-active")
                .removeAttr("hidden")
                .siblings()
                .removeClass("hd-active")
                .attr("hidden", !0),
                (function (t) {
                    var e = t.parent(),
                    a = t.get(0).offsetLeft - 30;
                    e.stop(0, 1).animate({ scrollLeft: a }, 700);
                })(t.eq(a));
            })(t, i, e);
        }).on("keydown", function (a) {
            var i = a.keyCode ? a.keyCode : a.which;
            (39 !== i && 40 !== i && 37 !== i && 38 !== i) ||
            (t.eq(e).attr("tabindex", -1),
                39 === i || 40 === i
                ? ++e >= t.length && (e = 0)
                : (37 !== i && 38 !== i) || (--e < 0 && (e = t.length - 1)),
                t.eq(e).attr("tabindex", 0),
                t.eq(e).focus().trigger("click"));
        });
    });

    var e = $(".hd-vid-lightbox"),
        a = $(".hd-player");
    $(".trigger-video").click(function () {
        var t =
        $(this).data("src") + "?modestbranding=0&color=white&mute=1&autoplay=0";
        a.attr("src", t),
        e.fadeIn(),
        a.attr("src", t.replace("autoplay=0", "autoplay=1"));
    }),
    $("#hd .hd-filter, #hd .hd-close").click(function () {
      e.fadeOut(), a.attr("src", "");
    }),
    $(".trigger-video-toggle .vid-control").on("click", function () {
        var t = $(this).prev("video")[0];
        $(this).toggleClass("hd-active"), t.paused ? t.play() : t.pause();
    });
});

// @koala-prepend "../lib/scrollreveal.min.js"
// @koala-prepend "../js/main.min.js"

$(function() {
  function e() {
    ScrollTrigger.sort(), ScrollTrigger.refresh()
  }

  function a() {
    r.removeClass("hd-active").attr("aria-current", "false"), $(".trigger-video").attr("aria-expanded", "false"), callPlayer("pauseVideo"), $("body").css("overflow", ""), "" != o && (o.focus(), o = "")
  }

  function t(e, a, t) {
    window.dataLayer = window.dataLayer || [], window.dataLayer.push({
      event: "data_layer_event",
      event_category_DL: e,
      event_action_DL: a,
      event_label_DL: t
    })
  }
  gsap.registerPlugin(ScrollTrigger), gsap.registerPlugin(ScrollToPlugin), gsap.defaults({
      overwrite: "auto",
      duration: .4
    }), $(window).on("resize", function() {
      setTimeout(function() {
        e()
      }, 400)
    }), $("#product_gallery").length > 0 && new ResizeObserver(e).observe(document.querySelector("#product_gallery")), $('a[href*="#"]:not([href="#"])').click(function() {
      if (location.pathname.replace(/^\//, "") == this.pathname.replace(/^\//, "") && location.hostname == this.hostname) {
        var e = $(this.hash);
        if ((e = e.length ? e : $("[name=" + this.hash.slice(1) + "]")).length) return $("html, body").stop(0, 1).animate({
          scrollTop: e.offset().top
        }, 800), !1
      }
    }),
    function(e) {
      e.off("keydown").on("keydown", function(e) {
        var a = e.keyCode ? e.keyCode : e.which;
        "13" != a && "32" != a || (("32" == a || $(this).is("button")) && e.preventDefault(), $(this).trigger("click"))
      })
    }($('#hd :not(button)[role="button"], #hd li[tabindex="0"], #hd div[tabindex="0"]')), window.sr = ScrollReveal({
      reset: true,
      mobile: true,
      duration: 600,
      origin: "bottom",
      distance: "20%",
      opacity: 0,
      scale: 1,
        delay:0,
      viewFactor: .25,
      easing: "ease-out"
    }), sr.reveal("#hd .sec-setup .list-setup li", { /*BE58U*/
      origin: "bottom",
          distance: '5%',
          duration: 800,
          opacity: 0,
          delay: 200
    }), sr.reveal("#hd .reveal", {
    }), sr.reveal("#hd .reveal-delay1", {
      delay: 150
    }), sr.reveal("#hd .reveal-delay2", {
      delay: 300
    }), sr.reveal("#hd .reveal-delay3", {
      delay: 400
    }), sr.reveal("#hd .reveal-delay4", {
      delay: 600
    }), sr.reveal("#hd .reveal-top", {
      origin: "top",
      distance: "12%",
      duration: 1200,
      easing: "ease-in-out"
    }), sr.reveal("#hd .reveal-top-delay1", {
      origin: "top",
      distance: "12%",
      duration: 1200,
      easing: "ease-in-out",
      delay: 400
    }), sr.reveal("#hd .reveal-right", { /*BE58U*/
      origin: "right",
      distance: "100%",
      duration: 1200,
      easing: "ease-in-out",
      delay: 0
    }), sr.reveal("#hd .reveal-right2", { /*BE58U*/
      origin: "top",
      distance: "100%",
      duration: 2000,
      easing: "ease-in-out",
      delay: 0
    }), sr.reveal("#hd .reveal-bottom", {}), sr.reveal("#hd .reveal-bottom-delay1", {
      delay: 150
    }), sr.reveal("#hd .reveal-bottom-delay2", {
      delay: 300
    }), sr.reveal("#hd .reveal-bottom-delay3", {
      delay: 400
    }), sr.reveal("#hd .reveal-left", {
      origin: "left",
      delay: 0
    }), sr.reveal("#hd .reveal-left-delay1", {
      origin: "left",
      delay: 150
    }), sr.reveal("#hd .reveal-list-1", 150), sr.reveal("#hd .reveal-list-2", 150), sr.reveal("#hd .reveal-list-3", 150), sr.reveal("#hd .reveal-list-4", 150), sr.reveal("#hd .reveal-list-5", 150), sr.reveal("#hd .reveal-list-6", 150), sr.reveal("#hd .reveal-list-7", 150);
  window.matchMedia("(max-width: 620px)").matches && sr.reveal("#hd .reveal-list-mobile", {}, 150), sr.reveal("#hd .reveal-animate", {
    reset: !1,
    duration: 100,
    opacity: 1,
    distance: 0,
    scale: 0,
    easing: "ease-out",
    beforeReveal: function(e) {
      $(e).addClass("is-animated")
    },
    beforeReset: function(e) {
      $(e).removeClass("is-animated")
    }
  }), sr.reveal("#hd .reveal-animate-reset", {
    reset: !0,
    duration: 100,
    opacity: 1,
    distance: 0,
    scale: 0,
    easing: "ease-out",
    beforeReveal: function(e) {
      $(e).addClass("is-animated")
    },
    beforeReset: function(e) {
      $(e).removeClass("is-animated")
    }
  }), sr.reveal("video.reveal-video", {
    reset: !0,
    duration: 0,
    opacity: 1,
    distance: 0,
    scale: 0,
    easing: "none",
    viewFactor: .4,
    delay: 800,
    beforeReveal: function(e) {
      $(e).trigger("play"), $(e).parents(".trigger-video-toggle").find(".vid-control").removeClass("hd-active").attr("aria-pressed", "false")
    },
    beforeReset: function(e) {
      $(e).trigger("pause"), $(e).parents(".trigger-video-toggle").find(".vid-control").addClass("hd-active").attr("aria-pressed", "true")
    }
  }), $(".gif-container .vid-control").on("click", function() {
    var e = $(this);
    e.toggleClass("hd-active"), e.hasClass("hd-active") ? e.attr("aria-pressed", "true") : e.attr("aria-pressed", "false"), e.parents(".hd-container").find(".gif-container").toggleClass("is-reduced-motion")
  }), $(".control-ani").on("click", function() {
    var e = $(this),
      a = $("#" + e.attr("aria-controls"));
    e.toggleClass("hd-active"), e.hasClass("hd-active") ? e.attr("aria-pressed", "true") : e.attr("aria-pressed", "false"), a.toggleClass("is-reduced-motion")
  }), $(".trigger-video-toggle .vid-control").on("click", function() {
    var e = $(this),
      a = e.parents(".trigger-video-toggle").find("video");
    a[0].paused ? (a.each(function() {
      this.play()
    }), e.removeClass("hd-active")) : (a.each(function() {
      this.pause()
    }), e.addClass("hd-active")), e.hasClass("hd-active") ? e.attr("aria-pressed", "true") : e.attr("aria-pressed", "false")
  }), $("#pageContent-sec-connectivity .list-port li").on("mouseenter focus", function() {
    var e = $("#" + $(this).attr("aria-controls"));
    $(this).attr("aria-current", "true").siblings().attr("aria-current", "false"), e.attr("aria-current", "true").siblings().attr("aria-current", "false")
  }), $("#pageContent-sec-control .list-feature li").on("click", function() {
    $(this).attr("aria-controls").split(",").forEach(function(e) {
      e = e.replace(/\s/g, "");
      $("#" + e).attr("aria-current", "true").siblings().attr("aria-current", "false")
    }), $(this).attr("aria-expanded", "true").siblings().attr("aria-expanded", "false")
  });
  const r = $("#pageContent-lightbox"),
    i = r.find("iframe");
  let o = "";
  $(".trigger-video").on("click", function() {
    let e = $(this);
    e.data("type");
    e.attr("aria-expanded", "true"), r.removeClass("type-img");
    let a = e.data("src") + "?modestbranding=0&color=white&mute=1&autoplay=0";
    i.attr("src", a), i.attr("src", a.replace("autoplay=0", "autoplay=1")), callPlayer("playVideo"), r.addClass("hd-active").attr("aria-current", "true"), r.focus(), o = e
  }), $("#pageContent-lightbox .hd-filter, #pageContent-lightbox .trigger-close").on("click", function() {
    a()
  }), $(document).on("keydown", function(e) {
    27 == e.which && a()
  });
  var n = "",
    s = "",
    l = "";
  window.dataLayer = window.dataLayer || [], $("#hd").on("click", '[data-action="clicked"], [data-action="downloaded"]', function() {
    var e = $(this);
    n = e.data("category"), s = e.data("action"), l = e.data("label"), t(n, s, l)
  }), $("#hd").on("mouseenter", '[data-action="hovered"]', function() {
    var e = $(this);
    n = e.data("category"), s = e.data("action"), l = e.data("label"), t(n, s, l)
  })
});