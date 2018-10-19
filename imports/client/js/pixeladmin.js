

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function () {
  'use strict';

  // From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys

  if (!Object.keys) {
    Object.keys = function () {
      var hasOwnProperty = Object.prototype.hasOwnProperty,
          hasDontEnumBug = !{ toString: null }.propertyIsEnumerable('toString'),
          dontEnums = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'],
          dontEnumsLength = dontEnums.length;

      return function (obj) {
        if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object' && (typeof obj !== 'function' || obj === null)) {
          throw new TypeError('Object.keys called on non-object');
        }

        var result = [],
            prop,
            i;

        for (prop in obj) {
          if (hasOwnProperty.call(obj, prop)) {
            result.push(prop);
          }
        }

        if (hasDontEnumBug) {
          for (i = 0; i < dontEnumsLength; i++) {
            if (hasOwnProperty.call(obj, dontEnums[i])) {
              result.push(dontEnums[i]);
            }
          }
        }
        return result;
      };
    }();
  }
})();


var pxUtil = function () {
  'use strict';

  var classListSupported = 'classList' in document.documentElement;

  /* Based on https://github.com/toddmotto/apollo */

  function forEach(items, fn) {
    var itemsArray = Object.prototype.toString.call(items) === '[object Array]' ? items : items.split(' ');

    for (var i = 0; i < itemsArray.length; i++) {
      fn(itemsArray[i], i);
    }
  }

  var _hasClass = classListSupported ? function (elem, className) {
    return elem.classList.contains(className);
  } : function (elem, className) {
    return new RegExp('(?:^|\\s)' + className + '(?:\\s|$)').test(elem.className);
  };

  var _addClass = classListSupported ? function (elem, className) {
    return elem.classList.add(className);
  } : function (elem, className) {
    if (_hasClass(elem, className)) {
      return;
    }
    elem.className += (elem.className ? ' ' : '') + className;
  };

  var _removeClass = classListSupported ? function (elem, className) {
    return elem.classList.remove(className);
  } : function (elem, className) {
    if (!_hasClass(elem, className)) {
      return;
    }
    elem.className = elem.className.replace(new RegExp('(?:^' + className + '\\s+)|(?:^\\s*' + className + '\\s*$)|(?:\\s+' + className + '$)', 'g'), '').replace(new RegExp('\\s+' + className + '\\s+', 'g'), ' ');
  };

  var _toggleClass = classListSupported ? function (elem, className) {
    return elem.classList.toggle(className);
  } : function (elem, className) {
    return (_hasClass(elem, className) ? _removeClass : _addClass)(elem, className);
  };

  /*** ***/

  return {
    // Based on http://stackoverflow.com/a/34168882
    generateUniqueId: function generateUniqueId() {
      // desired length of Id
      var idStrLen = 32;

      // always start with a letter -- base 36 makes for a nice shortcut
      var idStr = (Math.floor(Math.random() * 25) + 10).toString(36) + '_';

      // add a timestamp in milliseconds (base 36 again) as the base
      idStr += new Date().getTime().toString(36) + '_';

      // similar to above, complete the Id using random, alphanumeric characters
      do {
        idStr += Math.floor(Math.random() * 35).toString(36);
      } while (idStr.length < idStrLen);

      return idStr;
    },
    escapeRegExp: function escapeRegExp(str) {
      return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    },
    hexToRgba: function hexToRgba(color, opacity) {
      var hex = color.replace('#', '');
      var r = parseInt(hex.substring(0, 2), 16);
      var g = parseInt(hex.substring(2, 4), 16);
      var b = parseInt(hex.substring(4, 6), 16);

      return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + opacity + ')';
    },


    // Triggers native resize event
    triggerResizeEvent: function triggerResizeEvent() {
      var event = void 0;

      if (document.createEvent) {
        event = document.createEvent('HTMLEvents');
        event.initEvent('resize', true, true);
      } else {
        event = document.createEventObject();
        event.eventType = 'resize';
      }

      event.eventName = 'resize';

      if (document.createEvent) {
        window.dispatchEvent(event);
      } else {
        window.fireEvent('on' + event.eventType, event);
      }
    },
    hasClass: function hasClass(elem, className) {
      return _hasClass(elem, className);
    },
    addClass: function addClass(elem, classes) {
      forEach(classes, function (className) {
        return _addClass(elem, className);
      });
    },
    removeClass: function removeClass(elem, classes) {
      forEach(classes, function (className) {
        return _removeClass(elem, className);
      });
    },
    toggleClass: function toggleClass(elem, classes) {
      forEach(classes, function (className) {
        return _toggleClass(elem, className);
      });
    }
  };
}();


function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var PixelAdmin = function ($) {
  'use strict';

  var PixelAdminObject = {
    isRtl: document.documentElement.getAttribute('dir') === 'rtl',
    isMobile: /iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()),
    isLocalStorageSupported: typeof window.Storage !== 'undefined',

    // Application-wide options
    options: {
      resizeDelay: 100,
      storageKeyPrefix: 'px_s_',
      cookieKeyPrefix: 'px_c_'
    },

    getScreenSize: function getScreenSize() {
      var isBreakpointVisible = PixelAdminObject._isBreakpointVisible;

      if (isBreakpointVisible('xs')) {
        return 'xs';
      } else if (isBreakpointVisible('sm')) {
        return 'sm';
      } else if (isBreakpointVisible('md')) {
        return 'md';
      } else if (isBreakpointVisible('lg')) {
        return 'lg';
      }

      return 'xl';
    },


    // Storage
    //

    storage: {
      _prefix: function _prefix(key) {
        return '' + PixelAdminObject.options.storageKeyPrefix + key;
      },
      set: function set(key, value) {
        var obj = typeof key === 'string' ? _defineProperty({}, key, value) : key;
        var keys = Object.keys(obj);

        try {
          for (var i = 0, len = keys.length; i < len; i++) {
            window.localStorage.setItem(this._prefix(keys[i]), obj[keys[i]]);
          }
        } catch (e) {
          PixelAdminObject.cookies.set(key, value);
        }
      },
      get: function get(key) {
        var keys = $.isArray(key) ? key : [key];
        var result = {};

        try {
          for (var i = 0, len = keys.length; i < len; i++) {
            result[keys[i]] = window.localStorage.getItem(this._prefix(keys[i]));
          }

          return $.isArray(key) ? result : result[key];
        } catch (e) {
          return PixelAdminObject.cookies.get(key);
        }
      }
    },

    // Cookies
    //

    cookies: {
      _prefix: function _prefix(key) {
        return '' + PixelAdminObject.options.cookieKeyPrefix + key;
      },
      set: function set(key, value) {
        var obj = typeof key === 'string' ? _defineProperty({}, key, value) : key;
        var keys = Object.keys(obj);

        var encodedKey = void 0;
        var encodedVal = void 0;

        for (var i = 0, len = keys.length; i < len; i++) {
          encodedKey = encodeURIComponent(this._prefix(keys[i]));
          encodedVal = encodeURIComponent(obj[keys[i]]);

          document.cookie = encodedKey + '=' + encodedVal;
        }
      },
      get: function get(key) {
        var cookie = ';' + document.cookie + ';';
        var keys = $.isArray(key) ? key : [key];
        var result = {};

        var escapedKey = void 0;
        var re = void 0;
        var found = void 0;

        for (var i = 0, len = keys.length; i < len; i++) {
          escapedKey = pxUtil.escapeRegExp(encodeURIComponent(this._prefix(keys[i])));
          re = new RegExp(';\\s*' + escapedKey + '\\s*=\\s*([^;]+)\\s*;');
          found = cookie.match(re);

          result[keys[i]] = found ? decodeURIComponent(found[1]) : null;
        }

        return $.isArray(key) ? result : result[key];
      }
    },

    _isBreakpointVisible: function _isBreakpointVisible(name) {
      var el = document.getElementById('px-breakpoint-' + name) || $('<div id="px-breakpoint-' + name + '"></div>').prependTo(document.body)[0];

      return el.offsetTop;
    },
    _setDelayedResizeListener: function _setDelayedResizeListener() {
      function delayedResizeHandler(callback) {
        var resizeTimer = null;

        return function () {
          if (resizeTimer) {
            clearTimeout(resizeTimer);
          }

          resizeTimer = setTimeout(function () {
            resizeTimer = null;
            callback();
          }, PixelAdminObject.options.resizeDelay);
        };
      }

      var $window = $(window);
      var prevScreen = null;

      $window.on('resize', delayedResizeHandler(function () {
        var curScreen = PixelAdminObject.getScreenSize();

        $window.trigger('px.resize');

        if (prevScreen !== curScreen) {
          $window.trigger('px.screen.' + curScreen);
        }

        prevScreen = curScreen;
      }));
    }
  };

  PixelAdminObject._setDelayedResizeListener();

  // Wait for the document load
  $(function () {
    if (PixelAdminObject.isMobile && window.FastClick) {
      window.FastClick.attach(document.body);
    }

    // Repaint to fix strange BODY offset bug in RTL mode
    if (PixelAdminObject.isRtl) {
      $(window).on('px.resize.px-rtl-fix', function () {
        document.body.style.overflow = 'hidden';

        var trick = document.body.offsetHeight;

        document.body.style.overflow = '';
      });
    }

    // Trigger 'px.load' and 'resize' events on window
    $(window).trigger('px.load');
    pxUtil.triggerResizeEvent();
  });

  return PixelAdminObject;
}(jQuery);

window.PixelAdmin = PixelAdmin;


// Extensions / Modal
// --------------------------------------------------

(function ($) {
  'use strict';

  if (!$.fn.modal) {
    throw new Error('modal.js required.');
  }

  var bsModalShow = $.fn.modal.Constructor.prototype.show;
  var bsModalHide = $.fn.modal.Constructor.prototype.hide;

  $.fn.modal.Constructor.prototype.show = function (_relatedTarget) {
    bsModalShow.call(this, _relatedTarget);

    if (this.isShown) {
      $('html').addClass('modal-open');
    }
  };

  $.fn.modal.Constructor.prototype.hide = function (e) {
    bsModalHide.call(this, e);

    if (!this.isShown) {
      $('html').removeClass('modal-open');
    }
  };
})(jQuery);


// Extensions / Tooltip
// --------------------------------------------------

(function ($) {
  'use strict';

  if (!$.fn.tooltip) {
    throw new Error('tooltip.js required.');
  }

  var STATE_PARAM = 'data-state';

  var bsTooltipGetOptions = $.fn.tooltip.Constructor.prototype.getOptions;
  var bsTooltipSetContent = $.fn.tooltip.Constructor.prototype.setContent;

  $.fn.tooltip.Constructor.prototype.getOptions = function (options) {
    var result = bsTooltipGetOptions.call(this, options);
    var _isRtl = $('html').attr('dir') === 'rtl';

    if (_isRtl && result.placement === 'left') {
      result.placement = 'right';
    } else if (_isRtl && result.placement === 'right') {
      result.placement = 'left';
    }

    return result;
  };

  $.fn.tooltip.Constructor.prototype.setContent = function () {
    var state = this.$element.attr(STATE_PARAM);

    if (state) {
      $(this.tip()).addClass('tooltip-' + state.replace(/[^a-z0-9_-]/ig, ''));
    }

    bsTooltipSetContent.call(this);
  };
})(jQuery);


// Extensions / Popover
// --------------------------------------------------

(function ($) {
  'use strict';

  if (!$.fn.popover) {
    throw new Error('popover.js required.');
  }

  var STATE_PARAM = 'data-state';
  var STYLE_PARAM = 'data-style';

  var bsPopoverGetOptions = $.fn.popover.Constructor.prototype.getOptions;
  var bsPopoverSetContent = $.fn.popover.Constructor.prototype.setContent;

  $.fn.popover.Constructor.prototype.getOptions = function (options) {
    var result = bsPopoverGetOptions.call(this, options);
    var _isRtl = $('html').attr('dir') === 'rtl';

    if (_isRtl && result.placement === 'left') {
      result.placement = 'right';
    } else if (_isRtl && result.placement === 'right') {
      result.placement = 'left';
    }

    return result;
  };

  $.fn.popover.Constructor.prototype.setContent = function () {
    var $element = this.$element;
    var $tip = $(this.tip());
    var state = $element.attr(STATE_PARAM);
    var style = ($element.attr(STYLE_PARAM) || '').toLowerCase().split(' ');

    if (state) {
      $tip.addClass('popover-' + state.replace(/[^a-z0-9_-]/ig, ''));
    }

    if (style.indexOf('dark') !== -1) {
      $tip.addClass('popover-dark');
    }

    if (style.indexOf('colorful') !== -1) {
      $tip.addClass('popover-colorful');
    }

    bsPopoverSetContent.call(this);
  };
})(jQuery);


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Plugins / PxFile
// --------------------------------------------------

var PxFile = function ($) {
  'use strict';

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME = 'pxFile';
  var DATA_KEY = 'px.file';
  var EVENT_KEY = '.' + DATA_KEY;
  var JQUERY_NO_CONFLICT = $.fn[NAME];

  var ClassName = {
    BROWSE: 'px-file-browse',
    CLEAR: 'px-file-clear',
    HAS_VALUE: 'px-file-has-value'
  };

  var Event = {
    CLICK: 'click' + EVENT_KEY,
    CHANGE: 'change' + EVENT_KEY
  };

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  var FileCls = function () {
    function FileCls(element) {
      _classCallCheck(this, FileCls);

      this.element = element;
      this.input = $(element).find('.custom-file-input')[0];
      this.control = $(element).find('.custom-file-control')[0];
      this.placeholder = this.control.innerHTML;

      this._checkElement();
      this._checkInput();
      this._checkControl();
      this._setListeners();

      this.update();
    }

    // getters

    _createClass(FileCls, [{
      key: 'browse',


      // public

      value: function browse() {
        $(this.input).trigger('click');
      }
    }, {
      key: 'clear',
      value: function clear() {
        if ($(this.input).is(':disabled')) {
          return;
        }

        $(this.input).wrap('<form>').parent().on('reset', function (e) {
          e.stopPropagation();
        }).trigger('reset');

        $(this.input).unwrap();
        $(this.input).trigger('change');
      }
    }, {
      key: 'update',
      value: function update() {
        var value = (this.input.value || '').replace(/\\/g, '/').split('/').pop();

        // Set control placeholder or value
        if (value) {
          $(this.control).text(value);
        } else {
          this.control.innerHTML = this.placeholder;
        }

        pxUtil[value ? 'addClass' : 'removeClass'](this.element, ClassName.HAS_VALUE);
      }
    }, {
      key: 'destroy',
      value: function destroy() {
        this._unsetListeners();

        $(this.element).removeData(DATA_KEY);
      }

      // private

    }, {
      key: '_checkElement',
      value: function _checkElement() {
        if (!pxUtil.hasClass(this.element, 'custom-file')) {
          throw new Error(NAME + ' plugin must be called on a custom file input wrapper.');
        }
      }
    }, {
      key: '_checkInput',
      value: function _checkInput() {
        if (!this.input) {
          throw new Error('File input is not found.');
        }
      }
    }, {
      key: '_checkControl',
      value: function _checkControl() {
        if (!this.control) {
          throw new Error('.custom-file-control element is not found.');
        }
      }
    }, {
      key: '_rejectEvent',
      value: function _rejectEvent(e) {
        if (!e) {
          return;
        }
        e.stopPropagation();
        e.preventDefault();
      }
    }, {
      key: '_setListeners',
      value: function _setListeners() {
        var _this = this;

        $(this.element).find('.' + ClassName.BROWSE).on(this.constructor.Event.CLICK, function (e) {
          _this._rejectEvent(e);
          _this.browse();
          $(_this.input).trigger('focus');
        });

        $(this.element).find('.' + ClassName.CLEAR).on(this.constructor.Event.CLICK, function (e) {
          _this._rejectEvent(e);
          _this.clear();
          $(_this.input).trigger('focus');
        });

        $(this.input).on(this.constructor.Event.CHANGE, $.proxy(this.update, this));
      }
    }, {
      key: '_unsetListeners',
      value: function _unsetListeners() {
        $(this.element).find('.' + ClassName.BROWSE).off(EVENT_KEY);
        $(this.element).find('.' + ClassName.CLEAR).off(EVENT_KEY);
        $(this.input).off(EVENT_KEY);
      }

      // static

    }], [{
      key: '_jQueryInterface',
      value: function _jQueryInterface(method) {
        return this.each(function () {
          var data = $(this).data(DATA_KEY);

          if (!data) {
            data = new FileCls(this);
            $(this).data(DATA_KEY, data);
          }

          if (typeof method === 'string') {
            if (!data[method]) {
              throw new Error('No method named "' + method + '".');
            }
            data[method]();
          }
        });
      }
    }, {
      key: 'NAME',
      get: function get() {
        return NAME;
      }
    }, {
      key: 'DATA_KEY',
      get: function get() {
        return DATA_KEY;
      }
    }, {
      key: 'Event',
      get: function get() {
        return Event;
      }
    }, {
      key: 'EVENT_KEY',
      get: function get() {
        return EVENT_KEY;
      }
    }]);

    return FileCls;
  }();

  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME] = FileCls._jQueryInterface;
  $.fn[NAME].Constructor = FileCls;
  $.fn[NAME].noConflict = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT;
    return FileCls._jQueryInterface;
  };

  return FileCls;
}(jQuery);
/* perfect-scrollbar v0.6.16 */
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var ps = require('../main');
var psInstances = require('../plugin/instances');

function mountJQuery(jQuery) {
  jQuery.fn.perfectScrollbar = function (settingOrCommand) {
    return this.each(function () {
      if (typeof settingOrCommand === 'object' ||
          typeof settingOrCommand === 'undefined') {
        // If it's an object or none, initialize.
        var settings = settingOrCommand;

        if (!psInstances.get(this)) {
          ps.initialize(this, settings);
        }
      } else {
        // Unless, it may be a command.
        var command = settingOrCommand;

        if (command === 'update') {
          ps.update(this);
        } else if (command === 'destroy') {
          ps.destroy(this);
        }
      }
    });
  };
}

if (typeof define === 'function' && define.amd) {
  // AMD. Register as an anonymous module.
  define(['jquery'], mountJQuery);
} else {
  var jq = window.jQuery ? window.jQuery : window.$;
  if (typeof jq !== 'undefined') {
    mountJQuery(jq);
  }
}

module.exports = mountJQuery;

},{"../main":7,"../plugin/instances":18}],2:[function(require,module,exports){
'use strict';

function oldAdd(element, className) {
  var classes = element.className.split(' ');
  if (classes.indexOf(className) < 0) {
    classes.push(className);
  }
  element.className = classes.join(' ');
}

function oldRemove(element, className) {
  var classes = element.className.split(' ');
  var idx = classes.indexOf(className);
  if (idx >= 0) {
    classes.splice(idx, 1);
  }
  element.className = classes.join(' ');
}

exports.add = function (element, className) {
  if (element.classList) {
    element.classList.add(className);
  } else {
    oldAdd(element, className);
  }
};

exports.remove = function (element, className) {
  if (element.classList) {
    element.classList.remove(className);
  } else {
    oldRemove(element, className);
  }
};

exports.list = function (element) {
  if (element.classList) {
    return Array.prototype.slice.apply(element.classList);
  } else {
    return element.className.split(' ');
  }
};

},{}],3:[function(require,module,exports){
'use strict';

var DOM = {};

DOM.e = function (tagName, className) {
  var element = document.createElement(tagName);
  element.className = className;
  return element;
};

DOM.appendTo = function (child, parent) {
  parent.appendChild(child);
  return child;
};

function cssGet(element, styleName) {
  return window.getComputedStyle(element)[styleName];
}

function cssSet(element, styleName, styleValue) {
  if (typeof styleValue === 'number') {
    styleValue = styleValue.toString() + 'px';
  }
  element.style[styleName] = styleValue;
  return element;
}

function cssMultiSet(element, obj) {
  for (var key in obj) {
    var val = obj[key];
    if (typeof val === 'number') {
      val = val.toString() + 'px';
    }
    element.style[key] = val;
  }
  return element;
}

DOM.css = function (element, styleNameOrObject, styleValue) {
  if (typeof styleNameOrObject === 'object') {
    // multiple set with object
    return cssMultiSet(element, styleNameOrObject);
  } else {
    if (typeof styleValue === 'undefined') {
      return cssGet(element, styleNameOrObject);
    } else {
      return cssSet(element, styleNameOrObject, styleValue);
    }
  }
};

DOM.matches = function (element, query) {
  if (typeof element.matches !== 'undefined') {
    return element.matches(query);
  } else {
    if (typeof element.matchesSelector !== 'undefined') {
      return element.matchesSelector(query);
    } else if (typeof element.webkitMatchesSelector !== 'undefined') {
      return element.webkitMatchesSelector(query);
    } else if (typeof element.mozMatchesSelector !== 'undefined') {
      return element.mozMatchesSelector(query);
    } else if (typeof element.msMatchesSelector !== 'undefined') {
      return element.msMatchesSelector(query);
    }
  }
};

DOM.remove = function (element) {
  if (typeof element.remove !== 'undefined') {
    element.remove();
  } else {
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
  }
};

DOM.queryChildren = function (element, selector) {
  return Array.prototype.filter.call(element.childNodes, function (child) {
    return DOM.matches(child, selector);
  });
};

module.exports = DOM;

},{}],4:[function(require,module,exports){
'use strict';

var EventElement = function (element) {
  this.element = element;
  this.events = {};
};

EventElement.prototype.bind = function (eventName, handler) {
  if (typeof this.events[eventName] === 'undefined') {
    this.events[eventName] = [];
  }
  this.events[eventName].push(handler);
  this.element.addEventListener(eventName, handler, false);
};

EventElement.prototype.unbind = function (eventName, handler) {
  var isHandlerProvided = (typeof handler !== 'undefined');
  this.events[eventName] = this.events[eventName].filter(function (hdlr) {
    if (isHandlerProvided && hdlr !== handler) {
      return true;
    }
    this.element.removeEventListener(eventName, hdlr, false);
    return false;
  }, this);
};

EventElement.prototype.unbindAll = function () {
  for (var name in this.events) {
    this.unbind(name);
  }
};

var EventManager = function () {
  this.eventElements = [];
};

EventManager.prototype.eventElement = function (element) {
  var ee = this.eventElements.filter(function (eventElement) {
    return eventElement.element === element;
  })[0];
  if (typeof ee === 'undefined') {
    ee = new EventElement(element);
    this.eventElements.push(ee);
  }
  return ee;
};

EventManager.prototype.bind = function (element, eventName, handler) {
  this.eventElement(element).bind(eventName, handler);
};

EventManager.prototype.unbind = function (element, eventName, handler) {
  this.eventElement(element).unbind(eventName, handler);
};

EventManager.prototype.unbindAll = function () {
  for (var i = 0; i < this.eventElements.length; i++) {
    this.eventElements[i].unbindAll();
  }
};

EventManager.prototype.once = function (element, eventName, handler) {
  var ee = this.eventElement(element);
  var onceHandler = function (e) {
    ee.unbind(eventName, onceHandler);
    handler(e);
  };
  ee.bind(eventName, onceHandler);
};

module.exports = EventManager;

},{}],5:[function(require,module,exports){
'use strict';

module.exports = (function () {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
  }
  return function () {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
           s4() + '-' + s4() + s4() + s4();
  };
})();

},{}],6:[function(require,module,exports){
'use strict';

var cls = require('./class');
var dom = require('./dom');

var toInt = exports.toInt = function (x) {
  return parseInt(x, 10) || 0;
};

var clone = exports.clone = function (obj) {
  if (!obj) {
    return null;
  } else if (obj.constructor === Array) {
    return obj.map(clone);
  } else if (typeof obj === 'object') {
    var result = {};
    for (var key in obj) {
      result[key] = clone(obj[key]);
    }
    return result;
  } else {
    return obj;
  }
};

exports.extend = function (original, source) {
  var result = clone(original);
  for (var key in source) {
    result[key] = clone(source[key]);
  }
  return result;
};

exports.isEditable = function (el) {
  return dom.matches(el, "input,[contenteditable]") ||
         dom.matches(el, "select,[contenteditable]") ||
         dom.matches(el, "textarea,[contenteditable]") ||
         dom.matches(el, "button,[contenteditable]");
};

exports.removePsClasses = function (element) {
  var clsList = cls.list(element);
  for (var i = 0; i < clsList.length; i++) {
    var className = clsList[i];
    if (className.indexOf('ps-') === 0) {
      cls.remove(element, className);
    }
  }
};

exports.outerWidth = function (element) {
  return toInt(dom.css(element, 'width')) +
         toInt(dom.css(element, 'paddingLeft')) +
         toInt(dom.css(element, 'paddingRight')) +
         toInt(dom.css(element, 'borderLeftWidth')) +
         toInt(dom.css(element, 'borderRightWidth'));
};

exports.startScrolling = function (element, axis) {
  cls.add(element, 'ps-in-scrolling');
  if (typeof axis !== 'undefined') {
    cls.add(element, 'ps-' + axis);
  } else {
    cls.add(element, 'ps-x');
    cls.add(element, 'ps-y');
  }
};

exports.stopScrolling = function (element, axis) {
  cls.remove(element, 'ps-in-scrolling');
  if (typeof axis !== 'undefined') {
    cls.remove(element, 'ps-' + axis);
  } else {
    cls.remove(element, 'ps-x');
    cls.remove(element, 'ps-y');
  }
};

exports.env = {
  isWebKit: 'WebkitAppearance' in document.documentElement.style,
  supportsTouch: (('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch),
  supportsIePointer: window.navigator.msMaxTouchPoints !== null
};

},{"./class":2,"./dom":3}],7:[function(require,module,exports){
'use strict';

var destroy = require('./plugin/destroy');
var initialize = require('./plugin/initialize');
var update = require('./plugin/update');

module.exports = {
  initialize: initialize,
  update: update,
  destroy: destroy
};

},{"./plugin/destroy":9,"./plugin/initialize":17,"./plugin/update":21}],8:[function(require,module,exports){
'use strict';

module.exports = {
  handlers: ['click-rail', 'drag-scrollbar', 'keyboard', 'wheel', 'touch'],
  maxScrollbarLength: null,
  minScrollbarLength: null,
  scrollXMarginOffset: 0,
  scrollYMarginOffset: 0,
  suppressScrollX: false,
  suppressScrollY: false,
  swipePropagation: true,
  useBothWheelAxes: false,
  wheelPropagation: false,
  wheelSpeed: 1,
  theme: 'default'
};

},{}],9:[function(require,module,exports){
'use strict';

var _ = require('../lib/helper');
var dom = require('../lib/dom');
var instances = require('./instances');

module.exports = function (element) {
  var i = instances.get(element);

  if (!i) {
    return;
  }

  i.event.unbindAll();
  dom.remove(i.scrollbarX);
  dom.remove(i.scrollbarY);
  dom.remove(i.scrollbarXRail);
  dom.remove(i.scrollbarYRail);
  _.removePsClasses(element);

  instances.remove(element);
};

},{"../lib/dom":3,"../lib/helper":6,"./instances":18}],10:[function(require,module,exports){
'use strict';

var instances = require('../instances');
var updateGeometry = require('../update-geometry');
var updateScroll = require('../update-scroll');

function bindClickRailHandler(element, i) {
  function pageOffset(el) {
    return el.getBoundingClientRect();
  }
  var stopPropagation = function (e) { e.stopPropagation(); };

  i.event.bind(i.scrollbarY, 'click', stopPropagation);
  i.event.bind(i.scrollbarYRail, 'click', function (e) {
    var positionTop = e.pageY - window.pageYOffset - pageOffset(i.scrollbarYRail).top;
    var direction = positionTop > i.scrollbarYTop ? 1 : -1;

    updateScroll(element, 'top', element.scrollTop + direction * i.containerHeight);
    updateGeometry(element);

    e.stopPropagation();
  });

  i.event.bind(i.scrollbarX, 'click', stopPropagation);
  i.event.bind(i.scrollbarXRail, 'click', function (e) {
    var positionLeft = e.pageX - window.pageXOffset - pageOffset(i.scrollbarXRail).left;
    var direction = positionLeft > i.scrollbarXLeft ? 1 : -1;

    updateScroll(element, 'left', element.scrollLeft + direction * i.containerWidth);
    updateGeometry(element);

    e.stopPropagation();
  });
}

module.exports = function (element) {
  var i = instances.get(element);
  bindClickRailHandler(element, i);
};

},{"../instances":18,"../update-geometry":19,"../update-scroll":20}],11:[function(require,module,exports){
'use strict';

var _ = require('../../lib/helper');
var dom = require('../../lib/dom');
var instances = require('../instances');
var updateGeometry = require('../update-geometry');
var updateScroll = require('../update-scroll');

function bindMouseScrollXHandler(element, i) {
  var currentLeft = null;
  var currentPageX = null;

  function updateScrollLeft(deltaX) {
    var newLeft = currentLeft + (deltaX * i.railXRatio);
    var maxLeft = Math.max(0, i.scrollbarXRail.getBoundingClientRect().left) + (i.railXRatio * (i.railXWidth - i.scrollbarXWidth));

    if (newLeft < 0) {
      i.scrollbarXLeft = 0;
    } else if (newLeft > maxLeft) {
      i.scrollbarXLeft = maxLeft;
    } else {
      i.scrollbarXLeft = newLeft;
    }

    var scrollLeft = _.toInt(i.scrollbarXLeft * (i.contentWidth - i.containerWidth) / (i.containerWidth - (i.railXRatio * i.scrollbarXWidth))) - i.negativeScrollAdjustment;
    updateScroll(element, 'left', scrollLeft);
  }

  var mouseMoveHandler = function (e) {
    updateScrollLeft(e.pageX - currentPageX);
    updateGeometry(element);
    e.stopPropagation();
    e.preventDefault();
  };

  var mouseUpHandler = function () {
    _.stopScrolling(element, 'x');
    i.event.unbind(i.ownerDocument, 'mousemove', mouseMoveHandler);
  };

  i.event.bind(i.scrollbarX, 'mousedown', function (e) {
    currentPageX = e.pageX;
    currentLeft = _.toInt(dom.css(i.scrollbarX, 'left')) * i.railXRatio;
    _.startScrolling(element, 'x');

    i.event.bind(i.ownerDocument, 'mousemove', mouseMoveHandler);
    i.event.once(i.ownerDocument, 'mouseup', mouseUpHandler);

    e.stopPropagation();
    e.preventDefault();
  });
}

function bindMouseScrollYHandler(element, i) {
  var currentTop = null;
  var currentPageY = null;

  function updateScrollTop(deltaY) {
    var newTop = currentTop + (deltaY * i.railYRatio);
    var maxTop = Math.max(0, i.scrollbarYRail.getBoundingClientRect().top) + (i.railYRatio * (i.railYHeight - i.scrollbarYHeight));

    if (newTop < 0) {
      i.scrollbarYTop = 0;
    } else if (newTop > maxTop) {
      i.scrollbarYTop = maxTop;
    } else {
      i.scrollbarYTop = newTop;
    }

    var scrollTop = _.toInt(i.scrollbarYTop * (i.contentHeight - i.containerHeight) / (i.containerHeight - (i.railYRatio * i.scrollbarYHeight)));
    updateScroll(element, 'top', scrollTop);
  }

  var mouseMoveHandler = function (e) {
    updateScrollTop(e.pageY - currentPageY);
    updateGeometry(element);
    e.stopPropagation();
    e.preventDefault();
  };

  var mouseUpHandler = function () {
    _.stopScrolling(element, 'y');
    i.event.unbind(i.ownerDocument, 'mousemove', mouseMoveHandler);
  };

  i.event.bind(i.scrollbarY, 'mousedown', function (e) {
    currentPageY = e.pageY;
    currentTop = _.toInt(dom.css(i.scrollbarY, 'top')) * i.railYRatio;
    _.startScrolling(element, 'y');

    i.event.bind(i.ownerDocument, 'mousemove', mouseMoveHandler);
    i.event.once(i.ownerDocument, 'mouseup', mouseUpHandler);

    e.stopPropagation();
    e.preventDefault();
  });
}

module.exports = function (element) {
  var i = instances.get(element);
  bindMouseScrollXHandler(element, i);
  bindMouseScrollYHandler(element, i);
};

},{"../../lib/dom":3,"../../lib/helper":6,"../instances":18,"../update-geometry":19,"../update-scroll":20}],12:[function(require,module,exports){
'use strict';

var _ = require('../../lib/helper');
var dom = require('../../lib/dom');
var instances = require('../instances');
var updateGeometry = require('../update-geometry');
var updateScroll = require('../update-scroll');

function bindKeyboardHandler(element, i) {
  var hovered = false;
  i.event.bind(element, 'mouseenter', function () {
    hovered = true;
  });
  i.event.bind(element, 'mouseleave', function () {
    hovered = false;
  });

  var shouldPrevent = false;
  function shouldPreventDefault(deltaX, deltaY) {
    var scrollTop = element.scrollTop;
    if (deltaX === 0) {
      if (!i.scrollbarYActive) {
        return false;
      }
      if ((scrollTop === 0 && deltaY > 0) || (scrollTop >= i.contentHeight - i.containerHeight && deltaY < 0)) {
        return !i.settings.wheelPropagation;
      }
    }

    var scrollLeft = element.scrollLeft;
    if (deltaY === 0) {
      if (!i.scrollbarXActive) {
        return false;
      }
      if ((scrollLeft === 0 && deltaX < 0) || (scrollLeft >= i.contentWidth - i.containerWidth && deltaX > 0)) {
        return !i.settings.wheelPropagation;
      }
    }
    return true;
  }

  i.event.bind(i.ownerDocument, 'keydown', function (e) {
    if ((e.isDefaultPrevented && e.isDefaultPrevented()) || e.defaultPrevented) {
      return;
    }

    var focused = dom.matches(i.scrollbarX, ':focus') ||
                  dom.matches(i.scrollbarY, ':focus');

    if (!hovered && !focused) {
      return;
    }

    var activeElement = document.activeElement ? document.activeElement : i.ownerDocument.activeElement;
    if (activeElement) {
      if (activeElement.tagName === 'IFRAME') {
        activeElement = activeElement.contentDocument.activeElement;
      } else {
        // go deeper if element is a webcomponent
        while (activeElement.shadowRoot) {
          activeElement = activeElement.shadowRoot.activeElement;
        }
      }
      if (_.isEditable(activeElement)) {
        return;
      }
    }

    var deltaX = 0;
    var deltaY = 0;

    switch (e.which) {
    case 37: // left
      if (e.metaKey) {
        deltaX = -i.contentWidth;
      } else if (e.altKey) {
        deltaX = -i.containerWidth;
      } else {
        deltaX = -30;
      }
      break;
    case 38: // up
      if (e.metaKey) {
        deltaY = i.contentHeight;
      } else if (e.altKey) {
        deltaY = i.containerHeight;
      } else {
        deltaY = 30;
      }
      break;
    case 39: // right
      if (e.metaKey) {
        deltaX = i.contentWidth;
      } else if (e.altKey) {
        deltaX = i.containerWidth;
      } else {
        deltaX = 30;
      }
      break;
    case 40: // down
      if (e.metaKey) {
        deltaY = -i.contentHeight;
      } else if (e.altKey) {
        deltaY = -i.containerHeight;
      } else {
        deltaY = -30;
      }
      break;
    case 33: // page up
      deltaY = 90;
      break;
    case 32: // space bar
      if (e.shiftKey) {
        deltaY = 90;
      } else {
        deltaY = -90;
      }
      break;
    case 34: // page down
      deltaY = -90;
      break;
    case 35: // end
      if (e.ctrlKey) {
        deltaY = -i.contentHeight;
      } else {
        deltaY = -i.containerHeight;
      }
      break;
    case 36: // home
      if (e.ctrlKey) {
        deltaY = element.scrollTop;
      } else {
        deltaY = i.containerHeight;
      }
      break;
    default:
      return;
    }

    updateScroll(element, 'top', element.scrollTop - deltaY);
    updateScroll(element, 'left', element.scrollLeft + deltaX);
    updateGeometry(element);

    shouldPrevent = shouldPreventDefault(deltaX, deltaY);
    if (shouldPrevent) {
      e.preventDefault();
    }
  });
}

module.exports = function (element) {
  var i = instances.get(element);
  bindKeyboardHandler(element, i);
};

},{"../../lib/dom":3,"../../lib/helper":6,"../instances":18,"../update-geometry":19,"../update-scroll":20}],13:[function(require,module,exports){
'use strict';

var instances = require('../instances');
var updateGeometry = require('../update-geometry');
var updateScroll = require('../update-scroll');

function bindMouseWheelHandler(element, i) {
  var shouldPrevent = false;

  function shouldPreventDefault(deltaX, deltaY) {
    var scrollTop = element.scrollTop;
    if (deltaX === 0) {
      if (!i.scrollbarYActive) {
        return false;
      }
      if ((scrollTop === 0 && deltaY > 0) || (scrollTop >= i.contentHeight - i.containerHeight && deltaY < 0)) {
        return !i.settings.wheelPropagation;
      }
    }

    var scrollLeft = element.scrollLeft;
    if (deltaY === 0) {
      if (!i.scrollbarXActive) {
        return false;
      }
      if ((scrollLeft === 0 && deltaX < 0) || (scrollLeft >= i.contentWidth - i.containerWidth && deltaX > 0)) {
        return !i.settings.wheelPropagation;
      }
    }
    return true;
  }

  function getDeltaFromEvent(e) {
    var deltaX = e.deltaX;
    var deltaY = -1 * e.deltaY;

    if (typeof deltaX === "undefined" || typeof deltaY === "undefined") {
      // OS X Safari
      deltaX = -1 * e.wheelDeltaX / 6;
      deltaY = e.wheelDeltaY / 6;
    }

    if (e.deltaMode && e.deltaMode === 1) {
      // Firefox in deltaMode 1: Line scrolling
      deltaX *= 10;
      deltaY *= 10;
    }

    if (deltaX !== deltaX && deltaY !== deltaY/* NaN checks */) {
      // IE in some mouse drivers
      deltaX = 0;
      deltaY = e.wheelDelta;
    }

    if (e.shiftKey) {
      // reverse axis with shift key
      return [-deltaY, -deltaX];
    }
    return [deltaX, deltaY];
  }

  function shouldBeConsumedByChild(deltaX, deltaY) {
    var child = element.querySelector('textarea:hover, select[multiple]:hover, .ps-child:hover');
    if (child) {
      if (!window.getComputedStyle(child).overflow.match(/(scroll|auto)/)) {
        // if not scrollable
        return false;
      }

      var maxScrollTop = child.scrollHeight - child.clientHeight;
      if (maxScrollTop > 0) {
        if (!(child.scrollTop === 0 && deltaY > 0) && !(child.scrollTop === maxScrollTop && deltaY < 0)) {
          return true;
        }
      }
      var maxScrollLeft = child.scrollLeft - child.clientWidth;
      if (maxScrollLeft > 0) {
        if (!(child.scrollLeft === 0 && deltaX < 0) && !(child.scrollLeft === maxScrollLeft && deltaX > 0)) {
          return true;
        }
      }
    }
    return false;
  }

  function mousewheelHandler(e) {
    var delta = getDeltaFromEvent(e);

    var deltaX = delta[0];
    var deltaY = delta[1];

    if (shouldBeConsumedByChild(deltaX, deltaY)) {
      return;
    }

    shouldPrevent = false;
    if (!i.settings.useBothWheelAxes) {
      // deltaX will only be used for horizontal scrolling and deltaY will
      // only be used for vertical scrolling - this is the default
      updateScroll(element, 'top', element.scrollTop - (deltaY * i.settings.wheelSpeed));
      updateScroll(element, 'left', element.scrollLeft + (deltaX * i.settings.wheelSpeed));
    } else if (i.scrollbarYActive && !i.scrollbarXActive) {
      // only vertical scrollbar is active and useBothWheelAxes option is
      // active, so let's scroll vertical bar using both mouse wheel axes
      if (deltaY) {
        updateScroll(element, 'top', element.scrollTop - (deltaY * i.settings.wheelSpeed));
      } else {
        updateScroll(element, 'top', element.scrollTop + (deltaX * i.settings.wheelSpeed));
      }
      shouldPrevent = true;
    } else if (i.scrollbarXActive && !i.scrollbarYActive) {
      // useBothWheelAxes and only horizontal bar is active, so use both
      // wheel axes for horizontal bar
      if (deltaX) {
        updateScroll(element, 'left', element.scrollLeft + (deltaX * i.settings.wheelSpeed));
      } else {
        updateScroll(element, 'left', element.scrollLeft - (deltaY * i.settings.wheelSpeed));
      }
      shouldPrevent = true;
    }

    updateGeometry(element);

    shouldPrevent = (shouldPrevent || shouldPreventDefault(deltaX, deltaY));
    if (shouldPrevent) {
      e.stopPropagation();
      e.preventDefault();
    }
  }

  if (typeof window.onwheel !== "undefined") {
    i.event.bind(element, 'wheel', mousewheelHandler);
  } else if (typeof window.onmousewheel !== "undefined") {
    i.event.bind(element, 'mousewheel', mousewheelHandler);
  }
}

module.exports = function (element) {
  var i = instances.get(element);
  bindMouseWheelHandler(element, i);
};

},{"../instances":18,"../update-geometry":19,"../update-scroll":20}],14:[function(require,module,exports){
'use strict';

var instances = require('../instances');
var updateGeometry = require('../update-geometry');

function bindNativeScrollHandler(element, i) {
  i.event.bind(element, 'scroll', function () {
    updateGeometry(element);
  });
}

module.exports = function (element) {
  var i = instances.get(element);
  bindNativeScrollHandler(element, i);
};

},{"../instances":18,"../update-geometry":19}],15:[function(require,module,exports){
'use strict';

var _ = require('../../lib/helper');
var instances = require('../instances');
var updateGeometry = require('../update-geometry');
var updateScroll = require('../update-scroll');

function bindSelectionHandler(element, i) {
  function getRangeNode() {
    var selection = window.getSelection ? window.getSelection() :
                    document.getSelection ? document.getSelection() : '';
    if (selection.toString().length === 0) {
      return null;
    } else {
      return selection.getRangeAt(0).commonAncestorContainer;
    }
  }

  var scrollingLoop = null;
  var scrollDiff = {top: 0, left: 0};
  function startScrolling() {
    if (!scrollingLoop) {
      scrollingLoop = setInterval(function () {
        if (!instances.get(element)) {
          clearInterval(scrollingLoop);
          return;
        }

        updateScroll(element, 'top', element.scrollTop + scrollDiff.top);
        updateScroll(element, 'left', element.scrollLeft + scrollDiff.left);
        updateGeometry(element);
      }, 50); // every .1 sec
    }
  }
  function stopScrolling() {
    if (scrollingLoop) {
      clearInterval(scrollingLoop);
      scrollingLoop = null;
    }
    _.stopScrolling(element);
  }

  var isSelected = false;
  i.event.bind(i.ownerDocument, 'selectionchange', function () {
    if (element.contains(getRangeNode())) {
      isSelected = true;
    } else {
      isSelected = false;
      stopScrolling();
    }
  });
  i.event.bind(window, 'mouseup', function () {
    if (isSelected) {
      isSelected = false;
      stopScrolling();
    }
  });
  i.event.bind(window, 'keyup', function () {
    if (isSelected) {
      isSelected = false;
      stopScrolling();
    }
  });

  i.event.bind(window, 'mousemove', function (e) {
    if (isSelected) {
      var mousePosition = {x: e.pageX, y: e.pageY};
      var containerGeometry = {
        left: element.offsetLeft,
        right: element.offsetLeft + element.offsetWidth,
        top: element.offsetTop,
        bottom: element.offsetTop + element.offsetHeight
      };

      if (mousePosition.x < containerGeometry.left + 3) {
        scrollDiff.left = -5;
        _.startScrolling(element, 'x');
      } else if (mousePosition.x > containerGeometry.right - 3) {
        scrollDiff.left = 5;
        _.startScrolling(element, 'x');
      } else {
        scrollDiff.left = 0;
      }

      if (mousePosition.y < containerGeometry.top + 3) {
        if (containerGeometry.top + 3 - mousePosition.y < 5) {
          scrollDiff.top = -5;
        } else {
          scrollDiff.top = -20;
        }
        _.startScrolling(element, 'y');
      } else if (mousePosition.y > containerGeometry.bottom - 3) {
        if (mousePosition.y - containerGeometry.bottom + 3 < 5) {
          scrollDiff.top = 5;
        } else {
          scrollDiff.top = 20;
        }
        _.startScrolling(element, 'y');
      } else {
        scrollDiff.top = 0;
      }

      if (scrollDiff.top === 0 && scrollDiff.left === 0) {
        stopScrolling();
      } else {
        startScrolling();
      }
    }
  });
}

module.exports = function (element) {
  var i = instances.get(element);
  bindSelectionHandler(element, i);
};

},{"../../lib/helper":6,"../instances":18,"../update-geometry":19,"../update-scroll":20}],16:[function(require,module,exports){
'use strict';

var _ = require('../../lib/helper');
var instances = require('../instances');
var updateGeometry = require('../update-geometry');
var updateScroll = require('../update-scroll');

function bindTouchHandler(element, i, supportsTouch, supportsIePointer) {
  function shouldPreventDefault(deltaX, deltaY) {
    var scrollTop = element.scrollTop;
    var scrollLeft = element.scrollLeft;
    var magnitudeX = Math.abs(deltaX);
    var magnitudeY = Math.abs(deltaY);

    if (magnitudeY > magnitudeX) {
      // user is perhaps trying to swipe up/down the page

      if (((deltaY < 0) && (scrollTop === i.contentHeight - i.containerHeight)) ||
          ((deltaY > 0) && (scrollTop === 0))) {
        return !i.settings.swipePropagation;
      }
    } else if (magnitudeX > magnitudeY) {
      // user is perhaps trying to swipe left/right across the page

      if (((deltaX < 0) && (scrollLeft === i.contentWidth - i.containerWidth)) ||
          ((deltaX > 0) && (scrollLeft === 0))) {
        return !i.settings.swipePropagation;
      }
    }

    return true;
  }

  function applyTouchMove(differenceX, differenceY) {
    updateScroll(element, 'top', element.scrollTop - differenceY);
    updateScroll(element, 'left', element.scrollLeft - differenceX);

    updateGeometry(element);
  }

  var startOffset = {};
  var startTime = 0;
  var speed = {};
  var easingLoop = null;
  var inGlobalTouch = false;
  var inLocalTouch = false;

  function globalTouchStart() {
    inGlobalTouch = true;
  }
  function globalTouchEnd() {
    inGlobalTouch = false;
  }

  function getTouch(e) {
    if (e.targetTouches) {
      return e.targetTouches[0];
    } else {
      // Maybe IE pointer
      return e;
    }
  }
  function shouldHandle(e) {
    if (e.targetTouches && e.targetTouches.length === 1) {
      return true;
    }
    if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== e.MSPOINTER_TYPE_MOUSE) {
      return true;
    }
    return false;
  }
  function touchStart(e) {
    if (shouldHandle(e)) {
      inLocalTouch = true;

      var touch = getTouch(e);

      startOffset.pageX = touch.pageX;
      startOffset.pageY = touch.pageY;

      startTime = (new Date()).getTime();

      if (easingLoop !== null) {
        clearInterval(easingLoop);
      }

      e.stopPropagation();
    }
  }
  function touchMove(e) {
    if (!inLocalTouch && i.settings.swipePropagation) {
      touchStart(e);
    }
    if (!inGlobalTouch && inLocalTouch && shouldHandle(e)) {
      var touch = getTouch(e);

      var currentOffset = {pageX: touch.pageX, pageY: touch.pageY};

      var differenceX = currentOffset.pageX - startOffset.pageX;
      var differenceY = currentOffset.pageY - startOffset.pageY;

      applyTouchMove(differenceX, differenceY);
      startOffset = currentOffset;

      var currentTime = (new Date()).getTime();

      var timeGap = currentTime - startTime;
      if (timeGap > 0) {
        speed.x = differenceX / timeGap;
        speed.y = differenceY / timeGap;
        startTime = currentTime;
      }

      if (shouldPreventDefault(differenceX, differenceY)) {
        e.stopPropagation();
        e.preventDefault();
      }
    }
  }
  function touchEnd() {
    if (!inGlobalTouch && inLocalTouch) {
      inLocalTouch = false;

      clearInterval(easingLoop);
      easingLoop = setInterval(function () {
        if (!instances.get(element)) {
          clearInterval(easingLoop);
          return;
        }

        if (!speed.x && !speed.y) {
          clearInterval(easingLoop);
          return;
        }

        if (Math.abs(speed.x) < 0.01 && Math.abs(speed.y) < 0.01) {
          clearInterval(easingLoop);
          return;
        }

        applyTouchMove(speed.x * 30, speed.y * 30);

        speed.x *= 0.8;
        speed.y *= 0.8;
      }, 10);
    }
  }

  if (supportsTouch) {
    i.event.bind(window, 'touchstart', globalTouchStart);
    i.event.bind(window, 'touchend', globalTouchEnd);
    i.event.bind(element, 'touchstart', touchStart);
    i.event.bind(element, 'touchmove', touchMove);
    i.event.bind(element, 'touchend', touchEnd);
  } else if (supportsIePointer) {
    if (window.PointerEvent) {
      i.event.bind(window, 'pointerdown', globalTouchStart);
      i.event.bind(window, 'pointerup', globalTouchEnd);
      i.event.bind(element, 'pointerdown', touchStart);
      i.event.bind(element, 'pointermove', touchMove);
      i.event.bind(element, 'pointerup', touchEnd);
    } else if (window.MSPointerEvent) {
      i.event.bind(window, 'MSPointerDown', globalTouchStart);
      i.event.bind(window, 'MSPointerUp', globalTouchEnd);
      i.event.bind(element, 'MSPointerDown', touchStart);
      i.event.bind(element, 'MSPointerMove', touchMove);
      i.event.bind(element, 'MSPointerUp', touchEnd);
    }
  }
}

module.exports = function (element) {
  if (!_.env.supportsTouch && !_.env.supportsIePointer) {
    return;
  }

  var i = instances.get(element);
  bindTouchHandler(element, i, _.env.supportsTouch, _.env.supportsIePointer);
};

},{"../../lib/helper":6,"../instances":18,"../update-geometry":19,"../update-scroll":20}],17:[function(require,module,exports){
'use strict';

var _ = require('../lib/helper');
var cls = require('../lib/class');
var instances = require('./instances');
var updateGeometry = require('./update-geometry');

// Handlers
var handlers = {
  'click-rail': require('./handler/click-rail'),
  'drag-scrollbar': require('./handler/drag-scrollbar'),
  'keyboard': require('./handler/keyboard'),
  'wheel': require('./handler/mouse-wheel'),
  'touch': require('./handler/touch'),
  'selection': require('./handler/selection')
};
var nativeScrollHandler = require('./handler/native-scroll');

module.exports = function (element, userSettings) {
  userSettings = typeof userSettings === 'object' ? userSettings : {};

  cls.add(element, 'ps-container');

  // Create a plugin instance.
  var i = instances.add(element);

  i.settings = _.extend(i.settings, userSettings);
  cls.add(element, 'ps-theme-' + i.settings.theme);

  i.settings.handlers.forEach(function (handlerName) {
    handlers[handlerName](element);
  });

  nativeScrollHandler(element);

  updateGeometry(element);
};

},{"../lib/class":2,"../lib/helper":6,"./handler/click-rail":10,"./handler/drag-scrollbar":11,"./handler/keyboard":12,"./handler/mouse-wheel":13,"./handler/native-scroll":14,"./handler/selection":15,"./handler/touch":16,"./instances":18,"./update-geometry":19}],18:[function(require,module,exports){
'use strict';

var _ = require('../lib/helper');
var cls = require('../lib/class');
var defaultSettings = require('./default-setting');
var dom = require('../lib/dom');
var EventManager = require('../lib/event-manager');
var guid = require('../lib/guid');

var instances = {};

function Instance(element) {
  var i = this;

  i.settings = _.clone(defaultSettings);
  i.containerWidth = null;
  i.containerHeight = null;
  i.contentWidth = null;
  i.contentHeight = null;

  i.isRtl = dom.css(element, 'direction') === "rtl";
  i.isNegativeScroll = (function () {
    var originalScrollLeft = element.scrollLeft;
    var result = null;
    element.scrollLeft = -1;
    result = element.scrollLeft < 0;
    element.scrollLeft = originalScrollLeft;
    return result;
  })();
  i.negativeScrollAdjustment = i.isNegativeScroll ? element.scrollWidth - element.clientWidth : 0;
  i.event = new EventManager();
  i.ownerDocument = element.ownerDocument || document;

  function focus() {
    cls.add(element, 'ps-focus');
  }

  function blur() {
    cls.remove(element, 'ps-focus');
  }

  i.scrollbarXRail = dom.appendTo(dom.e('div', 'ps-scrollbar-x-rail'), element);
  i.scrollbarX = dom.appendTo(dom.e('div', 'ps-scrollbar-x'), i.scrollbarXRail);
  i.scrollbarX.setAttribute('tabindex', 0);
  i.event.bind(i.scrollbarX, 'focus', focus);
  i.event.bind(i.scrollbarX, 'blur', blur);
  i.scrollbarXActive = null;
  i.scrollbarXWidth = null;
  i.scrollbarXLeft = null;
  i.scrollbarXBottom = _.toInt(dom.css(i.scrollbarXRail, 'bottom'));
  i.isScrollbarXUsingBottom = i.scrollbarXBottom === i.scrollbarXBottom; // !isNaN
  i.scrollbarXTop = i.isScrollbarXUsingBottom ? null : _.toInt(dom.css(i.scrollbarXRail, 'top'));
  i.railBorderXWidth = _.toInt(dom.css(i.scrollbarXRail, 'borderLeftWidth')) + _.toInt(dom.css(i.scrollbarXRail, 'borderRightWidth'));
  // Set rail to display:block to calculate margins
  dom.css(i.scrollbarXRail, 'display', 'block');
  i.railXMarginWidth = _.toInt(dom.css(i.scrollbarXRail, 'marginLeft')) + _.toInt(dom.css(i.scrollbarXRail, 'marginRight'));
  dom.css(i.scrollbarXRail, 'display', '');
  i.railXWidth = null;
  i.railXRatio = null;

  i.scrollbarYRail = dom.appendTo(dom.e('div', 'ps-scrollbar-y-rail'), element);
  i.scrollbarY = dom.appendTo(dom.e('div', 'ps-scrollbar-y'), i.scrollbarYRail);
  i.scrollbarY.setAttribute('tabindex', 0);
  i.event.bind(i.scrollbarY, 'focus', focus);
  i.event.bind(i.scrollbarY, 'blur', blur);
  i.scrollbarYActive = null;
  i.scrollbarYHeight = null;
  i.scrollbarYTop = null;
  i.scrollbarYRight = _.toInt(dom.css(i.scrollbarYRail, 'right'));
  i.isScrollbarYUsingRight = i.scrollbarYRight === i.scrollbarYRight; // !isNaN
  i.scrollbarYLeft = i.isScrollbarYUsingRight ? null : _.toInt(dom.css(i.scrollbarYRail, 'left'));
  i.scrollbarYOuterWidth = i.isRtl ? _.outerWidth(i.scrollbarY) : null;
  i.railBorderYWidth = _.toInt(dom.css(i.scrollbarYRail, 'borderTopWidth')) + _.toInt(dom.css(i.scrollbarYRail, 'borderBottomWidth'));
  dom.css(i.scrollbarYRail, 'display', 'block');
  i.railYMarginHeight = _.toInt(dom.css(i.scrollbarYRail, 'marginTop')) + _.toInt(dom.css(i.scrollbarYRail, 'marginBottom'));
  dom.css(i.scrollbarYRail, 'display', '');
  i.railYHeight = null;
  i.railYRatio = null;
}

function getId(element) {
  return element.getAttribute('data-ps-id');
}

function setId(element, id) {
  element.setAttribute('data-ps-id', id);
}

function removeId(element) {
  element.removeAttribute('data-ps-id');
}

exports.add = function (element) {
  var newId = guid();
  setId(element, newId);
  instances[newId] = new Instance(element);
  return instances[newId];
};

exports.remove = function (element) {
  delete instances[getId(element)];
  removeId(element);
};

exports.get = function (element) {
  return instances[getId(element)];
};

},{"../lib/class":2,"../lib/dom":3,"../lib/event-manager":4,"../lib/guid":5,"../lib/helper":6,"./default-setting":8}],19:[function(require,module,exports){
'use strict';

var _ = require('../lib/helper');
var cls = require('../lib/class');
var dom = require('../lib/dom');
var instances = require('./instances');
var updateScroll = require('./update-scroll');

function getThumbSize(i, thumbSize) {
  if (i.settings.minScrollbarLength) {
    thumbSize = Math.max(thumbSize, i.settings.minScrollbarLength);
  }
  if (i.settings.maxScrollbarLength) {
    thumbSize = Math.min(thumbSize, i.settings.maxScrollbarLength);
  }
  return thumbSize;
}

function updateCss(element, i) {
  var xRailOffset = {width: i.railXWidth};
  if (i.isRtl) {
    xRailOffset.left = i.negativeScrollAdjustment + element.scrollLeft + i.containerWidth - i.contentWidth;
  } else {
    xRailOffset.left = element.scrollLeft;
  }
  if (i.isScrollbarXUsingBottom) {
    xRailOffset.bottom = i.scrollbarXBottom - element.scrollTop;
  } else {
    xRailOffset.top = i.scrollbarXTop + element.scrollTop;
  }
  dom.css(i.scrollbarXRail, xRailOffset);

  var yRailOffset = {top: element.scrollTop, height: i.railYHeight};
  if (i.isScrollbarYUsingRight) {
    if (i.isRtl) {
      yRailOffset.right = i.contentWidth - (i.negativeScrollAdjustment + element.scrollLeft) - i.scrollbarYRight - i.scrollbarYOuterWidth;
    } else {
      yRailOffset.right = i.scrollbarYRight - element.scrollLeft;
    }
  } else {
    if (i.isRtl) {
      yRailOffset.left = i.negativeScrollAdjustment + element.scrollLeft + i.containerWidth * 2 - i.contentWidth - i.scrollbarYLeft - i.scrollbarYOuterWidth;
    } else {
      yRailOffset.left = i.scrollbarYLeft + element.scrollLeft;
    }
  }
  dom.css(i.scrollbarYRail, yRailOffset);

  dom.css(i.scrollbarX, {left: i.scrollbarXLeft, width: i.scrollbarXWidth - i.railBorderXWidth});
  dom.css(i.scrollbarY, {top: i.scrollbarYTop, height: i.scrollbarYHeight - i.railBorderYWidth});
}

module.exports = function (element) {
  var i = instances.get(element);

  i.containerWidth = element.clientWidth;
  i.containerHeight = element.clientHeight;
  i.contentWidth = element.scrollWidth;
  i.contentHeight = element.scrollHeight;

  var existingRails;
  if (!element.contains(i.scrollbarXRail)) {
    existingRails = dom.queryChildren(element, '.ps-scrollbar-x-rail');
    if (existingRails.length > 0) {
      existingRails.forEach(function (rail) {
        dom.remove(rail);
      });
    }
    dom.appendTo(i.scrollbarXRail, element);
  }
  if (!element.contains(i.scrollbarYRail)) {
    existingRails = dom.queryChildren(element, '.ps-scrollbar-y-rail');
    if (existingRails.length > 0) {
      existingRails.forEach(function (rail) {
        dom.remove(rail);
      });
    }
    dom.appendTo(i.scrollbarYRail, element);
  }

  if (!i.settings.suppressScrollX && i.containerWidth + i.settings.scrollXMarginOffset < i.contentWidth) {
    i.scrollbarXActive = true;
    i.railXWidth = i.containerWidth - i.railXMarginWidth;
    i.railXRatio = i.containerWidth / i.railXWidth;
    i.scrollbarXWidth = getThumbSize(i, _.toInt(i.railXWidth * i.containerWidth / i.contentWidth));
    i.scrollbarXLeft = _.toInt((i.negativeScrollAdjustment + element.scrollLeft) * (i.railXWidth - i.scrollbarXWidth) / (i.contentWidth - i.containerWidth));
  } else {
    i.scrollbarXActive = false;
  }

  if (!i.settings.suppressScrollY && i.containerHeight + i.settings.scrollYMarginOffset < i.contentHeight) {
    i.scrollbarYActive = true;
    i.railYHeight = i.containerHeight - i.railYMarginHeight;
    i.railYRatio = i.containerHeight / i.railYHeight;
    i.scrollbarYHeight = getThumbSize(i, _.toInt(i.railYHeight * i.containerHeight / i.contentHeight));
    i.scrollbarYTop = _.toInt(element.scrollTop * (i.railYHeight - i.scrollbarYHeight) / (i.contentHeight - i.containerHeight));
  } else {
    i.scrollbarYActive = false;
  }

  if (i.scrollbarXLeft >= i.railXWidth - i.scrollbarXWidth) {
    i.scrollbarXLeft = i.railXWidth - i.scrollbarXWidth;
  }
  if (i.scrollbarYTop >= i.railYHeight - i.scrollbarYHeight) {
    i.scrollbarYTop = i.railYHeight - i.scrollbarYHeight;
  }

  updateCss(element, i);

  if (i.scrollbarXActive) {
    cls.add(element, 'ps-active-x');
  } else {
    cls.remove(element, 'ps-active-x');
    i.scrollbarXWidth = 0;
    i.scrollbarXLeft = 0;
    updateScroll(element, 'left', 0);
  }
  if (i.scrollbarYActive) {
    cls.add(element, 'ps-active-y');
  } else {
    cls.remove(element, 'ps-active-y');
    i.scrollbarYHeight = 0;
    i.scrollbarYTop = 0;
    updateScroll(element, 'top', 0);
  }
};

},{"../lib/class":2,"../lib/dom":3,"../lib/helper":6,"./instances":18,"./update-scroll":20}],20:[function(require,module,exports){
'use strict';

var instances = require('./instances');

var lastTop;
var lastLeft;

var createDOMEvent = function (name) {
  var event = document.createEvent("Event");
  event.initEvent(name, true, true);
  return event;
};

module.exports = function (element, axis, value) {
  if (typeof element === 'undefined') {
    throw 'You must provide an element to the update-scroll function';
  }

  if (typeof axis === 'undefined') {
    throw 'You must provide an axis to the update-scroll function';
  }

  if (typeof value === 'undefined') {
    throw 'You must provide a value to the update-scroll function';
  }

  if (axis === 'top' && value <= 0) {
    element.scrollTop = value = 0; // don't allow negative scroll
    element.dispatchEvent(createDOMEvent('ps-y-reach-start'));
  }

  if (axis === 'left' && value <= 0) {
    element.scrollLeft = value = 0; // don't allow negative scroll
    element.dispatchEvent(createDOMEvent('ps-x-reach-start'));
  }

  var i = instances.get(element);

  if (axis === 'top' && value >= i.contentHeight - i.containerHeight) {
    // don't allow scroll past container
    value = i.contentHeight - i.containerHeight;
    if (value - element.scrollTop <= 1) {
      // mitigates rounding errors on non-subpixel scroll values
      value = element.scrollTop;
    } else {
      element.scrollTop = value;
    }
    element.dispatchEvent(createDOMEvent('ps-y-reach-end'));
  }

  if (axis === 'left' && value >= i.contentWidth - i.containerWidth) {
    // don't allow scroll past container
    value = i.contentWidth - i.containerWidth;
    if (value - element.scrollLeft <= 1) {
      // mitigates rounding errors on non-subpixel scroll values
      value = element.scrollLeft;
    } else {
      element.scrollLeft = value;
    }
    element.dispatchEvent(createDOMEvent('ps-x-reach-end'));
  }

  if (!lastTop) {
    lastTop = element.scrollTop;
  }

  if (!lastLeft) {
    lastLeft = element.scrollLeft;
  }

  if (axis === 'top' && value < lastTop) {
    element.dispatchEvent(createDOMEvent('ps-scroll-up'));
  }

  if (axis === 'top' && value > lastTop) {
    element.dispatchEvent(createDOMEvent('ps-scroll-down'));
  }

  if (axis === 'left' && value < lastLeft) {
    element.dispatchEvent(createDOMEvent('ps-scroll-left'));
  }

  if (axis === 'left' && value > lastLeft) {
    element.dispatchEvent(createDOMEvent('ps-scroll-right'));
  }

  if (axis === 'top') {
    element.scrollTop = lastTop = value;
    element.dispatchEvent(createDOMEvent('ps-scroll-y'));
  }

  if (axis === 'left') {
    element.scrollLeft = lastLeft = value;
    element.dispatchEvent(createDOMEvent('ps-scroll-x'));
  }

};

},{"./instances":18}],21:[function(require,module,exports){
'use strict';

var _ = require('../lib/helper');
var dom = require('../lib/dom');
var instances = require('./instances');
var updateGeometry = require('./update-geometry');
var updateScroll = require('./update-scroll');

module.exports = function (element) {
  var i = instances.get(element);

  if (!i) {
    return;
  }

  // Recalcuate negative scrollLeft adjustment
  i.negativeScrollAdjustment = i.isNegativeScroll ? element.scrollWidth - element.clientWidth : 0;

  // Recalculate rail margins
  dom.css(i.scrollbarXRail, 'display', 'block');
  dom.css(i.scrollbarYRail, 'display', 'block');
  i.railXMarginWidth = _.toInt(dom.css(i.scrollbarXRail, 'marginLeft')) + _.toInt(dom.css(i.scrollbarXRail, 'marginRight'));
  i.railYMarginHeight = _.toInt(dom.css(i.scrollbarYRail, 'marginTop')) + _.toInt(dom.css(i.scrollbarYRail, 'marginBottom'));

  // Hide scrollbars not to affect scrollWidth and scrollHeight
  dom.css(i.scrollbarXRail, 'display', 'none');
  dom.css(i.scrollbarYRail, 'display', 'none');

  updateGeometry(element);

  // Update top/left scroll to trigger events
  updateScroll(element, 'top', element.scrollTop);
  updateScroll(element, 'left', element.scrollLeft);

  dom.css(i.scrollbarXRail, 'display', '');
  dom.css(i.scrollbarYRail, 'display', '');
};

},{"../lib/dom":3,"../lib/helper":6,"./instances":18,"./update-geometry":19,"./update-scroll":20}]},{},[1]);



// Extensions / Bootstrap-datepicker
// --------------------------------------------------

(function ($) {
  'use strict';

  if (!$.fn.perfectScrollbar) {
    throw new Error('perfect-scrollbar.jquery.js required.');
  }

  var _isRtl = $('html').attr('dir') === 'rtl';
  var fnPerfectScrollbar = $.fn.perfectScrollbar;

  $.fn.perfectScrollbar = function (settingOrCommand) {
    return this.each(function () {
      var _this = this;

      var psId = $(this).attr('data-ps-id');

      fnPerfectScrollbar.call($(this), settingOrCommand);

      if (_isRtl && !psId) {
        psId = $(this).attr('data-ps-id');

        if (psId) {
          $(window).on('resize.ps.' + psId, function () {
            return $(_this).perfectScrollbar('update');
          });
        }
      } else if (_isRtl && psId && settingOrCommand === 'destroy') {
        $(window).off('resize.ps.' + psId);
      }
    });
  };
})(jQuery);


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Plugins / PxSidebar
// --------------------------------------------------

var PxSidebar = function ($) {
  'use strict';

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME = 'pxSidebar';
  var DATA_KEY = 'px.sidebar';
  var EVENT_KEY = '.' + DATA_KEY;
  var DATA_API_KEY = '.data-api';
  var JQUERY_NO_CONFLICT = $.fn[NAME];

  var ClassName = {
    NAVBAR_FIXED: 'px-navbar-fixed',
    LEFT: 'px-sidebar-left'
  };

  var Event = {
    RESIZE: 'resize' + EVENT_KEY,
    SCROLL: 'scroll' + EVENT_KEY,
    CLICK_DATA_API: 'click' + EVENT_KEY + DATA_API_KEY,

    EXPAND: 'expand' + EVENT_KEY,
    EXPANDED: 'expanded' + EVENT_KEY,
    COLLAPSE: 'collapse' + EVENT_KEY,
    COLLAPSED: 'collapsed' + EVENT_KEY
  };

  var Selector = {
    DATA_TOGGLE: '[data-toggle="sidebar"]',
    CONTENT: '.px-sidebar-content',
    NAVBAR_HEADER: '.navbar-header'
  };

  var Default = {
    width: null,
    enableScrollbar: true,
    desktopMode: ['lg', 'xl'],
    navbarSelector: '> .px-navbar'
  };

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  var Sidebar = function () {
    function Sidebar(element, config) {
      _classCallCheck(this, Sidebar);

      this.uniqueId = pxUtil.generateUniqueId();

      this.element = element;
      this.$content = $(element).find(Selector.CONTENT);
      this.parent = element.parentNode;

      this.config = this._getConfig(config);

      this._isRtl = $('html').attr('dir') === 'rtl';

      this._setWidth();
      this._setScrollbar();
      this._checkMode();

      this._setListeners();
    }

    // getters

    _createClass(Sidebar, [{
      key: 'toggle',


      // public

      value: function toggle() {
        if (!this._triggerPreventableEvent(pxUtil.hasClass(this.element, 'open') ? 'COLLAPSE' : 'EXPAND', this.element)) {
          return;
        }

        pxUtil.toggleClass(this.element, 'open');

        this._triggerEvent(pxUtil.hasClass(this.element, 'open') ? 'EXPANDED' : 'COLLAPSED', this.element);
      }
    }, {
      key: 'update',
      value: function update() {
        var $navbarHeader = $(this.parent).find(this.config.navbarSelector + ' ' + Selector.NAVBAR_HEADER);

        if ($navbarHeader.length) {
          var height = $navbarHeader.height();

          if (pxUtil.hasClass(this.parent, ClassName.NAVBAR_FIXED) || !this._positioning) {
            this.element.style.top = height + 'px';
          } else {
            var scrollTop = document.documentElement && document.documentElement.scrollTop || document.body.scrollTop || 0;

            this.element.style.top = scrollTop > height ? '0px' : height - scrollTop + 'px';
          }
        }

        if (this.config.enableScrollbar) {
          this.$content.perfectScrollbar('update');
        }
      }
    }, {
      key: 'destroy',
      value: function destroy() {
        this._unsetListeners();
        this._unsetScrollbar();
        $(this.element).removeData(DATA_KEY);
      }

      // private

    }, {
      key: '_setWidth',
      value: function _setWidth() {
        var width = parseInt(this.config.width || $(this.element).width(), 10);

        var pos = void 0;

        if (!this._isRtl) {
          pos = pxUtil.hasClass(this.element, ClassName.LEFT) ? 'left' : 'right';
        } else {
          pos = pxUtil.hasClass(this.element, ClassName.LEFT) ? 'right' : 'left';
        }

        this.element.style.width = width + 'px';
        this.element.style[pos] = '-' + width + 'px';
      }
    }, {
      key: '_checkMode',
      value: function _checkMode() {
        this._positioning = this.config.desktopMode.indexOf(window.PixelAdmin.getScreenSize()) !== -1;

        this.update();
      }
    }, {
      key: '_setScrollbar',
      value: function _setScrollbar() {
        if (!this.config.enableScrollbar) {
          return;
        }

        if (!this.$content.length) {
          throw new Error('.px-sidebar-content element is not found.');
        }

        this.$content.perfectScrollbar();
      }
    }, {
      key: '_unsetScrollbar',
      value: function _unsetScrollbar() {
        if (!this.config.enableScrollbar || !this.$content.length) {
          return;
        }

        this.$content.perfectScrollbar('destroy');
      }
    }, {
      key: '_triggerEvent',
      value: function _triggerEvent(eventKey, target) {
        var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        $(this.element).trigger($.Event(this.constructor.Event[eventKey], { target: target }), [data]);
      }
    }, {
      key: '_triggerPreventableEvent',
      value: function _triggerPreventableEvent(eventKey, target) {
        var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        var event = $.Event(this.constructor.Event[eventKey], { target: target });

        $(this.element).trigger(event, [data]);

        return !event.isDefaultPrevented();
      }
    }, {
      key: '_setListeners',
      value: function _setListeners() {
        $(window).on(this.constructor.Event.RESIZE + '.' + this.uniqueId, $.proxy(this._checkMode, this)).on(this.constructor.Event.SCROLL + '.' + this.uniqueId, $.proxy(this.update, this));
      }
    }, {
      key: '_unsetListeners',
      value: function _unsetListeners() {
        $(window).off(this.constructor.Event.RESIZE + '.' + this.uniqueId).off(this.constructor.Event.SCROLL + '.' + this.uniqueId);
      }
    }, {
      key: '_getConfig',
      value: function _getConfig(config) {
        return $.extend({}, this.constructor.Default, $(this.element).data(), config);
      }

      // static

    }], [{
      key: '_jQueryInterface',
      value: function _jQueryInterface(config) {
        return this.each(function () {
          var data = $(this).data(DATA_KEY);
          var _config = (typeof config === 'undefined' ? 'undefined' : _typeof(config)) === 'object' ? config : null;

          if (!data) {
            data = new Sidebar(this, _config);
            $(this).data(DATA_KEY, data);
          }

          if (typeof config === 'string') {
            if (!data[config]) {
              throw new Error('No method named "' + config + '"');
            }
            data[config]();
          }
        });
      }
    }, {
      key: 'Default',
      get: function get() {
        return Default;
      }
    }, {
      key: 'NAME',
      get: function get() {
        return NAME;
      }
    }, {
      key: 'DATA_KEY',
      get: function get() {
        return DATA_KEY;
      }
    }, {
      key: 'Event',
      get: function get() {
        return Event;
      }
    }, {
      key: 'EVENT_KEY',
      get: function get() {
        return EVENT_KEY;
      }
    }]);

    return Sidebar;
  }();

  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */

  $(document).on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE, function (e) {
    e.preventDefault();

    var selector = this.getAttribute('data-target');
    var target = selector ? $(selector)[0] : null;

    if (!target) {
      return;
    }

    if (!$(target).data(DATA_KEY)) {
      Sidebar._jQueryInterface.call($(target), $(this).data());
    }

    Sidebar._jQueryInterface.call($(target), 'toggle');
  });

  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME] = Sidebar._jQueryInterface;
  $.fn[NAME].Constructor = Sidebar;
  $.fn[NAME].noConflict = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT;
    return Sidebar._jQueryInterface;
  };

  return Sidebar;
}(jQuery);


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Plugins / PxNavbar
// --------------------------------------------------

var PxNavbar = function ($) {
  'use strict';

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME = 'pxNavbar';
  var DATA_KEY = 'px.navbar';
  var EVENT_KEY = '.' + DATA_KEY;
  var DATA_API_KEY = '.data-api';
  var JQUERY_NO_CONFLICT = $.fn[NAME];

  var ClassName = {
    NAVBAR: 'px-navbar',
    INNER: 'px-navbar-collapse-inner',
    IN: 'in',
    COLLAPSED: 'collapsed'
  };

  var Selector = {
    DATA_TOGGLE: '.navbar-toggle[data-toggle="collapse"]',
    DROPDOWN_TOGGLE: '.dropdown-toggle[data-toggle="dropdown"]',
    COLLAPSE: '.navbar-collapse',
    DROPDOWN: '.dropdown'
  };

  var Event = {
    CLICK_DATA_API: 'click' + EVENT_KEY + DATA_API_KEY,
    RESIZE: 'resize' + EVENT_KEY,
    CLICK: 'click' + EVENT_KEY,
    MOUSEDOWN: 'mousedown' + EVENT_KEY,
    COLLAPSE_SHOW: 'show.bs.collapse' + EVENT_KEY,
    COLLAPSE_SHOWN: 'shown.bs.collapse' + EVENT_KEY,
    COLLAPSE_HIDDEN: 'hidden.bs.collapse' + EVENT_KEY,
    DROPDOWN_SHOWN: 'shown.bs.dropdown' + EVENT_KEY,
    DROPDOWN_HIDDEN: 'hidden.bs.dropdown' + EVENT_KEY
  };

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  var Navbar = function () {
    function Navbar(element) {
      _classCallCheck(this, Navbar);

      if (!$.fn.perfectScrollbar) {
        throw new Error('Scrolling feature requires the "perfect-scrollbar" plugin included.');
      }

      this.uniqueId = pxUtil.generateUniqueId();

      this.element = element;
      this.$collapse = $(element).find(Selector.COLLAPSE);
      this.$toggle = $(element).find(Selector.DATA_TOGGLE);

      this._scrollbarEnabled = 0;
      this._curScrollTop = 0;

      if (!this.$collapse.length || !this.$toggle.length) {
        return;
      }

      this.$inner = this._setupInnerContainer();

      this._setListeners();
    }

    // getters

    _createClass(Navbar, [{
      key: 'updateScrollbar',


      // public

      value: function updateScrollbar() {
        if (!this._scrollbarEnabled) {
          return;
        }

        this._updateHeight();

        this.$inner.scrollTop(this._curScrollTop).perfectScrollbar('update');
      }
    }, {
      key: 'destroy',
      value: function destroy() {
        this._unsetListeners();

        this._disableScrollbar();

        this.$collapse.append(this.$inner.find('> *'));

        this.$inner.remove();

        $(this.element).removeData(DATA_KEY);
      }

      // private

    }, {
      key: '_updateHeight',
      value: function _updateHeight() {
        var maxHeight = $(window).height() - this.$collapse[0].offsetTop;

        this.$collapse.height('');

        var curHeight = this.$collapse.height();

        if (curHeight > maxHeight) {
          this.$collapse.height(maxHeight + 'px');
        }
      }
    }, {
      key: '_enableScrollbar',
      value: function _enableScrollbar() {
        if (this._scrollbarEnabled) {
          return;
        }

        this._updateHeight();
        this.$inner.perfectScrollbar({ suppressScrollX: true });

        this._scrollbarEnabled = 1;
      }
    }, {
      key: '_disableScrollbar',
      value: function _disableScrollbar() {
        if (!this._scrollbarEnabled) {
          return;
        }

        this.$collapse.height('');
        this.$inner.perfectScrollbar('destroy');

        this._scrollbarEnabled = 0;
      }
    }, {
      key: '_setupInnerContainer',
      value: function _setupInnerContainer() {
        var $inner = $('<div class="' + ClassName.INNER + '"></div>');

        $inner.append(this.$collapse.find('> *'));

        this.$collapse.append($inner);

        return $inner;
      }
    }, {
      key: '_setListeners',
      value: function _setListeners() {
        var _this = this;

        var self = this;

        $(window).on(this.constructor.Event.RESIZE + '.' + this.uniqueId, function () {
          if (!_this._scrollbarEnabled) {
            return;
          }

          // TODO: Remove dependency on toggle button
          if (_this.$toggle.is(':visible')) {
            _this._curScrollTop = _this.$inner[0].scrollTop;
            _this.updateScrollbar();
          } else {
            _this._disableScrollbar();
            _this.$collapse.removeClass(ClassName.IN);
            _this.$toggle.addClass(ClassName.COLLAPSED);
            _this.$collapse.attr('aria-expanded', 'false');
            _this.$toggle.attr('aria-expanded', 'false');
          }
        });

        $(this.element).on(this.constructor.Event.COLLAPSE_SHOW, Selector.COLLAPSE, function () {
          _this.$collapse.find('.dropdown.open').removeClass('open');
        }).on(this.constructor.Event.COLLAPSE_SHOWN, Selector.COLLAPSE, function () {
          _this._enableScrollbar();
        }).on(this.constructor.Event.COLLAPSE_HIDDEN, Selector.COLLAPSE, function () {
          _this._disableScrollbar();
        }).on(this.constructor.Event.DROPDOWN_SHOWN + ' ' + this.constructor.Event.DROPDOWN_HIDDEN, Selector.DROPDOWN, function () {
          _this.updateScrollbar();
        }).on(this.constructor.Event.MOUSEDOWN, Selector.DROPDOWN_TOGGLE, function () {
          if (!_this._scrollbarEnabled) {
            return true;
          }

          _this._curScrollTop = _this.$inner[0].scrollTop;
        }).on(this.constructor.Event.CLICK, Selector.DROPDOWN_TOGGLE, function (e) {
          if (!self._scrollbarEnabled) {
            return true;
          }
          if (!this.getAttribute('href') || this.getAttribute('href') === '#') {
            return true;
          }

          // Prevent dropdown open
          e.preventDefault();
          e.stopPropagation();

          // Simulate link click and prevent dropdown toggling
          this.removeAttribute('data-toggle');
          this.click();
          this.setAttribute('data-toggle', 'dropdown');
        });
      }
    }, {
      key: '_unsetListeners',
      value: function _unsetListeners() {
        $(window).off(this.constructor.Event.RESIZE + '.' + this.uniqueId);
        $(this.element).off(EVENT_KEY);
      }

      // static

    }], [{
      key: '_jQueryInterface',
      value: function _jQueryInterface(method) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        return this.each(function () {
          var data = $(this).data(DATA_KEY);

          if (!data) {
            data = new Navbar(this);
            $(this).data(DATA_KEY, data);

            if (!$.support.transition && $(this).find(Selector.DATA_TOGGLE).attr('aria-expanded') === 'true') {
              data._enableScrollbar();
            }
          }

          if (typeof method === 'string') {
            if (!data[method]) {
              throw new Error('No method named "' + method + '"');
            }
            data[method].apply(data, args);
          }
        });
      }
    }, {
      key: 'NAME',
      get: function get() {
        return NAME;
      }
    }, {
      key: 'DATA_KEY',
      get: function get() {
        return DATA_KEY;
      }
    }, {
      key: 'Event',
      get: function get() {
        return Event;
      }
    }, {
      key: 'EVENT_KEY',
      get: function get() {
        return EVENT_KEY;
      }
    }]);

    return Navbar;
  }();

  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */

  $(document).on(Event.CLICK_DATA_API, '.' + ClassName.NAVBAR + ' ' + Selector.DATA_TOGGLE, function (e) {
    e.preventDefault();

    var $target = $(this).parents('.' + ClassName.NAVBAR);

    if (!$target.length) {
      return;
    }

    if (!$target.data(DATA_KEY)) {
      Navbar._jQueryInterface.call($target);
    }
  });

  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME] = Navbar._jQueryInterface;
  $.fn[NAME].Constructor = Navbar;
  $.fn[NAME].noConflict = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT;
    return Navbar._jQueryInterface;
  };

  return Navbar;
}(jQuery);


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Plugins / PxNav
// --------------------------------------------------

var PxNav = function ($) {
  'use strict';

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME = 'pxNav';
  var DATA_KEY = 'px.nav';
  var EVENT_KEY = '.' + DATA_KEY;
  var DATA_API_KEY = '.data-api';
  var JQUERY_NO_CONFLICT = $.fn[NAME];

  var Default = {
    accordion: true,
    transitionDuration: 300,
    dropdownCloseDelay: 400,
    enableTooltips: true,
    animate: true,
    storeState: true,
    storagePrefix: 'px-nav.',

    modes: {
      phone: ['xs'],
      tablet: ['sm', 'md'],
      desktop: ['lg', 'xl']
    }
  };

  var ClassName = {
    NAV: 'px-nav',
    NAV_LEFT: 'px-nav-left',
    CONTENT: 'px-nav-content',
    EXPAND: 'px-nav-expand',
    STATIC: 'px-nav-static',
    COLLAPSE: 'px-nav-collapse',
    ANIMATE: 'px-nav-animate',
    NAV_TRANSITIONING: 'px-nav-transitioning',
    DIMMER: 'px-nav-dimmer',
    FIXED: 'px-nav-fixed',
    OFF_CANVAS: 'px-nav-off-canvas',
    SCROLLABLE_AREA: 'px-nav-scrollable-area',

    ITEM: 'px-nav-item',
    TOOLTIP: 'px-nav-tooltip',
    DROPDOWN: 'px-nav-dropdown',
    DROPDOWN_MENU: 'px-nav-dropdown-menu',
    DROPDOWN_MENU_TITLE: 'px-nav-dropdown-menu-title',
    DROPDOWN_MENU_SHOW: 'px-nav-dropdown-menu-show',
    DROPDOWN_MENU_WRAPPER: 'px-nav-dropdown-menu-wrapper',
    DROPDOWN_MENU_TOP: 'px-nav-dropdown-menu-top',

    OPEN: 'px-open',
    SHOW: 'px-show',
    FREEZE: 'freeze',
    ACTIVE: 'active',
    TRANSITIONING: 'transitioning',

    PERFECT_SCROLLBAR_CONTAINER: 'ps-container',
    NAVBAR_FIXED: 'px-navbar-fixed'
  };

  var Selector = {
    DATA_TOGGLE: '[data-toggle="px-nav"]',
    CONTENT: '.px-nav-content',
    ITEM: '> .px-nav-item',
    ITEM_LABEL: '> a > .px-nav-label',
    ROOT_LINK: '> .px-nav-item:not(.px-nav-dropdown) > a',
    DROPDOWN_LINK: '.px-nav-dropdown > a',
    DROPDOWN_MENU: '> .px-nav-dropdown-menu',
    DROPDOWN_MENU_TITLE: '> .px-nav-dropdown-menu-title',
    OPENED_DROPDOWNS: '> .px-nav-dropdown.px-open',
    SHOWN_DROPDOWNS: '> .px-nav-dropdown.px-show',
    FROZEN_DROPDOWNS: '.px-nav-dropdown.freeze',
    SCROLLABLE_AREA: '.px-nav-scrollable-area',
    NEAR_NAVBAR: '~ .px-navbar'
  };

  var Event = {
    CLICK_DATA_API: 'click' + EVENT_KEY + DATA_API_KEY,
    RESIZE: 'resize' + EVENT_KEY,
    CLICK: 'click' + EVENT_KEY,
    MOUSEENTER: 'mouseenter' + EVENT_KEY,
    MOUSELEAVE: 'mouseleave' + EVENT_KEY,
    SCROLL: 'scroll' + EVENT_KEY,

    INITIALIZED: 'initialized',
    EXPAND: 'expand' + EVENT_KEY,
    EXPANDED: 'expanded' + EVENT_KEY,
    COLLAPSE: 'collapse' + EVENT_KEY,
    COLLAPSED: 'collapsed' + EVENT_KEY,
    DESTROY: 'destroy' + EVENT_KEY,
    DROPDOWN_OPEN: 'dropdown-open' + EVENT_KEY,
    DROPDOWN_OPENED: 'dropdown-opened' + EVENT_KEY,
    DROPDOWN_CLOSE: 'dropdown-close' + EVENT_KEY,
    DROPDOWN_CLOSED: 'dropdown-closed' + EVENT_KEY,
    DROPDOWN_FROZEN: 'dropdown-frozen' + EVENT_KEY,
    DROPDOWN_UNFROZEN: 'dropdown-unfrozen' + EVENT_KEY
  };

  var PERFECT_SCROLLBAR_OPTIONS = {
    suppressScrollX: true,
    wheelPropagation: false,
    swipePropagation: false
  };

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  var Nav = function () {
    function Nav(element, config) {
      _classCallCheck(this, Nav);

      this.uniqueId = pxUtil.generateUniqueId();

      this.element = element;
      this.content = $(element).find(Selector.CONTENT)[0];
      this.config = this._getConfig(config);

      // Internal variables
      this._curMode = this._getMode();
      this._isCollapsed = this._getNavState();
      this._stateChanging = 0;

      this._setupMarkup();

      this.dimmer = $(element).parent().find('> .' + ClassName.DIMMER)[0];

      this._setListeners();

      this._restoreNavState();

      this._detectActiveItem();

      this._enableAnimation();

      this._checkNavbarPosition();

      this._triggerEvent('INITIALIZED', element);
    }

    // getters

    _createClass(Nav, [{
      key: 'toggle',


      // public

      value: function toggle() {
        this[this._curMode !== 'desktop' && pxUtil.hasClass(this.element, ClassName.EXPAND) || this._curMode === 'desktop' && !pxUtil.hasClass(this.element, ClassName.COLLAPSE) ? 'collapse' : 'expand']();
      }
    }, {
      key: 'expand',
      value: function expand() {
        if (this._curMode !== 'phone' && !this.isCollapsed()) {
          return;
        }
        if (this._curMode === 'phone' && pxUtil.hasClass(this.element, ClassName.EXPAND)) {
          return;
        }
        if (!this._triggerPreventableEvent('EXPAND', this.element)) {
          return;
        }

        if (this._curMode !== 'phone') {
          this.closeAllDropdowns();
        }

        if (this.config.enableTooltips) {
          this._clearTooltips();
        }

        this._changeNavState(function () {
          var _this = this;

          if (this._curMode !== 'desktop') {
            var self = this;

            // Collapse other navs
            $(this.element).parent().find('> .' + ClassName.EXPAND).each(function () {
              if (this === self.element) {
                return;
              }

              $(this)[NAME]('collapse');
            });

            $(this.dimmer).on(this.constructor.Event.CLICK, function () {
              return _this.collapse();
            });
            pxUtil.addClass(this.element, ClassName.EXPAND);
          } else {
            pxUtil.removeClass(this.element, ClassName.COLLAPSE);
          }

          this._triggerEvent('EXPANDED', this.element);
        });
      }
    }, {
      key: 'collapse',
      value: function collapse() {
        if (this.isCollapsed()) {
          return;
        }
        if (!this._triggerPreventableEvent('COLLAPSE', this.element)) {
          return;
        }

        this._changeNavState(function () {
          if (this._curMode !== 'desktop') {
            $(this.dimmer).off('click');
            pxUtil.removeClass(this.element, ClassName.EXPAND);
          } else {
            pxUtil.addClass(this.element, ClassName.COLLAPSE);
          }

          $(window).trigger('scroll');
          this._triggerEvent('COLLAPSED', this.element);
        });
      }
    }, {
      key: 'isFixed',
      value: function isFixed() {
        return pxUtil.hasClass(this.element, ClassName.FIXED);
      }
    }, {
      key: 'isStatic',
      value: function isStatic() {
        return pxUtil.hasClass(this.element, ClassName.STATIC);
      }
    }, {
      key: 'isCollapsed',
      value: function isCollapsed() {
        return this._isCollapsed;
      }
    }, {
      key: 'activateItem',
      value: function activateItem(_el) {
        var el = this._getNode(_el, ClassName.ITEM);

        if (pxUtil.hasClass(el, ClassName.DROPDOWN)) {
          return;
        }

        // Deactivate all items
        $(this.element).find('.' + ClassName.ITEM + '.' + ClassName.ACTIVE).removeClass(ClassName.ACTIVE);

        pxUtil.addClass(el, ClassName.ACTIVE);

        // If item is in the root
        if (pxUtil.hasClass(el.parentNode, ClassName.CONTENT)) {
          return;

          // Else if item is in the floating opened dropdown
        } else if (pxUtil.hasClass(el.parentNode, ClassName.DROPDOWN_MENU_WRAPPER)) {
          var targetDropdown = $(el).parents('.' + ClassName.DROPDOWN_MENU).data('dropdown');

          if (!targetDropdown) {
            return;
          }

          targetDropdown.addClass(ClassName.ACTIVE);

          // Else
        } else {
          var curDropdown = $(el).parents('.' + ClassName.DROPDOWN)[0];
          var rootDropdown = void 0;

          this.openDropdown(curDropdown, false);

          while (curDropdown) {
            pxUtil.addClass(curDropdown, ClassName.ACTIVE);

            if (pxUtil.hasClass(curDropdown.parentNode, ClassName.DROPDOWN_MENU_WRAPPER)) {
              rootDropdown = $(curDropdown).parents('.' + ClassName.DROPDOWN_MENU).data('dropdown');
              curDropdown = null;

              if (!rootDropdown) {
                return;
              }

              pxUtil.addClass(rootDropdown, ClassName.ACTIVE);
            } else {
              rootDropdown = curDropdown;
              curDropdown = $(curDropdown).parents('.' + ClassName.DROPDOWN)[0];
            }
          }

          if (this.isCollapsed()) {
            $(this.content).find(Selector.OPENED_DROPDOWNS).removeClass(ClassName.OPEN);
            pxUtil.addClass(rootDropdown, ClassName.OPEN);
          }
        }
      }
    }, {
      key: 'openDropdown',
      value: function openDropdown(_el) {
        var showDropdown = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        var el = this._getNode(_el);

        if (this.isStatic() && !this._isFloatingDropdown(el)) {
          return;
        }
        if ((!this._isFloatingDropdown(el) || showDropdown) && !this.isDropdownOpened(el) && !this._triggerPreventableEvent('DROPDOWN_OPEN', el)) {
          return;
        }

        // Open dropdown tree
        //

        var dropdowns = this.isDropdownOpened(el) ? [] : [el];
        var dropdown = el;

        // Collect unopened parent dropdowns
        while (dropdown = $(dropdown).parents('.' + ClassName.DROPDOWN)[0]) {
          if (!this.isDropdownOpened(dropdown)) {
            dropdowns.push(dropdown);
          }
        }

        var parent = dropdowns.pop();

        if (!parent) {
          return;
        }

        // Expand child dropdowns without animation
        for (var i = 0, l = dropdowns.length; i < l; i++) {
          this._expandDropdown(dropdowns[i], false);
        }

        if (this._isFloatingDropdown(parent)) {
          if (!showDropdown) {
            return;
          }

          this._showDropdown(parent);
        } else {
          this._expandDropdown(parent, true);
        }
      }
    }, {
      key: 'closeDropdown',
      value: function closeDropdown(_el) {
        var el = this._getNode(_el);

        if (!this.isDropdownOpened(el)) {
          return;
        }
        if (this.isStatic() && !this._isFloatingDropdown(el)) {
          return;
        }
        if (!this._triggerPreventableEvent('DROPDOWN_CLOSE', el)) {
          return;
        }

        if (this._isFloatingDropdown(el)) {
          this._hideDropdown(el);
        } else {
          this._collapseDropdown(el, true);
        }
      }
    }, {
      key: 'toggleDropdown',
      value: function toggleDropdown(_el) {
        var el = this._getNode(_el);

        this[this.isDropdownOpened(el) ? 'closeDropdown' : 'openDropdown'](el);
      }
    }, {
      key: 'closeAllDropdowns',
      value: function closeAllDropdowns() {
        var _parent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : $(this.element).find('.' + ClassName.CONTENT);

        this._closeAllDropdowns(this._getNode(_parent, null));
      }
    }, {
      key: 'freezeDropdown',
      value: function freezeDropdown(_el) {
        var el = this._getNode(_el);

        if (!this._isFloatingDropdown(el) || !this.isDropdownOpened(el)) {
          return;
        }
        if (pxUtil.hasClass(el, ClassName.FREEZE)) {
          return;
        }

        pxUtil.addClass(el, ClassName.FREEZE);

        this._clearDropdownTimer(el);

        this._triggerEvent('DROPDOWN_FROZEN', el);
      }
    }, {
      key: 'unfreezeDropdown',
      value: function unfreezeDropdown(_el) {
        var el = this._getNode(_el);

        if (!this._isFloatingDropdown(el) || !this.isDropdownOpened(el)) {
          return;
        }
        if (!pxUtil.hasClass(el, ClassName.FREEZE)) {
          return;
        }

        pxUtil.removeClass(el, ClassName.FREEZE);

        this._triggerEvent('DROPDOWN_UNFROZEN', el);
      }
    }, {
      key: 'getDropdownContainer',
      value: function getDropdownContainer(_el) {
        var el = this._getNode(_el);

        return this._isFloatingDropdown(el) && this.isDropdownOpened(el) ? $($(el).data('dropdown')).find('.' + ClassName.DROPDOWN_MENU_WRAPPER) : $(el).find(Selector.DROPDOWN_MENU);
      }
    }, {
      key: 'isFloatingDropdown',
      value: function isFloatingDropdown(el) {
        return this._isFloatingDropdown(this._getNode(el));
      }
    }, {
      key: 'isDropdownOpened',
      value: function isDropdownOpened(_el) {
        var el = this._getNode(_el);
        var isRoot = this._isRootDropdown(el);
        var isCollapsed = this.isCollapsed();

        return isCollapsed && isRoot && pxUtil.hasClass(el, ClassName.SHOW) || isCollapsed && !isRoot && pxUtil.hasClass(el, ClassName.OPEN) || !isCollapsed && pxUtil.hasClass(el, ClassName.OPEN);
      }
    }, {
      key: 'isDropdownFrozen',
      value: function isDropdownFrozen(_el) {
        return pxUtil.hasClass(this._getNode(_el), ClassName.FREEZE);
      }
    }, {
      key: 'append',
      value: function append(item) {
        var parentDropdown = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        return this.insert(item, null, parentDropdown);
      }
    }, {
      key: 'prepend',
      value: function prepend(item) {
        var parentDropdown = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        return this.insert(item, 0, parentDropdown);
      }
    }, {
      key: 'insert',
      value: function insert(_item, position) {
        var _parent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

        // Get item

        var $items = this._getNodeOrCreate(_item, ClassName.ITEM, false);

        if ($items.hasClass(ClassName.DROPDOWN) && !$items.find(Selector.DROPDOWN_MENU).length) {
          throw new Error('The .' + ClassName.DROPDOWN + ' item(s) must contain the child .' + ClassName.DROPDOWN_MENU + ' element.');
        }

        // Get target

        var $parent = _parent === null ? $(this.content) : this._getNode(_parent, ClassName.DROPDOWN, false);

        var $target = void 0;

        if ($parent.hasClass(ClassName.CONTENT)) {
          $target = $parent;
        } else {
          // If floating dropdown
          if (this._isFloatingDropdown($parent[0]) && this.isDropdownOpened($parent[0])) {
            $target = $($parent.data('dropdown')).find('.' + ClassName.DROPDOWN_MENU_WRAPPER);
          } else {
            $target = $parent.find(Selector.DROPDOWN_MENU);
          }

          if (!$target.length) {
            throw new Error('Targeted element is not found.');
          }
        }

        // Insert items

        var $dropdownItems = $target.find(Selector.ITEM);

        if (!$dropdownItems.length) {
          $target.append($items);
        } else if (position === null) {
          $items.insertAfter($dropdownItems.last());
        } else {
          var $found = $dropdownItems.eq(position);

          if ($found.length) {
            $items.insertBefore($found);
          } else {
            $items.insertAfter($dropdownItems.last());
          }
        }

        // Update scrollbar

        if (!this.isCollapsed() || $parent.hasClass(ClassName.CONTENT)) {
          this._updateScrollbar(this.content);
        } else if ($target.hasClass(ClassName.DROPDOWN_MENU_WRAPPER)) {
          this._updateScrollbar($target[0]);
        } else {
          this._updateScrollbar($target.parents('.' + ClassName.DROPDOWN_MENU_WRAPPER)[0]);
        }

        return $items;
      }
    }, {
      key: 'remove',
      value: function remove(_item) {
        var $item = this._getNode(_item, ClassName.ITEM, false);
        var $parent = $item.parent();

        if ($item.hasClass(ClassName.DROPDOWN)) {
          $($item.data('dropdown')).remove();
        }

        $item.remove();

        if (!this.isCollapsed() || $parent.hasClass(ClassName.CONTENT)) {
          this._updateScrollbar(this.content);
        } else if ($parent.hasClass(ClassName.DROPDOWN_MENU_WRAPPER)) {
          this._updateScrollbar($parent[0]);
        } else {
          this._updateScrollbar($parent.parents('.' + ClassName.DROPDOWN_MENU_WRAPPER)[0]);
        }
      }
    }, {
      key: 'destroy',
      value: function destroy() {
        // Trigger before destroy event
        if (!this._triggerPreventableEvent('DESTROY', this.element)) {
          return;
        }

        this._unsetListeners();
        $(this.element).removeData(DATA_KEY);

        // Disable animations
        pxUtil.removeClass(this.element, ClassName.ANIMATE);

        // Disable transitions
        pxUtil.removeClass(this.element, ClassName.TRANSITIONING);

        // Reset nav state
        pxUtil.removeClass(this.element, ClassName.EXPAND);

        // Close dropdowns
        if (this.isCollapsed()) {
          this.closeAllDropdowns();
        }

        // Remove dimmer if no initialized navs exists

        var initializedNavs = 0;

        $(this.element.parentNode).find('> .' + ClassName.NAV).each(function () {
          if ($(this).data(DATA_KEY)) {
            initializedNavs++;
          }
        });

        if (!initializedNavs) {
          $(this.dimmer).remove();
        }

        // Destroy scrollbar
        $(this.element).find('.' + ClassName.CONTENT).perfectScrollbar('destroy');
        $(this.content).unwrap(Selector.SCROLLABLE_AREA);
      }

      // private

    }, {
      key: '_getNode',
      value: function _getNode(_el) {
        var requiredClass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ClassName.DROPDOWN;
        var returnPlainNode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

        var $el = typeof _el === 'string' ? $(this.element).find(_el) : $(_el);

        if (!$el.length) {
          throw new Error('Element is not found.');
        }

        if (requiredClass && !$el.hasClass(requiredClass)) {
          throw new Error('Element(s) must have the .' + requiredClass + ' class.');
        }

        return returnPlainNode ? $el[0] : $el;
      }
    }, {
      key: '_getNodeOrCreate',
      value: function _getNodeOrCreate(_el) {
        var requiredClass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ClassName.DROPDOWN;
        var returnPlainNode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

        // Add simple check to detect CSS selector
        return this._getNode(typeof _el === 'string' && (_el[0] === '#' || _el[0] === '.') ? _el : $(_el), requiredClass, returnPlainNode);
      }
    }, {
      key: '_detectActiveItem',
      value: function _detectActiveItem() {
        var $activeItem = $(this.content).find('.' + ClassName.ITEM + '.' + ClassName.ACTIVE + ':not(.' + ClassName.DROPDOWN + ')');

        if (!$activeItem.length) {
          return;
        }

        this.activateItem($activeItem.first());
      }
    }, {
      key: '_expandDropdown',
      value: function _expandDropdown(el) {
        var animate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        if (pxUtil.hasClass(el, ClassName.OPEN)) {
          return;
        }

        var $dropdown = $(el).find(Selector.DROPDOWN_MENU);

        function complete() {
          $dropdown.removeClass(ClassName.TRANSITIONING).height('');

          this._updateScrollbar(this.isCollapsed() ? $(el).parents('.' + ClassName.DROPDOWN_MENU_WRAPPER)[0] : this.content);

          // Trigger "opened" event
          this._triggerEvent('DROPDOWN_OPENED', el);
        }

        if (this.config.accordion) {
          this._closeAllDropdowns(el.parentNode, animate, $(el));
        }

        pxUtil.addClass(el, ClassName.OPEN);

        if (!$.support.transition || !animate) {
          return complete.call(this);
        }

        $dropdown.height(0).addClass(ClassName.TRANSITIONING).one('bsTransitionEnd', $.proxy(complete, this)).emulateTransitionEnd(this.config.transitionDuration).height($dropdown[0].scrollHeight);
      }
    }, {
      key: '_collapseDropdown',
      value: function _collapseDropdown(el) {
        var animate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        if (!pxUtil.hasClass(el, ClassName.OPEN)) {
          return;
        }

        var $dropdown = $(el).find(Selector.DROPDOWN_MENU);

        function complete() {
          pxUtil.removeClass(el, ClassName.OPEN);
          $dropdown.removeClass(ClassName.TRANSITIONING).height('');

          // Collapse all sub-dropdowns
          $(el).find('.' + ClassName.OPEN).removeClass(ClassName.OPEN);

          this._updateScrollbar(this.isCollapsed() ? $(el).parents('.' + ClassName.DROPDOWN_MENU_WRAPPER)[0] : this.content);

          // Trigger "closed" event
          this._triggerEvent('DROPDOWN_CLOSED', el);
        }

        if (!$.support.transition || !animate) {
          return complete.call(this);
        }

        $dropdown.height($dropdown.height())[0].offsetHeight;

        $dropdown.addClass(ClassName.TRANSITIONING).height(0).one('bsTransitionEnd', $.proxy(complete, this)).emulateTransitionEnd(this.config.transitionDuration);
      }
    }, {
      key: '_showDropdown',
      value: function _showDropdown(el) {
        var _this2 = this;

        if (pxUtil.hasClass(el, ClassName.SHOW) || !this._isRootDropdown(el)) {
          return;
        }

        var container = el.parentNode.parentNode;
        var dropdown = $(el).find(Selector.DROPDOWN_MENU)[0];

        if (!dropdown) {
          return;
        }

        // Close all dropdowns
        this.closeAllDropdowns();

        var offsetTop = el.parentNode.offsetTop;
        var elTop = el.offsetTop - el.parentNode.scrollTop;

        var $dropdownTitle = $('<div class="' + ClassName.DROPDOWN_MENU_TITLE + '"></div>').html($(el).find(Selector.ITEM_LABEL).html()).prependTo(dropdown);

        pxUtil.addClass(el, ClassName.SHOW);
        pxUtil.addClass(dropdown, ClassName.SHOW);
        container.appendChild(dropdown);

        var elHeight = $(el).outerHeight();
        var $items = $(dropdown).find(Selector.ITEM);
        var itemHeight = $items.first().find('> a').outerHeight();
        var visibleArea = $(this.element).outerHeight() - offsetTop;
        var titleHeight = $dropdownTitle.outerHeight();
        var minHeight = titleHeight + itemHeight * 3;

        var dropdownWrapper = $('<div class="' + ClassName.DROPDOWN_MENU_WRAPPER + '"></div>').append($items).appendTo(dropdown)[0];

        var maxHeight = void 0;

        // Top dropdown
        if (elTop + minHeight > visibleArea) {
          maxHeight = elTop;

          if (this.isFixed() || this._curMode === 'tablet') {
            dropdown.style.bottom = visibleArea - elTop - elHeight + 'px';
          } else {
            dropdown.style.bottom = '0px';
          }

          pxUtil.addClass(dropdown, ClassName.DROPDOWN_MENU_TOP);
          dropdown.appendChild($dropdownTitle[0]);

          // Bottom dropdown
        } else {
          maxHeight = visibleArea - elTop - titleHeight;

          dropdown.style.top = offsetTop + elTop + 'px';
          dropdown.insertBefore($dropdownTitle[0], dropdown.firstChild);
        }

        dropdownWrapper.style.maxHeight = maxHeight - 10 + 'px';
        $(dropdownWrapper).perfectScrollbar(PERFECT_SCROLLBAR_OPTIONS);

        // Add event handlers
        $(dropdown).on(this.constructor.Event.MOUSEENTER, function () {
          return _this2._clearDropdownTimer(el);
        }).on(this.constructor.Event.MOUSELEAVE, function () {
          return _this2._setDropdownTimer(el);
        });

        // Link elements
        $(el).data('dropdown', dropdown);
        $(dropdown).data('element', el);

        this._updateScrollbar(el.parentNode);

        // Trigger "opened" event
        this._triggerEvent('DROPDOWN_OPENED', el);
      }
    }, {
      key: '_hideDropdown',
      value: function _hideDropdown(el) {
        if (!pxUtil.hasClass(el, ClassName.SHOW)) {
          return;
        }

        var dropdown = $(el).data('dropdown');

        if (!dropdown) {
          return;
        }

        // Remove classes
        pxUtil.removeClass(el, [ClassName.SHOW, ClassName.FREEZE]);
        pxUtil.removeClass(dropdown, ClassName.SHOW);
        pxUtil.removeClass(dropdown, ClassName.DROPDOWN_MENU_TOP);
        this.unfreezeDropdown(el);

        var $wrapper = $(dropdown).find('.' + ClassName.DROPDOWN_MENU_WRAPPER);

        // Remove title
        $(dropdown).find('.' + ClassName.DROPDOWN_MENU_TITLE).remove();

        // Remove wrapper
        $(dropdown).append($wrapper.find(Selector.ITEM));
        $wrapper.perfectScrollbar('destroy').remove();

        dropdown.setAttribute('style', '');
        el.appendChild(dropdown);

        $(el).data('dropdown', null);
        $(dropdown).data('element', null);

        this._clearDropdownTimer(el);

        // Remove event handlers
        $(dropdown).off('mouseenter').off('mouseleave');

        this._updateScrollbar(el.parentNode);

        // Trigger "closed" event
        this._triggerEvent('DROPDOWN_CLOSED', el);
      }
    }, {
      key: '_showTooltip',
      value: function _showTooltip(dropdown) {
        this._clearTooltips();

        var text = $(dropdown).find('.px-nav-label').contents().filter(function () {
          return this.nodeType === 3;
        }).text();

        var tooptip = $('<div class="' + ClassName.TOOLTIP + '"></div>').text(text)[0];

        var offsetTop = dropdown.parentNode.offsetTop;
        var elTop = dropdown.offsetTop - dropdown.parentNode.scrollTop;

        tooptip.style.top = offsetTop + elTop + 'px';

        // Link dropdown
        $(tooptip).data('dropdown', dropdown);

        dropdown.parentNode.parentNode.appendChild(tooptip);
      }
    }, {
      key: '_updateTooltipPosition',
      value: function _updateTooltipPosition() {
        var tooltip = $(this.element).find('.' + ClassName.TOOLTIP)[0];

        if (!tooltip) {
          return;
        }

        var dropdown = $(tooltip).data('dropdown');

        if (!dropdown) {
          $(tooltip).remove();
          return;
        }

        var offsetTop = dropdown.parentNode.offsetTop;
        var elTop = dropdown.offsetTop - dropdown.parentNode.scrollTop;

        tooltip.style.top = offsetTop + elTop + 'px';
      }
    }, {
      key: '_clearTooltips',
      value: function _clearTooltips() {
        $(this.element).find('.' + ClassName.TOOLTIP).remove();
      }
    }, {
      key: '_closeAllDropdowns',
      value: function _closeAllDropdowns(_parent, animate) {
        var $except = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

        var self = this;

        var _selector = void 0;
        var method = void 0;
        var parent = _parent;

        if (this.isCollapsed() && pxUtil.hasClass(parent, ClassName.CONTENT)) {
          _selector = Selector.SHOWN_DROPDOWNS;
          method = '_hideDropdown';
        } else {
          if (this._isFloatingDropdown(parent) && this.isDropdownOpened(parent)) {
            parent = $($(parent).data('dropdown')).find('.' + ClassName.DROPDOWN_MENU_WRAPPER)[0];
          } else if (pxUtil.hasClass(parent, ClassName.DROPDOWN)) {
            parent = $(parent).find(Selector.DROPDOWN_MENU)[0];
          }

          _selector = Selector.OPENED_DROPDOWNS;
          method = '_collapseDropdown';
        }

        $(parent).find(_selector).each(function () {
          if ($except && $except === $(this)) {
            return;
          }

          self[method](this, animate);
        });
      }
    }, {
      key: '_isRootDropdown',
      value: function _isRootDropdown(el) {
        return pxUtil.hasClass(el.parentNode, ClassName.CONTENT);
      }
    }, {
      key: '_isFloatingDropdown',
      value: function _isFloatingDropdown(el) {
        return this.isCollapsed() && this._isRootDropdown(el);
      }
    }, {
      key: '_getNavState',
      value: function _getNavState() {
        return (this._curMode === 'phone' || this._curMode === 'tablet') && !pxUtil.hasClass(this.element, ClassName.EXPAND) || this._curMode === 'desktop' && pxUtil.hasClass(this.element, ClassName.COLLAPSE);
      }
    }, {
      key: '_setDropdownTimer',
      value: function _setDropdownTimer(el) {
        var _this3 = this;

        if (this.isDropdownFrozen(el)) {
          return;
        }

        this._clearDropdownTimer(el);

        var timer = setTimeout(function () {
          if (_this3.isDropdownFrozen(el)) {
            return;
          }

          _this3._hideDropdown(el);
        }, this.config.dropdownCloseDelay);

        $(el).data('timer', timer);
      }
    }, {
      key: '_clearDropdownTimer',
      value: function _clearDropdownTimer(el) {
        var timer = $(el).data('timer');

        if (!timer) {
          return;
        }

        clearTimeout(timer);
      }
    }, {
      key: '_updateScrollbar',
      value: function _updateScrollbar(el) {
        if (el && pxUtil.hasClass(el, ClassName.PERFECT_SCROLLBAR_CONTAINER)) {
          $(el).perfectScrollbar('update');
        }
      }
    }, {
      key: '_changeNavState',
      value: function _changeNavState(fn) {
        this._stateChanging++;

        if (this.config.animate && $.support.transition) {
          pxUtil.addClass(this.element, ClassName.NAV_TRANSITIONING);
        }

        function transitionComplete() {
          this._stateChanging = this._stateChanging < 2 ? 0 : this._stateChanging - 1;

          if (!this._stateChanging) {
            pxUtil.removeClass(this.element, ClassName.NAV_TRANSITIONING);
          }

          this._updateScrollbar(this.content);
          pxUtil.triggerResizeEvent();
        }

        fn.call(this);

        this._isCollapsed = this._getNavState();
        this._storeNavState();

        if (!this.config.animate || !$.support.transition) {
          return transitionComplete.call(this);
        }

        $(this.element).one('bsTransitionEnd', $.proxy(transitionComplete, this)).emulateTransitionEnd(this.config.transitionDuration);
      }
    }, {
      key: '_getMode',
      value: function _getMode() {
        var screenSize = window.PixelAdmin.getScreenSize();

        var mode = void 0;

        if (this.config.modes.phone.indexOf(screenSize) !== -1) {
          mode = 'phone';
        } else if (this.config.modes.tablet.indexOf(screenSize) !== -1) {
          mode = 'tablet';
        } else if (this.config.modes.desktop.indexOf(screenSize) !== -1) {
          mode = 'desktop';
        } else {
          throw new Error('Cannot determine PxNav mode.');
        }

        return mode;
      }
    }, {
      key: '_prefixStorageKey',
      value: function _prefixStorageKey(key) {
        return this.config.storagePrefix + (pxUtil.hasClass(this.element, ClassName.NAV_LEFT) ? 'left.' : 'right.') + key;
      }
    }, {
      key: '_storeNavState',
      value: function _storeNavState() {
        if (!this.config.storeState) {
          return;
        }

        var key = this._prefixStorageKey('state');
        var state = pxUtil.hasClass(this.element, ClassName.COLLAPSE) ? 'collapsed' : 'expanded';

        window.PixelAdmin.storage.set(key, state);
      }
    }, {
      key: '_restoreNavState',
      value: function _restoreNavState() {
        if (!this.config.storeState) {
          return;
        }

        var key = this._prefixStorageKey('state');
        var state = window.PixelAdmin.storage.get(key) || 'expanded';

        pxUtil[state === 'collapsed' ? 'addClass' : 'removeClass'](this.element, ClassName.COLLAPSE);

        this._isCollapsed = this._getNavState();
        pxUtil.triggerResizeEvent();
      }
    }, {
      key: '_checkNavbarPosition',
      value: function _checkNavbarPosition() {
        if (!this.isFixed()) {
          return;
        }

        var navbar = $(this.element).find(Selector.NEAR_NAVBAR)[0];

        if (!navbar) {
          return;
        }

        if (!pxUtil.hasClass(navbar.parentNode, ClassName.NAVBAR_FIXED)) {
          console.warn('The ' + (pxUtil.hasClass(this.element, ClassName.NAV_LEFT) ? 'left' : 'right') + ' .px-nav is fixed, but the coterminous .px-navbar isn\'t. You need to explicitly add the .' + ClassName.NAVBAR_FIXED + ' class to the parent element to fix the navbar.');

          pxUtil.addClass(navbar.parentNode, ClassName.NAVBAR_FIXED);
        }
      }
    }, {
      key: '_setupMarkup',
      value: function _setupMarkup() {
        var $parent = $(this.element).parent();

        // Append dimmer
        if (!$parent.find('> .' + ClassName.DIMMER).length) {
          $parent.append('<div class="' + ClassName.DIMMER + '"></div>');
        }

        // Set scrollbar

        if (!$.fn.perfectScrollbar) {
          throw new Error('Scrolling feature requires the "perfect-scrollbar" plugin included.');
        }

        var $content = $(this.content);

        if ($content.length) {
          $content.wrap('<div class="' + ClassName.SCROLLABLE_AREA + '"></div>').perfectScrollbar(PERFECT_SCROLLBAR_OPTIONS);
        }
      }
    }, {
      key: '_setListeners',
      value: function _setListeners() {
        var _this4 = this;

        var self = this;

        $(window).on(this.constructor.Event.RESIZE + '.' + this.uniqueId, function () {
          self._curMode = self._getMode();
          self._isCollapsed = self._getNavState();

          if (self.isCollapsed()) {
            self.closeAllDropdowns();
          }

          if (self.config.enableTooltips) {
            self._clearTooltips();
          }

          self._updateScrollbar(self.content);
        });

        $(this.element).on(this.constructor.Event.CLICK, Selector.DROPDOWN_LINK, function (e) {
          e.preventDefault();

          var el = this.parentNode;

          if (self._isFloatingDropdown(el)) {
            if (self.isDropdownOpened(el)) {
              self[self.isDropdownFrozen(el) ? 'closeDropdown' : 'freezeDropdown'](el);
            } else {
              self.openDropdown(el);
              self.freezeDropdown(el);
            }
          } else {
            self.toggleDropdown(el);
          }
        });

        $(this.content).on(this.constructor.Event.MOUSEENTER, Selector.DROPDOWN_LINK, function () {
          if (window.PixelAdmin.isMobile) {
            return;
          }

          var el = this.parentNode;

          if (!self._isFloatingDropdown(el) || pxUtil.hasClass(self.element, ClassName.OFF_CANVAS)) {
            return;
          }

          if (!self.isDropdownOpened(el)) {
            if ($(self.element).find(Selector.FROZEN_DROPDOWNS).length) {
              return;
            }
            self.openDropdown(el);
          } else {
            self._clearDropdownTimer(el);
          }
        }).on(this.constructor.Event.MOUSELEAVE, Selector.DROPDOWN_LINK, function () {
          if (window.PixelAdmin.isMobile) {
            return;
          }

          var el = this.parentNode;

          if (!self._isFloatingDropdown(el) || !self.isDropdownOpened(el)) {
            return;
          }

          self._setDropdownTimer(el);
        }).on(this.constructor.Event.MOUSEENTER, Selector.ROOT_LINK, function () {
          if (window.PixelAdmin.isMobile) {
            return;
          }

          if (!self.config.enableTooltips || !self.isCollapsed() || pxUtil.hasClass(self.element, ClassName.OFF_CANVAS)) {
            return;
          }

          self._showTooltip(this.parentNode);
        }).on(this.constructor.Event.MOUSELEAVE, Selector.ROOT_LINK, function () {
          if (window.PixelAdmin.isMobile) {
            return;
          }

          if (!self.config.enableTooltips) {
            return;
          }

          self._clearTooltips();
        }).on(this.constructor.Event.SCROLL, function () {
          if (!_this4.isCollapsed()) {
            return;
          }

          if (_this4.config.enableTooltips) {
            _this4._updateTooltipPosition();
          }

          _this4.closeAllDropdowns();
        });
      }
    }, {
      key: '_unsetListeners',
      value: function _unsetListeners() {
        $(window).off(this.constructor.Event.RESIZE + '.' + this.uniqueId);
        $(this.element).off(EVENT_KEY);
        $(this.content).off(EVENT_KEY).find('.' + ClassName.DROPDOWN_MENU).off(EVENT_KEY);

        // Reset dimmer
        if (this._curMode !== 'desktop' && pxUtil.hasClass(this.element, ClassName.EXPAND)) {
          $(this.dimmer).off(EVENT_KEY);
        }
      }
    }, {
      key: '_enableAnimation',
      value: function _enableAnimation() {
        var _this5 = this;

        if (!this.config.animate) {
          return;
        }

        // Prevent animation "blink"
        pxUtil.addClass(this.element, ['off', ClassName.ANIMATE]);

        setTimeout(function () {
          pxUtil.removeClass(_this5.element, 'off');
        }, this.config.transitionDuration);
      }
    }, {
      key: '_triggerEvent',
      value: function _triggerEvent(eventKey, target) {
        var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        $(this.element).trigger($.Event(this.constructor.Event[eventKey], { target: target }), [data]);
      }
    }, {
      key: '_triggerPreventableEvent',
      value: function _triggerPreventableEvent(eventKey, target) {
        var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        var event = $.Event(this.constructor.Event[eventKey], { target: target });

        $(this.element).trigger(event, [data]);

        return !event.isDefaultPrevented();
      }
    }, {
      key: '_getConfig',
      value: function _getConfig(config) {
        return $.extend({}, this.constructor.Default, $(this.element).data(), config);
      }

      // static

    }], [{
      key: '_jQueryInterface',
      value: function _jQueryInterface(config) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        var result = void 0;

        var $el = this.each(function () {
          var data = $(this).data(DATA_KEY);
          var _config = (typeof config === 'undefined' ? 'undefined' : _typeof(config)) === 'object' ? config : null;

          if (!data) {
            data = new Nav(this, _config);
            $(this).data(DATA_KEY, data);
          }

          if (typeof config === 'string') {
            if (!data[config]) {
              throw new Error('No method named "' + config + '"');
            }
            result = data[config].apply(data, args);
          }
        });

        return typeof result !== 'undefined' ? result : $el;
      }
    }, {
      key: 'Default',
      get: function get() {
        return Default;
      }
    }, {
      key: 'NAME',
      get: function get() {
        return NAME;
      }
    }, {
      key: 'DATA_KEY',
      get: function get() {
        return DATA_KEY;
      }
    }, {
      key: 'Event',
      get: function get() {
        return Event;
      }
    }, {
      key: 'EVENT_KEY',
      get: function get() {
        return EVENT_KEY;
      }
    }]);

    return Nav;
  }();

  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */

  $(document).on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE, function (e) {
    e.preventDefault();

    var $target = $($(this).data('target'));

    if (!$target.length) {
      $target = $(this).parents('.' + ClassName.NAV);
    }
    if (!$target.length) {
      return;
    }

    if (!$target.data(DATA_KEY)) {
      Nav._jQueryInterface.call($target, $(this).data());
    }

    Nav._jQueryInterface.call($target, 'toggle');
  });

  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME] = Nav._jQueryInterface;
  $.fn[NAME].Constructor = Nav;
  $.fn[NAME].noConflict = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT;
    return Nav._jQueryInterface;
  };

  return Nav;
}(jQuery);


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Plugins / PxFooter
// --------------------------------------------------

var PxFooter = function ($) {
  'use strict';

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME = 'pxFooter';
  var DATA_KEY = 'px.footer';
  var EVENT_KEY = '.' + DATA_KEY;
  var JQUERY_NO_CONFLICT = $.fn[NAME];

  var ClassName = {
    CONTENT: 'px-content',
    BOTTOM: 'px-footer-bottom',
    FIXED: 'px-footer-fixed'
  };

  var Event = {
    RESIZE: 'resize' + EVENT_KEY,
    SCROLL: 'scroll' + EVENT_KEY,
    NAV_EXPANDED: 'expanded.px.nav',
    NAV_COLLAPSED: 'collapsed.px.nav',
    DROPDOWN_OPENED: 'dropdown-opened.px.nav',
    DROPDOWN_CLOSED: 'dropdown-closed.px.nav'
  };

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  var Footer = function () {
    function Footer(element) {
      _classCallCheck(this, Footer);

      this.uniqueId = pxUtil.generateUniqueId();
      this.element = element;
      this.parent = this._getParent(element);

      this._setListeners();

      this.update();
    }

    // getters

    _createClass(Footer, [{
      key: 'update',


      // public

      value: function update() {
        if (this.parent === document.body) {
          this._curScreenSize = window.PixelAdmin.getScreenSize();
          this._updateBodyMinHeight();
        }

        var content = $(this.element.parentNode).find('> .' + ClassName.CONTENT)[0];

        // if (!content) { return; }

        if (!pxUtil.hasClass(this.element, ClassName.BOTTOM) && !pxUtil.hasClass(this.element, ClassName.FIXED)) {
          content.style.paddingBottom = content.setAttribute('style', (content.getAttribute('style') || '').replace(/\s*padding-bottom:\s*\d+px\s*;?/i));
          return;
        }

        content.style.paddingBottom = $(this.element).outerHeight() + 20 + 'px';
      }
    }, {
      key: 'destroy',
      value: function destroy() {
        this._unsetListeners();

        $(this.element).removeData(DATA_KEY);

        // Reset related styles
        $(document.body).css('min-height', '');

        var content = $(this.element.parentNode).find('> .' + ClassName.CONTENT)[0];

        content.style.paddingBottom = content.setAttribute('style', (content.getAttribute('style') || '').replace(/\s*padding-bottom:\s*\d+px\s*;?/i));
      }

      // private

    }, {
      key: '_getParent',
      value: function _getParent(element) {
        var parent = element.parentNode;

        while (parent.nodeName.toLowerCase() === 'ui-view') {
          parent = parent.parentNode;
        }

        return parent;
      }
    }, {
      key: '_updateBodyMinHeight',
      value: function _updateBodyMinHeight() {
        if (document.body.style.minHeight) {
          document.body.style.minHeight = null;
        }

        if (this._curScreenSize !== 'lg' && this._curScreenSize !== 'xl' || !pxUtil.hasClass(this.element, ClassName.BOTTOM) || $(document.body).height() >= document.body.scrollHeight) {
          return;
        }

        document.body.style.minHeight = document.body.scrollHeight + 'px';
      }
    }, {
      key: '_setListeners',
      value: function _setListeners() {
        $(window).on(this.constructor.Event.RESIZE + '.' + this.uniqueId, $.proxy(this.update, this)).on(this.constructor.Event.SCROLL + '.' + this.uniqueId, $.proxy(this._updateBodyMinHeight, this)).on(this.constructor.Event.NAV_EXPANDED + '.' + this.uniqueId + ' ' + this.constructor.Event.NAV_COLLAPSED + '.' + this.uniqueId, '.px-nav', $.proxy(this._updateBodyMinHeight, this));

        if (this.parent === document.body) {
          $('.px-nav').on(this.constructor.Event.DROPDOWN_OPENED + '.' + this.uniqueId + ' ' + this.constructor.Event.DROPDOWN_CLOSED + '.' + this.uniqueId, '.px-nav-dropdown', $.proxy(this._updateBodyMinHeight, this));
        }
      }
    }, {
      key: '_unsetListeners',
      value: function _unsetListeners() {
        $(window).off(this.constructor.Event.RESIZE + '.' + this.uniqueId + ' ' + this.constructor.Event.SCROLL + '.' + this.uniqueId).off(this.constructor.Event.NAV_EXPANDED + '.' + this.uniqueId + ' ' + this.constructor.Event.NAV_COLLAPSED + '.' + this.uniqueId);

        $('.px-nav').off(this.constructor.Event.DROPDOWN_OPENED + '.' + this.uniqueId + ' ' + this.constructor.Event.DROPDOWN_CLOSED + '.' + this.uniqueId);
      }

      // static

    }], [{
      key: '_jQueryInterface',
      value: function _jQueryInterface(method) {
        return this.each(function () {
          var data = $(this).data(DATA_KEY);

          if (!data) {
            data = new Footer(this);
            $(this).data(DATA_KEY, data);
          }

          if (typeof method === 'string') {
            if (!data[method]) {
              throw new Error('No method named "' + method + '"');
            }
            data[method]();
          }
        });
      }
    }, {
      key: 'NAME',
      get: function get() {
        return NAME;
      }
    }, {
      key: 'DATA_KEY',
      get: function get() {
        return DATA_KEY;
      }
    }, {
      key: 'Event',
      get: function get() {
        return Event;
      }
    }, {
      key: 'EVENT_KEY',
      get: function get() {
        return EVENT_KEY;
      }
    }]);

    return Footer;
  }();

  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME] = Footer._jQueryInterface;
  $.fn[NAME].Constructor = Footer;
  $.fn[NAME].noConflict = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT;
    return Footer._jQueryInterface;
  };

  return Footer;
}(jQuery);


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Plugins / PxWizard
// --------------------------------------------------

var PxWizard = function ($) {
  'use strict';

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME = 'pxWizard';
  var DATA_KEY = 'px.wizard';
  var EVENT_KEY = '.' + DATA_KEY;
  var JQUERY_NO_CONFLICT = $.fn[NAME];

  var Default = {
    minStepWidth: 200
  };

  var ClassName = {
    WRAPPER: 'wizard-wrapper',
    STEPS: 'wizard-steps',
    PANE: 'wizard-pane',
    FROZEN: 'frozen',
    FINISHED: 'finished',
    ACTIVE: 'active',
    COMPLETED: 'completed'
  };

  var Event = {
    RESIZE: 'resize' + EVENT_KEY,
    CLICK: 'click' + EVENT_KEY,
    CHANGE: 'stepchange' + EVENT_KEY,
    CHANGED: 'stepchanged' + EVENT_KEY,
    FINISH: 'finish' + EVENT_KEY,
    FINISHED: 'finished' + EVENT_KEY,
    FROZEN: 'frozen' + EVENT_KEY,
    UNFROZEN: 'unfrozen' + EVENT_KEY,
    RESETED: 'reseted' + EVENT_KEY,
    DESTROY: 'destroy' + EVENT_KEY
  };

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  var Wizard = function () {
    function Wizard(element, config) {
      _classCallCheck(this, Wizard);

      this.uniqueId = pxUtil.generateUniqueId();

      this.element = element;
      this.steps = $(element).find('.' + ClassName.STEPS)[0];
      this.stepItems = $(this.steps).find('li');
      this.wrapper = $(element).find('.' + ClassName.WRAPPER)[0];
      this.config = this._getConfig(config);

      this.activeStep = null;

      this._isRtl = $('html').attr('dir') === 'rtl';

      this._resetStepsWidth();
      this.resizeStepItems();
      this.goTo(this.getActiveStepIndex());

      this._setListeners();
    }

    // getters

    _createClass(Wizard, [{
      key: 'resizeStepItems',


      // public

      value: function resizeStepItems() {
        var stepCount = this.stepItems.length;
        var curWrapperWidth = $(this.wrapper).width();
        var minWrapperWidth = this.config.minStepWidth * stepCount;

        var newWidth = curWrapperWidth > minWrapperWidth ? Math.floor(curWrapperWidth / stepCount) : this.config.minStepWidth;

        for (var i = 0; i < stepCount; i++) {
          this._setStrictWidth(this.stepItems[i], newWidth);
        }

        if (this.activeStep !== null) {
          this._placeStepsContainer();
        }
      }
    }, {
      key: 'getActiveStepIndex',
      value: function getActiveStepIndex() {
        var curStep = this.activeStep || $(this.steps).find('li.' + ClassName.ACTIVE)[0];

        if (!curStep) {
          return 0;
        }

        return this._getStepIndex(curStep);
      }
    }, {
      key: 'getStepCount',
      value: function getStepCount() {
        return this.stepItems.length;
      }
    }, {
      key: 'goTo',
      value: function goTo(step) {
        if (this.isFrozen() || this.isFinished()) {
          return;
        }

        var stepItem = void 0;
        var stepIndex = void 0;
        var stepTarget = void 0;

        // Get active step index
        var _getStepItemAndTarget2 = this._getStepItemAndTarget(step);

        var _getStepItemAndTarget3 = _slicedToArray(_getStepItemAndTarget2, 3);

        stepIndex = _getStepItemAndTarget3[0];
        stepItem = _getStepItemAndTarget3[1];
        stepTarget = _getStepItemAndTarget3[2];
        var activeStepIndex = this.activeStep ? this._getStepIndex(this.activeStep) : null;

        if (activeStepIndex !== null && stepIndex === activeStepIndex) {
          return;
        }

        if (activeStepIndex !== null) {
          // Trigger before change event
          var eventResult = this._triggerPreventableEvent('CHANGE', this.element, {
            activeStepIndex: activeStepIndex,
            nextStepIndex: stepIndex
          });

          if (!eventResult) {
            return;
          }
        }

        this.activeStep = stepItem;

        this._activateStepItem(stepItem, stepIndex);
        this._activateStepPane(stepTarget);

        if (activeStepIndex !== null) {
          // Trigger after change event
          this._triggerEvent('CHANGED', this.element, {
            prevStepIndex: activeStepIndex,
            activeStepIndex: stepIndex
          });
        }
      }
    }, {
      key: 'getPaneByIndex',
      value: function getPaneByIndex(stepIndex) {
        var _stepItem = void 0;
        var _stepIndex = void 0;
        var stepTarget = void 0;

        var _getStepItemAndTarget4 = this._getStepItemAndTarget(stepIndex);

        var _getStepItemAndTarget5 = _slicedToArray(_getStepItemAndTarget4, 3);

        _stepIndex = _getStepItemAndTarget5[0];
        _stepItem = _getStepItemAndTarget5[1];
        stepTarget = _getStepItemAndTarget5[2];


        return $(stepTarget);
      }
    }, {
      key: 'getActivePane',
      value: function getActivePane() {
        return this.getPaneByIndex(this.getActiveStepIndex());
      }
    }, {
      key: 'goNext',
      value: function goNext() {
        if (this.isFrozen() || this.isFinished()) {
          return;
        }

        var nextIndex = this._getStepIndex(this.activeStep) + 1;

        if (nextIndex >= this.stepItems.length) {
          return this.finish();
        }

        this.goTo(nextIndex);
      }
    }, {
      key: 'goPrev',
      value: function goPrev() {
        if (this.isFrozen() || this.isFinished()) {
          return;
        }

        var prevIndex = this._getStepIndex(this.activeStep) - 1;

        if (prevIndex < 0) {
          return;
        }

        this.goTo(prevIndex);
      }
    }, {
      key: 'finish',
      value: function finish() {
        if (this.isFrozen() || this.isFinished()) {
          return;
        }

        // Trigger before finish event
        if (!this._triggerPreventableEvent('FINISH', this.element)) {
          return;
        }

        var curIndex = this._getStepIndex(this.activeStep);
        var lastIndex = this.stepItems.length - 1;

        if (curIndex !== lastIndex) {
          this.goTo(lastIndex);
        }

        pxUtil.addClass(this.element, ClassName.FINISHED);
        this.freeze();

        // Trigger after finish event
        this._triggerEvent('FINISHED', this.element);
      }
    }, {
      key: 'isFinished',
      value: function isFinished() {
        return pxUtil.hasClass(this.element, ClassName.FINISHED);
      }
    }, {
      key: 'freeze',
      value: function freeze() {
        pxUtil.addClass(this.element, ClassName.FROZEN);

        // Trigger after freeze event
        this._triggerEvent('FROZEN', this.element);
      }
    }, {
      key: 'unfreeze',
      value: function unfreeze() {
        if (this.isFinished()) {
          return;
        }

        pxUtil.removeClass(this.element, ClassName.FROZEN);

        // Trigger after unfreeze event
        this._triggerEvent('UNFROZEN', this.element);
      }
    }, {
      key: 'isFrozen',
      value: function isFrozen() {
        return pxUtil.hasClass(this.element, ClassName.FROZEN);
      }
    }, {
      key: 'reset',
      value: function reset() {
        var resetSteps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

        pxUtil.removeClass(this.element, ClassName.FROZEN);
        pxUtil.removeClass(this.element, ClassName.FINISHED);

        if (resetSteps) {
          this.goTo(0);
        }

        // Trigger after reset event
        this._triggerEvent('RESETED', this.element);
      }
    }, {
      key: 'destroy',
      value: function destroy() {
        // Trigger before destroy event
        if (!this._triggerPreventableEvent('DESTROY', this.element)) {
          return;
        }

        this._unsetListeners();
        $(this.element).removeData(DATA_KEY);
      }

      // private

    }, {
      key: '_resetStepsWidth',
      value: function _resetStepsWidth() {
        this.steps.style.width = 'auto';
      }
    }, {
      key: '_setStrictWidth',
      value: function _setStrictWidth(element, width) {
        element.style.minWidth = width + 'px';
        element.style.maxWidth = width + 'px';
        element.style.width = width + 'px';
      }
    }, {
      key: '_getStepItemAndTarget',
      value: function _getStepItemAndTarget(step) {
        var stepItem = void 0;
        var stepIndex = void 0;

        if (typeof step === 'number') {
          stepItem = this.stepItems[step];
          stepIndex = step;

          if (!stepItem) {
            throw new Error('Step item with index "' + step + '" is not found.');
          }
        } else {
          stepItem = step[0] || step;
          stepIndex = this._getStepIndex(stepItem);
        }

        var stepTarget = stepItem.getAttribute('data-target');

        if (!stepTarget) {
          throw new Error('The step item has invalid "data-target" attribute.');
        }

        return [stepIndex, stepItem, stepTarget];
      }
    }, {
      key: '_activateStepItem',
      value: function _activateStepItem(stepItem, index) {
        pxUtil.addClass(stepItem, ClassName.ACTIVE);
        pxUtil.removeClass(stepItem, ClassName.COMPLETED);

        // Add completed and remove active classes for the previous items
        for (var i = 0; i < index; i++) {
          pxUtil.addClass(this.stepItems[i], ClassName.COMPLETED);
          pxUtil.removeClass(this.stepItems[i], ClassName.ACTIVE);
        }

        // Remove completed and active classes for the next items
        for (var j = index + 1, len = this.stepItems.length; j < len; j++) {
          pxUtil.removeClass(this.stepItems[j], ClassName.ACTIVE);
          pxUtil.removeClass(this.stepItems[j], ClassName.COMPLETED);
        }

        this._placeStepsContainer();
      }
    }, {
      key: '_activateStepPane',
      value: function _activateStepPane(selector) {
        var panes = $(this.element).find('.' + ClassName.PANE + '.' + ClassName.ACTIVE);

        // Remove active state
        for (var i = 0, len = panes.length; i < len; i++) {
          pxUtil.removeClass(panes[i], ClassName.ACTIVE);
        }

        // Add active class to target
        pxUtil.addClass($(this.element).find(selector)[0], ClassName.ACTIVE);
      }
    }, {
      key: '_placeStepsContainer',
      value: function _placeStepsContainer() {
        var wrapperWidth = $(this.wrapper).width();
        var stepsWidth = $(this.steps).width();
        var curStepWidth = $(this.activeStep).outerWidth();
        var delta = Math.floor((wrapperWidth - curStepWidth) / 2);
        var curStepX = $(this.activeStep).position().left;
        var offset = void 0;

        if (this._isRtl) {
          curStepX = stepsWidth - curStepX - curStepWidth;
        }

        if (stepsWidth > wrapperWidth && curStepX > delta) {
          offset = -1 * curStepX + delta;

          if (stepsWidth + offset < wrapperWidth) {
            offset = -1 * stepsWidth + wrapperWidth;
          }
        } else {
          offset = 0;
        }

        this.steps.style[this._isRtl ? 'right' : 'left'] = offset + 'px';
      }
    }, {
      key: '_getStepIndex',
      value: function _getStepIndex(stepItem) {
        var stepIndex = void 0;

        for (var i = 0, len = this.stepItems.length; i < len; i++) {
          if (stepItem === this.stepItems[i]) {
            stepIndex = i;
            break;
          }
        }

        if (typeof stepIndex === 'undefined') {
          throw new Error('Cannot find step item index.');
        }

        return stepIndex;
      }
    }, {
      key: '_setListeners',
      value: function _setListeners() {
        var self = this;

        $(window).on(this.constructor.Event.RESIZE + '.' + this.uniqueId, $.proxy(this.resizeStepItems, this));

        $(this.steps).on(this.constructor.Event.CLICK, '> li', function () {
          if (!pxUtil.hasClass(this, ClassName.COMPLETED)) {
            return;
          }
          self.goTo(this);
        });

        $(this.element).on(this.constructor.Event.CLICK, '[data-wizard-action]', function () {
          var action = this.getAttribute('data-wizard-action');

          if (action === 'next') {
            return self.goNext();
          }

          if (action === 'prev') {
            return self.goPrev();
          }

          if (action === 'finish') {
            return self.finish();
          }

          throw new Error('Action "' + action + '" is not found.');
        });
      }
    }, {
      key: '_unsetListeners',
      value: function _unsetListeners() {
        $(window).off(this.constructor.Event.RESIZE + '.' + this.uniqueId);
        $(this.element).off(EVENT_KEY);
        $(this.steps).off(EVENT_KEY);
      }
    }, {
      key: '_triggerEvent',
      value: function _triggerEvent(eventKey, target) {
        var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        $(this.element).trigger($.Event(this.constructor.Event[eventKey], { target: target }), [data]);
      }
    }, {
      key: '_triggerPreventableEvent',
      value: function _triggerPreventableEvent(eventKey, target) {
        var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        var event = $.Event(this.constructor.Event[eventKey], { target: target });

        $(this.element).trigger(event, [data]);

        return !event.isDefaultPrevented();
      }
    }, {
      key: '_getConfig',
      value: function _getConfig(config) {
        return $.extend({}, this.constructor.Default, $(this.element).data(), config);
      }

      // static

    }], [{
      key: '_jQueryInterface',
      value: function _jQueryInterface(config) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        var result = void 0;

        var $el = this.each(function () {
          var data = $(this).data(DATA_KEY);
          var _config = (typeof config === 'undefined' ? 'undefined' : _typeof(config)) === 'object' ? config : null;

          if (!data) {
            data = new Wizard(this, _config);
            $(this).data(DATA_KEY, data);
          }

          if (typeof config === 'string') {
            if (!data[config]) {
              throw new Error('No method named "' + config + '".');
            }
            result = data[config].apply(data, args);
          }
        });

        return typeof result !== 'undefined' ? result : $el;
      }
    }, {
      key: 'Default',
      get: function get() {
        return Default;
      }
    }, {
      key: 'NAME',
      get: function get() {
        return NAME;
      }
    }, {
      key: 'DATA_KEY',
      get: function get() {
        return DATA_KEY;
      }
    }, {
      key: 'Event',
      get: function get() {
        return Event;
      }
    }, {
      key: 'EVENT_KEY',
      get: function get() {
        return EVENT_KEY;
      }
    }]);

    return Wizard;
  }();

  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME] = Wizard._jQueryInterface;
  $.fn[NAME].Constructor = Wizard;
  $.fn[NAME].noConflict = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT;
    return Wizard._jQueryInterface;
  };

  return Wizard;
}(jQuery);


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Plugins / PxResponsiveBg
// --------------------------------------------------

var PxResponsiveBg = function ($) {
  'use strict';

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME = 'pxResponsiveBg';
  var DATA_KEY = 'px.responsiveBg';
  var EVENT_KEY = '.' + DATA_KEY;
  var JQUERY_NO_CONFLICT = $.fn[NAME];

  var Default = {
    backgroundImage: null,
    backgroundPosition: 'center middle',
    overlay: false,
    overlayOpacity: 0.2
  };

  var ClassName = {
    CONTAINER: 'px-responsive-bg-container',
    IMAGE: 'px-responsive-bg',
    OVERLAY: 'px-responsive-bg-overlay'
  };

  var Event = {
    RESIZE: 'resize' + EVENT_KEY
  };

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  var ResponsiveBg = function () {
    function ResponsiveBg(element, config) {
      var _this = this;

      _classCallCheck(this, ResponsiveBg);

      this.uniqueId = pxUtil.generateUniqueId();

      this.element = element;
      this.config = this._getConfig(config);

      // Return if "dummy" object
      if (this.config.backgroundImage === null) {
        return;
      }

      this._loadImage(this.config.backgroundImage, function (img) {
        _this._sizeRatio = img.height / img.width;

        _this._setupMarkup(img);
        _this._setListeners();

        _this.update();
      });
    }

    // getters

    _createClass(ResponsiveBg, [{
      key: 'update',


      // public

      value: function update() {
        var parentEl = this.image.parentNode;
        var parentHeight = $(parentEl).height();
        var parentWidth = $(parentEl).width();

        var height = void 0;
        var width = void 0;
        var top = void 0;
        var left = void 0;

        if (parentWidth * this._sizeRatio > parentHeight) {
          width = '100%';
          height = Math.ceil(parentWidth * this._sizeRatio);
          left = 0;

          if (this.config.backgroundPosition[1] === 'top') {
            top = 0;
          } else if (this.config.backgroundPosition[1] === 'bottom') {
            top = -1 * (height - parentHeight);
          } else {
            top = Math.floor(-1 * (height - parentHeight) / 2);
          }
        } else {
          width = Math.ceil(parentHeight / this._sizeRatio);
          height = parentHeight;
          top = 0;

          if (this.config.backgroundPosition[0] === 'left') {
            left = 0;
          } else if (this.config.backgroundPosition[0] === 'right') {
            left = -1 * (width - parentWidth);
          } else {
            left = Math.floor(-1 * (width - parentWidth) / 2);
          }
        }

        this.image.style.width = width === '100%' ? width : width + 'px';
        this.image.style.height = height + 'px';
        this.image.style.top = top + 'px';
        this.image.style.left = left + 'px';
      }
    }, {
      key: 'destroy',
      value: function destroy(clearMarkup) {
        this._unsetListeners();

        if (clearMarkup) {
          $(this.element).removeClass(ClassName.CONTAINER).find('> .' + ClassName.IMAGE).remove();
        }

        $(this.element).removeData(DATA_KEY);
      }

      // private

    }, {
      key: '_loadImage',
      value: function _loadImage(path, cb) {
        var img = new Image();

        img.onload = function () {
          return cb(img);
        };
        img.src = path;
      }
    }, {
      key: '_setupMarkup',
      value: function _setupMarkup(img) {
        pxUtil.addClass(this.element, ClassName.CONTAINER);

        var $imageContainer = $(this.element).find('> .' + ClassName.IMAGE);

        if (!$imageContainer.length) {
          $imageContainer = $('<div class="' + ClassName.IMAGE + '"></div>').appendTo(this.element);
          $imageContainer.append('<img alt="">');
        }

        this.image = $imageContainer.find('> img')[0];

        if (!this.image) {
          throw new Error('Background <img> element not found!');
        }

        $(this.image).attr('src', img.src);

        if (this.config.overlay !== false) {
          $imageContainer.find('.' + ClassName.OVERLAY).remove();

          $imageContainer.prepend(typeof this.config.overlay === 'string' && this.config.overlay[0] === '<' ? $(this.config.overlay).addClass(ClassName.OVERLAY).css('opacity', this.config.overlayOpacity) : $('<div class="' + ClassName.OVERLAY + '"></div>').css({
            background: typeof this.config.overlay === 'boolean' ? '#000' : this.config.overlay,
            opacity: this.config.overlayOpacity
          }));
        } else {
          $imageContainer.find('> .' + ClassName.OVERLAY).remove();
        }
      }
    }, {
      key: '_setListeners',
      value: function _setListeners() {
        $(window).on(this.constructor.Event.RESIZE + '.' + this.uniqueId, $.proxy(this.update, this));
      }
    }, {
      key: '_unsetListeners',
      value: function _unsetListeners() {
        $(window).off(this.constructor.Event.RESIZE + '.' + this.uniqueId);
      }
    }, {
      key: '_getConfig',
      value: function _getConfig(config) {
        var result = $.extend({}, this.constructor.Default, $(this.element).data(), config);

        if (!result.backgroundImage && result.backgroundImage !== null) {
          throw new Error('Background image is not specified.');
        }

        var parts = String(result.backgroundPosition).split(' ').slice(0, 2);

        if (parts[0] !== 'center' && parts[0] !== 'left' && parts[0] !== 'right') {
          parts[0] = 'center';
        }

        if (parts[1] !== 'middle' && parts[1] !== 'top' && parts[1] !== 'bottom') {
          parts[1] = 'middle';
        }

        result.backgroundPosition = parts;

        return result;
      }

      // static

    }], [{
      key: '_jQueryInterface',
      value: function _jQueryInterface(config) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        return this.each(function () {
          var data = $(this).data(DATA_KEY);
          var _config = (typeof config === 'undefined' ? 'undefined' : _typeof(config)) === 'object' ? config : null;

          if (!data && config !== 'destroy') {
            data = new ResponsiveBg(this, _config);
            $(this).data(DATA_KEY, data);
          }

          if (data && typeof config === 'string') {
            var _data;

            if (!data[config]) {
              throw new Error('No method named "' + config + '"');
            }
            (_data = data)[config].apply(_data, args);
          }
        });
      }
    }, {
      key: 'Default',
      get: function get() {
        return Default;
      }
    }, {
      key: 'NAME',
      get: function get() {
        return NAME;
      }
    }, {
      key: 'DATA_KEY',
      get: function get() {
        return DATA_KEY;
      }
    }, {
      key: 'Event',
      get: function get() {
        return Event;
      }
    }, {
      key: 'EVENT_KEY',
      get: function get() {
        return EVENT_KEY;
      }
    }]);

    return ResponsiveBg;
  }();

  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME] = ResponsiveBg._jQueryInterface;
  $.fn[NAME].Constructor = ResponsiveBg;
  $.fn[NAME].noConflict = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT;
    return ResponsiveBg._jQueryInterface;
  };

  return ResponsiveBg;
}(jQuery);
//# sourceMappingURL=pixeladmin.js.map
